# Testing Luminar Integration on Stellar Testnet

This guide walks you through configuring and running integration tests for the **Luminar SDK** using the **Stellar Testnet**.

---

## 1. Testnet Smart Contract Addresses

Luminar has a persistent contract suite deployed and initialized on the Stellar Testnet. You can use these contract IDs directly in your test configuration:

| Contract Name | Contract ID | Explorer Link |
| :--- | :--- | :--- |
| **Luminar KYC Registry** | `CAGM5DYHKTAC3OG3HTJCCP4MNLD7EIQR74SLO3E3Q6BGAY4TEEP75M6U` | [View on Stellar.expert](https://stellar.expert/explorer/testnet/contract/CAGM5DYHKTAC3OG3HTJCCP4MNLD7EIQR74SLO3E3Q6BGAY4TEEP75M6U) |
| **ZK UltraHonk Verifier** | `CAF46OFBWDEDEWYPASUEAGM5UNLIVGM5X3TRDKEMBR6HHN363I6T2Z43` | [View on Stellar.expert](https://stellar.expert/explorer/testnet/contract/CAF46OFBWDEDEWYPASUEAGM5UNLIVGM5X3TRDKEMBR6HHN363I6T2Z43) |
| **Luminar Compliance SBT (LSBT)** | `CDMUHTTOS7HHIJAL7XKTTZABQWFW3O5CVAJXJ5RBFYQMLXORMJK4HOSG` | [View on Stellar.expert](https://stellar.expert/explorer/testnet/contract/CDMUHTTOS7HHIJAL7XKTTZABQWFW3O5CVAJXJ5RBFYQMLXORMJK4HOSG) |

---

## 2. Prerequisites

### A. Fund Your Test Wallet
Your connected tester wallet must contain testnet XLM to pay for transaction and storage fee reserves.
1. Connect your wallet (e.g., Freighter, Albedo).
2. Copy your Stellar address.
3. Go to the [Stellar Laboratory Friendbot Tool](https://laboratory.stellar.org/#friendbot?network=testnet).
4. Enter your address and click **Get Test Network XLM** to receive 10,000 test XLM.

### B. Run the Oracle Service Locally
The oracle service is required to return signatures for test inputs.
1. In the `oracle/` directory, ensure you have configured your local environment variables in `.env`.
2. Start the local server:
   ```bash
   cd oracle
   npm install
   npm run dev
   ```
   *The local server will listen at `http://localhost:3001`.*

---

## 3. Configuring the SDK for Testnet

Instantiate the `LuminarClient` with the Testnet contract IDs and endpoints:

```typescript
import { LuminarClient } from "@luminar/sdk";

const client = new LuminarClient({
  network: "testnet",
  rpcUrl: "https://soroban-testnet.stellar.org",
  registryContractId: "CAGM5DYHKTAC3OG3HTJCCP4MNLD7EIQR74SLO3E3Q6BGAY4TEEP75M6U",
  verifierContractId: "CAF46OFBWDEDEWYPASUEAGM5UNLIVGM5X3TRDKEMBR6HHN363I6T2Z43",
  sbtContractId: "CDMUHTTOS7HHIJAL7XKTTZABQWFW3O5CVAJXJ5RBFYQMLXORMJK4HOSG",
  oracleUrl: "http://localhost:3001" // Local running oracle service
});
```

---

## 4. End-to-End Integration Flow

Add this integration sequence to your test app or mock environment:

```typescript
import { 
  requestAttestations, 
  computeHashes, 
  generateKycProof,
  StellarWalletsKitProvider 
} from "@luminar/sdk";

async function runTest(yourStellarWalletsKitInstance: any, userAddress: string) {
  console.log("Starting Testnet Verification for:", userAddress);

  // 1. Wrap the wallet connection
  const wallet = new StellarWalletsKitProvider(yourStellarWalletsKitInstance, userAddress);

  // 2. Fetch Consensus Signatures from local Oracle
  const attestation = await requestAttestations("http://localhost:3001", {
    name: "John Doe",
    dob: "1995-05-15",
    docNumber: "ABCDE1234F",
    documentType: "PAN"
  });

  // 3. Compute Poseidon2 hashes locally
  const { commitment, nullifier } = await computeHashes({
    nameHash: attestation.nameHash,
    idHash: attestation.idHash,
    dobTimestamp: attestation.dobTimestamp,
    secret: attestation.secret,
    stellarAddress: userAddress
  });

  // 4. Generate local Zero-Knowledge Proof (UltraHonk in browser WASM)
  // Ensure the ZK circuit config file is hosted in your app static directory
  const proofBundle = await generateKycProof({
    circuitSource: "/circuits/kyc_proof.json",
    nameHash: attestation.nameHash,
    idHash: attestation.idHash,
    dobTimestamp: attestation.dobTimestamp,
    secret: attestation.secret,
    stellarAddress: userAddress,
    commitment,
    nullifier,
    minAgeSecs: 567648000 // 18 years
  });

  // 5. Submit on-chain registration transaction to Soroban Testnet
  const txHash = await client.register({
    wallet,
    proof: proofBundle.proofBytes,
    publicInputs: proofBundle.publicInputsBytes,
    commitment: proofBundle.commitment,
    nullifier: proofBundle.nullifier,
    minAgeSecs: 567648000,
    oracleIdxA: 0,
    sigA: attestation.oracle1Sig,
    oracleIdxB: 1,
    sigB: attestation.oracle2Sig
  });

  console.log("🎉 Testnet registration transaction complete! Tx Hash:", txHash);

  // 6. Verify that the SBT was successfully minted to user Address
  const ownsSbt = await client.hasToken(userAddress);
  console.log("ownsSbt:", ownsSbt); // Expected output: true
}
```

---

## 5. Verification on Testnet Explorer

After a successful test transaction:
1. Copy the output transaction hash or your wallet address.
2. Go to [Stellar.expert Testnet Explorer](https://stellar.expert/explorer/testnet/).
3. Paste the address or hash into the search bar.
4. You should see a `Mint` event from the SBT contract `CDMUHTTO...` transferring a compliance token to your address, confirming the integration is working!
