#![cfg(test)]

use super::*;
use soroban_sdk::{Env, Bytes, BytesN, Address, String};
use soroban_sdk::testutils::Address as _;
use soroban_sdk::testutils::Ledger;
use ed25519_dalek::{SigningKey, Signer};
use rand::rngs::OsRng;

const VERIFIER_WASM: &[u8] =
    include_bytes!("../../../../verifier/ultrahonk_soroban_contract/target/wasm32v1-none/release/ultrahonk_soroban_contract.wasm");

const SBT_WASM: &[u8] =
    include_bytes!("../../../target/wasm32v1-none/release/luminar_sbt.wasm");

#[test]
fn test_is_verified_default_false() {
    let env = Env::default();
    let contract_id = env.register(RegistryContract, ());
    let client = RegistryContractClient::new(&env, &contract_id);

    let user = Address::generate(&env);
    assert_eq!(client.is_verified(&user), false);
}

#[test]
fn test_kyc_registration_and_revocation() {
    let env = Env::default();
    env.budget().reset_unlimited();

    // 1. Load the ZK proof, vk, and public inputs
    let vk_bytes_raw = include_bytes!("../test_artifacts/vk");
    let proof_bytes_raw = include_bytes!("../test_artifacts/proof");
    let public_inputs_raw = include_bytes!("../test_artifacts/public_inputs");

    let vk_bytes = Bytes::from_slice(&env, vk_bytes_raw);
    let proof = Bytes::from_slice(&env, proof_bytes_raw);
    let public_inputs = Bytes::from_slice(&env, public_inputs_raw);

    // 2. Deploy the verifier contract
    let verifier_address = env.register(VERIFIER_WASM, (vk_bytes,));

    // 3. Deploy the SBT contract
    let sbt_address = env.register(SBT_WASM, ());
    let sbt_client = sbt::Client::new(&env, &sbt_address);

    // 4. Deploy the registry contract
    let registry_address = env.register(RegistryContract, ());
    let registry_client = RegistryContractClient::new(&env, &registry_address);
    env.mock_all_auths();

    // 5. Initialize SBT with the registry as admin
    let sbt_name = String::from_str(&env, "Luminar Compliance SBT");
    let sbt_symbol = String::from_str(&env, "LSBT");
    sbt_client.initialize(&registry_address, &sbt_name, &sbt_symbol);

    // 6. Generate oracle keys dynamically
    let signer1 = SigningKey::generate(&mut OsRng);
    let signer2 = SigningKey::generate(&mut OsRng);
    let signer3 = SigningKey::generate(&mut OsRng);

    let oracle1 = BytesN::from_array(&env, &signer1.verifying_key().to_bytes());
    let oracle2 = BytesN::from_array(&env, &signer2.verifying_key().to_bytes());
    let oracle3 = BytesN::from_array(&env, &signer3.verifying_key().to_bytes());

    // Initialize the registry with verifier + SBT + oracles
    let owner = Address::generate(&env);
    registry_client.initialize(&owner, &verifier_address, &sbt_address, &oracle1, &oracle2, &oracle3);

    // 7. Setup test variables matching the circuits/kyc_proof public inputs
    let user = Address::generate(&env);

    let commitment = BytesN::from_array(&env, &[
        0x0c, 0x96, 0xed, 0x2d, 0xa7, 0x05, 0xd8, 0xf8,
        0x89, 0xd2, 0x9d, 0xc5, 0xf3, 0x3b, 0x2f, 0x24,
        0x7f, 0xeb, 0x95, 0xf8, 0x2a, 0x87, 0x27, 0x9b,
        0x51, 0xc3, 0xc3, 0x44, 0xe7, 0x92, 0x6d, 0xf7
    ]);
    let nullifier = BytesN::from_array(&env, &[
        0x12, 0x09, 0xb3, 0x19, 0x03, 0x2d, 0xc2, 0xee,
        0x8d, 0x3d, 0x76, 0x4d, 0x34, 0x97, 0xe8, 0xcc,
        0xe8, 0x94, 0x84, 0xfc, 0x91, 0xcb, 0xae, 0x23,
        0xaa, 0xb6, 0xe4, 0x14, 0xc2, 0x36, 0xe1, 0x68
    ]);
    let min_age_secs = 567648000; // 18 years in seconds

    // Sign commitment dynamically using Oracle 1 and 2
    let msg_bytes = commitment.to_array();
    let sig1 = BytesN::from_array(&env, &signer1.sign(&msg_bytes).to_bytes());
    let sig2 = BytesN::from_array(&env, &signer2.sign(&msg_bytes).to_bytes());

    // Initially, user is not verified and has no SBT
    assert!(!registry_client.is_verified(&user));
    assert_eq!(sbt_client.balance_of(&user), 0);

    // Register user — this should also mint an SBT
    registry_client.register(&user, &proof, &public_inputs, &commitment, &nullifier, &min_age_secs, &0, &sig1, &1, &sig2);

    // User should be verified AND hold an SBT
    assert!(registry_client.is_verified(&user));
    assert_eq!(sbt_client.balance_of(&user), 1);
    assert_eq!(sbt_client.total_supply(), 1);

    // Trying to register again should fail (AlreadyVerified)
    let err = registry_client.try_register(&user, &proof, &public_inputs, &commitment, &nullifier, &min_age_secs, &0, &sig1, &1, &sig2);
    assert_eq!(err, Err(Ok(Error::AlreadyVerified)));

    // Trying to register a new user with the same nullifier should fail (NullifierUsed)
    let another_user = Address::generate(&env);
    let another_commitment = BytesN::from_array(&env, &[1; 32]);
    let another_msg = another_commitment.to_array();
    let sig1_another = BytesN::from_array(&env, &signer1.sign(&another_msg).to_bytes());
    let sig2_another = BytesN::from_array(&env, &signer2.sign(&another_msg).to_bytes());

    let err_nullifier = registry_client.try_register(&another_user, &proof, &public_inputs, &another_commitment, &nullifier, &min_age_secs, &0, &sig1_another, &1, &sig2_another);
    assert_eq!(err_nullifier, Err(Ok(Error::NullifierUsed)));

    // Trying to register a new user with the same commitment (but different nullifier) should fail (CommitmentUsed)
    let different_nullifier = BytesN::from_array(&env, &[2; 32]);
    let err_commitment = registry_client.try_register(&another_user, &proof, &public_inputs, &commitment, &different_nullifier, &min_age_secs, &0, &sig1, &1, &sig2);
    assert_eq!(err_commitment, Err(Ok(Error::CommitmentUsed)));

    // Revoke user by owner — this should also burn the SBT
    registry_client.revoke(&user);
    assert!(!registry_client.is_verified(&user));
    assert_eq!(sbt_client.balance_of(&user), 0);
    assert_eq!(sbt_client.total_supply(), 0);
}

