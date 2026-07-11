# @luminar/sdk

A lightweight, developer-friendly TypeScript/JavaScript SDK to integrate **Luminar ZK-KYC Identity Verification** and compliance checks directly into Stellar DeFi platforms.

---

## Features

- **Decentralized Multi-Oracle Client**: Easily request threshold consensus signatures from identity verification nodes.
- **Client-Side ZK Prover**: Generate Noir/UltraHonk compliance proofs locally in the browser (WASM).
- **Wallet Adapters**: Out-of-the-box adapters for Freighter and custom Stellar signers.
- **On-Chain Contract Interfaces**: Instantly read user verification status or submit ZK proof registration transactions to Soroban.

---

## Installation

Install the package and its peer dependencies:

```bash
npm install @luminar/sdk @stellar/stellar-sdk
```

---

## Core Flow Integrations

### Scenario 1: Check If User Has Compliance Token (Frictionless Read)

DeFi apps can perform a quick, free on-chain read to check if a user is compliant before unlocking trading/lending.

```typescript
import { LuminarClient } from "@luminar/sdk";

// 1. Initialize client config
const client = new LuminarClient({
  oracleUrl: "https://oracle.luminar.io",
  registryContractId: "CCGSPB7P2PTI7SPUN2EGWPPCGL5SGNIZ7AAVFKBTFBSIY7XCMSOKHZ4B",
  verifierContractId: "CCSIAHS2UOARAAEZW5CNV2RNJNOPOPSXM7J3FT764K6E4YZZFTCE76N6",
  sbtContractId: "CB2Y2S7N6ERY6YAC6M2KCDPVF4CSEDVEHN5OIFIUQWA37BATYJBFZVBP",
  network: "mainnet", // "mainnet" | "testnet"
  rpcUrl: "https://mainnet.sorobanrpc.com"
});

// 2. Perform the read
const userAddress = "GAZXGFFROEO6EDT4XLRFZIPUKG4ELQ77D6NFSM4CZALWBH5HG6CFINOB";
const isVerified = await client.hasToken(userAddress);

if (isVerified) {
  console.log("✅ User holds a valid Soulbound Compliance Token. Access granted!");
} else {
  console.log("❌ User has no compliance token. Redirect to verification portal.");
}
```

---

### Scenario 2: Complete KYC Verification & Proof Generation

If the user is not verified, run the attestation, local proof generation, and registration flow:

```typescript
import { 
  requestAttestations, 
  computeHashes, 
  generateKycProof,
  StellarWalletsKitProvider // Or FreighterWalletProvider
} from "@luminar/sdk";

// 1. Connect wallet and get address (e.g. using pre-initialized StellarWalletsKit instance)
const wallet = new StellarWalletsKitProvider(yourStellarWalletsKitInstance, userAddress);
const stellarAddress = await wallet.getPublicKey();

// 2. Request Multi-Oracle attestations (e.g. from user input)
const attestationData = await requestAttestations("https://oracle.luminar.io", {
  name: "John Doe",
  dob: "1995-05-15",
  docNumber: "ABCDE1234F",
  documentType: "PAN"
});

// 3. Compute Poseidon2 hashes locally
const { commitment, nullifier } = await computeHashes({
  nameHash: attestationData.nameHash,
  idHash: attestationData.idHash,
  dobTimestamp: attestationData.dobTimestamp,
  secret: attestationData.secret,
  stellarAddress
});

// 4. Generate ZK Proof locally in browser
// Pass the path to your hosted circuit JSON configuration file
const proofBundle = await generateKycProof({
  circuitSource: "/circuits/kyc_proof.json",
  nameHash: attestationData.nameHash,
  idHash: attestationData.idHash,
  dobTimestamp: attestationData.dobTimestamp,
  secret: attestationData.secret,
  stellarAddress,
  commitment,
  nullifier,
  minAgeSecs: 567648000 // 18 years in seconds
});

// 5. Submit registration to Stellar Soroban
// (Invokes on-chain verifier and automatically mints the SBT)
const txHash = await client.register({
  wallet,
  proof: proofBundle.proofBytes,
  publicInputs: proofBundle.publicInputsBytes,
  commitment: proofBundle.commitment,
  nullifier: proofBundle.nullifier,
  minAgeSecs: 567648000,
  oracleIdxA: 0,
  sigA: attestationData.oracle1Sig,
  oracleIdxB: 1,
  sigB: attestationData.oracle2Sig
});

console.log(`🎉 Registration complete! Tx Hash: ${txHash}`);
```

---

## API Reference

### `LuminarClient` Class
Main interface for interacting with the on-chain contracts:
- `constructor(config: SDKConfig)`: Instantiates a client.
- `hasToken(userAddress: string): Promise<boolean>`: Checks if an address holds a compliance Soulbound Token.
- `getSbtExpiration(userAddress: string): Promise<number>`: Gets the unix timestamp expiration of the token.
- `register(params: RegisterParams): Promise<string>`: Submits ZK proof and consensus signatures. Returns tx hash.

### Wallet Providers
Adapters to connect the user's wallet with the on-chain registry:
- `FreighterWalletProvider`: Uses the browser extension Freighter API directly.
- `StellarWalletsKitProvider(kit, address)`: Direct adapter wrapping an initialized `@creit-tech/stellar-wallets-kit` instance and the active address.
- `CustomWalletProvider(address, signFn)`: Adapter class to integrate any custom wallet signing mechanism.

### Cryptographic Helpers
- `requestAttestations(oracleUrl, payload)`: Queries the oracle consensus node.
- `computeHashes(params)`: Computes Poseidon2 commitments.
- `generateKycProof(params)`: Runs local witness execution and UltraHonk proof generation.
