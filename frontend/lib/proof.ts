import { StrKey } from "@stellar/stellar-sdk";

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

export async function computeHashes(
  nameHash: string,
  idHash: string,
  dobTimestamp: number,
  secret: string,
  stellarAddress: string
): Promise<HashOutputs> {
  const { BarretenbergSync, Fr } = await import("@aztec/bb.js");
  await BarretenbergSync.initSingleton();
  const api = BarretenbergSync.getSingleton();

  const stellarField = stellarAddressToField(stellarAddress);

  // commitment = Poseidon2(name_hash, id_hash, dob_timestamp, secret)
  const commRes = api.poseidon2Hash([
    Fr.fromBuffer(hexToBytes(nameHash)),
    Fr.fromBuffer(hexToBytes(idHash)),
    Fr.fromBuffer(hexToBytes(dobTimestamp.toString(16))),
    Fr.fromBuffer(hexToBytes(secret))
  ]);
  
  // nullifier = Poseidon2(secret, stellar_address)
  const nullRes = api.poseidon2Hash([
    Fr.fromBuffer(hexToBytes(secret)),
    Fr.fromBuffer(hexToBytes(stellarField))
  ]);

  const commHex = "0x" + Array.from(commRes.value).map(b => b.toString(16).padStart(2, "0")).join("");
  const nullHex = "0x" + Array.from(nullRes.value).map(b => b.toString(16).padStart(2, "0")).join("");

  return {
    commitment: commHex,
    nullifier: nullHex
  };
}

export interface ProofGenerationResult {
  proofBytes: Uint8Array;
  publicInputsBytes: Uint8Array;
}

export function signatureHexToBytes(hex: string): number[] {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  const bytes: number[] = [];
  for (let i = 0; i < clean.length; i += 2) {
    bytes.push(parseInt(clean.slice(i, i + 2), 16));
  }
  while (bytes.length < 64) {
    bytes.push(0);
  }
  return bytes.slice(0, 64);
}

export interface BenchmarkTimings {
  wasmInit: number;
  circuitFetch: number;
  inputPrep: number;
  witnessGen: number;
  proofGen: number;
  total: number;
}

export interface ProofGenerationResultWithBenchmark extends ProofGenerationResult {
  benchmark: BenchmarkTimings;
}

export async function generateKycProof(
  nameHash: string,
  idHash: string,
  dobTimestamp: number,
  secret: string,
  stellarAddress: string,
  commitment: string,
  nullifier: string,
  minAgeSecs: number,
  sig1Hex: string,
  sig2Hex: string,
  sig3Hex: string
): Promise<ProofGenerationResultWithBenchmark> {
  const totalStart = performance.now();

  // 1. Import WASM modules
  const wasmStart = performance.now();
  const { Noir } = await import("@noir-lang/noir_js");
  const { UltraHonkBackend } = await import("@aztec/bb.js");
  const wasmInit = performance.now() - wasmStart;
  console.log(`⏱ WASM Init: ${wasmInit.toFixed(0)} ms`);

  // 2. Fetch circuit definition
  const fetchStart = performance.now();
  const response = await fetch("/circuits/kyc_proof.json");
  const circuit = await response.json();
  const circuitFetch = performance.now() - fetchStart;
  console.log(`⏱ Circuit Fetch: ${circuitFetch.toFixed(0)} ms`);

  // 3. Prepare inputs
  const prepStart = performance.now();
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const stellarField = stellarAddressToField(stellarAddress);
  const inputs = {
    name_hash: padTo32BytesHex(nameHash),
    id_hash: padTo32BytesHex(idHash),
    dob_timestamp: dobTimestamp.toString(),
    secret: padTo32BytesHex(secret),
    sig1: signatureHexToBytes(sig1Hex),
    sig2: signatureHexToBytes(sig2Hex),
    sig3: signatureHexToBytes(sig3Hex),
    commitment: padTo32BytesHex(commitment),
    nullifier: padTo32BytesHex(nullifier),
    stellar_address: stellarField,
    current_timestamp: currentTimestamp.toString(),
    min_age_secs: minAgeSecs.toString()
  };
  const inputPrep = performance.now() - prepStart;
  console.log(`⏱ Input Prep: ${inputPrep.toFixed(0)} ms`);

  // 4. Instantiate UltraHonkBackend with multi-threading (if SharedArrayBuffer is available)
  const threads = typeof SharedArrayBuffer !== "undefined"
    ? navigator.hardwareConcurrency || 4
    : 1;
  console.log(`🧵 Using ${threads} threads (SharedArrayBuffer: ${typeof SharedArrayBuffer !== "undefined" ? "✓" : "✗"})`);
  const backend = new UltraHonkBackend(circuit.bytecode, { threads });
  const noir = new Noir(circuit);

  try {
    // 5. Generate witness
    const witnessStart = performance.now();
    const { witness } = await noir.execute(inputs);
    const witnessGen = performance.now() - witnessStart;
    console.log(`⏱ Witness Generation: ${witnessGen.toFixed(0)} ms`);

    // 6. Generate proof
    const proofStart = performance.now();
    const proofRes = await backend.generateProof(witness, { keccak: true });
    const proofGen = performance.now() - proofStart;
    console.log(`⏱ Proof Generation: ${proofGen.toFixed(0)} ms`);

    // publicInputs is string[] — convert each hex string field to 32 bytes
    const numInputs = proofRes.publicInputs.length;
    const concatenatedInputs = new Uint8Array(numInputs * 32);
    proofRes.publicInputs.forEach((input: string, index: number) => {
      concatenatedInputs.set(hexToBytes(input), index * 32);
    });

    const total = performance.now() - totalStart;
    console.log(`⏱ TOTAL: ${total.toFixed(0)} ms`);
    console.log(`📦 Proof size: ${proofRes.proof.length} bytes`);

    const benchmark: BenchmarkTimings = {
      wasmInit: Math.round(wasmInit),
      circuitFetch: Math.round(circuitFetch),
      inputPrep: Math.round(inputPrep),
      witnessGen: Math.round(witnessGen),
      proofGen: Math.round(proofGen),
      total: Math.round(total),
    };

    return {
      proofBytes: proofRes.proof,
      publicInputsBytes: concatenatedInputs,
      benchmark,
    };
  } finally {
    await backend.destroy();
  }
}

