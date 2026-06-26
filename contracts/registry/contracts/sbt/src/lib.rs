#![no_std]
#![allow(deprecated)]
use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, symbol_short, Address, Env, String,
};

// ---------------------------------------------------------------------------
// Storage Keys
// ---------------------------------------------------------------------------
#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    /// The admin address (the registry contract) that is authorized to mint/revoke.
    Admin,
    /// Per-holder balance: always 0 or 1.
    Balance(Address),
    /// Global counter of active SBTs.
    TotalSupply,
    /// Human-readable token name.
    TokenName,
    /// Human-readable token symbol.
    TokenSymbol,
}

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------
#[contracterror]
#[repr(u32)]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
pub enum Error {
    /// Contract has already been initialized.
    AlreadyInitialized = 1,
    /// Contract has not been initialized yet.
    NotInitialized = 2,
    /// Caller is not the admin (registry contract).
    Unauthorized = 3,
    /// The target address already holds an SBT.
    AlreadyHoldsToken = 4,
    /// The target address does not hold an SBT.
    NoTokenToRevoke = 5,
}

// ---------------------------------------------------------------------------
// Contract
// ---------------------------------------------------------------------------
#[contract]
pub struct SoulboundToken;

#[contractimpl]
impl SoulboundToken {
    // -----------------------------------------------------------------------
    // Initialization
    // -----------------------------------------------------------------------

    /// Initialize the SBT contract.
    ///
    /// * `admin`  – the address authorized to mint and revoke (should be the
    ///              registry contract address).
    /// * `name`   – human-readable token name, e.g. "Luminar Compliance SBT".
    /// * `symbol` – token ticker symbol, e.g. "LSBT".
    pub fn initialize(env: Env, admin: Address, name: String, symbol: String) -> Result<(), Error> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(Error::AlreadyInitialized);
        }

        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::TokenName, &name);
        env.storage()
            .instance()
            .set(&DataKey::TokenSymbol, &symbol);
        env.storage().instance().set(&DataKey::TotalSupply, &0u64);

        env.events().publish(
            (symbol_short!("init"),),
            admin,
        );

        Ok(())
    }

    // -----------------------------------------------------------------------
    // Admin-Only: Mint & Revoke
    // -----------------------------------------------------------------------

    /// Mint exactly 1 SBT to `to`. Only the admin may call this.
    /// Fails if `to` already holds a token.
    pub fn mint(env: Env, to: Address) -> Result<(), Error> {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .ok_or(Error::NotInitialized)?;
        admin.require_auth();

        // Prevent double-minting
        let current_balance: u64 = env
            .storage()
            .persistent()
            .get(&DataKey::Balance(to.clone()))
            .unwrap_or(0);

        if current_balance > 0 {
            return Err(Error::AlreadyHoldsToken);
        }

        // Set balance to 1
        env.storage()
            .persistent()
            .set(&DataKey::Balance(to.clone()), &1u64);

        // Increment total supply
        let supply: u64 = env
            .storage()
            .instance()
            .get(&DataKey::TotalSupply)
            .unwrap_or(0);
        env.storage()
            .instance()
            .set(&DataKey::TotalSupply, &(supply + 1));

        env.events().publish(
            (symbol_short!("mint"),),
            to,
        );

        Ok(())
    }

    /// Revoke (burn) an SBT from `holder`. Only the admin may call this.
    /// Fails if `holder` does not hold a token.
    pub fn revoke(env: Env, holder: Address) -> Result<(), Error> {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .ok_or(Error::NotInitialized)?;
        admin.require_auth();

        let current_balance: u64 = env
            .storage()
            .persistent()
            .get(&DataKey::Balance(holder.clone()))
            .unwrap_or(0);

        if current_balance == 0 {
            return Err(Error::NoTokenToRevoke);
        }

        // Set balance to 0
        env.storage()
            .persistent()
            .set(&DataKey::Balance(holder.clone()), &0u64);

        // Decrement total supply
        let supply: u64 = env
            .storage()
            .instance()
            .get(&DataKey::TotalSupply)
            .unwrap_or(0);
        if supply > 0 {
            env.storage()
                .instance()
                .set(&DataKey::TotalSupply, &(supply - 1));
        }

        env.events().publish(
            (symbol_short!("revoke"),),
            holder,
        );

        Ok(())
    }

    // -----------------------------------------------------------------------
    // Public Read-Only Methods
    // -----------------------------------------------------------------------

    /// Returns `1` if the holder has an active SBT, `0` otherwise.
    pub fn balance_of(env: Env, holder: Address) -> u64 {
        env.storage()
            .persistent()
            .get(&DataKey::Balance(holder))
            .unwrap_or(0)
    }

    /// Returns the total number of active SBTs.
    pub fn total_supply(env: Env) -> u64 {
        env.storage()
            .instance()
            .get(&DataKey::TotalSupply)
            .unwrap_or(0)
    }

    /// Returns the token name.
    pub fn name(env: Env) -> String {
        env.storage()
            .instance()
            .get(&DataKey::TokenName)
            .unwrap_or(String::from_str(&env, "Luminar Compliance SBT"))
    }

    /// Returns the token symbol.
    pub fn symbol(env: Env) -> String {
        env.storage()
            .instance()
            .get(&DataKey::TokenSymbol)
            .unwrap_or(String::from_str(&env, "LSBT"))
    }

    /// Returns token decimals. Always 0 since SBTs are indivisible.
    pub fn decimals(_env: Env) -> u32 {
        0
    }
}

mod test;
