#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, testutils::Ledger, Address, Env, String};

#[test]
fn test_initialize() {
    let env = Env::default();
    let contract_id = env.register(SoulboundToken, ());
    let client = SoulboundTokenClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let name = String::from_str(&env, "Luminar Compliance SBT");
    let symbol = String::from_str(&env, "LSBT");

    client.initialize(&admin, &name, &symbol);

    assert_eq!(client.name(), name);
    assert_eq!(client.symbol(), symbol);
    assert_eq!(client.decimals(), 0);
    assert_eq!(client.total_supply(), 0);
}

#[test]
fn test_initialize_cannot_be_called_twice() {
    let env = Env::default();
    let contract_id = env.register(SoulboundToken, ());
    let client = SoulboundTokenClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let name = String::from_str(&env, "Luminar Compliance SBT");
    let symbol = String::from_str(&env, "LSBT");

    client.initialize(&admin, &name, &symbol);

    let result = client.try_initialize(&admin, &name, &symbol);
    assert_eq!(result, Err(Ok(Error::AlreadyInitialized)));
}

#[test]
fn test_mint_grants_balance() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(SoulboundToken, ());
    let client = SoulboundTokenClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let user = Address::generate(&env);
    let name = String::from_str(&env, "Luminar Compliance SBT");
    let symbol = String::from_str(&env, "LSBT");

    client.initialize(&admin, &name, &symbol);

    // Before minting
    assert_eq!(client.balance_of(&user), 0);
    assert_eq!(client.total_supply(), 0);

    // Mint
    client.mint(&user);

    // After minting
    assert_eq!(client.balance_of(&user), 1);
    assert_eq!(client.total_supply(), 1);
}

#[test]
fn test_mint_reverts_if_already_holds_token() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(SoulboundToken, ());
    let client = SoulboundTokenClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let user = Address::generate(&env);
    let name = String::from_str(&env, "Luminar Compliance SBT");
    let symbol = String::from_str(&env, "LSBT");

    client.initialize(&admin, &name, &symbol);
    client.mint(&user);

    // Try minting again
    let result = client.try_mint(&user);
    assert_eq!(result, Err(Ok(Error::AlreadyHoldsToken)));
}

#[test]
fn test_revoke_burns_token() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(SoulboundToken, ());
    let client = SoulboundTokenClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let user = Address::generate(&env);
    let name = String::from_str(&env, "Luminar Compliance SBT");
    let symbol = String::from_str(&env, "LSBT");

    client.initialize(&admin, &name, &symbol);
    client.mint(&user);

    assert_eq!(client.balance_of(&user), 1);
    assert_eq!(client.total_supply(), 1);

    // Revoke
    client.revoke(&user);

    assert_eq!(client.balance_of(&user), 0);
    assert_eq!(client.total_supply(), 0);
}

#[test]
fn test_revoke_fails_if_no_token() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(SoulboundToken, ());
    let client = SoulboundTokenClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let user = Address::generate(&env);
    let name = String::from_str(&env, "Luminar Compliance SBT");
    let symbol = String::from_str(&env, "LSBT");

    client.initialize(&admin, &name, &symbol);

    let result = client.try_revoke(&user);
    assert_eq!(result, Err(Ok(Error::NoTokenToRevoke)));
}

#[test]
fn test_balance_of_unknown_address_returns_zero() {
    let env = Env::default();
    let contract_id = env.register(SoulboundToken, ());
    let client = SoulboundTokenClient::new(&env, &contract_id);

    let unknown = Address::generate(&env);
    assert_eq!(client.balance_of(&unknown), 0);
}

#[test]
fn test_multiple_users_mint() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(SoulboundToken, ());
    let client = SoulboundTokenClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let user1 = Address::generate(&env);
    let user2 = Address::generate(&env);
    let user3 = Address::generate(&env);
    let name = String::from_str(&env, "Luminar Compliance SBT");
    let symbol = String::from_str(&env, "LSBT");

    client.initialize(&admin, &name, &symbol);

    client.mint(&user1);
    client.mint(&user2);
    client.mint(&user3);

    assert_eq!(client.balance_of(&user1), 1);
    assert_eq!(client.balance_of(&user2), 1);
    assert_eq!(client.balance_of(&user3), 1);
    assert_eq!(client.total_supply(), 3);

    // Revoke one user
    client.revoke(&user2);
    assert_eq!(client.balance_of(&user2), 0);
    assert_eq!(client.total_supply(), 2);
}

#[test]
fn test_token_expiration_and_renewal() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(SoulboundToken, ());
    let client = SoulboundTokenClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let user = Address::generate(&env);
    let name = String::from_str(&env, "Luminar Compliance SBT");
    let symbol = String::from_str(&env, "LSBT");

    client.initialize(&admin, &name, &symbol);

    // Initial ledger timestamp is 0. Mint at timestamp 0.
    client.mint(&user);
    assert_eq!(client.balance_of(&user), 1);
    assert_eq!(client.expires_at(&user), 31_536_000);

    // Advance time to 365 days exactly. balance_of should return 0 (expired)
    env.ledger().set(soroban_sdk::testutils::LedgerInfo {
        timestamp: 31_536_000,
        protocol_version: 26,
        sequence_number: 0,
        network_id: [0u8; 32],
        base_reserve: 0,
        min_persistent_entry_ttl: 4096,
        min_temp_entry_ttl: 16,
        max_entry_ttl: 6312000,
    });
    assert_eq!(client.balance_of(&user), 0);

    // Renewal: Minting should succeed since the previous token has expired.
    client.mint(&user);
    // New balance is 1, expiry is extended by 365 days (new expiry is 31,536,000 + 31,536,000 = 63,072,000)
    assert_eq!(client.balance_of(&user), 1);
    assert_eq!(client.expires_at(&user), 63_072_000);
}
