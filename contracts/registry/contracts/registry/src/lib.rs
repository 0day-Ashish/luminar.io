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
    Commitment(BytesN<32>),
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
    InvalidMinAge = 10,
    CommitmentUsed = 11,
}

/// Credential validity period: 365 days in seconds.
const CREDENTIAL_TTL_SECS: u64 = 31_536_000;

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

        // Enforce a strict minimum age requirement of 18 years in seconds (567,648,000)
        if min_age_secs < 567_648_000 {
            return Err(Error::InvalidMinAge);
        }

        // Ensure the contract is initialized
        if !env.storage().instance().has(&DataKey::Owner) {
            return Err(Error::NotInitialized);
        }

        // Extend instance storage TTL
        env.storage().instance().extend_ttl(100_000, 500_000);

        let credential_key = DataKey::Credential(user.clone());

        // Allow renewal if expired or inactive
        if let Some(existing_cred) = env
            .storage()
            .persistent()
            .get::<_, KYCCredential>(&credential_key)
        {
            env.storage().persistent().extend_ttl(&credential_key, 100_000, 500_000);
            let expiry_duration = CREDENTIAL_TTL_SECS;
            let expired = env.ledger().timestamp() >= existing_cred.issued_at + expiry_duration;
            if !expired && existing_cred.active {
                return Err(Error::AlreadyVerified);
            }
        }

        let commitment_key = DataKey::Commitment(commitment.clone());

        // Prevent commitment reuse by another wallet (Sybil protection for the same identity)
        if let Some(existing_owner) = env
            .storage()
            .persistent()
            .get::<_, Address>(&commitment_key)
        {
            env.storage().persistent().extend_ttl(&commitment_key, 100_000, 500_000);
            if existing_owner != user {
                if let Some(existing_cred) = env
                    .storage()
                    .persistent()
                    .get::<_, KYCCredential>(&DataKey::Credential(existing_owner.clone()))
                {
                    let expiry_duration = CREDENTIAL_TTL_SECS;
                    let expired = env.ledger().timestamp() >= existing_cred.issued_at + expiry_duration;
                    if !expired && existing_cred.active {
                        return Err(Error::CommitmentUsed);
                    }
                }
            }
        }

        let nullifier_key = DataKey::Nullifier(nullifier.clone());

        // Prevent nullifier reuse (double-spend protection)
        // Store the address in the nullifier map to allow self-renewal but prevent other wallets from reusing it
        if let Some(existing_owner) = env
            .storage()
            .persistent()
            .get::<_, Address>(&nullifier_key)
        {
            env.storage().persistent().extend_ttl(&nullifier_key, 100_000, 500_000);
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
            .set(&nullifier_key, &user);
        env.storage().persistent().extend_ttl(&nullifier_key, 100_000, 500_000);

        // Store/associate the commitment with the user address
        env.storage()
            .persistent()
            .set(&commitment_key, &user);
        env.storage().persistent().extend_ttl(&commitment_key, 100_000, 500_000);

        // Store the credential
        let credential = KYCCredential {
            holder: user.clone(),
            commitment: commitment.clone(),
            issued_at: env.ledger().timestamp(),
            min_age_secs,
            active: true,
        };
        env.storage()
            .persistent()
            .set(&credential_key, &credential);
        env.storage().persistent().extend_ttl(&credential_key, 100_000, 500_000);

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
        // Extend instance storage TTL on check
        if env.storage().instance().has(&DataKey::Owner) {
            env.storage().instance().extend_ttl(100_000, 500_000);
        }

        let credential_key = DataKey::Credential(user);
        env.storage()
            .persistent()
            .get::<_, KYCCredential>(&credential_key)
            .map(|cred| {
                env.storage().persistent().extend_ttl(&credential_key, 100_000, 500_000);
                if !cred.active {
                    return false;
                }
                let expiry_duration = CREDENTIAL_TTL_SECS;
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
        env.storage().instance().extend_ttl(100_000, 500_000);

        let credential_key = DataKey::Credential(user.clone());
        let mut credential: KYCCredential = env
            .storage()
            .persistent()
            .get(&credential_key)
            .ok_or(Error::NotVerified)?;

        credential.active = false;
        env.storage()
            .persistent()
            .set(&credential_key, &credential);
        env.storage().persistent().extend_ttl(&credential_key, 100_000, 500_000);

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
