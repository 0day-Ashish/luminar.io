#!/usr/bin/env node
/**
 * Luminar ZK Circuit Benchmark — Prover.toml Generator
 * Generates correct test inputs from Oracle attestation data.
 */

const crypto = require("crypto");

// Oracle attestation data (fresh from server)
const data = {
  name_hash: "0x245846abc1761d1dc221354f2443c0a02a4347e7a093abd81ab97c8b16d13b20",
  id_hash: "0x227076972d95de58f9a6a1d6a488fc014d06d7ed4154608646883ee5e7d9b0f1",
  secret: "0x21697f148efd513bfd7ceb70055192ad3da60301dc4936f2be74c4118e9c33f7",
  dob_timestamp: 1150070400,
  oracle1_sig: "242f8ef980ad3bc967aeece8e17648de1c03ff463cec9f4758461ff06b7781a6355bfe0fad848f0920ea0505c3f40e33e4fcafa2d7b17ef9f77a09585a34c432",
  oracle2_sig: "bcfe9963a7f0b65f321d3f522b8015bae0731d39e66244ff42bf3ae2c7a09cb514639e91b4e241f2ca9dba65e865da3db8ad8a689627c74682cec7e02ce29895",
  oracle3_sig: "6ebe1d94be38f9afb5bf9ea6aade74cde6ff0853abfa3613974078179a7026776aed25a4f7aa2cfaa67b947d899e9fc61a944f54560285b81a478677a343f248",
};

// BN254 prime
const BN254 = BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495617");

// Use a test stellar address field
const stellarField = "0x" + (BigInt("0xdead") % BN254).toString(16).padStart(64, "0");

// Simple Poseidon2 cannot be computed here without bb.js, so we need to use
// the compiled circuit with nargo to derive them. Instead, let's use nargo execute
// and capture the public inputs. But the circuit requires correct commitment/nullifier.

// We'll run a two-pass approach:
// 1. First, write a Prover.toml with placeholder commitment/nullifier
// 2. Use the lib/proof.ts computeHashes logic ported to Node

// Actually, let's compute them using the same approach as the frontend:
// commitment = Poseidon2(name_hash, id_hash, dob_timestamp, secret)
// nullifier = Poseidon2(secret, stellar_address)
// We need @aztec/bb.js for this

async function main() {
  try {
    // Try to use bb.js if available
    const { BarretenbergSync, Fr } = require("@aztec/bb.js");
    await BarretenbergSync.initSingleton();
    const api = BarretenbergSync.getSingleton();

    function hexToBytes(hex) {
      const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
      const padded = clean.padStart(64, "0");
      const bytes = new Uint8Array(32);
      for (let i = 0; i < 64; i += 2) {
        bytes[i / 2] = parseInt(padded.slice(i, i + 2), 16);
      }
      return bytes;
    }

    const dobHex = data.dob_timestamp.toString(16);

    const commRes = api.poseidon2Hash([
      Fr.fromBuffer(hexToBytes(data.name_hash)),
      Fr.fromBuffer(hexToBytes(data.id_hash)),
      Fr.fromBuffer(hexToBytes(dobHex)),
      Fr.fromBuffer(hexToBytes(data.secret)),
    ]);

    const nullRes = api.poseidon2Hash([
      Fr.fromBuffer(hexToBytes(data.secret)),
      Fr.fromBuffer(hexToBytes(stellarField)),
    ]);

    const commitment = "0x" + Array.from(commRes.value).map(b => b.toString(16).padStart(2, "0")).join("");
    const nullifier = "0x" + Array.from(nullRes.value).map(b => b.toString(16).padStart(2, "0")).join("");

    // Convert signature hex to byte arrays
    function sigToArray(hex) {
      const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
      const padded = clean.padStart(128, "0");
      const bytes = [];
      for (let i = 0; i < 128; i += 2) {
        bytes.push(parseInt(padded.slice(i, i + 2), 16));
      }
      return bytes;
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const minAgeSecs = 567648000;

    const toml = `name_hash = "${data.name_hash}"
id_hash = "${data.id_hash}"
dob_timestamp = ${data.dob_timestamp}
secret = "${data.secret}"
sig1 = [${sigToArray(data.oracle1_sig).join(", ")}]
sig2 = [${sigToArray(data.oracle2_sig).join(", ")}]
sig3 = [${sigToArray(data.oracle3_sig).join(", ")}]
commitment = "${commitment}"
nullifier = "${nullifier}"
stellar_address = "${stellarField}"
current_timestamp = ${currentTimestamp}
min_age_secs = ${minAgeSecs}
`;

    const fs = require("fs");
    fs.writeFileSync("Prover.toml", toml);
    console.log("✓ Prover.toml generated successfully");
    console.log("  commitment:", commitment);
    console.log("  nullifier:", nullifier);
    console.log("  current_timestamp:", currentTimestamp);
  } catch (e) {
    console.error("Error:", e.message);
    process.exit(1);
  }
}

main();
