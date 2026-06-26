import React from "react";
import StatusDashboard from "./StatusDashboard";

export const metadata = {
  title: "System Status",
  description: "Check the live operational status and latency diagnostics for the Luminar zero-knowledge identity verification network and Stellar testnet integration.",
};

export default function StatusPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-slate-800 font-clash">
      {/* Page Header */}
      <div className="max-w-2xl mb-12 space-y-4">
        <span className="text-xs font-bold text-[#2EA37A] uppercase tracking-wider bg-[#2EA37A]/10 px-3 py-1 rounded-full">
          Live Diagnostics
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 font-instrument">
          System <span className="font-instrument italic">Status</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Real-time check on the health, response times, and ledger synchronization for all core Luminar nodes, contracts, and connected blockchain networks.
        </p>
      </div>

      {/* Main Dashboard Component */}
      <StatusDashboard />
    </div>
  );
}