#[test]
fn test_credential_expiration_and_renewal() {
    let env = Env::default();
    env.budget().reset_unlimited();

    // 1. Load the proof, vk, and public inputs
    let vk_bytes_raw = include_bytes!("../test_artifacts/vk");
    let proof_bytes_raw = include_bytes!("../test_artifacts/proof");
    let public_inputs_raw = include_bytes!("../test_artifacts/public_inputs");

    let vk_bytes = Bytes::from_slice(&env, vk_bytes_raw);
    let proof = Bytes::from_slice(&env, proof_bytes_raw);
    let public_inputs = Bytes::from_slice(&env, public_inputs_raw);

    // 2. Deploy the verifier contract
    let verifier_address = env.register(VERIFIER_WASM, (vk_bytes,));

    // 3. Deploy the SBT contract
    let sbt_address = env.register(SBT_WASM, ());
    let sbt_client = sbt::Client::new(&env, &sbt_address);

    // 4. Deploy the registry contract
    let registry_address = env.register(RegistryContract, ());
    let registry_client = RegistryContractClient::new(&env, &registry_address);
    env.mock_all_auths();

    // 5. Initialize SBT with the registry as admin
    let sbt_name = String::from_str(&env, "Luminar Compliance SBT");
    let sbt_symbol = String::from_str(&env, "LSBT");
    sbt_client.initialize(&registry_address, &sbt_name, &sbt_symbol);

    // 6. Generate oracle keys dynamically
    let signer1 = SigningKey::generate(&mut OsRng);
    let signer2 = SigningKey::generate(&mut OsRng);
    let signer3 = SigningKey::generate(&mut OsRng);

    let oracle1 = BytesN::from_array(&env, &signer1.verifying_key().to_bytes());
    let oracle2 = BytesN::from_array(&env, &signer2.verifying_key().to_bytes());
    let oracle3 = BytesN::from_array(&env, &signer3.verifying_key().to_bytes());

    let owner = Address::generate(&env);
    registry_client.initialize(&owner, &verifier_address, &sbt_address, &oracle1, &oracle2, &oracle3);

    // 7. Setup test variables
    let user = Address::generate(&env);
    let commitment = BytesN::from_array(&env, &[
        0x0c, 0x96, 0xed, 0x2d, 0xa7, 0x05, 0xd8, 0xf8,
        0x89, 0xd2, 0x9d, 0xc5, 0xf3, 0x3b, 0x2f, 0x24,
        0x7f, 0xeb, 0x95, 0xf8, 0x2a, 0x87, 0x27, 0x9b,
        0x51, 0xc3, 0xc3, 0x44, 0xe7, 0x92, 0x6d, 0xf7
    ]);
    let nullifier = BytesN::from_array(&env, &[
        0x12, 0x09, 0xb3, 0x19, 0x03, 0x2d, 0xc2, 0xee,
        0x8d, 0x3d, 0x76, 0x4d, 0x34, 0x97, 0xe8, 0xcc,
        0xe8, 0x94, 0x84, 0xfc, 0x91, 0xcb, 0xae, 0x23,
        0xaa, 0xb6, 0xe4, 0x14, 0xc2, 0x36, 0xe1, 0x68
    ]);
    let min_age_secs = 567648000;

    let msg_bytes = commitment.to_array();
    let sig1 = BytesN::from_array(&env, &signer1.sign(&msg_bytes).to_bytes());
    let sig2 = BytesN::from_array(&env, &signer2.sign(&msg_bytes).to_bytes());

    // Initial registration at timestamp 0
    registry_client.register(&user, &proof, &public_inputs, &commitment, &nullifier, &min_age_secs, &0, &sig1, &1, &sig2);
    assert!(registry_client.is_verified(&user));
    assert_eq!(sbt_client.balance_of(&user), 1);

    // Try to register a different wallet using the same commitment while it is still active (should fail - CommitmentUsed)
    let another_user = Address::generate(&env);
    let different_nullifier = BytesN::from_array(&env, &[2; 32]);
    let err_commitment = registry_client.try_register(&another_user, &proof, &public_inputs, &commitment, &different_nullifier, &min_age_secs, &0, &sig1, &1, &sig2);
    assert_eq!(err_commitment, Err(Ok(Error::CommitmentUsed)));

    // Advance time past 365 days (timestamp 31,536,000)
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
    assert!(!registry_client.is_verified(&user));
    assert_eq!(sbt_client.balance_of(&user), 0);

    // Try to register a different wallet using the same nullifier (should fail - Sybil protection)
    let err_sybil = registry_client.try_register(&another_user, &proof, &public_inputs, &commitment, &nullifier, &min_age_secs, &0, &sig1, &1, &sig2);
    assert_eq!(err_sybil, Err(Ok(Error::NullifierUsed)));

    // Renew verification using same wallet and nullifier (should succeed)
    registry_client.register(&user, &proof, &public_inputs, &commitment, &nullifier, &min_age_secs, &0, &sig1, &1, &sig2);
    assert!(registry_client.is_verified(&user));
    assert_eq!(sbt_client.balance_of(&user), 1);
    assert_eq!(sbt_client.expires_at(&user), 63_072_000);
}

