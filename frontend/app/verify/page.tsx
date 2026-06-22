"use client";

import React, { useState } from "react";
import ProofStep from "../../components/ProofStep";
import KYCForm from "../../components/KYCForm";
import CredentialCard from "../../components/CredentialCard";

type StepType = "connect" | "kyc" | "proof" | "complete";

export default function VerifyPage() {
  const [currentStep, setCurrentStep] = useState<StepType>("connect");

  // Stub handlers to simulate the verification flow
  const handleConnectWalletMock = () => {
    setCurrentStep("kyc");
  };

  const handleKYCSubmitMock = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep("proof");
  };

  const handleGenerateProofMock = () => {
    setCurrentStep("complete");
  };

  const handleReset = () => {
    setCurrentStep("connect");
  };

  return (
    <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-cabinet">KYC Verification Flow</h1>
        <p className="text-slate-550 text-sm mt-1.5 font-cabinet">
          Complete the verification steps below to generate your private identity credential.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Steps Timeline Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <ProofStep
            stepNumber={1}
            title="Connect Stellar Wallet"
            description="Authorize via Freighter browser extension."
            status={
              currentStep === "connect"
                ? "current"
                : "completed"
            }
          />
          <ProofStep
            stepNumber={2}
            title="Identity Verification"
            description="Provide KYC data securely to verification anchor."
            status={
              currentStep === "connect"
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
              currentStep === "connect" || currentStep === "kyc"
                ? "pending"
                : currentStep === "proof"
                ? "current"
                : "completed"
            }
          />
          <ProofStep
            stepNumber={4}
            title="Credential Issued"
            description="Get your private verification token."
            status={currentStep === "complete" ? "completed" : "pending"}
          />
        </div>

        {/* Dynamic Action Pane */}
        <div className="lg:col-span-8 bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-10 min-h-[420px] flex flex-col justify-center items-center relative overflow-hidden shadow-sm">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-luminar/5 rounded-full filter blur-3xl pointer-events-none"></div>

          {currentStep === "connect" && (
            <div className="text-center space-y-6 max-w-md">
              <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 mx-auto text-2xl">
                🔌
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold tracking-tight text-slate-900 font-cabinet">Connect Your Wallet</h3>
                <p className="text-slate-550 text-sm font-cabinet">
                  We use your Stellar wallet to establish your identity anchor. Click below to simulate connecting via Freighter.
                </p>
              </div>
              <button
                onClick={handleConnectWalletMock}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-full shadow-sm transition duration-200"
              >
                Mock Connect Freighter Wallet
              </button>
            </div>
          )}

          {currentStep === "kyc" && (
            <div className="w-full max-w-md flex flex-col items-center">
              {/* Wrapping KYCForm structure with mocked submission */}
              <div className="w-full" onClick={(e) => {
                // If form submit was clicked
                const target = e.target as HTMLElement;
                if (target.tagName === 'BUTTON' && target.getAttribute('type') === 'submit') {
                  handleKYCSubmitMock(e);
                }
              }}>
                <KYCForm />
              </div>
            </div>
          )}

          {currentStep === "proof" && (
            <div className="text-center space-y-6 max-w-md">
              <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 mx-auto text-2xl animate-pulse">
                🔐
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold tracking-tight text-slate-900 font-cabinet">Generate Zero-Knowledge Proof</h3>
                <p className="text-slate-550 text-sm font-cabinet">
                  Your KYC verification has completed. Generate your ZK proof now to mint your private credential.
                </p>
              </div>
              <button
                onClick={handleGenerateProofMock}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-full shadow-sm transition duration-200"
              >
                Generate ZK Proof
              </button>
            </div>
          )}

          {currentStep === "complete" && (
            <div className="text-center space-y-6 max-w-md flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-2xl">
                ✓
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold tracking-tight text-slate-900 font-cabinet">Verification Complete</h3>
                <p className="text-slate-550 text-sm font-cabinet">
                  Your credential has been generated successfully. You are ready to interact with DeFi protocols.
                </p>
              </div>
              
              <div className="pt-2 w-full flex justify-center">
                <CredentialCard />
              </div>

              <button
                onClick={handleReset}
                className="mt-4 px-5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-full shadow-sm transition duration-200"
              >
                Reset Demo Flow
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
