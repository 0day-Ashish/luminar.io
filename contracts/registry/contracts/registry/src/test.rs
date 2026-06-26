#![cfg(test)]

use super::*;
use soroban_sdk::{Env, Bytes, BytesN, Address, String};
use soroban_sdk::testutils::Address as _;

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

    // 1. Load the proof, vk, and public inputs
    let vk_bytes_raw = include_bytes!("../test_artifacts/vk");
    let proof_bytes_raw = include_bytes!("../test_artifacts/proof");
    let public_inputs_raw = include_bytes!("../test_artifacts/public_inputs");

    let vk_bytes = Bytes::from_slice(&env, vk_bytes_raw);
    let proof = Bytes::from_slice(&env, proof_bytes_raw);
    let public_inputs = Bytes::from_slice(&env, public_inputs_raw);

    // 2. Deploy the verifier contract
    let verifier_address = env.register(VERIFIER_WASM, (vk_bytes,));

    // 3. Deploy the SBT contract and initialize it
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

    // 6. Initialize the registry with verifier + SBT
    let owner = Address::generate(&env);
    registry_client.initialize(&owner, &verifier_address, &sbt_address);

    // 7. Setup test variables matching the circuits/kyc_proof public inputs
    let user = Address::generate(&env);

    // commitment and nullifier bytes from Prover.toml/public inputs:
    // commitment: 0x0b42852e21a45e535f4093674dd7002683c720ce37d26b339c7b255f0b545a02
    // nullifier: 0x263e9e9820d091699b182811307caf8f867a3d07b234d3328e925bd2919521ab
    let commitment = BytesN::from_array(&env, &[
        0x0b, 0x42, 0x85, 0x2e, 0x21, 0xa4, 0x5e, 0x53,
        0x5f, 0x40, 0x93, 0x67, 0x4d, 0xd7, 0x00, 0x26,
        0x83, 0xc7, 0x20, 0xce, 0x37, 0xd2, 0x6b, 0x33,
        0x9c, 0x7b, 0x25, 0x5f, 0x0b, 0x54, 0x5a, 0x02,
    ]);
    let nullifier = BytesN::from_array(&env, &[
        0x26, 0x3e, 0x9e, 0x98, 0x20, 0xd0, 0x91, 0x69,
        0x9b, 0x18, 0x28, 0x11, 0x30, 0x7c, 0xaf, 0x8f,
        0x86, 0x7a, 0x3d, 0x07, 0xb2, 0x34, 0xd3, 0x32,
        0x8e, 0x92, 0x5b, 0xd2, 0x91, 0x95, 0x21, 0xab,
    ]);
    let min_age_secs = 567648000; // 18 years in seconds

    // Initially, user is not verified and has no SBT
    assert!(!registry_client.is_verified(&user));
    assert_eq!(sbt_client.balance_of(&user), 0);

    // Register user — this should also mint an SBT
    registry_client.register(&user, &proof, &public_inputs, &commitment, &nullifier, &min_age_secs);

    // User should be verified AND hold an SBT
    assert!(registry_client.is_verified(&user));
    assert_eq!(sbt_client.balance_of(&user), 1);
    assert_eq!(sbt_client.total_supply(), 1);

    // Trying to register again should fail (AlreadyVerified)
    let err = registry_client.try_register(&user, &proof, &public_inputs, &commitment, &nullifier, &min_age_secs);
    assert_eq!(err, Err(Ok(Error::AlreadyVerified)));

    // Trying to register a new user with the same nullifier should fail (NullifierUsed)
    let another_user = Address::generate(&env);
    let err_nullifier = registry_client.try_register(&another_user, &proof, &public_inputs, &commitment, &nullifier, &min_age_secs);
    assert_eq!(err_nullifier, Err(Ok(Error::NullifierUsed)));

    // Revoke user by owner — this should also burn the SBT
    registry_client.revoke(&user);
    assert!(!registry_client.is_verified(&user));
    assert_eq!(sbt_client.balance_of(&user), 0);
    assert_eq!(sbt_client.total_supply(), 0);
}
