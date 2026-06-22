"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import CredentialCard from "../components/CredentialCard";

export default function Home() {
  const expandCardRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const complianceSteps = [
    {
      stepNumber: "01a",
      title: "Describe what matters",
      description: "Explain the flow, behaviour, or outcome you care about, without writing code.",
      terminalTitle: "",
      terminalText: "POST TWO IMAGES OF PEOPLE PLAYING TENNIS, AND ASK THE APP TO IDENTIFY THE CONTENTS. VERIFY THE RESPONSE MENTIONS TENNIS.",
      version: "V1.05.111 (2750)"
    },
    {
      stepNumber: "02a",
      title: "Configure compliance rules",
      description: "Configure parameters such as proof of age, country restrictions, and accreditations for your Stellar application.",
      terminalTitle: "ZK COMPLIANCE CONFIG:",
      terminalText: "POST TWO IMAGES OF STELLAR COMPLIANCE RECORDS, AND ASK THE ENGINE TO VERIFY AGE & RESIDENCY REQUIREMENTS. MATCH KYC_STATUS = APPROVED.",
      version: "V1.05.111 (2750)"
    },
    {
      stepNumber: "03a",
      title: "Generate zero-knowledge proof",
      description: "Your browser generates a cryptographic proof verifying these constraints. No personal data ever leaves your device.",
      terminalTitle: "GENERATING ZK PROOF:",
      terminalText: "[████████████████████] 100%\n\nPROOF: 0x8a92f...3c7d\nSTATUS: VERIFIER READY",
      version: "V1.05.111 (2750)"
    },
    {
      stepNumber: "04a",
      title: "Submit attestation to Stellar",
      description: "The proof is submitted to a Soroban smart contract, instantly updating your compliance state on the ledger.",
      terminalTitle: "SUBMITTING TO STELLAR...",
      terminalText: "LEDGER HEIGHT: 19842103\nCONTRACT: SorobanAttestationV1\nSTATUS: COMPLIANT_VERIFIED",
      version: "V1.05.111 (2750)"
    },
    {
      stepNumber: "05a",
      title: "Transact with complete privacy",
      description: "Execute DeFi swaps, payments, or access liquidity pools on Stellar knowing you are fully compliant and your privacy is intact.",
      terminalTitle: "COMPLIANCE SHIELD ACTIVE:",
      terminalText: "DEFI SWAP EXECUTED: XLM -> USDC\nPRIVACY OVERLAY: SECURE\nKYC COMPLIANCE: APPROVED",
      version: "V1.05.111 (2750)"
    }
  ];

  const scrollToStep = (index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const rect = container.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const containerTop = rect.top + scrollTop;
    const totalScrollHeight = rect.height - window.innerHeight;
    const targetScroll = containerTop + (index / 4) * totalScrollHeight;
    
    window.scrollTo({
      top: targetScroll,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current || !expandCardRef.current) return;
      
      const container = scrollContainerRef.current;
      const card = expandCardRef.current;
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollHeight = rect.height - windowHeight;
      
      if (totalScrollHeight <= 0) return;
      
      let scale = 0.93;
      let borderRadius = 2.5;
      let active = 0;

      if (rect.top > 0) {
        // Entering from bottom
        const distanceToTop = Math.min(rect.top, windowHeight);
        const progressEntering = 1 - distanceToTop / windowHeight; // 0 to 1
        scale = 0.93 + progressEntering * 0.07;
        borderRadius = 2.5 - progressEntering * 0.5;
        active = 0;
      } else {
        // Sticky/exiting range
        const progress = Math.min(Math.max(-rect.top / totalScrollHeight, 0), 1);
        active = Math.min(Math.floor(progress * 5), 4);
        
        if (progress > 0.9) {
          const exitingProgress = (1.0 - progress) / 0.1;
          scale = 0.93 + exitingProgress * 0.07;
          borderRadius = 2.5 - exitingProgress * 0.5;
        } else {
          scale = 1.0;
          borderRadius = 2.0;
        }
      }
      
      card.style.transform = `scale(${scale})`;
      card.style.borderRadius = `${borderRadius}rem`;
      setActiveStep(active);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-white min-h-screen flex flex-col font-cabinet">
      {/* Hero Content Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-1 md:pt-2 pb-12 flex flex-col items-start text-left">
        
        {/* Main Heading using Cabinet Grotesk font */}
        <h1 className="text-4xl sm:text-6xl md:text-6xl font-bold tracking-tighter text-slate-900 leading-[1.05] font-cabinet max-w-3xl mb-8">
          Verify compliance <br />
          before your users transact.
        </h1>

        {/* Input Bar Section matching Semaloop's email input exactly */}
        <div className="max-w-md w-full mb-10">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-full p-1.5 focus-within:ring-2 focus-within:ring-slate-950 focus-within:border-transparent transition-all duration-200 shadow-sm">
            <input
              type="text"
              placeholder="Enter your Stellar public key or email"
              className="flex-grow bg-transparent px-4 py-2 text-sm text-slate-850 placeholder-slate-400 focus:outline-none"
            />
            <Link
              href="/verify"
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-full transition duration-200 shadow-sm shrink-0"
            >
              Pre-Register
            </Link>
          </div>
        </div>

        {/* Client Logos Monochromatic Row */}
        <div className="w-full pt-2 pb-12 border-b border-slate-100 mb-16">
          <p className="text-xs font-medium text-slate-600 uppercase tracking-wider mb-5">
            Supported Integrations
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-black font-semibold text-sm">
            <div className="flex items-center">
              <img
                src="/assets/stellar.png"
                alt="Stellar"
                className="h-5 w-auto object-contain opacity-90 hover:opacity-100 transition duration-200"
              />
            </div>
            <div className="transition duration-200 tracking-wider">
              FREIGHTER
            </div>
            <div className="opacity-90 hover:opacity-100 transition duration-200 font-mono tracking-widest text-xs">
              [ SOROBAN ]
            </div>
            <div className="opacity-90 hover:opacity-100 transition duration-200 italic">
              albedo.link
            </div>
            <div className="opacity-90 hover:opacity-100 transition duration-200 font-sans tracking-wide">
              LOBSTR
            </div>
          </div>
        </div>

        {/* Mockup Showcase Section - Cream Card Container */}
        <div className="w-full bg-[#F4F3EF] border border-slate-200 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden shadow-sm relative">
          {/* SECURE CHECKING indicator mirroring the Semaloop phone screenshot badge */}
          <div className="absolute top-6 right-6 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Checking compliant credentials</span>
          </div>

          <div className="space-y-4 max-w-md text-left">
            <span className="text-xs font-bold text-luminar uppercase tracking-wider">
              Zero-Knowledge Engine
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 font-cabinet tracking-tight">
              Decentralized ID with no data footprint.
            </h3>
            <p className="text-sm text-slate-650 leading-relaxed font-cabinet">
              Protocols verify cryptographic proof of your identity in real-time, matching AML/KYC checks instantly while leaving zero personal documentation on-chain.
            </p>
          </div>

          {/* Glowing Mockup Card Placement */}
          <div className="w-full md:w-auto flex justify-center items-center shrink-0">
            <div className="relative group transition duration-300">
              {/* Soft background glow */}
              <div className="absolute -inset-1.5 bg-luminar/15 rounded-2xl filter blur-xl opacity-75 group-hover:opacity-100 transition duration-300"></div>
              
              {/* Premium dark-mode card mockup standing out on light canvas */}
              <div className="relative transform hover:-translate-y-1 transition duration-500 shadow-2xl">
                <CredentialCard />
              </div>
            </div>
          </div>
        </div>

        {/* Problem & Solution Columns (Semaloop style) */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-62 mt-16 mb-12">
          {/* Left Column: Problem */}
          <div className="space-y-3 text-left">
            <span className="text-xs font-mono text-slate-400 uppercase block">
              Problem
            </span>
            <p className="text-base md:text-[16px] text-slate-900 font-bold leading-relaxed font-cabinet max-w-lg">
              DeFi protocols require compliance verification to operate, but traditional KYC anchors force users to disclose sensitive personal documents and link their public wallets directly to their real-world identities, compromising financial privacy.
            </p>
          </div>

          {/* Right Column: Solution */}
          <div className="space-y-3 text-left">
            <span className="text-xs font-mono text-slate-400 uppercase block">
              Solution
            </span>
            <p className="text-base md:text-[19px] font-bold text-slate-900 leading-relaxed font-cabinet max-w-lg">
              Zero-knowledge compliance proofs that verify regulatory criteria locally, letting users satisfy protocol compliance checks without revealing any underlying personal data.
            </p>
          </div>
        </div>
      </section>

      {/* Scrollytelling Section */}
      <section 
        ref={scrollContainerRef}
        className="relative w-full h-[350vh]"
      >
        {/* Sticky viewport wrapper */}
        <div className="sticky top-0 h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden">
          <div 
            ref={expandCardRef}
            className="w-full h-full max-w-7xl bg-[#2EA37A] relative shadow-2xl transition-all duration-75 ease-out select-none overflow-hidden"
            style={{ 
              transform: "scale(0.93)", 
              borderRadius: "2.5rem",
              transformOrigin: "center center"
            }}
          >
            {/* Inner Content Centered Wrapper */}
            <div className="max-w-6xl mx-auto w-full h-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 px-4 md:px-8 relative">
              
              {/* Left Column: Mock Criteria Terminal (Fading stack) */}
              <div className="relative w-full md:w-1/2 h-[260px] md:h-[400px] flex flex-col justify-center items-center">
                {/* Vertical Line Anchor from screenshot */}
                <div className="absolute top-1/2 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-white/20 pointer-events-none z-0" />
                
                {complianceSteps.map((step, idx) => {
                  const isActive = idx === activeStep;
                  return (
                    <div
                      key={idx}
                      className={`absolute inset-x-0 mx-auto flex flex-col justify-center items-center transition-all duration-700 ease-in-out ${
                        isActive 
                          ? "opacity-100 translate-y-0 scale-100 z-10 pointer-events-auto" 
                          : "opacity-0 translate-y-8 scale-95 z-0 pointer-events-none"
                      }`}
                    >
                      <div className="border border-white/20 rounded-2xl bg-black/10 backdrop-blur-md p-6 max-w-sm w-full font-mono text-xs text-white/90 relative shadow-inner">
                        <div className="space-y-3">
                          {step.terminalTitle && (
                            <p className="text-white font-bold tracking-wide">{step.terminalTitle}</p>
                          )}
                          <p className="leading-relaxed whitespace-pre-line text-slate-100">
                            {step.terminalText}
                          </p>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-6">
                          <span className="text-white/40 text-[10px]">{step.version}</span>
                          <button className="w-8 h-8 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition duration-200">
                            →
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Text Information (Fading stack) */}
              <div className="relative w-full md:w-1/2 h-[200px] md:h-[350px] flex flex-col justify-center">
                {complianceSteps.map((step, idx) => {
                  const isActive = idx === activeStep;
                  return (
                    <div
                      key={idx}
                      className={`absolute inset-x-0 mx-auto flex flex-col justify-center text-left text-white transition-all duration-700 ease-in-out ${
                        isActive 
                          ? "opacity-100 translate-y-0 z-10 pointer-events-auto" 
                          : "opacity-0 -translate-y-8 z-0 pointer-events-none"
                      }`}
                    >
                      <span className="text-xs font-mono text-white/50 block mb-2">
                        {step.stepNumber}
                      </span>
                      <h3 className="text-2xl md:text-4xl font-bold tracking-tight font-cabinet leading-tight">
                        {step.title}
                      </h3>
                      <p className="text-base text-white/80 leading-relaxed font-cabinet mt-3 max-w-md">
                        {step.description}
                      </p>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Scroll Indicator Track on the far right */}
            <div className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 flex flex-col items-center z-30">
              <div className="relative flex flex-col items-center" style={{ height: "220px" }}>
                {/* Active Capsule Outline */}
                <div 
                  className="absolute border border-white rounded-full w-5 h-11 transition-all duration-300 ease-out pointer-events-none"
                  style={{
                    transform: `translateY(${activeStep * 44}px)`,
                    top: "0px",
                  }}
                />
                
                {/* Diamond dots */}
                {complianceSteps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollToStep(idx)}
                    className="w-10 h-11 flex items-center justify-center focus:outline-none group relative z-10 cursor-pointer"
                    title={`Go to step ${idx + 1}`}
                  >
                    <span 
                      className={`block w-2 h-2 rotate-45 transition-all duration-300 ${
                        idx === activeStep 
                          ? "bg-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.8)]" 
                          : "bg-white/30 group-hover:bg-white/60"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
