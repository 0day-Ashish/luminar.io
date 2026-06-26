"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { StellarWalletsKit } from "../lib/wallet";

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
      const { address } = await StellarWalletsKit.authModal();
      if (address) {
        const walletId = StellarWalletsKit.selectedModule?.productId;
        if (typeof window !== "undefined") {
          localStorage.removeItem("walletDisconnected");
          if (walletId) {
            localStorage.setItem("selectedWalletId", walletId);
          }
        }
        setWalletAddress(address);
      }
    } catch (error) {
      console.error("Error connecting via wallet kit:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("walletDisconnected", "true");
      localStorage.removeItem("selectedWalletId");
    }
    StellarWalletsKit.disconnect().catch(console.error);
    setWalletAddress(null);
  };

  // Auto-connect if a wallet was previously connected
  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (typeof window !== "undefined" && localStorage.getItem("walletDisconnected") === "true") {
          return;
        }

        const savedWalletId = typeof window !== "undefined" ? localStorage.getItem("selectedWalletId") : null;
        if (!savedWalletId) return;

        StellarWalletsKit.setWallet(savedWalletId);
        const { address } = await StellarWalletsKit.getAddress();
        if (address) {
          setWalletAddress(address);
        }
      } catch (e) {
        console.warn("Wallet auto-connect check failed", e);
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

