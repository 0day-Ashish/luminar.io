import { StrKey } from "@stellar/stellar-sdk";
import { ProofBundle } from "./types.js";

const BN254_PRIME = BigInt(
  "21888242871839275222246405745257275088548364400416034343698204186575808495617"
);

export function padTo32BytesHex(val: string): string {
  const clean = val.startsWith("0x") ? val.slice(2) : val;
  return "0x" + clean.padStart(64, "0");
}

export function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  const padded = clean.padStart(64, "0");
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 64; i += 2) {
    bytes[i / 2] = parseInt(padded.slice(i, i + 2), 16);
  }
  return bytes;
}


export function stellarAddressToField(address: string): string {
  try {
    const decoded = StrKey.decodeEd25519PublicKey(address);
    const hex = Array.from(decoded)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    const big = BigInt("0x" + hex);
    const fieldVal = big % BN254_PRIME;
    return padTo32BytesHex(fieldVal.toString(16));
  } catch (e) {
    console.error("Error converting address to field:", e);
    throw e;
  }
}

export interface HashOutputs {
  commitment: string;
  nullifier: string;
}

/**
 * Computes the commitment and nullifier using Poseidon2 hashing.
 */
export async function computeHashes(params: {
  nameHash: string;
  idHash: string;
  dobTimestamp: number;
  secret: string;
  stellarAddress: string;
}): Promise<HashOutputs> {
  const { BarretenbergSync, Fr } = await import("@aztec/bb.js");
  await BarretenbergSync.initSingleton();
  const api = BarretenbergSync.getSingleton();

  const stellarField = stellarAddressToField(params.stellarAddress);

  // commitment = Poseidon2(name_hash, id_hash, dob_timestamp, secret)
  const commRes = api.poseidon2Hash([
    Fr.fromBuffer(hexToBytes(params.nameHash)),
    Fr.fromBuffer(hexToBytes(params.idHash)),
    Fr.fromBuffer(hexToBytes(params.dobTimestamp.toString(16))),
    Fr.fromBuffer(hexToBytes(params.secret))
  ]);
  
  // nullifier = Poseidon2(secret, stellar_address)
  const nullRes = api.poseidon2Hash([
    Fr.fromBuffer(hexToBytes(params.secret)),
    Fr.fromBuffer(hexToBytes(stellarField))
  ]);

  const commHex = "0x" + Array.from(commRes.value).map((b: any) => b.toString(16).padStart(2, "0")).join("");
  const nullHex = "0x" + Array.from(nullRes.value).map((b: any) => b.toString(16).padStart(2, "0")).join("");

  return {
    commitment: commHex,
    nullifier: nullHex
  };
}

/**
 * Generates the compliance ZK Proof locally on the client's browser.
 */
export async function generateKycProof(params: {
  circuitSource: string | Record<string, any>;
  nameHash: string;
  idHash: string;
  dobTimestamp: number;
  secret: string;
  stellarAddress: string;
  commitment: string;
  nullifier: string;
  minAgeSecs: number;
}): Promise<ProofBundle> {
  // 1. Fetch circuit if it's a URL/path, or use direct object
  let circuit: any;
  if (typeof params.circuitSource === "string") {
    const response = await fetch(params.circuitSource);
    circuit = await response.json();
  } else {
    circuit = params.circuitSource;
  }

  // 2. Import WASM modules
  const { Noir } = await import("@noir-lang/noir_js");
  const { UltraHonkBackend } = await import("@aztec/bb.js");

  // 3. Prepare inputs
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const stellarField = stellarAddressToField(params.stellarAddress);
  const inputs = {
    name_hash: padTo32BytesHex(params.nameHash),
    id_hash: padTo32BytesHex(params.idHash),
    dob_timestamp: params.dobTimestamp.toString(),
    secret: padTo32BytesHex(params.secret),
    commitment: padTo32BytesHex(params.commitment),
    nullifier: padTo32BytesHex(params.nullifier),
    stellar_address: stellarField,
    current_timestamp: currentTimestamp.toString(),
    min_age_secs: params.minAgeSecs.toString()
  };

  const threads = typeof SharedArrayBuffer !== "undefined"
    ? (navigator.hardwareConcurrency || 4)
    : 1;

  const backend = new UltraHonkBackend(circuit.bytecode, { threads });
  const noir = new Noir(circuit);

  try {
    const { witness } = await noir.execute(inputs);
    const proofRes = await backend.generateProof(witness, { keccak: true });

    // Format public inputs as a flat Uint8Array (32 bytes per input)
    const numInputs = proofRes.publicInputs.length;
    const concatenatedInputs = new Uint8Array(numInputs * 32);
    proofRes.publicInputs.forEach((input: string, index: number) => {
      concatenatedInputs.set(hexToBytes(input), index * 32);
    });

    return {
      proofBytes: proofRes.proof,
      publicInputsBytes: concatenatedInputs,
      commitment: params.commitment,
      nullifier: params.nullifier,
    };
  } finally {
    await backend.destroy();
  }
}
