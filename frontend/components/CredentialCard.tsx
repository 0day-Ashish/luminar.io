"use client";

import React from "react";

export default function CredentialCard() {
  return (
    <div className="p-6 bg-gradient-to-br from-slate-900 via-slate-900 to-luminar/10 border border-slate-800 rounded-2xl max-w-sm w-full relative overflow-hidden shadow-xl">
      <div className="absolute top-0 right-0 w-24 h-24 bg-luminar/5 rounded-full filter blur-2xl"></div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-xs text-luminar font-semibold uppercase tracking-wider">
            Verified Credential
          </span>
          <h3 className="text-lg font-bold text-white mt-1 tracking-wide">Luminar ID</h3>
        </div>
        <div className="w-8 h-8 rounded-lg bg-luminar/20 border border-luminar/30 flex items-center justify-center text-luminar text-xs font-bold">
          LMR
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <span className="text-xs text-slate-500 block">DID Identifier</span>
          <code className="text-xs text-slate-300 break-all font-mono">
            did:stellar:GABC...XYZ
          </code>
        </div>
        <div className="flex justify-between text-xs text-slate-400">
          <div>
            <span className="text-[10px] text-slate-500 block">Issued</span>
            <span>June 2026</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block">Status</span>
            <span className="text-emerald-400 font-medium">Valid</span>
          </div>
        </div>
      </div>
    </div>
  );
}
