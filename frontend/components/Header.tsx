"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../public/assets/logo.png";
import WalletButton from "./WalletButton";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="w-full bg-[#F2F0EF] mt-14 sm:mt-16 mb-3 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">
        {/* Brand Logo (Left) */}
        <Link href="/" className="flex items-center space-x-2" onClick={closeMenu}>
          <Image
            src={logo}
            alt="Luminar Logo"
            priority
            className="h-90 w-auto object-contain pointer-events-none -ml-23 md:-ml-25"
          />
        </Link>

        {/* Desktop Navigation links & buttons (Right) */}
        <nav className="hidden md:flex items-center space-x-3">
          <Link
            href="/verify"
            className="px-4 py-2 border border-slate-300 hover:border-slate-400 text-sm text-slate-600 hover:text-black rounded-full transition duration-200"
          >
            Verify
          </Link>
          <Link
            href="/blog"
            className="px-4 py-2 border border-slate-300 hover:border-slate-400 text-sm text-slate-600 hover:text-black rounded-full transition duration-200"
          >
            Blog
          </Link>
          <Link
            href="/contact"
            className="px-4 py-2 border border-slate-300 hover:border-slate-400 text-sm text-slate-600 hover:text-black rounded-full transition duration-200"
          >
            Contact
          </Link>
          <WalletButton />
        </nav>

        {/* Mobile Header Actions (Hamburger only) */}
        <div className="flex md:hidden items-center">
          
          {/* Hamburger Menu Toggle */}
          <button
            onClick={toggleMenu}
            type="button"
            className="w-10 h-10 flex items-center justify-center border border-slate-300 rounded-full hover:bg-slate-100 transition duration-200 cursor-pointer focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <div className="relative w-5 h-5 flex items-center justify-center">
              <span
                className={`absolute block h-0.5 w-5 bg-slate-800 rounded-full transition-transform duration-300 ${
                  isOpen ? "rotate-45" : "-translate-y-1.5"
                }`}
              />
              <span
                className={`absolute block h-0.5 w-5 bg-slate-800 rounded-full transition-opacity duration-300 ${
                  isOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute block h-0.5 w-5 bg-slate-800 rounded-full transition-transform duration-300 ${
                  isOpen ? "-rotate-45" : "translate-y-1.5"
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu (Slide Down / Fade In) */}
      <div
        className={`absolute top-full left-0 w-full bg-[#F2F0EF]/95 backdrop-blur-md border-b border-slate-300 shadow-lg md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[300px] opacity-100 py-6" : "max-h-0 opacity-0 py-0"
        }`}
      >
        <nav className="flex flex-col items-center space-y-4 px-4">
          <Link
            href="/verify"
            onClick={closeMenu}
            className="w-full text-center px-4 py-3 border border-slate-300 hover:border-slate-400 text-sm font-semibold text-slate-600 hover:text-black rounded-full transition duration-200 bg-white/40"
          >
            Verify
          </Link>
          <Link
            href="/blog"
            onClick={closeMenu}
            className="w-full text-center px-4 py-3 border border-slate-300 hover:border-slate-400 text-sm font-semibold text-slate-600 hover:text-black rounded-full transition duration-200 bg-white/40"
          >
            Blog
          </Link>
          <Link
            href="/contact"
            onClick={closeMenu}
            className="w-full text-center px-4 py-3 border border-slate-300 hover:border-slate-400 text-sm font-semibold text-slate-600 hover:text-black rounded-full transition duration-200 bg-white/40"
          >
            Contact
          </Link>
          <div className="w-full pt-2 border-t border-slate-200/60 flex justify-center" onClick={closeMenu}>
            <WalletButton />
          </div>
        </nav>
      </div>
    </header>
  );
}