#[test]
fn test_invalid_minimum_age() {
    let env = Env::default();
    env.budget().reset_unlimited();

    let vk_bytes_raw = include_bytes!("../test_artifacts/vk");
    let proof_bytes_raw = include_bytes!("../test_artifacts/proof");
    let public_inputs_raw = include_bytes!("../test_artifacts/public_inputs");

    let vk_bytes = Bytes::from_slice(&env, vk_bytes_raw);
    let proof = Bytes::from_slice(&env, proof_bytes_raw);
    let public_inputs = Bytes::from_slice(&env, public_inputs_raw);

    let verifier_address = env.register(VERIFIER_WASM, (vk_bytes,));
    let sbt_address = env.register(SBT_WASM, ());
    let sbt_client = sbt::Client::new(&env, &sbt_address);

    let registry_address = env.register(RegistryContract, ());
    let registry_client = RegistryContractClient::new(&env, &registry_address);
    env.mock_all_auths();

    let sbt_name = String::from_str(&env, "Luminar Compliance SBT");
    let sbt_symbol = String::from_str(&env, "LSBT");
    sbt_client.initialize(&registry_address, &sbt_name, &sbt_symbol);

    let owner = Address::generate(&env);
    let oracle1 = BytesN::from_array(&env, &[0; 32]);
    let oracle2 = BytesN::from_array(&env, &[0; 32]);
    let oracle3 = BytesN::from_array(&env, &[0; 32]);
    registry_client.initialize(&owner, &verifier_address, &sbt_address, &oracle1, &oracle2, &oracle3);

    let user = Address::generate(&env);
    let commitment = BytesN::from_array(&env, &[0; 32]);
    let nullifier = BytesN::from_array(&env, &[0; 32]);
    
    // min_age_secs set below 18 years (e.g. 17 years in seconds: 17 * 365 * 24 * 3600 = 536,112,000)
    let min_age_secs = 536112000;

    let sig1 = BytesN::from_array(&env, &[0; 64]);
    let sig2 = BytesN::from_array(&env, &[0; 64]);

    let err = registry_client.try_register(&user, &proof, &public_inputs, &commitment, &nullifier, &min_age_secs, &0, &sig1, &1, &sig2);
    assert_eq!(err, Err(Ok(Error::InvalidMinAge)));
}
