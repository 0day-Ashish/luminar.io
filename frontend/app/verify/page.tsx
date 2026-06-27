"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useWallet } from "../../context/WalletContext";
import ProofStep from "../../components/ProofStep";
import KYCForm from "../../components/KYCForm";
import CredentialCard from "../../components/CredentialCard";
import { computeHashes, generateKycProof } from "../../lib/proof";
import { checkIsVerified, checkSbtExpiration, submitRegistration } from "../../lib/stellar";

type StepType = "connect" | "kyc" | "proof" | "complete";

export default function VerifyPage() {
  const { walletAddress, connectWallet, isConnecting } = useWallet();
  const [currentStep, setCurrentStep] = useState<StepType>("connect");
  const [isAlreadyVerified, setIsAlreadyVerified] = useState(false);
  const [expiresAt, setExpiresAt] = useState<number | undefined>(undefined);
  const [isExpiredCredential, setIsExpiredCredential] = useState(false);
  
  // Data from Oracle
  const [kycData, setKycData] = useState<{
    name_hash: string;
    id_hash: string;
    secret: string;
    dob_timestamp: number;
    oracle_signature: string;
    min_age_secs: number;
    doc_type?: string;
    oracle1_sig?: string;
    oracle2_sig?: string;
    oracle3_sig?: string;
  } | null>(null);

  // ZK computed inputs & proof
  const [commitment, setCommitment] = useState<string | null>(null);
  const [nullifier, setNullifier] = useState<string | null>(null);
  const [proofData, setProofData] = useState<{
    proofBytes: Uint8Array;
    publicInputsBytes: Uint8Array;
  } | null>(null);

  // States
  const [loading, setLoading] = useState(false);
  const [proofLoadingStatus, setProofLoadingStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  // Check verification state when wallet connects
  useEffect(() => {
    if (walletAddress) {
      const checkStatus = async () => {
        setLoading(true);
        setError(null);
        try {
          const verified = await checkIsVerified(walletAddress);
          const expiry = await checkSbtExpiration(walletAddress);
          setExpiresAt(expiry);
          
          if (verified) {
            setIsAlreadyVerified(true);
            setIsExpiredCredential(false);
            setCurrentStep("complete");
          } else if (expiry > 0 && expiry * 1000 < Date.now()) {
            setIsAlreadyVerified(false);
            setIsExpiredCredential(true);
            setCurrentStep("complete");
          } else {
            setIsAlreadyVerified(false);
            setIsExpiredCredential(false);
            setCurrentStep("kyc");
          }
        } catch (e: any) {
          console.error("Error checking verification:", e);
          setCurrentStep("kyc");
        } finally {
          setLoading(false);
        }
      };
      checkStatus();
    } else {
      setCurrentStep("connect");
      setIsAlreadyVerified(false);
      setIsExpiredCredential(false);
      setExpiresAt(undefined);
      setKycData(null);
      setProofData(null);
      setCommitment(null);
      setNullifier(null);
      setTxHash(null);
    }
  }, [walletAddress]);

  const handleKYCSuccess = (data: typeof kycData) => {
    setKycData(data);
    setCurrentStep("proof");
  };

  const handleGenerateProof = async () => {
    if (!walletAddress || !kycData) return;
    setLoading(true);
    setError(null);
    setProofLoadingStatus("Computing commitment & nullifier hashes...");

    try {
      // 1. Compute hashes
      const hashes = await computeHashes(
        kycData.name_hash,
        kycData.id_hash,
        kycData.dob_timestamp,
        kycData.secret,
        walletAddress
      );

      setCommitment(hashes.commitment);
      setNullifier(hashes.nullifier);

      // 2. Generate ZK Proof
      setProofLoadingStatus("Executing circuit & generating UltraHonk proof (browser WASM)...");
      const result = await generateKycProof(
        kycData.name_hash,
        kycData.id_hash,
        kycData.dob_timestamp,
        kycData.secret,
        walletAddress,
        hashes.commitment,
        hashes.nullifier,
        kycData.min_age_secs,
        kycData.oracle1_sig || "",
        kycData.oracle2_sig || "",
        kycData.oracle3_sig || ""
      );

      setProofData(result);
      setCurrentStep("complete");
    } catch (e: any) {
      console.error("ZK Proof Generation Error:", e);
      setError(e.message || "Failed to generate ZK proof. Please try again.");
    } finally {
      setLoading(false);
      setProofLoadingStatus("");
    }
  };

  const handleOnChainRegister = async () => {
    if (!walletAddress || !proofData || !commitment || !nullifier || !kycData) return;
    setLoading(true);
    setError(null);

    try {
      const result = await submitRegistration({
        userAddress: walletAddress,
        proofBytes: proofData.proofBytes,
        publicInputsBytes: proofData.publicInputsBytes,
        commitmentHex: commitment,
        nullifierHex: nullifier,
        minAgeSecs: kycData.min_age_secs,
      });

      setTxHash(result.txHash);
      setIsAlreadyVerified(true);
      setIsExpiredCredential(false);
      try {
        const expiry = await checkSbtExpiration(walletAddress);
        setExpiresAt(expiry);
      } catch (ex) {
        console.error("Failed to fetch sbt expiration post-register:", ex);
      }
    } catch (e: any) {
      console.error("On-chain Registration Error:", e);
      const errMsg = e.message || "";
      if (errMsg.includes("Error(Contract, #4)") || errMsg.includes("AlreadyVerified")) {
        setIsAlreadyVerified(true);
        setIsExpiredCredential(false);
        setError(null);
      } else {
        setError(errMsg || "Failed to register on-chain. Please check your wallet and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setKycData(null);
    setCommitment(null);
    setNullifier(null);
    setProofData(null);
    setTxHash(null);
    setIsAlreadyVerified(false);
    setIsExpiredCredential(false);
    setExpiresAt(undefined);
    setCurrentStep(walletAddress ? "kyc" : "connect");
  };

  return (
    <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-16 w-full font-clash">
      <title>Verify Identity | Luminar</title>
      <meta name="description" content="Secure your cryptographic zero-knowledge proof for on-chain Stellar compliance. Verify your identity without sharing personal information." />
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-instrument">KYC Verification Flow</h1>
          <p className="text-slate-550 text-sm mt-1.5 font-clash">
            Complete the verification steps below to generate your private identity credential.
          </p>
        </div>
        <Link
          href="/"
          className="px-5 py-2.5 border border-slate-300 hover:border-slate-400 text-sm text-slate-650 hover:text-black rounded-full transition duration-200 shadow-sm inline-flex items-center gap-1.5 bg-white/80 self-start sm:self-auto font-clash"
        >
          ← Back to Home
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Steps Timeline Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <ProofStep
            stepNumber={1}
            title="Connect Stellar Wallet"
            description="Authorize via Freighter browser extension."
            status={!walletAddress ? "current" : "completed"}
          />
          <ProofStep
            stepNumber={2}
            title="Identity Verification"
            description="Provide KYC data securely to verification anchor."
            status={
              !walletAddress
                ? "pending"
                : currentStep === "kyc"
                ? "current"
                : "completed"
            }
          />
          <ProofStep
            stepNumber={3}
            title="Generate Proof"
            description="Create zero-knowledge compliance proof."
            status={
              currentStep === "proof"
                ? "current"
                : currentStep === "complete"
                ? "completed"
                : "pending"
            }
          />
          <ProofStep
            stepNumber={4}
            title="Credential Issued"
            description="Get your private verification token."
            status={
              currentStep === "complete"
                ? isAlreadyVerified
                  ? "completed"
                  : "current"
                : "pending"
            }
          />
        </div>

        {/* Dynamic Action Pane */}
        <div className="lg:col-span-8 bg-white border border-slate-300 rounded-3xl p-6 md:p-10 min-h-[420px] flex flex-col justify-center items-center relative overflow-hidden shadow-sm">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-luminar/5 rounded-full filter blur-3xl pointer-events-none"></div>

          {error && (
            <div className="w-full max-w-md mb-6 bg-rose-50 border border-rose-100 text-rose-700 text-xs p-4 rounded-xl font-medium relative z-10">
              ⚠️ {error}
            </div>
          )}

          {/* Loader Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center space-y-4 rounded-3xl">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-luminar rounded-full animate-spin"></div>
              {proofLoadingStatus && (
                <p className="text-xs text-slate-500 font-semibold max-w-xs text-center animate-pulse leading-relaxed">
                  {proofLoadingStatus}
                </p>
              )}
            </div>
          )}

          {/* Step 1: Connect Wallet */}
          {currentStep === "connect" && (
            <div className="text-center space-y-6 max-w-md relative z-10">
              <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-300 flex items-center justify-center text-slate-800 mx-auto text-2xl">
                🔑
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold tracking-tight text-slate-900 font-instrument">Connect Your Wallet</h3>
                <p className="text-slate-550 text-sm font-clash leading-relaxed">
                  We use your Stellar wallet to establish your identity anchor. Click below to connect via Freighter.
                </p>
              </div>
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-full shadow-sm transition duration-200 cursor-pointer"
              >
                {isConnecting ? "Connecting Freighter..." : "Connect Freighter Wallet"}
              </button>
            </div>
          )}

          {/* Step 2: KYC Form */}
          {currentStep === "kyc" && (
            <div className="w-full max-w-md relative z-10 flex flex-col items-center">
              <KYCForm onSuccess={handleKYCSuccess} />
            </div>
          )}

          {/* Step 3: ZK Proof Generation */}
          {currentStep === "proof" && kycData && (
            <div className="text-center space-y-6 max-w-md relative z-10">
              <div className="w-16 h-16 rounded-full bg-[#2EA37A]/10 border border-[#2EA37A]/20 flex items-center justify-center text-2xl mx-auto">
                🔐
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold tracking-tight text-slate-900 font-instrument">Generate Compliance Proof</h3>
                <p className="text-slate-550 text-sm font-clash leading-relaxed">
                  Your identity has been validated by the oracle. We will now generate a zero-knowledge proof locally on your device to certify you are over 18 years old.
                </p>
              </div>

              {/* Hashes details display */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left font-mono text-[10px] space-y-2 text-slate-600">
                <p className="truncate"><span className="font-bold text-slate-850">Name Hash:</span> {kycData.name_hash}</p>
                <p className="truncate"><span className="font-bold text-slate-850">ID Hash:</span> {kycData.id_hash}</p>
                <p className="truncate"><span className="font-bold text-slate-850">Secret:</span> {kycData.secret}</p>
                <p className="truncate"><span className="font-bold text-slate-850">Stellar Address:</span> {walletAddress}</p>
              </div>

              <button
                onClick={handleGenerateProof}
                className="px-6 py-3 bg-luminar hover:bg-[#258262] text-white text-xs font-semibold rounded-full shadow-sm transition duration-200 cursor-pointer"
              >
                Generate ZK Proof
              </button>
            </div>
          )}

          {/* Step 4: Complete/Credential Issued */}
          {currentStep === "complete" && (
            <div className="text-center space-y-6 max-w-md flex flex-col items-center relative z-10 w-full">
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold tracking-tight text-slate-900 font-instrument">
                  {isExpiredCredential
                    ? "Credential Expired!"
                    : isAlreadyVerified
                    ? "Verification Complete!"
                    : "Compliance Proof Generated!"}
                </h3>
                <p className="text-slate-550 text-sm font-clash leading-relaxed">
                  {isExpiredCredential
                    ? "Your compliance credential has expired. Please renew your verification to restore compliance status."
                    : isAlreadyVerified
                    ? "Your compliance credential is active and verified on the Stellar ledger. You are fully compliant."
                    : "Your proof is ready. Register it on-chain to activate your compliance token."}
                </p>
              </div>
              
              <div className="pt-2 w-full flex justify-center">
                <CredentialCard
                  docType={kycData?.doc_type}
                  isAlreadyVerified={isAlreadyVerified}
                  commitment={commitment || undefined}
                  nullifier={nullifier || undefined}
                  oracleSignature={kycData?.oracle_signature}
                  expiresAt={expiresAt}
                />
              </div>

              {isExpiredCredential ? (
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-red-650 hover:bg-red-750 text-white text-xs font-semibold rounded-full shadow-sm transition duration-200 cursor-pointer mt-4"
                  style={{ backgroundColor: "#dc2626" }}
                >
                  Renew Verification
                </button>
              ) : (
                <>
                  {!isAlreadyVerified && (
                    <button
                      onClick={handleOnChainRegister}
                      className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-full shadow-sm transition duration-200 cursor-pointer mt-4"
                    >
                      Register on Stellar Ledger
                    </button>
                  )}
                </>
              )}

              {txHash && (
                <a
                  href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-luminar hover:underline font-mono mt-2"
                >
                  View Transaction: {txHash.slice(0, 16)}...
                </a>
              )}

              {!isExpiredCredential && (
                <button
                  onClick={handleReset}
                  className="mt-6 px-5 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-full shadow-sm transition duration-200 cursor-pointer"
                >
                  Reset Flow / Re-verify
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
