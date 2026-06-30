import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ReactLenis } from "lenis/react";
import { WalletProvider } from "../context/WalletContext";
import { Analytics } from "@vercel/analytics/next"
import ChatbotWidget from "../components/ChatbotWidget";

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
  title: {
    default: "Luminar | Verifiable Zero-Knowledge Identity for Stellar",
    template: "%s | Luminar"
  },
  description: "Prove you're KYC-verified on the Stellar network without revealing sensitive personal records. Client-side zero-knowledge proofs and secure oracle signatures.",
  keywords: ["Stellar", "Zero-Knowledge", "ZK-Proofs", "KYC", "On-chain Compliance", "DeFi KYC", "Sybil Resistance", "Web3 Identity"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://luminar.io",
    title: "Luminar | Verifiable Zero-Knowledge Identity for Stellar",
    description: "Prove you're KYC-verified on the Stellar network without revealing sensitive personal records. Client-side zero-knowledge proofs and secure oracle signatures.",
    siteName: "Luminar",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luminar | Verifiable Zero-Knowledge Identity for Stellar",
    description: "Prove you're KYC-verified on the Stellar network without revealing sensitive personal records.",
    site: "@luminar_IND",
  }
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
      suppressHydrationWarning
    >
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&display=swap" rel="stylesheet" />
        <script src="https://louisabraham.github.io/nekojs/neko.js" data-autostart="true" async></script>
      </head>
      <body className="min-h-full flex flex-col bg-[#F2F0EF] text-slate-900 selection:bg-luminar/25 selection:text-slate-900 font-clash">
        <WalletProvider>
          <ReactLenis root>
            {/* Sticky Reveal Wrapper */}
            <div className="relative z-10 bg-[#F2F0EF] shadow-[0_15px_40px_rgba(0,0,0,0.04)] flex flex-col min-h-screen ">
             <Header />

            {/* Main Content */}
            <main className="flex-grow flex flex-col">{children}</main>
          </div>

          {/* Footer (Sticky bottom to reveal on scroll) */}
          <Footer />
          <ChatbotWidget />
        </ReactLenis>
        <Analytics/>
        </WalletProvider>
      </body>
    </html>
  );
}

