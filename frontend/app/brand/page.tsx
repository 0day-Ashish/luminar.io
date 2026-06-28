"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Custom SVG Icons for the UI
const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m3.375-3.375V18a2.25 2.25 0 0 0 2.25 2.25H18A2.25 2.25 0 0 0 20.25 18v-8.25A2.25 2.25 0 0 0 18 7.5h-2.25m-3.375 3.375H18" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-emerald-600">
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

// Luminar Brand Shield SVG String for copying
const LUMINAR_SHIELD_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" className="w-full h-full">
  <defs>
    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2EA37A" />
      <stop offset="100%" stop-color="#1A6C50" />
    </linearGradient>
  </defs>
  <path d="M50 8L85 22V55C85 75 70 90 50 94C30 90 15 75 15 55V22L50 8Z" fill="url(#shieldGrad)" />
  <path d="M42 35 L28 42 L28 68 L42 75 L42 65 L35 61 L35 49 L42 45 Z" fill="#F2F0EF" />
  <path d="M58 35 L72 42 L72 68 L58 75 L58 65 L65 61 L65 49 L58 45 Z" fill="#F2F0EF" />
</svg>`;

export default function BrandAssetsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const triggerCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const colors = [
    { name: "Luminar Green", hex: "#2EA37A", rgb: "46, 163, 122", usage: "Primary Brand Color, Highlights, Buttons" },
    { name: "Deep Obsidian", hex: "#0F172A", rgb: "15, 23, 42", usage: "Primary Text, Dark Mode Backgrounds" },
    { name: "Off-White Canvas", hex: "#F2F0EF", rgb: "242, 240, 239", usage: "Main Page Background, Card Fills" },
    { name: "Bordure Silver", hex: "#E2E8F0", rgb: "226, 232, 240", usage: "Borders, Divided Lines, Subtitles" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-slate-800 font-clash">
      
      {/* Hero Header Section */}
      <div className="border-b border-slate-300 pb-12 mb-16 relative">
        <div className="absolute top-0 right-0 -z-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="text-xs font-mono font-bold tracking-widest text-[#2EA37A] uppercase mb-3">
          Identity Guidelines
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 font-instrument mb-6 text-wrap-balance">
          Luminar Brand Assets
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl leading-relaxed text-wrap-pretty">
          Resources and design standards for presenting the Luminar zero-knowledge identity protocol. Use these assets to maintain brand consistency across integrations, wallets, and ecosystem platforms.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="space-y-24">
        
        {/* Section 1: Logo & Mark */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-baseline justify-between border-b border-slate-200 pb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-instrument">
              1. Brand Marks
            </h2>
            <span className="text-xs text-slate-500 font-mono mt-1">PNG & Vector SVG Formats</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Primary Logo Card */}
            <div className="border border-slate-300 rounded-2xl bg-white p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition duration-300 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[6px] bg-[#2EA37A]" />
              <div>
                <h3 className="text-lg font-bold text-slate-950 mb-2">Primary Horizontal Logo</h3>
                <p className="text-xs text-slate-500 mb-6">Best for standard layouts, headers, and navigation bars.</p>
                <div className="h-40 bg-[#F2F0EF] rounded-xl flex items-center justify-center border border-slate-200 p-6 mb-6">
                  <Image 
                    src="/assets/logo.png" 
                    alt="Luminar Horizontal Logo" 
                    width={220} 
                    height={60} 
                    className="max-h-16 object-contain pointer-events-none"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a 
                  href="/assets/logo.png" 
                  download="luminar_logo.png"
                  className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold font-mono tracking-wider text-center flex items-center justify-center gap-2 transition"
                >
                  <DownloadIcon />
                  DOWNLOAD PNG
                </a>
              </div>
            </div>

            {/* ZK Badge / Shield SVG Card */}
            <div className="border border-slate-300 rounded-2xl bg-white p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition duration-300 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[6px] bg-[#2EA37A]" />
              <div>
                <h3 className="text-lg font-bold text-slate-950 mb-2">ZK Compliance Badge</h3>
                <p className="text-xs text-slate-500 mb-6">Stellar Soroban identity stamp used to indicate verified ZK credentials.</p>
                <div className="h-40 bg-[#F2F0EF] rounded-xl flex items-center justify-center border border-slate-200 p-6 mb-6">
                  <div className="w-20 h-20">
                    <div dangerouslySetInnerHTML={{ __html: LUMINAR_SHIELD_SVG }} />
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => triggerCopy(LUMINAR_SHIELD_SVG, "svg-shield")}
                  className="flex-1 py-2.5 px-4 border border-slate-350 hover:border-slate-400 text-slate-800 hover:bg-slate-50 rounded-lg text-xs font-bold font-mono tracking-wider flex items-center justify-center gap-2 transition"
                >
                  {copiedId === "svg-shield" ? <CheckIcon /> : <CopyIcon />}
                  {copiedId === "svg-shield" ? "COPIED SVG" : "COPY VECTOR SVG"}
                </button>
              </div>
            </div>

            {/* Stellar Ecosystem Partner Card */}
            <div className="border border-slate-300 rounded-2xl bg-white p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition duration-300 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[6px] bg-[#2EA37A]" />
              <div>
                <h3 className="text-lg font-bold text-slate-950 mb-2">Stellar Ecosystem Partner</h3>
                <p className="text-xs text-slate-500 mb-6">Partner banner for co-branding on Stellar networks and forums.</p>
                <div className="h-40 bg-[#F2F0EF] rounded-xl flex items-center justify-center border border-slate-200 p-4 mb-6">
                  <Image 
                    src="/assets/@StellarOrg.png" 
                    alt="Stellar Partner Banner" 
                    width={220} 
                    height={60} 
                    className="max-h-24 object-contain pointer-events-none"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a 
                  href="/assets/@StellarOrg.png" 
                  download="stellar_org.png"
                  className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold font-mono tracking-wider text-center flex items-center justify-center gap-2 transition"
                >
                  <DownloadIcon />
                  DOWNLOAD PNG
                </a>
              </div>
            </div>

            {/* Neko.js Interactive Mascot Card */}
            <div className="border border-slate-300 rounded-2xl bg-white p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition duration-300 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[6px] bg-[#2EA37A]" />
              <div>
                <h3 className="text-lg font-bold text-slate-950 mb-2">Neko.js Interactive Mascot</h3>
                <p className="text-xs text-slate-500 mb-6">Easter-egg mouse chasing cat active globally across layout templates.</p>
                <div className="h-40 bg-[#F2F0EF] rounded-xl flex flex-col items-center justify-center border border-slate-200 p-4 mb-6 select-none">
                  <Image 
                    src="/assets/neko.ico" 
                    alt="Neko Mascot Icon" 
                    width={48} 
                    height={48} 
                    className="w-12 h-12 object-contain mb-2 pointer-events-none"
                  />
                  <span className="text-[10px] font-mono text-slate-400 tracking-wider">neko.js active</span>
                </div>
              </div>
              <div className="flex gap-2">
                <a 
                  href="https://github.com/louisabraham/nekojs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-grow py-2.5 px-3 border border-slate-350 hover:border-slate-400 text-slate-800 hover:bg-slate-50 rounded-lg text-xs font-bold font-mono tracking-wider text-center flex items-center justify-center gap-1.5 transition"
                >
                  GITHUB REPO
                </a>
                <button
                  onClick={() => triggerCopy("https://louisabraham.github.io/nekojs/neko.js", "neko-js-link")}
                  className="py-2.5 px-3 border border-slate-350 hover:border-slate-400 text-slate-800 hover:bg-slate-50 rounded-lg text-xs font-bold font-mono tracking-wider flex items-center justify-center gap-1.5 transition shrink-0"
                  title="Copy script URL"
                >
                  {copiedId === "neko-js-link" ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* Section 2: Color Palette */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-baseline justify-between border-b border-slate-200 pb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-instrument">
              2. Core Color Palette
            </h2>
            <span className="text-xs text-slate-500 font-mono mt-1">Hex & RGB Values</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {colors.map((color, idx) => (
              <div key={idx} className="border border-slate-300 rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col">
                <div className="h-28 w-full border-b border-slate-200 relative group" style={{ backgroundColor: color.hex }}>
                  {/* Hex Copy Button Overlay */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-200">
                    <button 
                      onClick={() => triggerCopy(color.hex, `hex-${idx}`)}
                      className="py-1.5 px-3 bg-white/95 backdrop-blur-sm rounded-lg text-[10px] font-bold font-mono text-slate-900 shadow-md flex items-center gap-1.5 hover:scale-105 active:scale-95 transition"
                    >
                      {copiedId === `hex-${idx}` ? <CheckIcon /> : <CopyIcon />}
                      {copiedId === `hex-${idx}` ? "COPIED" : "COPY HEX"}
                    </button>
                  </div>
                </div>
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 font-instrument">{color.name}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">{color.usage}</p>
                  </div>
                  
                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-600">
                      <span>HEX:</span>
                      <button 
                        onClick={() => triggerCopy(color.hex, `hex-sub-${idx}`)}
                        className="hover:text-black font-semibold flex items-center gap-1 hover:underline text-[10px]"
                      >
                        {color.hex}
                        {copiedId === `hex-sub-${idx}` ? <CheckIcon /> : <CopyIcon />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-600">
                      <span>RGB:</span>
                      <button 
                        onClick={() => triggerCopy(color.rgb, `rgb-${idx}`)}
                        className="hover:text-black font-semibold flex items-center gap-1 hover:underline text-[10px]"
                      >
                        rgb({color.rgb})
                        {copiedId === `rgb-${idx}` ? <CheckIcon /> : <CopyIcon />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Typography */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-baseline justify-between border-b border-slate-200 pb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-instrument">
              3. Typography
            </h2>
            <span className="text-xs text-slate-500 font-mono mt-1">Font Pairings & Scale</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Clash Display */}
            <div className="border border-slate-300 rounded-2xl bg-white p-8 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#2EA37A] uppercase">
                  Display Font
                </span>
                <h3 className="text-3xl font-bold font-clash text-slate-900 mt-2 mb-4">
                  Clash Display
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  Used exclusively for hero titles, section headings, numbers, and primary UI callouts to emphasize bold identity characteristics.
                </p>
                <div className="border-t border-slate-200 pt-6 space-y-4">
                  <div className="text-4xl font-light font-clash text-slate-800">AaBbCc 200</div>
                  <div className="text-4xl font-medium font-clash text-slate-800">AaBbCc 500</div>
                  <div className="text-4xl font-bold font-clash text-slate-900">AaBbCc 700</div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100">
                <a 
                  href="https://www.fontshare.com/fonts/clash-display" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-slate-550 hover:text-[#2EA37A] transition flex items-center gap-1 font-mono font-bold uppercase tracking-wider"
                >
                  VIEW ON FONTSHARE
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Instrument Sans */}
            <div className="border border-slate-300 rounded-2xl bg-white p-8 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#2EA37A] uppercase">
                  Body & Interface Font
                </span>
                <h3 className="text-3xl font-bold font-instrument text-slate-900 mt-2 mb-4">
                  Instrument Sans
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  Used for paragraph blocks, labels, form descriptions, and general text settings where readability is crucial.
                </p>
                <div className="border-t border-slate-200 pt-6 space-y-4 font-instrument">
                  <div className="text-4xl font-normal text-slate-800">AaBbCc Regular</div>
                  <div className="text-4xl font-semibold text-slate-800">AaBbCc Semibold</div>
                  <div className="text-4xl font-bold text-slate-900">AaBbCc Bold</div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100">
                <a 
                  href="https://fonts.google.com/specimen/Instrument+Sans" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-slate-550 hover:text-[#2EA37A] transition flex items-center gap-1 font-mono font-bold uppercase tracking-wider"
                >
                  VIEW ON GOOGLE FONTS
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* Section 4: Usage Rules */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-baseline justify-between border-b border-slate-200 pb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-instrument">
              4. Visual Dos & Don'ts
            </h2>
            <span className="text-xs text-slate-500 font-mono mt-1">Guidelines for ecosystem consistency</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* The Dos */}
            <div className="border border-emerald-200 bg-emerald-500/5 rounded-2xl p-8 space-y-6">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-lg font-instrument">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
                Correct Usage (Dos)
              </div>
              <ul className="space-y-4 text-sm text-slate-750 list-disc pl-5">
                <li>Provide ample clear space around the logo (minimum 24px of margins).</li>
                <li>Ensure high contrast between the green/dark assets and the layout background.</li>
                <li>Prefer the horizontal logo in high-prominence headers or interfaces.</li>
                <li>Link directly back to <code className="bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono text-xs text-emerald-800">luminar.io</code> when placing the compliance badge.</li>
              </ul>
            </div>

            {/* The Don'ts */}
            <div className="border border-rose-200 bg-rose-500/5 rounded-2xl p-8 space-y-6">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-lg font-instrument">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
                Incorrect Usage (Don'ts)
              </div>
              <ul className="space-y-4 text-sm text-slate-750 list-disc pl-5">
                <li>Never stretch, skew, or distort the proportions of the logo.</li>
                <li>Do not recolor the logo elements or compliance badge outside standard brand hexes.</li>
                <li>Do not overlay busy background textures or complex images under text/logos.</li>
                <li>Avoid using the compliance stamp for non-compliance functions or general links.</li>
              </ul>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
