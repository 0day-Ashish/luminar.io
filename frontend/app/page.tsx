"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import CredentialCard from "../components/CredentialCard";

export default function Home() {
  const expandCardRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const [activeDebugTab, setActiveDebugTab] = useState("timeline");
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringQuote, setIsHoveringQuote] = useState(false);
  const testimonialRef = useRef<HTMLDivElement>(null);

  const handleMouseMoveQuote = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!testimonialRef.current) return;
    const rect = testimonialRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

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
      let withinStep = 0;

      if (rect.top > 0) {
        // Entering from bottom
        const distanceToTop = Math.min(rect.top, windowHeight);
        const progressEntering = 1 - distanceToTop / windowHeight; // 0 to 1
        scale = 0.93 + progressEntering * 0.07;
        borderRadius = 2.5 - progressEntering * 0.5;
        active = 0;
        withinStep = 0;
      } else {
        // Sticky/exiting range
        const progress = Math.min(Math.max(-rect.top / totalScrollHeight, 0), 1);
        active = Math.min(Math.floor(progress * 5), 4);
        withinStep = Math.min(Math.max((progress * 5) - active, 0), 1);

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
      setStepProgress(withinStep);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-[#F2F0EF] min-h-screen flex flex-col font-clash">
      {/* Hero Content Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-1 md:pt-2 pb-12 flex flex-col items-start text-left">

        {/* Main Heading using Cabinet Grotesk font */}
        <h1 className="text-4xl sm:text-6xl md:text-5xl font-bold tracking-tighter text-slate-900 leading-[1.05] font-instrument max-w-3xl mb-8">
          Verify compliance <br />
          before your users transact
        </h1>

        {/* Input Bar Section matching Luminar's email input exactly */}
        <div className="max-w-md w-full mb-10">
          <div className="flex items-center bg-slate-50 border border-slate-300 rounded-full p-1.5 focus-within:ring-2 focus-within:ring-slate-950 focus-within:border-transparent transition-all duration-200 shadow-sm">
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
        <div className="w-full pb-10">
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

        {/* Mockup Showcase Section - Glass Card Container */}
        <div className="w-full bg-white/35 backdrop-blur-xl border border-white/50 rounded-3xl p-6 sm:p-8 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 overflow-hidden shadow-lg shadow-black/[0.01] relative">

          <div className="space-y-4 max-w-md text-center lg:text-left">
            <span className="text-xs font-bold text-luminar uppercase tracking-wider">
              Zero-Knowledge Engine
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 font-instrument tracking-tight">
              Decentralized ID with no data footprint
            </h3>
            <p className="text-sm text-slate-650 leading-relaxed font-clash">
              Protocols verify cryptographic proof of your identity in real-time, matching AML/KYC checks instantly while leaving zero personal documentation on-chain.
            </p>
          </div>

          {/* Glowing Mockup Card Placement */}
          <div className="w-full lg:w-auto flex justify-center items-center shrink-0 mt-6 lg:mt-0">
            <div className="relative group transition duration-300">
              {/* Soft background glow */}
              <div className="absolute -inset-1.5 bg-luminar/15 rounded-2xl filter blur-xl opacity-75 group-hover:opacity-100 transition duration-300"></div>

              {/* Premium dark-mode card mockup standing out on light canvas */}
              <div className="relative transform hover:-translate-y-1 transition duration-500 shadow-2xl rounded-3xl">
                <CredentialCard />
              </div>
            </div>
          </div>
        </div>

        {/* Problem & Solution Columns (Luminar style) */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-62 mt-16 mb-12">
          {/* Left Column: Problem */}
          <div className="space-y-3 text-left">
            <span className="text-base font-clash text-slate-400 uppercase block">
              <span className="font-mono text-xs mr-2">00</span>  Problem
            </span>
            <p className="text-xs md:text-[16px] text-slate-900 font-bold leading-relaxed font-clash max-w-lg">
              DeFi protocols require compliance verification to operate, but traditional KYC anchors force users to disclose sensitive personal documents and link their public wallets directly to their real-world identities, compromising financial privacy.
            </p>
          </div>

          {/* Right Column: Solution */}
          <div className="space-y-3 text-left">
            <span className="text-base font-clash text-slate-400 uppercase block">
              <span className="font-mono text-xs mr-2">01</span> Solution
            </span>
            <p className="text-xs md:text-[19px] font-bold text-black leading-relaxed font-clash max-w-lg">
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

                {complianceSteps.map((step, idx) => {
                  const isActive = idx === activeStep;
                  return (
                    <div
                      key={idx}
                      className={`absolute inset-x-0 mx-auto flex flex-col justify-center items-center transition-all duration-700 ease-in-out ${isActive
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
                      className={`absolute inset-x-0 mx-auto flex flex-col justify-center text-left text-white transition-all duration-700 ease-in-out ${isActive
                        ? "opacity-100 translate-y-0 z-10 pointer-events-auto"
                        : "opacity-0 -translate-y-8 z-0 pointer-events-none"
                        }`}
                    >
                      <span className="text-xs font-mono text-white/50 block mb-2">
                        {step.stepNumber}
                      </span>
                      <h3 className="text-2xl md:text-4xl font-bold tracking-tight font-instrument leading-tight">
                        {step.title}
                      </h3>
                      <p className="text-base text-white/80 leading-relaxed font-clash mt-3 max-w-md">
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
                  className="absolute border border-white rounded-full w-3.5 h-[56px] transition-all duration-300 ease-out pointer-events-none flex justify-center"
                  style={{
                    transform: `translateY(${activeStep * 44}px)`,
                    top: "-6px",
                  }}
                >
                  {/* Moving Active Dot inside the capsule */}
                  <span
                    className="absolute block w-1 h-1 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-300 ease-out"
                    style={{
                      transform: `translateX(-50%) translateY(${6 + stepProgress * 38}px) rotate(45deg)`,
                      left: "50%",
                      top: "0px",
                    }}
                  />
                </div>

                {/* Diamond dots */}
                {complianceSteps.map((_, idx) => {
                  const isActive = idx === activeStep;
                  return (
                    <button
                      key={idx}
                      onClick={() => scrollToStep(idx)}
                      className="w-8 h-11 flex items-center justify-center focus:outline-none group relative z-10 cursor-pointer"
                      title={`Go to step ${idx + 1}`}
                    >
                      <span
                        className={`block w-1 h-1 rotate-45 transition-all duration-300 ${isActive
                          ? "opacity-0"
                          : "bg-white/30 group-hover:bg-white/60"
                          }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="w-full bg-[#F2F0EF] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto border-t border-b border-slate-300 py-20 md:py-28">
          <div 
            ref={testimonialRef}
            onMouseMove={handleMouseMoveQuote}
            onMouseEnter={() => setIsHoveringQuote(true)}
            onMouseLeave={() => setIsHoveringQuote(false)}
            className="max-w-4xl mx-auto flex flex-col items-center text-center relative group select-none"
          >
            {/* Logo Icon and Badge Row */}
            <div className="flex items-center gap-3 mb-8">
              <div className="relative w-14 h-14 bg-white border border-slate-350 rounded-2xl flex items-center justify-center shadow-sm hover:scale-105 transition-transform duration-300 overflow-hidden">
                <img 
                  src="/assets/dikeLogo.png" 
                  alt="Dike Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* AGENT Badge Placeholder (for structure/layout spacing) */}
              <span className="opacity-0 bg-[#1B5E45] text-white text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-md uppercase leading-none select-none">
                AGENT
              </span>
            </div>

            {/* Real Interactive AGENT Badge (Follows cursor smoothly or returns home) */}
            <span 
              className="absolute bg-[#1B5E45] text-white text-[9.5px] font-bold tracking-wider px-2.5 py-1.5 rounded-md uppercase leading-none select-none pointer-events-none z-20 shadow-sm"
              style={
                isHoveringQuote 
                  ? { 
                      left: 0,
                      top: 0,
                      transform: `translate3d(${mousePos.x + 18}px, ${mousePos.y + 18}px, 0)`,
                      transition: "transform 0.28s cubic-bezier(0.25, 1, 0.5, 1)"
                    }
                  : { 
                      left: "50%",
                      top: "28px",
                      transform: "translate3d(40px, -6px, 0)", 
                      transition: "left 0.45s cubic-bezier(0.25, 1, 0.5, 1), top 0.45s cubic-bezier(0.25, 1, 0.5, 1), transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)"
                    }
              }
            >
              AGENT
            </span>

            {/* Testimonial Quote */}
            <blockquote className="text-xl sm:text-2xl md:text-[30px] font-bold text-slate-900 tracking-tight leading-snug font-instrument max-w-3xl mb-8">
              “Luminar provides our application with robust, plug-and-play compliance controls. We can verify our users' age and country constraints on-chain without storing a single byte of sensitive personal data.”
            </blockquote>

            {/* User/Company Attribution */}
            <cite className="not-italic flex flex-col items-center">
              <span className="text-sm font-bold text-slate-900 font-clash">Sachindra</span>
              <span className="text-xs text-slate-500 font-clash mt-1">AI Engineer, QuillAI Network</span>
            </cite>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="w-full bg-[#F2F0EF] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto border-b border-slate-300 py-20 md:py-28">
          {/* Header */}
          <div className="mb-12 text-left">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
              02 Core features
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-[32px] font-bold text-slate-900 tracking-tight leading-tight mt-2 font-instrument">
              Built for zero-knowledge on-chain compliance.
            </h2>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-[#F5F5F3] p-5 rounded-2xl flex flex-col gap-4 hover:shadow-md transition-all duration-300 group border border-slate-200/50">
              <div className="w-full bg-[#EAEAE7] rounded-xl h-48 overflow-hidden flex items-center justify-center relative select-none">
                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-850 to-zinc-700 flex items-center justify-center p-6 transition-transform duration-500 group-hover:scale-[1.02]">
                  {/* Shield graphic */}
                  <div className="relative w-28 h-28 bg-[#121315]/80 backdrop-blur-md rounded-2xl border border-zinc-700 shadow-2xl flex items-center justify-center">
                    <svg className="w-14 h-14 text-[#2EA37A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <div className="absolute bottom-2 bg-[#2EA37A]/10 border border-[#2EA37A]/30 text-[#2EA37A] text-[7px] font-bold tracking-wider px-2 py-0.5 rounded-full uppercase leading-none">
                      WASM Prover
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-left mt-2">
                <h4 className="text-sm md:text-base font-bold text-slate-900 tracking-tight leading-snug font-instrument">
                  Client-side ZK proof shields
                </h4>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed mt-2 font-clash">
                  Generate cryptographic proofs of age and document validation directly in your browser. Sensitive identity documents never leave your local device.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#F5F5F3] p-5 rounded-2xl flex flex-col gap-4 hover:shadow-md transition-all duration-300 group border border-slate-200/50">
              <div className="w-full bg-[#EAEAE7] rounded-xl h-48 overflow-hidden flex items-center justify-center relative select-none">
                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-850 to-zinc-700 flex items-center justify-center p-6 transition-transform duration-500 group-hover:scale-[1.02]">
                  {/* Key lock graphic */}
                  <div className="relative w-28 h-28 bg-[#121315]/80 backdrop-blur-md rounded-2xl border border-zinc-700 shadow-2xl flex items-center justify-center">
                    <svg className="w-14 h-14 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <div className="absolute bottom-2 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[7px] font-bold tracking-wider px-2 py-0.5 rounded-full uppercase leading-none">
                      Oracle Verified
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-left mt-2">
                <h4 className="text-sm md:text-base font-bold text-slate-900 tracking-tight leading-snug font-instrument">
                  Secured oracle attestations
                </h4>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed mt-2 font-clash">
                  Format verification keys and third-party database records are hashed and signed by our trusted oracle, creating a clean cryptographic verification chain.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#F5F5F3] p-5 rounded-2xl flex flex-col gap-4 hover:shadow-md transition-all duration-300 group border border-slate-200/50">
              <div className="w-full bg-[#EAEAE7] rounded-xl h-48 overflow-hidden flex items-center justify-center relative select-none">
                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-850 to-zinc-700 flex items-center justify-center p-6 transition-transform duration-500 group-hover:scale-[1.02]">
                  {/* Database/anti-sybil graphic */}
                  <div className="relative w-28 h-28 bg-[#121315]/80 backdrop-blur-md rounded-2xl border border-zinc-700 shadow-2xl flex items-center justify-center">
                    <svg className="w-14 h-14 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <div className="absolute bottom-2 bg-blue-500/10 border border-blue-500/30 text-blue-500 text-[7px] font-bold tracking-wider px-2 py-0.5 rounded-full uppercase leading-none">
                      Anti-Sybil Shield
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-left mt-2">
                <h4 className="text-sm md:text-base font-bold text-slate-900 tracking-tight leading-snug font-instrument">
                  Anti-Sybil nullifier tracking
                </h4>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed mt-2 font-clash">
                  Unique cryptographic nullifier keys ensure that a single physical document cannot register multiple Stellar accounts, providing complete on-chain Sybil protection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Debug Faster Section */}
      <section className="w-full bg-[#F2F0EF] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto border-b border-slate-300 py-20 md:py-28">
          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            {/* Left Column */}
            <div className="flex flex-col text-left">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                03 Audit trail
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-[32px] font-bold text-slate-900 tracking-tight leading-tight mt-2 font-instrument">
                Verify every proof step with complete transparency.
              </h2>
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed mt-4 font-clash">
                Go beyond simple pass or fail checks with an interactive, step-by-step cryptographic audit of your verification pipeline.
              </p>

              {/* Highlighted text */}
              <div className="mt-12 text-[#1b5e45] text-sm sm:text-[15px] font-bold leading-relaxed font-clash">
                Every proof generation, oracle attestation, and smart contract submission is tracked in real-time, providing complete visibility into compliance checks.
              </div>

              {/* Progress Line Divider */}
              <div className="relative w-full h-[1.5px] bg-slate-100 mt-6 mb-8">
                <div
                  className="absolute left-0 top-0 h-full bg-[#2EA37A] transition-all duration-500 ease-out"
                  style={{
                    width: `${
                      activeDebugTab === "audio" ? "16.6%" :
                        activeDebugTab === "timeline" ? "33.3%" :
                          activeDebugTab === "logs" ? "50%" :
                            activeDebugTab === "network" ? "66.6%" :
                              activeDebugTab === "analysis" ? "83.3%" : "100%"
                      }`
                  }}
                />
                <div
                  className="absolute h-2 w-2 rounded-full bg-[#2EA37A] -top-[3px] transition-all duration-500 ease-out"
                  style={{
                    left: `calc(${
                      activeDebugTab === "audio" ? "16.6%" :
                        activeDebugTab === "timeline" ? "33.3%" :
                          activeDebugTab === "logs" ? "50%" :
                            activeDebugTab === "network" ? "66.6%" :
                              activeDebugTab === "analysis" ? "83.3%" : "100%"
                      } - 4px)`
                  }}
                />
              </div>

              {/* Tabs Grid */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 font-clash">
                {/* Column 1 */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setActiveDebugTab("audio")}
                    className={`text-sm text-left transition duration-200 focus:outline-none cursor-pointer ${activeDebugTab === "audio" ? "text-[#2EA37A] font-bold" : "text-slate-400 font-semibold hover:text-slate-600"}`}
                  >
                    Signature entropy
                  </button>
                  <button
                    onClick={() => setActiveDebugTab("timeline")}
                    className={`text-sm text-left transition duration-200 focus:outline-none cursor-pointer ${activeDebugTab === "timeline" ? "text-[#2EA37A] font-bold" : "text-slate-400 font-semibold hover:text-slate-600"}`}
                  >
                    Verification trace
                  </button>
                  <button
                    onClick={() => setActiveDebugTab("logs")}
                    className={`text-sm text-left transition duration-200 focus:outline-none cursor-pointer ${activeDebugTab === "logs" ? "text-[#2EA37A] font-bold" : "text-slate-400 font-semibold hover:text-slate-600"}`}
                  >
                    Verification logs
                  </button>
                </div>

                {/* Column 2 */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setActiveDebugTab("network")}
                    className={`text-sm text-left transition duration-200 focus:outline-none cursor-pointer ${activeDebugTab === "network" ? "text-[#2EA37A] font-bold" : "text-slate-400 font-semibold hover:text-slate-600"}`}
                  >
                    Network monitor
                  </button>
                  <button
                    onClick={() => setActiveDebugTab("analysis")}
                    className={`text-sm text-left transition duration-200 focus:outline-none cursor-pointer ${activeDebugTab === "analysis" ? "text-[#2EA37A] font-bold" : "text-slate-400 font-semibold hover:text-slate-600"}`}
                  >
                    Proof diagnosis
                  </button>
                  <button
                    onClick={() => setActiveDebugTab("fixes")}
                    className={`text-sm text-left transition duration-200 focus:outline-none cursor-pointer ${activeDebugTab === "fixes" ? "text-[#2EA37A] font-bold" : "text-slate-400 font-semibold hover:text-slate-600"}`}
                  >
                    Integration guide
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div 
              className="w-full bg-center rounded-3xl p-6 md:p-8 flex items-center justify-center min-h-[480px] relative overflow-hidden shadow-sm"
              style={{ backgroundImage: "url('/assets/features.jpg')" }}
            >

              {/* Tab 2: Signature Entropy */}
              {activeDebugTab === "audio" && (
                <div className="w-full max-w-md bg-white/30 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/40 text-left space-y-6 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-bold text-slate-800 tracking-wider">SIGNATURE ENTROPY MONITOR</span>
                    <span className="text-[8px] font-bold px-2 py-0.5 bg-[#2EA37A]/15 text-[#1b5e45] border border-[#2EA37A]/30 rounded-full uppercase">Active</span>
                  </div>

                  <div className="h-28 flex items-center justify-center gap-1.5 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 p-4 shadow-inner">
                    {[20, 45, 15, 60, 30, 80, 50, 95, 75, 40, 65, 35, 70, 85, 25, 55, 90, 30, 45, 15].map((val, idx) => (
                      <div
                        key={idx}
                        className="w-1.5 bg-[#2EA37A] rounded-full transition-all duration-300 animate-pulse"
                        style={{
                          height: `${val}%`,
                          animationDelay: `${idx * 75}ms`
                        }}
                      />
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-800">Signature algorithm:</span>
                      <span className="font-mono text-slate-600 font-semibold">Secp256k1 (Oracle Authority)</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-800">Entropy calculated:</span>
                      <span className="font-mono text-slate-600 font-semibold">256 bits (Cryptographically Strong)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Verification Trace */}
              {activeDebugTab === "timeline" && (
                <div className="w-full max-w-md relative flex flex-col gap-6 py-2 animate-in fade-in duration-300">
                  <div className="absolute left-[15px] top-6 bottom-6 w-[1.5px] bg-[#1B5E45]/20" />

                  {/* Item 1 */}
                  <div className="flex gap-4 relative">
                    <div className="w-8 h-8 rounded-full bg-[#1B5E45] flex items-center justify-center text-white shrink-0 z-10 shadow-sm">
                      <span className="text-[10px]">✓</span>
                    </div>
                    <div className="flex-grow bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/40 text-left space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono font-bold text-slate-900 tracking-wider">GENERATE ZK PROOF</span>
                        <div className="flex gap-1.5">
                          <span className="text-[8px] font-bold px-1.5 py-0.5 border border-slate-300 text-slate-600 bg-white/40 rounded">CIRCUIT</span>
                          <span className="text-[8px] font-bold px-1.5 py-0.5 border border-slate-300 text-slate-600 bg-white/40 rounded">184K</span>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 bg-white/20 border border-white/30 p-1.5 rounded shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] font-mono text-[9px] text-slate-700">
                          <span className="text-emerald-700 font-extrabold">✓</span>
                          <span className="font-extrabold text-slate-800">EXTRACT</span>
                          <span className="text-slate-600">CRYPTOGRAPHIC ID ATTRIBUTES</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/20 border border-white/30 p-1.5 rounded shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] font-mono text-[9px] text-slate-700">
                          <span className="text-emerald-700 font-extrabold">✓</span>
                          <span className="font-extrabold text-slate-800">COMPUTE</span>
                          <span className="text-slate-600">POSEIDON COMMITMENT & NULLIFIER</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/20 border border-white/30 p-1.5 rounded shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] font-mono text-[9px] text-slate-700">
                          <span className="text-emerald-700 font-extrabold">✓</span>
                          <span className="font-extrabold text-slate-800">PROVE</span>
                          <span className="text-slate-600">SATISFY WITNESS CIRCUIT CONSTRAINTS</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex gap-4 relative">
                    <div className="w-8 h-8 rounded-full bg-[#1B5E45] flex items-center justify-center text-white shrink-0 z-10 shadow-sm">
                      <span className="text-[10px]">✓</span>
                    </div>
                    <div className="flex-grow bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/40 text-left space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono font-bold text-slate-900 tracking-wider">ORACLE ATTESTATION</span>
                        <div className="flex gap-1.5">
                          <span className="text-[8px] font-bold px-1.5 py-0.5 border border-slate-300 text-slate-600 bg-white/40 rounded">ORACLE</span>
                          <span className="text-[8px] font-bold px-1.5 py-0.5 border border-slate-300 text-slate-600 bg-white/40 rounded">ECDSA</span>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 bg-white/20 border border-white/30 p-1.5 rounded shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] font-mono text-[9px] text-slate-700">
                          <span className="text-emerald-700 font-extrabold">✓</span>
                          <span className="font-extrabold text-slate-800">PACK</span>
                          <span className="text-slate-600">COMPLIANCE ATTESTATION PAYLOAD</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/20 border border-white/30 p-1.5 rounded shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] font-mono text-[9px] text-slate-700">
                          <span className="text-emerald-700 font-extrabold">✓</span>
                          <span className="font-extrabold text-slate-800">SIGN</span>
                          <span className="text-slate-600">SECP256K1 PRIVATE KEY SIGNATURE</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/20 border border-white/30 p-1.5 rounded shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] font-mono text-[9px] text-slate-700">
                          <span className="text-emerald-700 font-extrabold">✓</span>
                          <span className="font-extrabold text-slate-800">SEAL</span>
                          <span className="text-slate-600">GENERATE VALID CRYPTOGRAPHIC ORACLE SEAL</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="flex gap-4 relative">
                    <div className="w-8 h-8 rounded-full border-2 border-dashed border-emerald-600 bg-white/25 flex items-center justify-center text-emerald-700 shrink-0 z-10">
                      <span className="text-[8px]">◌</span>
                    </div>
                    <div className="flex-grow bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/40 text-left space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono font-bold text-slate-900 tracking-wider">STELLAR SUBMISSION</span>
                        <div className="flex gap-1.5">
                          <span className="text-[8px] font-bold px-1.5 py-0.5 border border-slate-300 text-slate-600 bg-white/40 rounded">SOROBAN</span>
                          <span className="text-[8px] font-bold px-1.5 py-0.5 border border-slate-300 text-slate-600 bg-white/40 rounded">ON-CHAIN</span>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 bg-white/20 border border-white/30 p-1.5 rounded shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] font-mono text-[9px] text-slate-600">
                          <span className="text-slate-500 font-bold">◌</span>
                          <span className="font-bold text-slate-800">INVOKE</span>
                          <span className="text-slate-600">CALL REGISTRY SMART CONTRACT</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: System Logs */}
              {activeDebugTab === "logs" && (
                <div className="w-full max-w-md bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl p-4 shadow-lg text-left font-mono text-[10px] text-slate-800 space-y-3 animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 border-b border-slate-300 pb-2.5">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-slate-500 text-[9px] uppercase tracking-widest ml-2">SYSTEM CONSOLE LOGS</span>
                  </div>

                  <div className="space-y-1.5 h-64 overflow-y-auto pr-1">
                    <p className="text-slate-500">[10:14:02] INIT: Zero-Knowledge compliance engine initialized.</p>
                    <p className="text-slate-500">[10:14:03] SOROBAN: Fetching rules parameters...</p>
                    <p className="text-slate-500">[10:14:04] KYC: Validating residency constraints (US/EU)...</p>
                    <p className="text-slate-800 font-semibold">[10:14:05] ZK-PROVER: Commencing proof generation on-device...</p>
                    <p className="text-emerald-700 font-semibold">[10:14:08] ZK-PROVER: Proof generated successfully in 3211ms.</p>
                    <p className="text-slate-500">[10:14:09] LEDGER: Submitting Soroban transaction 0x7c9a...</p>
                    <p className="text-emerald-800 font-extrabold">[10:14:10] SUCCESS: Compliance state verified on ledger 19842103.</p>
                    <p className="text-slate-600 animate-pulse">[10:14:11] ENGINE: Standby mode active...</p>
                  </div>
                </div>
              )}

              {/* Tab 5: Network Activity */}
              {activeDebugTab === "network" && (
                <div className="w-full max-w-md bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl p-5 shadow-lg text-left space-y-4 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center border-b border-slate-350 pb-3">
                    <span className="text-[10px] font-mono font-bold text-slate-800 tracking-wider">NETWORK MONITOR</span>
                    <span className="text-[8px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100 font-bold uppercase">Online</span>
                  </div>

                  <div className="space-y-2 font-mono text-[9px]">
                    <div className="flex items-center justify-between p-2 hover:bg-white/20 rounded transition duration-150 border-b border-slate-200/65">
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-700 font-bold">POST</span>
                        <span className="text-slate-800 font-semibold">/api/v1/proof/generate</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-slate-500">1.2s</span>
                        <span className="text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded border border-emerald-200/10 font-bold">200</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2 hover:bg-white/20 rounded transition duration-150 border-b border-slate-200/65">
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-700 font-bold">GET</span>
                        <span className="text-slate-800 font-semibold">/api/v1/compliance/rules</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-slate-500">180ms</span>
                        <span className="text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded border border-emerald-200/10 font-bold">200</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2 hover:bg-white/20 rounded transition duration-150 border-b border-slate-200/65">
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-700 font-bold">POST</span>
                        <span className="text-slate-800 font-semibold">/api/v1/attestations</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-slate-500">450ms</span>
                        <span className="text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded border border-emerald-200/10 font-bold">201</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2 hover:bg-white/20 rounded transition duration-150">
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-700 font-bold">GET</span>
                        <span className="text-slate-800 font-semibold">/api/v1/stellar/ledger</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-slate-500">90ms</span>
                        <span className="text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded border border-emerald-200/10 font-bold">200</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 6: Root Cause Analysis */}
              {activeDebugTab === "analysis" && (
                <div className="w-full max-w-md bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl p-5 shadow-lg text-left space-y-4 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center border-b border-slate-350 pb-3">
                    <span className="text-[10px] font-mono font-bold text-rose-700 tracking-wider">ROOT CAUSE DIAGNOSIS</span>
                    <span className="text-[8px] font-mono bg-rose-50 text-rose-600 px-2 py-0.5 rounded border border-rose-100 font-bold uppercase">FAILED</span>
                  </div>

                  <div className="bg-rose-50 border border-rose-200/80 rounded-xl p-4 space-y-3 font-mono text-[9px]">
                    <div className="flex items-start gap-2 text-rose-800 font-bold leading-relaxed">
                      <span>🛑</span>
                      <span>ASSERTION_FAILED: Expected Soroban transaction status 'COMPLIANT_VERIFIED' but got 'PENDING_KYC'.</span>
                    </div>

                    <div className="text-slate-600 space-y-1.5 pt-2 border-t border-slate-200/80">
                      <p className="font-bold text-slate-800 font-extrabold">Stack Trace:</p>
                      <p className="pl-4">at SorobanAttestationV1.submit (soroban.ts:42)</p>
                      <p className="pl-4">at verifyAndTransact (page.tsx:120)</p>
                      <p className="pl-4">at runEngine (engine.ts:88)</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 7: Suggested Fixes */}
              {activeDebugTab === "fixes" && (
                <div className="w-full max-w-md bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl p-5 shadow-lg text-left space-y-4 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center border-b border-slate-350 pb-3">
                    <span className="text-[10px] font-mono font-bold text-emerald-800 tracking-wider">SUGGESTED REFACTOR</span>
                    <span className="text-[8px] font-mono bg-[#2EA37A]/15 text-[#1b5e45] border border-[#2EA37A]/30 px-2 py-0.5 rounded border-emerald-500/20 font-bold uppercase">Ready</span>
                  </div>

                  <div className="bg-slate-900/10 rounded-xl p-4 font-mono text-[9px] leading-relaxed overflow-x-auto border border-slate-300">
                    <p className="text-slate-500">// Refactoring compliance check block</p>
                    <div className="bg-rose-100 text-rose-700 px-2 py-1 rounded my-1 border-l-2 border-rose-500 font-semibold">
                      - const kycStatus = await getLegacyKycStatus(wallet);
                    </div>
                    <div className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded my-1 border-l-2 border-[#2EA37A] font-semibold">
                      + const kycStatus = await generateZkComplianceProof(wallet, rules);
                    </div>
                    <p className="text-slate-800 font-semibold pl-2">const status = await ledger.submitProof(kycStatus);</p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* Second Testimonial Section */}
      <section className="w-full bg-[#F2F0EF] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto border-b border-slate-300 py-20 md:py-28">
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
            {/* Logo Icon and Badge Row */}
            <div className="flex items-center gap-3 mb-8">
              <div className="relative w-14 h-14 bg-[#0091FF] rounded-2xl flex items-center justify-center shadow-sm hover:scale-105 transition-transform duration-300">
                {/* Lowercase "go" text logo */}
                <span className="text-white text-xl font-bold font-clash tracking-tight select-none">
                  go
                </span>
                {/* Overlapping Hexagon Badge on Top Right */}
                <div
                  className="absolute -top-1 -right-1 w-5 h-5 bg-[#1B5E45] shadow-sm flex items-center justify-center"
                  style={{
                    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
                  }}
                />
              </div>
              {/* AGENT Badge */}
              <span className="bg-[#1B5E45] text-white text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-md uppercase leading-none select-none">
                AGENT
              </span>
            </div>

            {/* Testimonial Quote */}
            <blockquote className="text-xl sm:text-2xl md:text-[30px] font-bold text-slate-900 tracking-tight leading-snug font-instrument max-w-3xl mb-8">
              “Luminar provides our platform with instant, cryptographically verifiable compliance checking. It makes integration with on-chain registries completely transparent and secure.”
            </blockquote>

            {/* User/Company Attribution */}
            <cite className="not-italic flex flex-col items-center">
              <span className="text-sm font-bold text-slate-900 font-clash">Josh Silverstein</span>
              <span className="text-xs text-slate-500 font-clash mt-1">Principal QA Engineer, Gopuff</span>
            </cite>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full bg-[#F2F0EF] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto border-b border-slate-300 py-20 md:py-28">
          {/* Card Container */}
          <div className="w-full bg-[#F4F3EF] border border-slate-300 rounded-3xl p-6 md:p-12 flex flex-col md:flex-row items-stretch justify-between gap-12 overflow-hidden shadow-sm relative">

            {/* Left Column: Text & Button */}
            <div className="flex flex-col justify-between items-start md:w-1/2 space-y-8 text-left">
              <div className="space-y-4">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  04 Team
                </span>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 leading-snug tracking-tight font-instrument max-w-md">
                  Built by people who have worked on decentralized systems, zero-knowledge proofs, and blockchain security at scale. <span className="text-slate-400">Our team comes from Apple, Palantir, and London's leading startups.</span>
                </h3>
              </div>

              <Link
                href="/careers"
                className="px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-900 text-sm font-bold rounded-full transition duration-200 border border-slate-300 shadow-sm inline-flex items-center gap-1.5"
              >
                Careers <span className="text-slate-400 font-normal">→</span>
              </Link>
            </div>

            {/* Right Column: Image Placeholder */}
            <div className="md:w-1/2 w-full flex justify-center items-center shrink-0">
              <div className="w-full relative h-[320px] rounded-2xl overflow-hidden shadow-md group select-none">
                {/* Background Gradient simulating the dinner photo */}
                <div className="absolute inset-0 bg-gradient-to-tr from-stone-400 to-stone-300 flex items-center justify-center p-8 transition-transform duration-500 group-hover:scale-[1.02]">
                  {/* Luminar hex logo overlay in white */}
                  <svg viewBox="0 0 100 100" className="w-16 h-16 text-white/90 drop-shadow-md" fill="currentColor">
                    {/* Left bracket */}
                    <path d="M42,20 L25,30 L25,70 L42,80 L42,66 L34,61 L34,39 L42,34 Z" />
                    {/* Right bracket */}
                    <path d="M58,20 L75,30 L75,70 L58,80 L58,66 L66,61 L66,39 L58,34 Z" />
                  </svg>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Third Testimonial Section */}
      <section className="w-full bg-[#F2F0EF] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto border-b border-slate-300 py-20 md:py-28">
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
            {/* Logo Icon and Badge Row */}
            <div className="flex items-center gap-3 mb-8">
              <div className="relative w-14 h-14 bg-white border border-slate-300 rounded-2xl flex items-center justify-center shadow-sm hover:scale-105 transition-transform duration-300">
                {/* Clove leaf SVG */}
                <svg viewBox="0 0 100 100" className="w-7 h-7 text-slate-900" fill="currentColor">
                  {/* Stem/Base connector */}
                  <path d="M47,75 L53,75 L52,80 L48,80 Z" />
                  {/* Center leaflet */}
                  <path d="M50,72 C56,60 58,45 50,30 C42,45 44,60 50,72 Z" />
                  {/* Left leaflet */}
                  <path d="M46,70 C34,66 26,52 34,42 C40,48 45,60 46,70 Z" />
                  {/* Right leaflet */}
                  <path d="M54,70 C66,66 74,52 66,42 C60,48 55,60 54,70 Z" />
                </svg>
                {/* Overlapping Hexagon Badge on Top Right */}
                <div
                  className="absolute -top-1 -right-1 w-5 h-5 bg-[#1B5E45] shadow-sm flex items-center justify-center"
                  style={{
                    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
                  }}
                />
              </div>
              {/* AGENT Badge */}
              <span className="bg-[#1B5E45] text-white text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-md uppercase leading-none select-none">
                AGENT
              </span>
            </div>

            {/* Testimonial Quote */}
            <blockquote className="text-xl sm:text-2xl md:text-[30px] font-bold text-slate-900 tracking-tight leading-snug font-instrument max-w-3xl mb-8">
              “Compliance checks should build trust, but they usually compromise user privacy. Luminar changes the paradigm by proving credential validity without exposing identity records.”
            </blockquote>

            {/* User/Company Attribution */}
            <cite className="not-italic flex flex-col items-center">
              <span className="text-sm font-bold text-slate-900 font-clash">Red Davis</span>
              <span className="text-xs text-slate-500 font-clash mt-1">Founding Engineer, Clove</span>
            </cite>
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="w-full bg-[#F2F0EF] px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto py-20 md:py-28">
          {/* Card Container */}
          <div className="w-full bg-[#2EA37A] rounded-3xl p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden shadow-sm relative min-h-[420px]">

            {/* Left Column: Text & Input */}
            <div className="flex flex-col items-start text-left lg:w-3/5 space-y-8 z-10">
              <div className="space-y-4">
                <span className="text-xs font-mono text-[#1B5E45] uppercase tracking-wider block">
                  05 Get started
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-[1.1] tracking-tight font-instrument max-w-xl">
                  Integrate private on-chain compliance today.
                </h2>
                <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed font-clash max-w-lg">
                  See how Luminar helps your protocol enforce identity regulations while maintaining user anonymity on the Stellar network.
                </p>
              </div>

              {/* Email Input Bar */}
              <div className="max-w-md w-full">
                <div className="flex items-center bg-white rounded-full p-1.5 focus-within:ring-2 focus-within:ring-slate-950 focus-within:border-transparent transition-all duration-200 shadow-sm">
                  <input
                    type="email"
                    placeholder="Your work email"
                    className="flex-grow bg-transparent px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-clash"
                  />
                  <button
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-full transition duration-200 shadow-sm shrink-0 font-clash"
                  >
                    Book a demo
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Abstract Dashed Circle SVG */}
            <div className="absolute right-0 bottom-0 top-0 w-1/2 hidden lg:flex items-center justify-end pointer-events-none select-none overflow-hidden">
              <svg viewBox="0 0 100 100" className="w-[120%] h-[120%] translate-x-1/3 text-white/30" fill="none" stroke="currentColor">
                <circle cx="50" cy="50" r="48" strokeWidth="0.5" strokeDasharray="2 2" />
              </svg>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

