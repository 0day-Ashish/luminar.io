use dep::poseidon::poseidon2::Poseidon2;

fn poseidon2_hash<let N: u32>(inputs: [Field; N]) -> Field {
    Poseidon2::hash(inputs, N)
}

// Oracle Public Keys (Secp256k1 X and Y coordinates)
global ORACLE1_X: [u8; 32] = [243, 35, 12, 41, 27, 170, 154, 121, 173, 186, 99, 148, 201, 117, 246, 255, 57, 0, 169, 132, 6, 190, 94, 134, 79, 163, 50, 57, 132, 149, 172, 255];
global ORACLE1_Y: [u8; 32] = [223, 251, 86, 218, 9, 205, 217, 243, 89, 59, 107, 137, 248, 119, 1, 120, 181, 73, 235, 254, 40, 232, 140, 193, 26, 153, 87, 236, 51, 42, 8, 160];

global ORACLE2_X: [u8; 32] = [55, 108, 93, 242, 146, 129, 117, 207, 57, 27, 214, 129, 57, 204, 30, 194, 190, 143, 179, 206, 163, 86, 107, 240, 174, 206, 142, 121, 17, 123, 120, 237];
global ORACLE2_Y: [u8; 32] = [177, 112, 137, 102, 78, 15, 179, 26, 59, 219, 210, 242, 136, 156, 96, 213, 98, 85, 112, 206, 100, 92, 177, 107, 95, 255, 182, 243, 89, 98, 68, 230];

global ORACLE3_X: [u8; 32] = [91, 183, 88, 49, 43, 255, 100, 104, 16, 27, 176, 79, 125, 2, 242, 231, 31, 106, 24, 217, 145, 167, 34, 108, 157, 27, 221, 77, 62, 76, 150, 180];
global ORACLE3_Y: [u8; 32] = [137, 73, 18, 5, 231, 134, 234, 179, 109, 199, 143, 239, 6, 197, 23, 187, 96, 94, 54, 191, 104, 80, 24, 97, 17, 254, 65, 219, 188, 65, 193, 183];

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