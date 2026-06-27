#![no_std]
use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, Address, Bytes, BytesN, Env,
};

mod verifier {
    soroban_sdk::contractimport!(
        file = "../../../verifier/ultrahonk_soroban_contract/target/wasm32v1-none/release/ultrahonk_soroban_contract.wasm"
    );
}

mod sbt {
    use soroban_sdk::{contractclient, Address, Env, String};

    #[contractclient(name = "Client")]
    pub trait SbtContract {
        fn initialize(env: Env, admin: Address, name: String, symbol: String);
        fn mint(env: Env, to: Address);
        fn revoke(env: Env, holder: Address);
        fn balance_of(env: Env, holder: Address) -> u64;
        fn expires_at(env: Env, holder: Address) -> u64;
        fn total_supply(env: Env) -> u64;
        fn name(env: Env) -> String;
        fn symbol(env: Env) -> String;
        fn decimals(env: Env) -> u32;
    }
}

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    VerifierContract,
    SbtContract,
    Owner,
    Credential(Address),
    Nullifier(BytesN<32>),
}

#[contracttype]
#[derive(Clone)]
pub struct KYCCredential {
    pub holder: Address,
    pub commitment: BytesN<32>,
    pub issued_at: u64,
    pub min_age_secs: u64,
    pub active: bool,
}

#[contracterror]
#[repr(u32)]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
pub enum Error {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    NotOwner = 3,
    AlreadyVerified = 4,
    NullifierUsed = 5,
    VerificationFailed = 6,
    NotVerified = 7,
    SbtMintFailed = 8,
    SbtRevokeFailed = 9,
}

#[contract]
pub struct RegistryContract;

#[contractimpl]
impl RegistryContract {
    /// Initialize the registry with an owner, the verifier contract, and the SBT contract.
    pub fn initialize(
        env: Env,
        owner: Address,
        verifier_contract: Address,
        sbt_contract: Address,
    ) -> Result<(), Error> {
        if env.storage().instance().has(&DataKey::Owner) {
            return Err(Error::AlreadyInitialized);
        }
        owner.require_auth();

        env.storage().instance().set(&DataKey::Owner, &owner);
        env.storage()
            .instance()
            .set(&DataKey::VerifierContract, &verifier_contract);
        env.storage()
            .instance()
            .set(&DataKey::SbtContract, &sbt_contract);
        Ok(())
    }

    /// Register a user's KYC credential by verifying their ZK proof on-chain via the verifier contract.
    pub fn register(
        env: Env,
        user: Address,
        proof: Bytes,
        public_inputs: Bytes,
        commitment: BytesN<32>,
        nullifier: BytesN<32>,
        min_age_secs: u64,
    ) -> Result<(), Error> {
        user.require_auth();

        // Ensure the contract is initialized
        if !env.storage().instance().has(&DataKey::Owner) {
            return Err(Error::NotInitialized);
        }

        // Allow renewal if expired or inactive
        if let Some(existing_cred) = env
            .storage()
            .persistent()
            .get::<_, KYCCredential>(&DataKey::Credential(user.clone()))
        {
            let expiry_duration = 31_536_000u64;
            let expired = env.ledger().timestamp() >= existing_cred.issued_at + expiry_duration;
            if !expired && existing_cred.active {
                return Err(Error::AlreadyVerified);
            }
        }

        // Prevent nullifier reuse (double-spend protection)
        // Store the address in the nullifier map to allow self-renewal but prevent other wallets from reusing it
        if let Some(existing_owner) = env
            .storage()
            .persistent()
            .get::<_, Address>(&DataKey::Nullifier(nullifier.clone()))
        {
            if existing_owner != user {
                return Err(Error::NullifierUsed);
            }
        }

        // Cross-contract call to the verifier to validate the ZK proof
        let verifier_address: Address = env
            .storage()
            .instance()
            .get(&DataKey::VerifierContract)
            .ok_or(Error::NotInitialized)?;

        let verifier_client = verifier::Client::new(&env, &verifier_address);
        match verifier_client.try_verify_proof(&public_inputs, &proof) {
            Ok(Ok(())) => {}
            _ => return Err(Error::VerificationFailed),
        }

        // Store/associate the nullifier with the user address
        env.storage()
            .persistent()
            .set(&DataKey::Nullifier(nullifier), &user);

        // Store the credential
        let credential = KYCCredential {
            holder: user.clone(),
            commitment,
            issued_at: env.ledger().timestamp(),
            min_age_secs,
            active: true,
        };
        env.storage()
            .persistent()
            .set(&DataKey::Credential(user.clone()), &credential);

        // Mint a Soulbound Compliance Token (SBT) to the user
        if let Some(sbt_address) = env
            .storage()
            .instance()
            .get::<_, Address>(&DataKey::SbtContract)
        {
            let sbt_client = sbt::Client::new(&env, &sbt_address);
            sbt_client.mint(&user);
        }

        Ok(())
    }

    /// Check whether a user has a verified and active KYC credential.
    pub fn is_verified(env: Env, user: Address) -> bool {
        env.storage()
            .persistent()
            .get::<_, KYCCredential>(&DataKey::Credential(user))
            .map(|cred| {
                if !cred.active {
                    return false;
                }
                let expiry_duration = 31_536_000u64;
                let expired = env.ledger().timestamp() >= cred.issued_at + expiry_duration;
                !expired
            })
            .unwrap_or(false)
    }

    /// Revoke a user's KYC credential. Only the contract owner may call this.
    pub fn revoke(env: Env, user: Address) -> Result<(), Error> {
        let owner: Address = env
            .storage()
            .instance()
            .get(&DataKey::Owner)
            .ok_or(Error::NotInitialized)?;
        owner.require_auth();

        let mut credential: KYCCredential = env
            .storage()
            .persistent()
            .get(&DataKey::Credential(user.clone()))
            .ok_or(Error::NotVerified)?;

        credential.active = false;
        env.storage()
            .persistent()
            .set(&DataKey::Credential(user.clone()), &credential);

        // Burn the Soulbound Token
        if let Some(sbt_address) = env
            .storage()
            .instance()
            .get::<_, Address>(&DataKey::SbtContract)
        {
            let sbt_client = sbt::Client::new(&env, &sbt_address);
            sbt_client.revoke(&user);
        }

        Ok(())
    }
}

mod test;
