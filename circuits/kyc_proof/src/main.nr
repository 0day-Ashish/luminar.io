use dep::poseidon::poseidon2::Poseidon2;

fn poseidon2_hash<let N: u32>(inputs: [Field; N]) -> Field {
    Poseidon2::hash(inputs, N)
}

fn main(
    // Private inputs
    name_hash: Field,
    id_hash: Field,
    dob_timestamp: u64,
    secret: Field,
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
}

#[test]
fn test_adult_user() {
    let name_hash: Field = 0x1234;
    let id_hash: Field = 0x5678;
    let secret: Field = 0xabcd;
    let stellar_address: Field = 0xdead;

    let dob_timestamp: u64 = 0;
    let current_timestamp: u64 = 946728000;
    let min_age_secs: u64 = 567648000;

    let commitment = poseidon2_hash(
        [name_hash, id_hash, dob_timestamp as Field, secret],
    );
    let nullifier = poseidon2_hash([secret, stellar_address]);

    main(
        name_hash, id_hash, dob_timestamp, secret,
        commitment, nullifier, stellar_address,
        current_timestamp, min_age_secs,
    );
}

#[test(should_fail_with = "User does not meet minimum age requirement")]
fn test_minor_user() {
    let name_hash: Field = 0x1234;
    let id_hash: Field = 0x5678;
    let secret: Field = 0xabcd;
    let stellar_address: Field = 0xdead;

    let dob_timestamp: u64 = 0;
    let current_timestamp: u64 = 315576000;
    let min_age_secs: u64 = 567648000;

    let commitment = poseidon2_hash(
        [name_hash, id_hash, dob_timestamp as Field, secret],
    );
    let nullifier = poseidon2_hash([secret, stellar_address]);

    main(
        name_hash, id_hash, dob_timestamp, secret,
        commitment, nullifier, stellar_address,
        current_timestamp, min_age_secs,
    );
}