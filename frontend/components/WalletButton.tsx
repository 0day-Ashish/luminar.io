"use client";

import React from "react";
import { useWallet } from "../context/WalletContext";

export default function WalletButton() {
  const { walletAddress, isConnecting, connectWallet, disconnectWallet } = useWallet();

  const handleToggle = () => {
    if (walletAddress) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  return (
    <button
      onClick={handleToggle}
      className={`px-5 py-2 text-sm font-medium rounded-full shadow-sm transition duration-200 cursor-pointer ${
        walletAddress
          ? "bg-[#2EA37A]/10 text-[#2EA37A] border border-[#2EA37A]/20 hover:bg-[#2EA37A]/20"
          : "bg-slate-900 hover:bg-slate-800 text-white"
      }`}
      disabled={isConnecting}
    >
      {isConnecting
        ? "Connecting..."
        : walletAddress
        ? `Connected: ${formatAddress(walletAddress)}`
        : "Connect Wallet"}
    </button>
  );
}
