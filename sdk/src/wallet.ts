import { WalletProvider } from "./types.js";

/**
 * Adapter for Stellar's Freighter browser extension wallet.
 */
export class FreighterWalletProvider implements WalletProvider {
  async getPublicKey(): Promise<string> {
    const { isConnected, getAddress } = await import("@stellar/freighter-api");
    const connection = await isConnected();
    if (!connection || !connection.isConnected) {
      throw new Error("Freighter wallet extension is not installed or locked.");
    }
    const res = await getAddress();
    if (res.error) {
      throw new Error(`Freighter error: ${res.error}`);
    }
    if (!res.address) {
      throw new Error("Could not retrieve address from Freighter wallet.");
    }
    return res.address;
  }

  async signTransaction(txXdr: string, opts?: { networkPassphrase?: string }): Promise<string> {
    const { signTransaction } = await import("@stellar/freighter-api");
    const res = await signTransaction(txXdr, {
      networkPassphrase: opts?.networkPassphrase,
    });
    if (res.error) {
      throw new Error(`Freighter signing error: ${res.error}`);
    }
    if (!res.signedTxXdr) {
      throw new Error("Transaction signing rejected by user or failed.");
    }
    return res.signedTxXdr;
  }
}

/**
 * Adapter for the `@creit-tech/stellar-wallets-kit`.
 * Enables integration with Albedo, Rovo, LOBSTR, xBull, and other kit wallets.
 */
export class StellarWalletsKitProvider implements WalletProvider {
  private kit: any;
  private userAddress: string;

  /**
   * @param kit An initialized instance of StellarWalletsKit from @creit-tech/stellar-wallets-kit
   * @param userAddress The currently connected active user account address
   */
  constructor(kit: any, userAddress: string) {
    if (!kit || typeof kit.signTransaction !== "function") {
      throw new Error("Invalid kit instance. Must be an initialized StellarWalletsKit provider.");
    }
    this.kit = kit;
    this.userAddress = userAddress;
  }

  async getPublicKey(): Promise<string> {
    return this.userAddress;
  }

  async signTransaction(txXdr: string, opts?: { networkPassphrase?: string }): Promise<string> {
    const res = await this.kit.signTransaction(sourceXdrToTarget(txXdr), {
      networkPassphrase: opts?.networkPassphrase,
      address: this.userAddress,
    });
    if (!res || !res.signedTxXdr) {
      throw new Error("Transaction signing rejected or failed in Stellar Wallets Kit.");
    }
    return res.signedTxXdr;
  }
}

// Internal helper to ensure correct string type is passed
function sourceXdrToTarget(txXdr: string): string {
  return txXdr;
}

/**
 * Generic wallet provider wrapper for third-party signing tools (e.g. custom signers).
 */
export class CustomWalletProvider implements WalletProvider {
  private publicKey: string;
  private signFn: (txXdr: string, opts?: { networkPassphrase?: string }) => Promise<string>;

  constructor(
    publicKey: string,
    signFn: (txXdr: string, opts?: { networkPassphrase?: string }) => Promise<string>
  ) {
    this.publicKey = publicKey;
    this.signFn = signFn;
  }

  async getPublicKey(): Promise<string> {
    return this.publicKey;
  }

  async signTransaction(txXdr: string, opts?: { networkPassphrase?: string }): Promise<string> {
    return this.signFn(txXdr, opts);
  }
}
