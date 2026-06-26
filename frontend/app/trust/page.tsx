import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Trust Center - Luminar.io",
  description: "Learn how Luminar uses zero-knowledge cryptography and Soroban smart contracts to verify identity without sacrificing privacy.",
};

export default function TrustPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-slate-800 font-clash">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24 space-y-6">
        <span className="text-xs font-bold text-[#2EA37A] uppercase tracking-wider bg-[#2EA37A]/10 px-3 py-1 rounded-full">
          Luminar Trust Center
        </span>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1] font-instrument">
          Trust built on <span className="font-instrument italic">mathematics</span>, not promises.
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Luminar is designed from the ground up to ensure your identity remains private, secure, and under your exclusive control. We use zero-knowledge cryptography to prove compliance on Stellar.
        </p>
      </div>

      {/* Trust Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 md:mb-28">
        {/* Pillar 1: Zero Knowledge */}
        <div className="bg-[#F4F3EF] border border-slate-300 rounded-3xl p-8 flex flex-col justify-between hover:shadow-md transition-shadow duration-300 relative group">
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-[#2EA37A]/10 flex items-center justify-center text-[#2EA37A]">
              <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current" fill="none" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Zero-Knowledge Privacy
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Verification happens entirely client-side using zk-SNARKs. Your government ID, date of birth, and biometric data are never uploaded to our servers or stored in any database. The protocol only outputs a cryptographic proof.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-slate-350 flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Guaranteed</span>
            <span className="text-xs font-bold text-[#2EA37A] bg-[#2EA37A]/10 px-2 py-0.5 rounded">0% PII Stored</span>
          </div>
        </div>

        {/* Pillar 2: Immutable Soroban Smart Contracts */}
        <div className="bg-[#F4F3EF] border border-slate-300 rounded-3xl p-8 flex flex-col justify-between hover:shadow-md transition-shadow duration-300 relative group">
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-[#2EA37A]/10 flex items-center justify-center text-[#2EA37A]">
              <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current" fill="none" strokeWidth="2">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                On-Chain Integrity
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Attestations are recorded directly on the Stellar ledger via Soroban smart contracts. No single entity, not even Luminar, can alter or remove a valid compliance attestation once committed. Smart contracts enforce compliance rules in real-time.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-slate-350 flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Verifiable</span>
            <span className="text-xs font-bold text-[#2EA37A] bg-[#2EA37A]/10 px-2 py-0.5 rounded">Soroban Native</span>
          </div>
        </div>

        {/* Pillar 3: Self-Custodial Identity */}
        <div className="bg-[#F4F3EF] border border-slate-300 rounded-3xl p-8 flex flex-col justify-between hover:shadow-md transition-shadow duration-300 relative group">
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-[#2EA37A]/10 flex items-center justify-center text-[#2EA37A]">
              <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current" fill="none" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Self-Custodial ID
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Your credentials are bound strictly to your Stellar wallet address. Authentication and signatures occur locally through secure extensions like Freighter. Luminar never has access to your private keys or backup seeds.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-slate-350 flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Control</span>
            <span className="text-xs font-bold text-[#2EA37A] bg-[#2EA37A]/10 px-2 py-0.5 rounded">User Owned</span>
          </div>
        </div>
      </div>

      {/* How Trust Flow Works section */}
      <div className="bg-[#F4F3EF] border border-slate-300 rounded-3xl p-8 md:p-12 mb-20 md:mb-28 shadow-sm">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-instrument mb-8 tracking-tight">
          How compliance verification establishes trust
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
          {/* Step 1 */}
          <div className="space-y-3 relative">
            <div className="text-[10px] font-mono text-[#2EA37A] font-bold uppercase tracking-wider">Step 01</div>
            <h4 className="text-base font-bold text-slate-900">Secure Hashing</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your sensitive parameters (name, birthdate, ID) are hashed locally using cryptographic primitives. Only these metadata hashes and an oracle signature are prepared for proving.
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-3 relative">
            <div className="text-[10px] font-mono text-[#2EA37A] font-bold uppercase tracking-wider">Step 02</div>
            <h4 className="text-base font-bold text-slate-900">Client-Side Proving</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your browser runs a zk-SNARK compiler, proving that the user's hidden attributes satisfy the compliance config (e.g., matching a specific country code) without revealing the attributes.
            </p>
          </div>

          {/* Step 3 */}
          <div className="space-y-3 relative">
            <div className="text-[10px] font-mono text-[#2EA37A] font-bold uppercase tracking-wider">Step 03</div>
            <h4 className="text-base font-bold text-slate-900">Smart Contract Verification</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              The Soroban smart contract checks the proof's validity against public parameters. Once verified, the contract registers an immutable compliance attestation on the Stellar blockchain.
            </p>
          </div>

          {/* Step 4 */}
          <div className="space-y-3 relative">
            <div className="text-[10px] font-mono text-[#2EA37A] font-bold uppercase tracking-wider">Step 04</div>
            <h4 className="text-base font-bold text-slate-900">Zero-Knowledge Attestation</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              DeFi protocols, bridges, or dApps check the contract's compliance status of your public key. They authorize your transaction without knowing your real identity.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="max-w-3xl mx-auto mb-20 md:mb-28">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-instrument mb-8 text-center tracking-tight">
          Trust & Security FAQs
        </h2>
        <div className="space-y-6">
          <div className="p-6 bg-[#F4F3EF] border border-slate-300 rounded-2xl">
            <h4 className="text-base font-bold text-slate-900 mb-2">
              Does Luminar store my personal data?
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              No. Luminar is built on a zero-knowledge architecture. We do not maintain databases of customer verification records, passport documents, or demographic profiles. All proofs are computed client-side, and only cryptographic hashes are processed.
            </p>
          </div>

          <div className="p-6 bg-[#F4F3EF] border border-slate-300 rounded-2xl">
            <h4 className="text-base font-bold text-slate-900 mb-2">
              Can my compliance proofs be tracked back to my personal identity?
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              No. By using advanced zero-knowledge cryptography, the link between your cryptographic attestation and your real-world identity is not exposed on-chain. Only the fact that your identity meets specific regulations is verifiable on-chain.
            </p>
          </div>

          <div className="p-6 bg-[#F4F3EF] border border-slate-300 rounded-2xl">
            <h4 className="text-base font-bold text-slate-900 mb-2">
              Are your smart contracts audited?
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Luminar’s Soroban smart contracts are open-source and follow industry-standard practices on the Stellar blockchain. The code is modular, and public audit results will be posted here as they are completed.
            </p>
          </div>
        </div>
      </div>

      {/* Audit/Verification CTA banner */}
      <div className="bg-slate-950 text-white rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-lg">
        {/* Glow effect background */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#2EA37A]/25 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[#2EA37A]/15 blur-3xl" />

        <div className="space-y-4 max-w-lg relative z-10">
          <span className="text-[10px] font-mono text-[#2EA37A] font-bold uppercase tracking-wider">
            Open Source Codebase
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold font-instrument tracking-tight leading-tight">
            Verify the cryptographic logic yourself.
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Our zero-knowledge circuits, Stellar Soroban contracts, and client-side SDK are open-source. Anyone can audit the math and logic that guarantees privacy.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto shrink-0 relative z-10">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#2EA37A] hover:bg-[#2EA37A]/90 text-white text-sm font-bold rounded-full text-center transition duration-200 shadow"
          >
            Browse GitHub
          </a>
          <Link
            href="/verify"
            className="px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-bold rounded-full text-center transition duration-200"
          >
            Start Verification
          </Link>
        </div>
      </div>
    </div>
  );
}
