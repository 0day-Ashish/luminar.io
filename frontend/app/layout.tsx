import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import WalletButton from "../components/WalletButton";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
      className={`${cabinetGrotesk.variable} ${zodiak.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900 selection:bg-luminar/25 selection:text-slate-900 font-cabinet">
        <header className="w-full bg-white mt-14 sm:mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16
           flex items-center justify-between">
            {/* Brand Logo (Left) */}
            <Link href="/" className="flex items-center space-x-2">
              {/* LOGO PLACEHOLDER */}
              <span className="text-2xl font-extrabold text-slate-900 font-zodiak tracking-wide">
                Luminar
              </span>
            </Link>

            {/* Navigation links & buttons (Right) */}
            <nav className="flex items-center space-x-3">
              <Link
                href="/"
                className="px-4 py-2 border border-slate-200 hover:border-slate-400 text-sm font-medium text-slate-650 rounded-full transition duration-200"
              >
                About
              </Link>
              <Link
                href="/verify"
                className="px-4 py-2 border border-slate-200 hover:border-slate-400 text-sm font-medium text-slate-650 rounded-full transition duration-200"
              >
                Verify
              </Link>
              <WalletButton />
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex flex-col">{children}</main>

        {/* Footer */}
        <footer className="border-t border-slate-100 bg-white py-8 text-center text-xs text-slate-505">
          <div className="max-w-7xl mx-auto px-4">
            <p>© {new Date().getFullYear()} Luminar.io. Built on Stellar.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

