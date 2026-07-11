export interface Attestation {
  oracleIndex: number;
  signature: string; // Hex string (64 bytes / 128 hex chars)
}

export interface AttestationRequest {
  name: string;
  dob: string; // YYYY-MM-DD
  docNumber: string;
  documentType: "PAN" | "AADHAAR" | "PASSPORT";
}

export interface ProofInputs {
  nameHash: string; // Hex string
  idHash: string; // Hex string
  dobTimestamp: number; // Unix timestamp
  secret: string; // Hex string
  stellarAddress: string; // Stellar G... address
  minAgeSecs: number;
}

export interface ProofBundle {
  proofBytes: Uint8Array;
  publicInputsBytes: Uint8Array;
  commitment: string; // Hex string with 0x prefix
  nullifier: string; // Hex string with 0x prefix
}

export interface SDKConfig {
  oracleUrl: string;
  registryContractId: string;
  verifierContractId: string;
  sbtContractId: string;
  network: "mainnet" | "testnet";
  rpcUrl: string;
}

export interface WalletProvider {
  getPublicKey(): Promise<string>;
  signTransaction(txXdr: string, opts?: { networkPassphrase?: string }): Promise<string>;
}

export interface RegisterParams {
  wallet: WalletProvider;
  proof: Uint8Array;
  publicInputs: Uint8Array;
  commitment: string; // Hex string (with or without 0x)
  nullifier: string; // Hex string (with or without 0x)
  minAgeSecs: number;
  oracleIdxA: number;
  sigA: string; // Hex signature
  oracleIdxB: number;
  sigB: string; // Hex signature
  inclusionFee?: number;
}
