import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_POSTS } from "../posts";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    id: post.id,
  }));
}

// Renders the high-fidelity light theme visual mockup that matches the card design
function renderArticleVisual(id: string) {
  switch (id) {
    case "scaling-zk-proofs":
      return (
        <div className="w-full bg-[#F2F0EF] border border-slate-300 rounded-3xl p-8 md:p-12 flex flex-col justify-center items-center relative overflow-hidden min-h-[260px] mb-12 shadow-sm">
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 rounded-full bg-[#2EA37A]/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 rounded-full bg-[#2EA37A]/5 blur-3xl pointer-events-none" />
          
          <div className="border border-slate-300 rounded-2xl p-6 bg-white/70 backdrop-blur-md space-y-4 font-mono relative z-10 max-w-sm w-full shadow-sm">
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
      );
    case "zero-pii-future":
      return (
        <div className="w-full bg-[#F2F0EF] border border-slate-300 rounded-3xl p-8 md:p-12 flex flex-col justify-center items-center relative overflow-hidden min-h-[260px] mb-12 shadow-sm">
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
          <div className="border border-slate-300 rounded-2xl p-6 bg-white/70 backdrop-blur-md space-y-4 font-mono relative z-10 max-w-sm w-full shadow-sm">
            <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-250 pb-2">
              <span className="font-bold text-slate-800">ANONYMOUS COMMITMENT</span>
              <span className="text-blue-700 font-bold">SECURED</span>
            </div>
            <div className="text-[10px] text-slate-800 space-y-2 font-mono">
              <div className="flex justify-between"><span className="text-slate-450 font-bold uppercase tracking-wider text-[9px]">Identity Commit:</span> <span className="text-blue-700 font-semibold">0x2a9f...e18b</span></div>
              <div className="flex justify-between"><span className="text-slate-450 font-bold uppercase tracking-wider text-[9px]">Nullifier Hash:</span> <span className="text-blue-700 font-semibold">0x7c2d...8b39</span></div>
              <div className="flex justify-between"><span className="text-slate-450 font-bold uppercase tracking-wider text-[9px]">PII Storage:</span> <span className="text-rose-600 font-bold">EXCLUDED (ZERO PII)</span></div>
              <div className="text-slate-400 mt-2">// verified constraints</div>
              <div className="text-emerald-700 font-semibold flex items-center gap-1">✓ Assert: User Age &gt;= 18</div>
              <div className="text-emerald-700 font-semibold flex items-center gap-1">✓ Assert: Valid Issuance Authority</div>
            </div>
          </div>
        </div>
      );
    case "soroban-contracts-compliance":
      return (
        <div className="w-full bg-[#F2F0EF] border border-slate-300 rounded-3xl p-8 md:p-12 flex flex-col justify-center items-center relative overflow-hidden min-h-[260px] mb-12 shadow-sm">
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 rounded-full bg-[#2EA37A]/15 blur-3xl pointer-events-none" />
          <div className="border border-slate-300 rounded-2xl p-6 bg-white/70 backdrop-blur-md space-y-4 font-mono relative z-10 max-w-sm w-full shadow-sm">
            <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-250 pb-2">
              <span className="font-bold text-slate-800">SOROBAN STATE REGISTRY</span>
              <span className="text-emerald-700 font-bold">ACTIVE</span>
            </div>
            <div className="text-[10px] text-slate-800 space-y-2 font-mono">
              <div className="flex justify-between"><span className="text-slate-450 font-bold uppercase tracking-wider text-[9px]">Registry ID:</span> <span className="text-slate-900 font-semibold font-mono">CC5D...4A3F</span></div>
              <div className="flex justify-between"><span className="text-slate-450 font-bold uppercase tracking-wider text-[9px]">SBT Contract:</span> <span className="text-slate-900 font-semibold font-mono">SBT8...77DE</span></div>
              <div className="flex justify-between"><span className="text-slate-450 font-bold uppercase tracking-wider text-[9px]">Registered Users:</span> <span className="text-slate-900 font-bold">1,842 Wallets</span></div>
              <div className="text-slate-400 mt-2">// contract events</div>
              <div className="text-emerald-700 font-semibold flex items-center gap-1">[event] Minting compliance SBT to user...</div>
              <div className="text-emerald-700 font-semibold flex items-center gap-1">[event] Verification completed successfully</div>
            </div>
          </div>
        </div>
      );
    case "freighter-zk-integration":
      return (
        <div className="w-full bg-[#F2F0EF] border border-slate-300 rounded-3xl p-8 md:p-12 flex flex-col justify-center items-center relative overflow-hidden min-h-[260px] mb-12 shadow-sm">
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
          <div className="border border-slate-300 rounded-2xl p-6 bg-white/70 backdrop-blur-md space-y-4 font-mono relative z-10 max-w-sm w-full shadow-sm">
            <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-250 pb-2">
              <span className="font-bold text-slate-800">FREIGHTER BINDING</span>
              <span className="text-sky-700 font-bold">READY</span>
            </div>
            <div className="text-[10px] text-slate-800 space-y-2 font-mono">
              <div className="text-slate-500 whitespace-nowrap">const signature = await signAuthEntry(entry);</div>
              <div className="text-slate-555 whitespace-nowrap">const witness = generateWitness(signature);</div>
              <div className="text-slate-400 mt-2">// private commitments</div>
              <div className="text-sky-750 font-semibold">User Address reduced to field element:</div>
              <div className="text-slate-900 font-bold bg-slate-100 p-2 rounded font-mono text-[9px] break-all">
                19827384910283748291038472910382918...
              </div>
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { id } = await params;
  const post = BLOG_POSTS.find((p) => p.id === id);

  if (!post) {
    notFound();
  }

  // Find other posts to suggest at the bottom (up to 2 suggestions)
  const suggestions = BLOG_POSTS.filter((p) => p.id !== id).slice(0, 2);

  return (
    <article className="min-h-screen bg-[#F2F0EF] text-slate-800 font-clash pb-24 w-full">
      {/* Top Floating Sticky Header for Navigation */}
      <div className="sticky top-0 bg-[#F2F0EF]/80 backdrop-blur-md border-b border-slate-300/40 z-30 w-full">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link 
            href="/blog" 
            className="text-xs font-mono font-bold tracking-wider text-slate-600 hover:text-black flex items-center gap-1.5 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            BACK TO JOURNAL
          </Link>
          <span className="text-[10px] font-mono text-[#2EA37A] uppercase tracking-widest font-bold bg-[#2EA37A]/10 px-2 py-0.5 rounded">
            {post.category}
          </span>
        </div>
      </div>

      {/* Main Column */}
      <div className="max-w-3xl mx-auto px-4 pt-12 sm:pt-16">
        
        {/* Category & Metadata */}
        <div className="space-y-4 mb-8">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight font-instrument text-wrap-balance">
            {post.title}
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed font-clash text-wrap-pretty">
            {post.description}
          </p>
        </div>

        {/* Author details card */}
        <div className="flex items-center justify-between py-6 border-y border-slate-300 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2EA37A] text-white flex items-center justify-center font-bold text-sm font-mono shadow-sm">
              {post.author.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">{post.author}</div>
              <div className="text-xs text-slate-500 font-mono flex items-center gap-2">
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
          
          {/* Share/External Link Trigger */}
          <div className="flex items-center gap-2">
            <button className="p-2 border border-slate-300 rounded-full hover:bg-slate-50 text-slate-500 hover:text-black transition cursor-pointer" title="Share Article">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m-6 3.75 3 3m0 0 3-3m-3 3V1.5" />
              </svg>
            </button>
          </div>
        </div>

        {/* Medium-Style Rendered Visual Mockup */}
        {renderArticleVisual(post.id)}

        {/* Article Body Content */}
        <div className="prose prose-slate max-w-none text-slate-850 leading-relaxed font-clash space-y-8 text-base">
          {post.content.split(/\n\s*\n/).map((paragraph, index) => {
            const trimmed = paragraph.trim();
            if (!trimmed) return null;

            // Header Section Formatting
            if (trimmed.startsWith("###")) {
              return (
                <h3 key={index} className="text-xl sm:text-2xl font-bold text-slate-950 pt-6 border-t border-slate-300/40 font-instrument">
                  {trimmed.replace("###", "").trim()}
                </h3>
              );
            }

            // Blockquote Formatting
            if (trimmed.startsWith(">")) {
              return (
                <blockquote key={index} className="pl-6 border-l-4 border-[#2EA37A] text-lg italic text-slate-700 bg-white/30 py-4 pr-4 rounded-r-xl">
                  {trimmed.replace(">", "").trim()}
                </blockquote>
              );
            }

            // Code Block Formatting
            if (trimmed.includes("```") || trimmed.startsWith("`") || trimmed.includes("$ npx")) {
              return (
                <pre key={index} className="bg-slate-900 text-emerald-400 p-6 rounded-2xl font-mono text-xs overflow-x-auto shadow-inner border border-white/5 space-y-1">
                  <code>{trimmed.replace(/```/g, "").trim()}</code>
                </pre>
              );
            }

            // Normal paragraphs
            return (
              <p key={index} className="text-wrap-pretty text-slate-700 leading-8">
                {trimmed}
              </p>
            );
          })}
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-slate-300 my-16" />

        {/* Next Read Suggestions */}
        <div className="space-y-8">
          <h4 className="text-xs font-mono font-bold tracking-widest text-[#2EA37A] uppercase">
            Recommended Reads
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suggestions.map((sug) => (
              <Link 
                key={sug.id}
                href={`/blog/${sug.id}`}
                className="bg-white/40 border border-slate-300 rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 font-bold uppercase">
                    <span>{sug.category}</span>
                    <span>{sug.readTime}</span>
                  </div>
                  <h5 className="text-base font-bold text-slate-900 font-instrument group-hover:text-[#2EA37A] transition-colors leading-snug">
                    {sug.title}
                  </h5>
                </div>
                <div className="text-xs font-mono text-slate-400 mt-4 pt-3 border-t border-slate-200/60">
                  {sug.date}
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </article>
  );
}
