"use client";

import React, { useState } from "react";
import { useWallet } from "../context/WalletContext";

export default function WalletButton() {
  const { walletAddress, isConnecting, connectWallet, disconnectWallet } = useWallet();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleToggle = () => {
    if (walletAddress) {
      setShowConfirm(true);
    } else {
      connectWallet();
    }
  };

  const handleConfirmDisconnect = () => {
    disconnectWallet();
    setShowConfirm(false);
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  return (
    <>
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

      {showConfirm && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4"
          onClick={() => setShowConfirm(false)}
        >
          <div 
            className="bg-[#F2F0EF] rounded-2xl border border-slate-200 max-w-sm w-full shadow-xl overflow-hidden transform scale-100 transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 pb-4">
              <h3 className="text-lg font-bold text-slate-900 font-zodiak mb-2">
                Disconnect Wallet
              </h3>
              <p className="text-sm text-slate-500 font-cabinet leading-relaxed">
                Are you sure you want to disconnect? You will need to re-connect your wallet to perform verifiable KYC proofs on Luminar.
              </p>
            </div>
            
            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-100/50 border-t border-slate-200/60">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border border-slate-300 hover:border-slate-400 text-sm font-bold text-slate-600 hover:text-black rounded-full transition duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDisconnect}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-full transition duration-200 shadow-sm hover:shadow cursor-pointer"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
