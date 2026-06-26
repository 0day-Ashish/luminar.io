import React from "react";
import Link from "next/link";

export default function CareersPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-slate-800 font-clash">
      {/* Page Header */}
      <div className="max-w-3xl mb-16 space-y-4">
        <span className="text-xs font-bold text-[#2EA37A] uppercase tracking-wider bg-[#2EA37A]/10 px-3 py-1 rounded-full">
          Careers
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight font-instrument">
          Build the future of <span className="font-instrument italic">private compliance</span>.
        </h1>
        <p className="text-base text-slate-650 max-w-xl">
          At Luminar, we are pioneering decentralized identity and on-chain zero-knowledge protocols on Stellar. Work at the bleeding edge of ZK cryptography and secure decentralized ledgers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
        {/* Open Positions Card (Left) */}
        <div className="lg:col-span-7 bg-[#F4F3EF] border border-slate-300 rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[400px]">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Current Openings</span>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 font-instrument">No Active Openings</h2>
              <p className="text-sm text-slate-600 leading-relaxed max-w-lg">
                We are currently operating in a focused, high-efficiency mode and do not have open roles listed at this time. However, our roadmap is ambitious and we scale quickly.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-300 pt-6 mt-8">
            <p className="text-xs text-slate-500 leading-relaxed">
              Check back frequently or follow our GitHub organization for open source contributions and bounty announcements.
            </p>
          </div>
        </div>

        {/* Speculative Application Card (Right) */}
        <div className="lg:col-span-5 bg-white border border-slate-300 rounded-3xl p-8 md:p-10 shadow-sm flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#2EA37A]/5 rounded-full filter blur-3xl pointer-events-none"></div>

          <div className="space-y-6 relative z-10">
            <h3 className="text-xl font-bold text-slate-900 font-instrument">Speculative Application</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Are you a researcher, cryptography engineer, or zero-knowledge compiler developer? We are always interested in speaking with exceptional minds.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Send your CV, GitHub profile, and a brief description of the complex engineering challenges you've solved to:
            </p>

            <div className="p-4 bg-[#F2F0EF]/60 border border-slate-200 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2EA37A]/10 flex items-center justify-center text-[#2EA37A] shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current" fill="none" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div className="min-w-0 flex-grow">
                <div className="text-[9px] font-clash text-slate-600 uppercase font-bold">Email Talent Acquisition</div>
                <a
                  href="mailto:support.luminar@gmail.com?subject=Speculative%20Application%20-%20Luminar"
                  className="text-xs sm:text-sm text-slate-900 hover:text-[#2EA37A] transition font-clash tracking-widest truncate block"
                >
                  support.luminar@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 relative z-10">
            <a
              href="mailto:support.luminar@gmail.com?subject=Speculative%20Application%20-%20Luminar"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-full transition duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer text-center"
            >
              Send Application
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
