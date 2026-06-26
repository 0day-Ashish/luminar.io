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
import { StellarWalletsKit } from "./wallet";

const TESTNET_RPC_URL = "https://soroban-testnet.stellar.org";
const TESTNET_PASSPHRASE = Networks.TESTNET;

export interface RegisterParams {
  userAddress: string;
  proofBytes: Uint8Array;
  publicInputsBytes: Uint8Array;
  commitmentHex: string;
  nullifierHex: string;
  minAgeSecs: number;
}

export function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  const len = clean.length;
  const bytes = new Uint8Array(len / 2);
  for (let i = 0; i < len; i += 2) {
    bytes[i / 2] = parseInt(clean.slice(i, i + 2), 16);
  }
  return bytes;
}

export function hexToBytes32(hex: string): Uint8Array {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  const padded = clean.padStart(64, "0").slice(0, 64);
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 64; i += 2) {
    bytes[i / 2] = parseInt(padded.slice(i, i + 2), 16);
  }
  return bytes;
}

export async function checkIsVerified(userAddress: string): Promise<boolean> {
  const contractId = process.env.NEXT_PUBLIC_REGISTRY_CONTRACT_ID;
  if (!contractId) throw new Error("Registry contract ID not configured");

  const server = new rpc.Server(TESTNET_RPC_URL);
  const contract = new Contract(contractId);

  try {
    const userScVal = nativeToScVal(userAddress, { type: "address" });
    
    // Simulate transaction to read state (is_verified is a read-only method)
    const mockTx = new TransactionBuilder(
      new Account("GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF", "0"),
      {
        fee: "100",
        networkPassphrase: TESTNET_PASSPHRASE,
      }
    )
      .addOperation(contract.call("is_verified", userScVal))
      .setTimeout(TimeoutInfinite)
      .build();

    const sim = await server.simulateTransaction(mockTx);
    if (rpc.Api.isSimulationSuccess(sim) && sim.result) {
      const val = sim.result.retval;
      return scValToNative(val); // returns boolean
    }
    return false;
  } catch (e) {
    console.error("Error checking verification state:", e);
    return false;
  }
}

export async function submitRegistration(params: RegisterParams): Promise<rpc.Api.GetTransactionResponse> {
  const contractId = process.env.NEXT_PUBLIC_REGISTRY_CONTRACT_ID;
  if (!contractId) throw new Error("Registry contract ID not configured");

  const server = new rpc.Server(TESTNET_RPC_URL);
  const contract = new Contract(contractId);

  // 1. Fetch current account details to build transaction
  const account = await server.getAccount(params.userAddress);

  // Convert inputs to ScVal
  const userScVal = nativeToScVal(params.userAddress, { type: "address" });
  const proofScVal = nativeToScVal(params.proofBytes, { type: "bytes" });
  const publicInputsScVal = nativeToScVal(params.publicInputsBytes, { type: "bytes" });
  const commitmentScVal = xdr.ScVal.scvBytes(Buffer.from(hexToBytes32(params.commitmentHex)));
  const nullifierScVal = xdr.ScVal.scvBytes(Buffer.from(hexToBytes32(params.nullifierHex)));
  const minAgeScVal = nativeToScVal(BigInt(params.minAgeSecs), { type: "u64" });

  // 2. Build the transaction structure
  const tx = new TransactionBuilder(account, {
    fee: "100", // Will be updated by simulation
    networkPassphrase: TESTNET_PASSPHRASE,
  })
    .addOperation(
      contract.call(
        "register",
        userScVal,
        proofScVal,
        publicInputsScVal,
        commitmentScVal,
        nullifierScVal,
        minAgeScVal
      )
    )
    .setTimeout(TimeoutInfinite)
    .build();

  // 3. Simulate to calculate fees and resource limits
  const sim = await server.simulateTransaction(tx);
  if (!rpc.Api.isSimulationSuccess(sim)) {
    console.error("=== SIMULATION FAILURE DEBUG ===");
    console.error("Full simulation response:", JSON.stringify(sim, null, 2));
    if ('error' in sim) {
      console.error("Simulation error field:", (sim as any).error);
    }
    if ('events' in sim) {
      console.error("Diagnostic events:", JSON.stringify((sim as any).events, null, 2));
    }
    throw new Error(`Simulation failed: ${JSON.stringify(sim)}`);
  }

  // Assemble transaction with simulation results
  const assembledTx = rpc.assembleTransaction(tx, sim).build();

  // 4. Request signing from the selected wallet via the kit
  const sourceXdr = assembledTx.toXDR();
  let signedTxXdr: string;
  try {
    const res = await StellarWalletsKit.signTransaction(sourceXdr, {
      networkPassphrase: TESTNET_PASSPHRASE,
      address: params.userAddress
    });
    signedTxXdr = res.signedTxXdr;
  } catch (err: any) {
    throw new Error(`Wallet signing error: ${err.message || err}`);
  }

  const signedTx = new Transaction(signedTxXdr, TESTNET_PASSPHRASE);

  // 5. Submit transaction to RPC
  const submitRes = await server.sendTransaction(signedTx);
  if (submitRes.status === "ERROR") {
    throw new Error(`Submit failed: ${JSON.stringify(submitRes)}`);
  }

  // 6. Poll status until confirmation
  let txResult: rpc.Api.GetTransactionResponse;
  
  // eslint-disable-next-line no-constant-condition
  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    txResult = await server.getTransaction(submitRes.hash);
    if (txResult.status !== "NOT_FOUND") {
      break;
    }
  }

  if (txResult.status === "SUCCESS") {
    return txResult;
  } else {
    throw new Error(`Transaction execution failed: ${JSON.stringify(txResult)}`);
  }
}

