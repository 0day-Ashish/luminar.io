import {
  Contract,
  Account,
  Networks,
  rpc,
  TimeoutInfinite,
  TransactionBuilder,
  nativeToScVal,
  scValToNative,
  xdr,
  Transaction
} from "@stellar/stellar-sdk";
import { SDKConfig, RegisterParams } from "./types.js";

// Helper to convert hex strings to 32-byte arrays
export function hexToBytes32(hex: string): Uint8Array {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  const padded = clean.padStart(64, "0").slice(0, 64);
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 64; i += 2) {
    bytes[i / 2] = parseInt(padded.slice(i, i + 2), 16);
  }
  return bytes;
}

// Helper to convert hex signature to 64-byte array
export function signatureHexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  const bytes = new Uint8Array(64);
  for (let i = 0; i < 128; i += 2) {
    bytes[i / 2] = parseInt(clean.slice(i, i + 2), 16);
  }
  return bytes;
}

export class LuminarClient {
  private config: SDKConfig;
  private server: rpc.Server;
  private networkPassphrase: string;

  constructor(config: SDKConfig) {
    this.config = config;
    this.server = new rpc.Server(config.rpcUrl);
    this.networkPassphrase = config.network === "mainnet" ? Networks.PUBLIC : Networks.TESTNET;
  }

  /**
   * Checks if a user is verified and currently holds a compliance SBT.
   */
  async hasToken(userAddress: string): Promise<boolean> {
    const contract = new Contract(this.config.sbtContractId);
    try {
      const userScVal = nativeToScVal(userAddress, { type: "address" });
      
      const mockTx = new TransactionBuilder(
        new Account("GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF", "0"),
        {
          fee: "100",
          networkPassphrase: this.networkPassphrase,
        }
      )
        .addOperation(contract.call("has_token", userScVal))
        .setTimeout(TimeoutInfinite)
        .build();

      const sim = await this.server.simulateTransaction(mockTx);
      if (rpc.Api.isSimulationSuccess(sim) && sim.result) {
        return scValToNative(sim.result.retval);
      }
      return false;
    } catch (e) {
      console.error("Error checking verification state:", e);
      return false;
    }
  }

  /**
   * Checks the expiration timestamp (Unix seconds) of a user's compliance SBT.
   * Returns 0 if expired, invalid, or no token exists.
   */
  async getSbtExpiration(userAddress: string): Promise<number> {
    const contract = new Contract(this.config.sbtContractId);
    try {
      const userScVal = nativeToScVal(userAddress, { type: "address" });
      
      const mockTx = new TransactionBuilder(
        new Account("GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF", "0"),
        {
          fee: "100",
          networkPassphrase: this.networkPassphrase,
        }
      )
        .addOperation(contract.call("expires_at", userScVal))
        .setTimeout(TimeoutInfinite)
        .build();

      const sim = await this.server.simulateTransaction(mockTx);
      if (rpc.Api.isSimulationSuccess(sim) && sim.result) {
        return Number(scValToNative(sim.result.retval));
      }
      return 0;
    } catch (e) {
      console.error("Error checking SBT expiration:", e);
      return 0;
    }
  }

  /**
   * Submits a user registration with ZK proof, public inputs, and oracle signatures.
   * Returns the transaction hash on success.
   */
  async register(params: RegisterParams): Promise<string> {
    const registryContract = new Contract(this.config.registryContractId);
    const userAddress = await params.wallet.getPublicKey();

    // 1. Fetch source account sequence from Stellar ledger
    const account = await this.server.getAccount(userAddress);

    // 2. Format inputs to SCVal format
    const userScVal = nativeToScVal(userAddress, { type: "address" });
    const proofScVal = nativeToScVal(params.proof, { type: "bytes" });
    const publicInputsScVal = nativeToScVal(params.publicInputs, { type: "bytes" });
    const commitmentScVal = xdr.ScVal.scvBytes(Buffer.from(hexToBytes32(params.commitment)));
    const nullifierScVal = xdr.ScVal.scvBytes(Buffer.from(hexToBytes32(params.nullifier)));
    const minAgeScVal = nativeToScVal(BigInt(params.minAgeSecs), { type: "u64" });
    const oracleIdxAScVal = nativeToScVal(params.oracleIdxA, { type: "u32" });
    const sigAScVal = nativeToScVal(signatureHexToBytes(params.sigA), { type: "bytes" });
    const oracleIdxBScVal = nativeToScVal(params.oracleIdxB, { type: "u32" });
    const sigBScVal = nativeToScVal(signatureHexToBytes(params.sigB), { type: "bytes" });

    // 3. Build registration transaction
    const tx = new TransactionBuilder(account, {
      fee: (params.inclusionFee || 100000).toString(),
      networkPassphrase: this.networkPassphrase,
    })
      .addOperation(
        registryContract.call(
          "register",
          userScVal,
          proofScVal,
          publicInputsScVal,
          commitmentScVal,
          nullifierScVal,
          minAgeScVal,
          oracleIdxAScVal,
          sigAScVal,
          oracleIdxBScVal,
          sigBScVal
        )
      )
      .setTimeout(TimeoutInfinite)
      .build();

    // 4. Simulate transaction to calculate resource fees and footprint
    const sim = await this.server.simulateTransaction(tx);
    if (!rpc.Api.isSimulationSuccess(sim)) {
      const errorDetail = 'error' in sim ? (sim as any).error : JSON.stringify(sim);
      throw new Error(`Soroban simulation failed: ${errorDetail}`);
    }

    const assembledTx = rpc.assembleTransaction(tx, sim).build();
    const sourceXdr = assembledTx.toXDR();

    // 5. Prompt wallet signature
    const signedTxXdr = await params.wallet.signTransaction(sourceXdr, {
      networkPassphrase: this.networkPassphrase,
    });

    const signedTx = new Transaction(signedTxXdr, this.networkPassphrase);

    // 6. Submit transaction
    const submitRes = await this.server.sendTransaction(signedTx);
    if (submitRes.status === "ERROR") {
      throw new Error(`Transaction submission failed: ${JSON.stringify(submitRes)}`);
    }

    // 7. Poll until transaction is mined on-chain
    let txResult: rpc.Api.GetTransactionResponse | undefined;
    let attempts = 0;
    const maxAttempts = 60;
    
    while (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      txResult = await this.server.getTransaction(submitRes.hash);
      if (txResult.status !== "NOT_FOUND") {
        break;
      }
      attempts++;
    }

    if (!txResult || txResult.status === "NOT_FOUND") {
      throw new Error(`Transaction confirmation timed out.`);
    }

    if (txResult.status === "SUCCESS") {
      return submitRes.hash;
    } else {
      throw new Error(`Transaction failed: ${JSON.stringify(txResult)}`);
    }
  }
}
