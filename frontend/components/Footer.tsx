"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function Footer() {
  const footerRef = React.useRef<HTMLElement>(null);
  const [translateX, setTranslateX] = useState(-15);

  useEffect(() => {
    const handleScroll = () => {
      if (!footerRef.current) return;

      const footer = footerRef.current;
      const rect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const totalScroll = docHeight - windowHeight;
      const scrollTop = window.scrollY;

      if (totalScroll <= 0) return;

      const footerHeight = rect.height || 450;
      const revealStart = totalScroll - footerHeight;

      if (scrollTop < revealStart) {
        setTranslateX(-15);
      } else {
        const revealProgress = (scrollTop - revealStart) / footerHeight;
        const progress = Math.min(Math.max(revealProgress, 0), 1);
        // Translate from -15% to 15% (sliding right to left)
        const translateVal = -15 + (progress * 30);
        setTranslateX(translateVal);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <footer ref={footerRef} className="sticky bottom-0 z-0 w-full pt-24 pb-16 border-t border-black overflow-hidden bg-center" style={{ backgroundImage: "url('/assets/footer.jpg')" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col">
        {/* Top Row: Socials & Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8">
          {/* Left: Social Buttons */}
          <div className="flex items-center gap-3">
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-9 h-9 bg-white rounded-lg border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition shadow-sm"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a 
              href="https://x.com/luminar_IND" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-9 h-9 bg-white rounded-lg border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition shadow-sm"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
          
          {/* Right: Legal & Trust Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] font-bold text-black tracking-wider font-clash uppercase">
            <Link href="/privacy" className="text-slate-600 hover:text-black transition">Privacy</Link>
            <Link href="/terms" className="text-slate-600 hover:text-black transition">Terms</Link>
            <Link href="/explorer" className="text-slate-600 hover:text-black transition">Explorer</Link>
            <Link href="/status" className="text-slate-600 hover:text-black transition">Status</Link>
            <Link href="/trust" className="text-slate-600 hover:text-black transition">Trust</Link>
          </div>
        </div>

        {/* Divider Line */}
        <div className="w-full h-[1px] bg-black mb-20" />
      </div>

      {/* Giant Repeating Watermark (Spans edge-to-edge) */}
      <div className="w-full overflow-hidden select-none pointer-events-none pb-0">
        <div 
          className="flex items-center justify-center gap-12 whitespace-nowrap will-change-transform"
          style={{ transform: `translateX(${translateX}%)` }}
        >
          <span className="text-[14vw] font-black font-instrument tracking-tighter leading-none text-black">
            Luminar
          </span>
          <svg viewBox="0 0 100 100" className="w-[10vw] h-[10vw] text-black shrink-0" fill="currentColor">
            <path d="M42,20 L25,30 L25,70 L42,80 L42,66 L34,61 L34,39 L42,34 Z" />
            <path d="M58,20 L75,30 L75,70 L58,80 L58,66 L66,61 L66,39 L58,34 Z" />
          </svg>
          <span className="text-[14vw] font-black font-instrument tracking-tighter leading-none text-black">
            Luminar
          </span>
          <svg viewBox="0 0 100 100" className="w-[10vw] h-[10vw] text-black shrink-0" fill="currentColor">
            <path d="M42,20 L25,30 L25,70 L42,80 L42,66 L34,61 L34,39 L42,34 Z" />
            <path d="M58,20 L75,30 L75,70 L58,80 L58,66 L66,61 L66,39 L58,34 Z" />
          </svg>
          <span className="text-[14vw] font-black font-instrument tracking-tighter leading-none text-black">
            Luminar
          </span>
        </div>
      </div>

      {/* Small Copyright line */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 text-center text-[10px] text-black font-mono mt-8">
        © {new Date().getFullYear()} Luminar.io. Built on Stellar.
      </div>
    </footer>
  );
}
