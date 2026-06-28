use dep::poseidon::poseidon2::Poseidon2;

fn poseidon2_hash<let N: u32>(inputs: [Field; N]) -> Field {
    Poseidon2::hash(inputs, N)
}

// Oracle Public Keys (Secp256k1 X and Y coordinates)
global ORACLE1_X: [u8; 32] = [32, 32, 21, 66, 73, 18, 249, 92, 27, 161, 216, 235, 15, 135, 241, 184, 132, 146, 137, 173, 150, 82, 72, 209, 172, 238, 71, 54, 210, 32, 150, 111];
global ORACLE1_Y: [u8; 32] = [89, 191, 225, 246, 126, 247, 145, 57, 101, 192, 204, 205, 189, 26, 93, 48, 164, 135, 122, 22, 120, 136, 88, 169, 165, 21, 204, 11, 174, 83, 240, 253];

global ORACLE2_X: [u8; 32] = [182, 183, 79, 240, 59, 253, 156, 85, 52, 160, 183, 20, 4, 116, 136, 200, 112, 192, 189, 46, 134, 214, 206, 154, 28, 55, 124, 87, 38, 117, 198, 65];
global ORACLE2_Y: [u8; 32] = [3, 32, 93, 143, 147, 87, 108, 153, 154, 126, 32, 195, 78, 142, 33, 113, 116, 9, 123, 30, 3, 65, 220, 29, 149, 80, 86, 247, 37, 11, 189, 186];

global ORACLE3_X: [u8; 32] = [75, 146, 1, 8, 197, 246, 227, 146, 65, 235, 155, 212, 87, 111, 205, 3, 44, 221, 12, 206, 133, 75, 38, 125, 203, 152, 200, 38, 217, 66, 251, 207];
global ORACLE3_Y: [u8; 32] = [3, 71, 110, 122, 155, 60, 234, 181, 133, 34, 192, 64, 17, 189, 242, 5, 176, 172, 152, 41, 216, 84, 159, 113, 218, 81, 21, 98, 227, 52, 81, 156];

fn main(
    // Private inputs
    name_hash: Field,
    id_hash: Field,
    dob_timestamp: u64,
    secret: Field,
    sig1: [u8; 64],
    sig2: [u8; 64],
    sig3: [u8; 64],
    // Public inputs
    commitment: pub Field,
    nullifier: pub Field,
    stellar_address: pub Field,
    current_timestamp: pub u64,
    min_age_secs: pub u64,
) {
    // 1. Verify commitment = Poseidon2(name_hash, id_hash, dob_timestamp, secret)
    let computed_commitment = poseidon2_hash(
        [name_hash, id_hash, dob_timestamp as Field, secret],
    );
    assert(commitment == computed_commitment, "Commitment mismatch");

    // 2. Verify age: current_timestamp - dob_timestamp >= min_age_secs
    let age_secs = current_timestamp - dob_timestamp;
    assert(age_secs >= min_age_secs, "User does not meet minimum age requirement");

    // 3. Verify nullifier = Poseidon2(secret, stellar_address)
    let computed_nullifier = poseidon2_hash([secret, stellar_address]);
    assert(nullifier == computed_nullifier, "Nullifier mismatch");

    // 4. Verify Multi-Oracle consensus (2-of-3 threshold)
    // Serialize message: name_hash || id_hash || dob_timestamp || secret
    let name_bytes: [u8; 32] = name_hash.to_be_bytes();
    let id_bytes: [u8; 32] = id_hash.to_be_bytes();
    let dob_field_bytes: [u8; 32] = (dob_timestamp as Field).to_be_bytes();
    let mut dob_bytes: [u8; 8] = [0; 8];
    for i in 0..8 {
        dob_bytes[i] = dob_field_bytes[24 + i];
    }
    let secret_bytes: [u8; 32] = secret.to_be_bytes();

    let mut payload: [u8; 104] = [0; 104];
    for i in 0..32 {
        payload[i] = name_bytes[i];
        payload[32 + i] = id_bytes[i];
        payload[72 + i] = secret_bytes[i];
    }
    for i in 0..8 {
        payload[64 + i] = dob_bytes[i];
    }

    let msg_hash = std::hash::blake2s(payload);

    let verify1 = std::ecdsa_secp256k1::verify_signature(ORACLE1_X, ORACLE1_Y, sig1, msg_hash);
    let verify2 = std::ecdsa_secp256k1::verify_signature(ORACLE2_X, ORACLE2_Y, sig2, msg_hash);
    let verify3 = std::ecdsa_secp256k1::verify_signature(ORACLE3_X, ORACLE3_Y, sig3, msg_hash);

    let mut score = 0;
    if verify1 { score += 1; }
    if verify2 { score += 1; }
    if verify3 { score += 1; }

    assert(score >= 2, "Threshold consensus failed: less than 2 valid oracle signatures");
}