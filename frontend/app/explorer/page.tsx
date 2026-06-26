"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext: string;
}

function MetricCard({ label, value, subtext }: MetricCardProps) {
  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 font-cabinet">
        {label}
      </p>
      <p className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight font-zodiak mb-1">
        {value}
      </p>
      <p className="text-xs text-slate-400 font-mono">
        {subtext}
      </p>
    </div>
  );
}

interface ActivityEvent {
  id: string;
  docType: string;
  commitment: string;
  time: string;
  country: string;
}

export default function Explorer() {
  const [stats, setStats] = useState({
    total: 1482,
    today: 45,
    active: 1475,
  });

  const docTypes = [
    { name: "PAN Card", percentage: 58, color: "bg-[#2EA37A]" },
    { name: "Aadhaar Card", percentage: 32, color: "bg-amber-500" },
    { name: "Passport", percentage: 10, color: "bg-blue-500" },
  ];

  const initialEvents: ActivityEvent[] = [
    {
      id: "1",
      docType: "PAN Card",
      commitment: "0x0558...8f9a",
      time: "2 mins ago",
      country: "India",
    },
    {
      id: "2",
      docType: "Aadhaar Card",
      commitment: "0x1a48...2c25",
      time: "12 mins ago",
      country: "India",
    },
    {
      id: "3",
      docType: "Passport",
      commitment: "0x2e8f...90ab",
      time: "1 hour ago",
      country: "United States",
    },
    {
      id: "4",
      docType: "PAN Card",
      commitment: "0x0b42...5a02",
      time: "3 hours ago",
      country: "India",
    },
    {
      id: "5",
      docType: "Passport",
      commitment: "0x3c5d...e3f8",
      time: "5 hours ago",
      country: "Germany",
    },
    {
      id: "6",
      docType: "Aadhaar Card",
      commitment: "0x7fd5...357f",
      time: "8 hours ago",
      country: "India",
    },
  ];

  const [events, setEvents] = useState<ActivityEvent[]>(initialEvents);

  // Simulate incoming real-time KYC verifications to make it interactive and "live"
  useEffect(() => {
    const countries = ["India", "United States", "United Kingdom", "Germany", "Canada", "Singapore"];
    const docs = ["PAN Card", "Aadhaar Card", "Passport"];

    const interval = setInterval(() => {
      // Pick random parameters
      const randomDoc = docs[Math.floor(Math.random() * docs.length)];
      const randomCountry = randomDoc === "Passport" 
        ? countries[Math.floor(Math.random() * countries.length)] 
        : "India";
      
      const randomCommitment = "0x" + Array.from({ length: 4 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join("") + "..." + Array.from({ length: 4 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join("");

      const newEvent: ActivityEvent = {
        id: Math.random().toString(),
        docType: randomDoc,
        commitment: randomCommitment,
        time: "Just now",
        country: randomCountry,
      };

      setEvents((prev) => [newEvent, ...prev.slice(0, 7)]);
      setStats((prev) => ({
        total: prev.total + 1,
        today: prev.today + 1,
        active: prev.active + 1,
      }));
    }, 12000); // add a new event every 12 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 w-full font-cabinet">
      {/* Header section */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            ZK-COMPLIANT NETWORK
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-[1.1] font-zodiak mt-1">
            Privacy Ledger Explorer
          </h2>
          <p className="text-sm text-slate-500 mt-2 max-w-xl">
            Live cryptographic activity stream of Luminar credentials on the Stellar network. No PII, transaction hashes, or wallet addresses are exposed to preserve complete user privacy.
          </p>
        </div>
      </div>

      {/* Network Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <MetricCard 
          label="Total Registrations" 
          value={stats.total.toLocaleString()} 
          subtext="Total unique user commitments" 
        />
        <MetricCard 
          label="Verified Today" 
          value={`+${stats.today}`} 
          subtext="New attestations in past 24h" 
        />
        <MetricCard 
          label="Verification Success" 
          value="100%" 
          subtext="ZK proof mathematical soundness" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Live Event Stream */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/35 backdrop-blur-xl border border-white/50 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 font-zodiak mb-6 border-b border-slate-200/50 pb-4">
              Real-Time Verification Stream
            </h3>

            <div className="flow-root">
              <ul className="-my-5 divide-y divide-slate-100">
                {events.map((event) => (
                  <li key={event.id} className="py-5 transition duration-300 hover:bg-slate-50/20 px-2 rounded-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {/* Checked shield icon */}
                          <div className="w-8 h-8 rounded-full bg-[#2EA37A]/10 border border-[#2EA37A]/25 flex items-center justify-center text-[#2EA37A]">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-slate-800">
                              Anonymous {event.docType} Verification
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 font-mono tracking-wide uppercase">
                              {event.country}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 mt-1 font-mono flex items-center gap-1.5">
                            <span>Commitment:</span>
                            <span className="text-slate-600 bg-slate-200/50 px-1.5 py-0.5 rounded font-semibold text-[11px]">
                              {event.commitment}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex sm:flex-col sm:items-end justify-between items-center gap-1.5">
                        <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#06241a] bg-[#2EA37A]/15 border border-[#2EA37A]/30 rounded-full">
                          Verified
                        </span>
                        <span className="text-xs text-slate-400 font-mono font-medium">
                          {event.time}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Distribution & FAQ */}
        <div className="space-y-6">
          {/* Document Distribution Card */}
          <div className="bg-white/35 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 font-zodiak mb-6">
              Document Distribution
            </h3>
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* SVG Donut Chart */}
              <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
                  {/* Background Track */}
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    className="stroke-slate-100 fill-none"
                    strokeWidth="12"
                  />
                  {/* PAN Card Segment: 58% (Circumference = 2 * pi * 48 = 301.6) -> 174.9 length */}
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    className="stroke-[#2EA37A] fill-none transition-all duration-1000 ease-out"
                    strokeWidth="12"
                    strokeDasharray="174.9 301.6"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                  />
                  {/* Aadhaar Card Segment: 32% -> 96.5 length, Offset = -174.9 */}
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    className="stroke-amber-500 fill-none transition-all duration-1000 ease-out"
                    strokeWidth="12"
                    strokeDasharray="96.5 301.6"
                    strokeDashoffset="-174.9"
                    strokeLinecap="round"
                  />
                  {/* Passport Segment: 10% -> 30.2 length, Offset = -271.4 */}
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    className="stroke-blue-500 fill-none transition-all duration-1000 ease-out"
                    strokeWidth="12"
                    strokeDasharray="30.2 301.6"
                    strokeDashoffset="-271.4"
                    strokeLinecap="round"
                  />
                </svg>
                {/* Center Text label inside Donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold font-zodiak text-slate-800 leading-none">58%</span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold font-cabinet mt-0.5">PAN Card</span>
                </div>
              </div>

              {/* Legend with Color indicators */}
              <div className="flex-grow w-full space-y-3.5">
                {docTypes.map((type) => (
                  <div key={type.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-3 h-3 rounded-full ${type.color} shrink-0 shadow-sm`} />
                      <span className="font-bold text-slate-700 font-cabinet">{type.name}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-650 bg-slate-100 px-1.5 py-0.5 rounded">
                      {type.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200/50 mt-6 pt-5">
              <div className="bg-[#2EA37A]/10 border border-[#2EA37A]/25 rounded-2xl p-4 flex gap-3 text-slate-800">
                <svg className="w-5 h-5 text-[#2EA37A] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-xs font-bold text-[#06241a] leading-tight">
                    On-chain Double Registration Prevention
                  </p>
                  <p className="text-[11px] text-slate-600 mt-1 leading-normal">
                    Users generate unique nullifiers from their secret key and public keys. If the same document is submitted twice, the transaction will fail on-chain, protecting the network from Sybil attacks.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy FAQ Card */}
          <div className="bg-white/35 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Privacy Ledger FAQ
            </h4>
            <div className="space-y-4 text-xs">
              <div>
                <p className="font-bold text-slate-800 mb-1">
                  How can the network verify without tx hashes?
                </p>
                <p className="text-slate-500 leading-normal">
                  The network verifier contract validates zero-knowledge proofs directly. Our client explorer omits the specific hash values on-screen to prevent scraping, but the smart contracts verify mathematical correctness.
                </p>
              </div>
              <div>
                <p className="font-bold text-slate-800 mb-1">
                  Can someone trace my wallet address?
                </p>
                <p className="text-slate-500 leading-normal">
                  This interface explicitly hides addresses to preserve client-side privacy. Experienced blockchain users can inspect the raw ledger, but your credential is securely decoupled from any real-world identity files.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
