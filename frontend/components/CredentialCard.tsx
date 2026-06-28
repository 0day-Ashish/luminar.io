"use client";

import React, { useState } from "react";
import { useWallet } from "../context/WalletContext";

interface CredentialCardProps {
  docType?: string;
  isAlreadyVerified?: boolean;
  commitment?: string;
  nullifier?: string;
  expiresAt?: number;
}

export default function CredentialCard({
  docType,
  isAlreadyVerified,
  commitment,
  nullifier,
  expiresAt,
}: CredentialCardProps) {
  const { walletAddress } = useWallet();
  const [isFlipped, setIsFlipped] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const isExpired = expiresAt ? (expiresAt * 1000 < Date.now()) : false;
  const expiryDateStr = expiresAt && expiresAt > 0
    ? new Date(expiresAt * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  const handleCopy = (e: React.MouseEvent, text: string, fieldName: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const displayAddress = walletAddress
    ? `did:stellar:${walletAddress}`
    : "did:stellar:GABC...XYZ";

  const shortAddress = walletAddress
    ? `did:stellar:${walletAddress.slice(0, 6)}...${walletAddress.slice(-6)}`
    : "did:stellar:GABC...XYZ";

  const issueDate = walletAddress
    ? new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "June 2026";

  const formatHash = (hash?: string) => {
    if (!hash) return "Pending Generation";
    return `${hash.slice(0, 10)}...${hash.slice(-10)}`;
  };

  const renderBadge = () => {
    if (isExpired) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border bg-red-500/20 text-red-300 border-red-500/30 shadow-sm animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
          Expired KYC
        </span>
      );
    }

    const badgeBase =
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border bg-white/15 text-white border-white/20 shadow-sm";

    switch (docType?.toLowerCase()) {
      case "pan":
        return (
          <span className={badgeBase}>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            PAN Verified
          </span>
        );
      case "aadhaar":
        return (
          <span className={badgeBase}>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            Aadhaar Verified
          </span>
        );
      case "passport":
        return (
          <span className={badgeBase}>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            Passport Verified
          </span>
        );
      default:
        return (
          <span className={badgeBase}>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            {isAlreadyVerified ? "Active Ledger ID" : "Identity Verified"}
          </span>
        );
    }
  };

  return (
    <div
      className="w-[340px] sm:w-[380px] max-w-full h-[240px] group select-none cursor-pointer relative rounded-3xl"
      style={{ perspective: "1000px" }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      {/* 3D Flip Card Wrapper */}
      <div
        className="relative w-full h-full duration-700 ease-out rounded-3xl"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* ==================== FRONT SIDE ==================== */}
        <div
          className="absolute inset-0 w-full h-full p-6 border border-white/10 rounded-3xl flex flex-col justify-between shadow-2xl overflow-hidden bg-cover bg-center"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            backgroundImage: "url('/assets/credential-card.jpg')",
          }}
        >
          {/* Background Ambient Glows */}
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/10 rounded-full filter blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-white/5 rounded-full filter blur-2xl pointer-events-none"></div>

          {/* Holographic Gloss Sheen Sweep */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none"></div>

          {/* Header Row */}
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-[#06241a] font-mono tracking-widest uppercase block font-semibold opacity-85">
                Identity Anchor
              </span>
              <h2 className="font-clash font-extrabold text-xl tracking-wider text-white mt-0.5">
                LUMINAR
              </h2>
            </div>

            {/* Smart Electronic Chip rendering (Darkened to stand out on green) */}
            <svg
              width="38"
              height="30"
              viewBox="0 0 36 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="opacity-95 shadow-inner rounded"
            >
              <rect width="36" height="28" rx="4" fill="url(#chip-grad)" />
              <path d="M0 8H12V20H0V8Z" stroke="#3D300F" strokeWidth="1" opacity="0.4" />
              <path d="M24 8H36V20H24V8Z" stroke="#3D300F" strokeWidth="1" opacity="0.4" />
              <path d="M12 0V28" stroke="#3D300F" strokeWidth="1.5" opacity="0.4" />
              <path d="M24 0V28" stroke="#3D300F" strokeWidth="1.5" opacity="0.4" />
              <path d="M0 14H36" stroke="#3D300F" strokeWidth="1.5" opacity="0.4" />
              <rect x="14" y="10" width="8" height="8" rx="1.5" fill="#3D300F" opacity="0.25" />
              <defs>
                <linearGradient id="chip-grad" x1="0" y1="0" x2="36" y2="28" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FAD673" />
                  <stop offset="0.5" stopColor="#B3861F" />
                  <stop offset="1" stopColor="#F5CD58" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Middle Row: Holder DID & Verification Type */}
          <div className="space-y-3">
            <div>
              <span className="text-[9px] uppercase tracking-widest text-[#06241a] font-mono block font-semibold opacity-85">
                DID Identifier
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <code className="text-xs text-white font-mono tracking-tight">
                  {shortAddress}
                </code>
                {walletAddress && (
                  <button
                    onClick={(e) => handleCopy(e, displayAddress, "did")}
                    className="text-white/60 hover:text-white transition duration-150 p-1 rounded hover:bg-white/10 cursor-pointer flex items-center justify-center"
                    title="Copy full DID"
                  >
                    {copiedField === "did" ? (
                      <span className="text-[9px] text-white font-bold">Copied</span>
                    ) : (
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center">
              {renderBadge()}

              <div className="flex items-center text-[10px] text-white font-bold bg-white/15 px-2.5 py-0.5 rounded-full border border-white/20 shadow-sm">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 11 2 2 4-4" />
                </svg>
                OVER 18
              </div>
            </div>
          </div>

          {/* Footer Details */}
          <div className="flex justify-between items-end border-t border-white/10 pt-3 text-[10px] text-slate-500 font-mono">
            <div>
              <span className="block text-[8px] text-[#06241a] uppercase font-semibold opacity-85">Issued</span>
              <span className="text-white">{issueDate}</span>
            </div>
            {expiryDateStr && (
              <div>
                <span className="block text-[8px] text-[#06241a] uppercase font-semibold opacity-85">Expires</span>
                <span className="text-white">{expiryDateStr}</span>
              </div>
            )}
            <div>
              <span className="block text-[8px] text-[#06241a] uppercase font-semibold opacity-85">Ledger</span>
              <span className="text-white font-medium">Stellar Testnet</span>
            </div>
            <div className="flex items-center gap-1 text-white/80 hover:text-white transition duration-150">
              <span>View Cryptographics</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
            </div>
          </div>
        </div>

        {/* ==================== BACK SIDE ==================== */}
        <div
          className="absolute inset-0 w-full h-full p-5 border border-white/10 rounded-3xl flex flex-col justify-between shadow-2xl overflow-hidden bg-cover bg-center"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            backgroundImage: "url('/assets/credential-card.jpg')",
          }}
        >
          {/* Ambient Glow */}
          <div className="absolute -top-10 -left-10 w-36 h-36 bg-white/10 rounded-full filter blur-2xl pointer-events-none"></div>

          {/* Header Row */}
          <div className="flex justify-between items-start border-b border-white/10 pb-2">
            <div>
              <span className="text-[10px] text-[#06241a] font-mono tracking-widest uppercase block font-semibold opacity-85">
                Zero-Knowledge Proof
              </span>
              <h3 className="font-clash font-bold text-sm text-white mt-0.5">
                Cryptographic Attestation
              </h3>
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded bg-white/15 text-white border border-white/20 uppercase tracking-widest font-mono">
              Metadata
            </span>
          </div>

          {/* Hash Rows */}
          <div className="space-y-2.5 my-2">
            {/* ZK Commitment */}
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-[#06241a] uppercase tracking-wide font-semibold opacity-85">Commitment:</span>
              <div className="flex items-center gap-1.5">
                <code className="text-white bg-white/10 px-2 py-0.5 rounded border border-white/10 text-[9px] truncate max-w-[170px]">
                  {formatHash(commitment)}
                </code>
                {commitment && (
                  <button
                    onClick={(e) => handleCopy(e, commitment, "commitment")}
                    className="text-white/60 hover:text-white p-0.5 rounded cursor-pointer"
                  >
                    {copiedField === "commitment" ? (
                      <span className="text-[8px] text-white font-bold">Copied</span>
                    ) : (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Nullifier */}
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-[#06241a] uppercase tracking-wide font-semibold opacity-85">Nullifier:</span>
              <div className="flex items-center gap-1.5">
                <code className="text-white bg-white/10 px-2 py-0.5 rounded border border-white/10 text-[9px] truncate max-w-[170px]">
                  {formatHash(nullifier)}
                </code>
                {nullifier && (
                  <button
                    onClick={(e) => handleCopy(e, nullifier, "nullifier")}
                    className="text-white/60 hover:text-white p-0.5 rounded cursor-pointer"
                  >
                    {copiedField === "nullifier" ? (
                      <span className="text-[8px] text-white font-bold">Copied</span>
                    ) : (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    )}
                  </button>
                )}
              </div>
            </div>


          </div>

          {/* Footer Details */}
          <div className="flex justify-between items-end border-t border-white/10 pt-3 text-[10px] text-slate-500 font-mono">
            <div>
              <span className="block text-[8px] text-[#06241a] uppercase font-semibold opacity-85 font-mono">Provider</span>
              <span className="text-white font-medium">Luminar ZK-Oracle</span>
            </div>
            <div>
              <span className="block text-[8px] text-[#06241a] uppercase font-semibold opacity-85 font-mono">Verifiable</span>
              <span className="text-white font-bold">On-Ledger</span>
            </div>
            <div className="flex items-center gap-1 text-white/80 hover:text-white transition duration-150">
              <span>View Card Info</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
