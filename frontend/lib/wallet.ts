import { StellarWalletsKit, Networks } from "@creit-tech/stellar-wallets-kit";
import { defaultModules } from "@creit-tech/stellar-wallets-kit/modules/utils";

if (typeof window !== "undefined") {
  StellarWalletsKit.init({
    network: Networks.TESTNET,
    modules: defaultModules()
  });
}

export { StellarWalletsKit, Networks };
