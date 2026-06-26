"use client";

import React, { useState } from "react";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  category: "Engineering" | "Privacy" | "Compliance";
  description: string;
  date: string;
  author: string;
  readTime: string;
  featured?: boolean;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: "scaling-zk-proofs",
    title: "Scaling Zero-Knowledge Proofs on the Stellar Ledger",
    category: "Engineering",
    description: "How we optimize zk-SNARK verifiers in Soroban smart contracts to enable instant compliance verification with minimal gas consumption.",
    date: "June 24, 2026",
    author: "Ashish Ranjan",
    readTime: "6 min read",
    featured: true,
  },
  {
    id: "zero-pii-future",
    title: "Why Zero PII Storage is the Future of KYC",
    category: "Privacy",
    description: "Exploring the regulatory shift from data accumulation to zero-knowledge verification and how it protects both users and developers.",
    date: "June 18, 2026",
    author: "Elena Rostova",
    readTime: "5 min read",
  },
  {
    id: "soroban-contracts-compliance",
    title: "Soroban Smart Contracts: A New Era for Stellar Compliance",
    category: "Compliance",
    description: "An in-depth look at how Stellar's native smart contract platform enables robust, decentralized identity validation systems.",
    date: "June 10, 2026",
    author: "Marcus Vance",
    readTime: "8 min read",
  },
  {
    id: "freighter-zk-integration",
    title: "Under the Hood: Integrating Freighter Wallet with ZK Circuits",
    category: "Engineering",
    description: "A developer walkthrough of binding private keys to anonymous zero-knowledge commitments using the Freighter browser API.",
    date: "May 29, 2026",
    author: "Ashish Ranjan",
    readTime: "10 min read",
  },
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Engineering", "Privacy", "Compliance"];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    if (selectedCategory === "All") return true;
    return post.category === selectedCategory;
  });

  const featuredPost = BLOG_POSTS.find((p) => p.featured);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-slate-800 font-clash">
      {/* Blog Header */}
      <div className="max-w-3xl mb-16 space-y-4">
        <span className="text-xs font-bold text-[#2EA37A] uppercase tracking-wider bg-[#2EA37A]/10 px-3 py-1 rounded-full">
          Luminar Journal
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
          Thoughts on privacy, compliance, <br />
          and <span className="font-instrument italic">stellar decentralization</span>.
        </h1>
        <p className="text-base text-slate-600 max-w-xl">
          Deep dives into zero-knowledge cryptography, smart contracts, and identity protocols shaping the future of global web3 compliance.
        </p>
      </div>

      {/* Category Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 pb-8 border-b border-slate-300 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-200 cursor-pointer ${
              selectedCategory === category
                ? "bg-[#2EA37A] text-white shadow-sm"
                : "border border-slate-350 text-slate-600 hover:text-black hover:border-slate-400 bg-white/50"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Featured Post (Only show if filtering is on "All" or matches category) */}
      {featuredPost && (selectedCategory === "All" || featuredPost.category === selectedCategory) && (
        <div className="mb-16">
          <div className="bg-[#F4F3EF] border border-slate-300 rounded-3xl overflow-hidden shadow-sm flex flex-col lg:flex-row hover:shadow-md transition-shadow duration-300">
            {/* Left/Top Content */}
            <div className="p-8 md:p-12 lg:w-1/2 flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-[#2EA37A] uppercase tracking-widest font-bold bg-[#2EA37A]/10 px-2 py-0.5 rounded">
                    Featured
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                    {featuredPost.category}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug font-instrument">
                  {featuredPost.title}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed font-clash">
                  {featuredPost.description}
                </p>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#2EA37A] text-white flex items-center justify-center font-bold text-xs font-mono">
                    {featuredPost.author.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{featuredPost.author}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{featuredPost.date}</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider bg-slate-200/50 px-2 py-0.5 rounded">
                  {featuredPost.readTime}
                </span>
              </div>
            </div>
            {/* Right/Bottom Decorative visual block */}
            <div className="lg:w-1/2 bg-slate-950 p-8 md:p-12 flex flex-col justify-center relative overflow-hidden min-h-[300px]">
              <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 rounded-full bg-[#2EA37A]/20 blur-3xl" />
              <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 rounded-full bg-[#2EA37A]/10 blur-3xl" />
              
              <div className="border border-white/10 rounded-2xl p-6 bg-white/5 backdrop-blur-md space-y-4 font-mono relative z-10 max-w-sm mx-auto shadow-inner">
                <div className="flex items-center justify-between text-xs text-white/50 border-b border-white/10 pb-2">
                  <span>ZK CIRCUIT COMPILATION</span>
                  <span className="text-[#2EA37A]">READY</span>
                </div>
                <div className="text-[10px] text-emerald-400 space-y-1 font-mono">
                  <div>$ npx snarkjs groth16 setup circuits/kyc.r1cs ...</div>
                  <div>[info] generating proving key... done.</div>
                  <div>[info] verification key fields written.</div>
                  <div className="text-white/60 mt-2">// commitment binding public inputs</div>
                  <div>Public inputs: [ 0x82f...3a9c ]</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts
          .filter((post) => !post.featured || selectedCategory !== "All")
          .map((post) => (
            <div
              key={post.id}
              className="bg-[#F4F3EF] border border-slate-300 rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-white/40"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#2EA37A] uppercase tracking-widest font-bold bg-[#2EA37A]/10 px-2 py-0.5 rounded">
                    {post.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{post.date}</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {post.description}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] font-mono">
                    {post.author.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-slate-700">{post.author}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 font-semibold">
                  {post.readTime}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
