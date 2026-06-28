"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { BLOG_POSTS, BlogPost } from "./posts";

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Engineering", "Privacy", "Compliance"];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    if (selectedCategory === "All") return true;
    return post.category === selectedCategory;
  });

  const featuredPost = BLOG_POSTS.find((p) => p.featured);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-slate-800 font-clash w-full">
      <title>Luminar Journal & Blog | ZK-Proofs & Stellar compliance</title>
      <meta name="description" content="Explore articles and tutorials on zero-knowledge cryptography, decentralized identity protocols, and on-chain compliance verifiers on Stellar." />
      
      {/* Blog Header */}
      <div className="max-w-3xl mb-16 space-y-4">
        <span className="text-xs font-bold text-[#2EA37A] uppercase tracking-wider bg-[#2EA37A]/10 px-3 py-1 rounded-full">
          Luminar Journal
        </span>
        <h1 className="text-4xl sm:text-5xl tracking-tight text-slate-900 leading-tight">
          Thoughts on privacy, compliance, <br />
          and <span className="font-instrument font-semibold italic">stellar decentralization</span>.
        </h1>
        <p className="text-base text-slate-600 max-w-xl">
          Deep dives into zero-knowledge cryptography, smart contracts, and identity protocols shaping the future of global web3 compliance.
        </p>
      </div>

      {/* Category Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 pb-8 border-b border-slate-350 mb-12">
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

      {/* Featured Post */}
      {featuredPost && (selectedCategory === "All" || featuredPost.category === selectedCategory) && (
        <div className="mb-16 w-full">
          <Link 
            href={`/blog/${featuredPost.id}`}
            className="w-full bg-[#F4F3EF] border border-slate-300 rounded-3xl overflow-hidden shadow-sm flex flex-col lg:flex-row hover:shadow-md transition-all duration-300 cursor-pointer group block"
          >
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
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug font-instrument group-hover:text-[#2EA37A] transition-colors duration-250">
                  {featuredPost.title}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed font-clash text-wrap-pretty">
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
            
            {/* Right/Bottom Light Theme Visual Block */}
            <div className="lg:w-1/2 bg-[#F2F0EF] border-t lg:border-t-0 lg:border-l border-slate-300 p-8 md:p-12 flex flex-col justify-center relative overflow-hidden min-h-[300px]">
              <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 rounded-full bg-[#2EA37A]/10 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 rounded-full bg-[#2EA37A]/5 blur-3xl pointer-events-none" />
              
              <div className="border border-slate-300 rounded-2xl p-6 bg-white/70 backdrop-blur-md space-y-4 font-mono relative z-10 max-w-sm mx-auto shadow-sm w-full">
                <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-250 pb-2">
                  <span className="font-bold text-slate-800">ZK CIRCUIT COMPILATION</span>
                  <span className="text-emerald-700 font-bold">READY</span>
                </div>
                <div className="text-[10px] text-slate-800 space-y-1.5 font-mono overflow-x-auto">
                  <div className="text-slate-500 whitespace-nowrap">$ npx snarkjs groth16 setup circuits/kyc.r1cs ...</div>
                  <div className="text-emerald-700 font-semibold whitespace-nowrap">[info] generating proving key... done.</div>
                  <div className="text-emerald-700 font-semibold whitespace-nowrap">[info] verification key fields written.</div>
                  <div className="text-slate-400 mt-2">// commitment binding public inputs</div>
                  <div className="text-slate-700 whitespace-nowrap">Public inputs: <span className="text-[#2EA37A] font-semibold">[ 0x82f...3a9c ]</span></div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {filteredPosts
          .filter((post) => !post.featured || selectedCategory !== "All")
          .map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="bg-[#F4F3EF] border border-slate-300 rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-white/40 cursor-pointer group block"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#2EA37A] uppercase tracking-widest font-bold bg-[#2EA37A]/10 px-2 py-0.5 rounded">
                    {post.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{post.date}</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug line-clamp-2 font-instrument group-hover:text-[#2EA37A] transition-colors duration-250">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 font-clash">
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
            </Link>
          ))}
      </div>
    </div>
  );
}
