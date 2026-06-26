import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import WalletButton from "../components/WalletButton";
import Link from "next/link";
import Image from "next/image";
import Footer from "../components/Footer";
import { ReactLenis } from "lenis/react";
import { WalletProvider } from "../context/WalletContext";
import logo from "../public/assets/logo.png";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

const cabinetGrotesk = localFont({
  src: "../public/fonts/CabinetGrotesk-Regular.otf",
  variable: "--font-cabinet",
});

const zodiak = localFont({
  src: "../public/fonts/Zodiak-Regular.otf",
  variable: "--font-zodiak",
});

export const metadata: Metadata = {
  title: "Luminar.io - Verifiable Stellar Identity",
  description: "Prove you're KYC-verified on Stellar without revealing who you are.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${cabinetGrotesk.variable} ${zodiak.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-[#F2F0EF] text-slate-900 selection:bg-luminar/25 selection:text-slate-900 font-clash">
        <WalletProvider>
          <ReactLenis root>
            {/* Sticky Reveal Wrapper */}
            <div className="relative z-10 bg-[#F2F0EF] shadow-[0_15px_40px_rgba(0,0,0,0.04)] flex flex-col min-h-screen ">
            <header className="w-full bg-[#F2F0EF] mt-14 sm:mt-16 mb-3">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16
               flex items-center justify-between">
                {/* Brand Logo (Left) */}
                <Link href="/" className="flex items-center space-x-2">
                  <Image
                    src={logo}
                    alt="Luminar Logo"
                    priority
                    className="h-90 w-auto object-contain pointer-events-none -ml-26"></Image>
                  
                </Link>

                 {/* Navigation links & buttons (Right) */}
                <nav className="flex items-center space-x-3">
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
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex flex-col">{children}</main>
          </div>

          {/* Footer (Sticky bottom to reveal on scroll) */}
          <Footer />
        </ReactLenis>
        </WalletProvider>
      </body>
    </html>
  );
}

