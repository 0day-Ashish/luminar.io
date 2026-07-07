import { StellarWalletsKit, Networks } from "@creit-tech/stellar-wallets-kit";
import { defaultModules } from "@creit-tech/stellar-wallets-kit/modules/utils";

const IS_MAINNET = process.env.NEXT_PUBLIC_NETWORK === "mainnet";

if (typeof window !== "undefined") {
  StellarWalletsKit.init({
    network: IS_MAINNET ? Networks.PUBLIC : Networks.TESTNET,
    modules: defaultModules()
  });
}

export { StellarWalletsKit, Networks };
