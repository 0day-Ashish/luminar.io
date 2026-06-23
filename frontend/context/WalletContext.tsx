"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  isConnected,
  requestAccess,
  getAddress,
  isAllowed,
} from "@stellar/freighter-api";

interface WalletContextType {
  walletAddress: string | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      // 1. Check if Freighter extension is installed
      const connectedRes = await isConnected();
      if (!connectedRes.isConnected) {
        alert(
          "Freighter wallet is not installed or not active. Please install it from https://freighter.app"
        );
        return;
      }

      // 2. Request access — this triggers the Freighter popup for user approval
      const accessRes = await requestAccess();
      if (accessRes.error) {
        console.error("Freighter access denied:", accessRes.error);
        alert("Wallet connection was denied. Please approve the request in Freighter.");
        return;
      }

      if (accessRes.address) {
        setWalletAddress(accessRes.address);
      }
    } catch (error) {
      console.error("Error connecting Freighter wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
  };

  // Auto-connect if site was previously authorized
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connectedRes = await isConnected();
        if (!connectedRes.isConnected) return;

        // Only auto-connect if the user previously allowed this site
        const allowedRes = await isAllowed();
        if (!allowedRes.isAllowed) return;

        const addrRes = await getAddress();
        if (addrRes.address) {
          setWalletAddress(addrRes.address);
        }
      } catch (e) {
        console.warn("Freighter auto-connect check failed", e);
      }
    };
    checkConnection();
  }, []);

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        isConnecting,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}

