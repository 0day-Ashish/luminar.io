export interface KnowledgeChunk {
  id: string;
  title: string;
  category: string;
  content: string;
}

export const KNOWLEDGE_BASE: KnowledgeChunk[] = [
  {
    id: "overview",
    title: "Luminar System Overview & Architecture",
    category: "general",
    content: "Luminar is a premium, decentralized zero-knowledge (ZK) identity verification and KYC registry system built on the Stellar Soroban smart contract network. It allows users to prove identity constraints (like 'is over 18 years old') on-chain using client-side zero-knowledge proofs (Noir/UltraHonk) without disclosing personal identifiable information (PII) like name, ID number, or exact date of birth. Upon successful validation on-chain, a Soulbound Compliance Token (LSBT) is minted directly to the user's wallet."
  },
  {
    id: "how-to-use",
    title: "How to Use the Luminar Platform",
    category: "usage",
    content: "Using Luminar involves a simple, privacy-preserving flow: 1. Connect your Stellar wallet (using Freighter, Albedo, Rovo, LOBSTR, or xBull extension via the Stellar Wallets Kit); 2. Fill out the KYC verification form (using Aadhaar, PAN, or Passport credentials); 3. The platform requests attestation signatures from three independent identity verification oracles; 4. Your browser locally generates a zero-knowledge cryptographic proof validating your compliance (such as 'Over 18' or 'residency matches country constraints') without sending PII anywhere; 5. Submit the proof to the Soroban contract which verifies it on-chain and issues you a non-transferable Soulbound Compliance Token (LSBT)."
  },
  {
    id: "zk-circuits",
    title: "Zero-Knowledge Circuit (Noir & UltraHonk) Mechanics",
    category: "cryptography",
    content: "Luminar uses Aztec's Noir programming language and the UltraHonk proving system. In the browser, Noir JS and @aztec/bb.js run inside WebAssembly (WASM) to generate client-side ZK-SNARK proofs. The main circuit verifies that: 1. The commitment matches Poseidon2(name_hash, id_hash, dob_timestamp, secret); 2. The user is older than the min_age_secs threshold; 3. The nullifier matches Poseidon2(secret, stellar_address); 4. At least 2 out of the 3 oracle signatures are valid under Secp256k1 coordinates."
  },
  {
    id: "multi-oracle",
    title: "Multi-Oracle 2-of-3 Threshold Consensus",
    category: "oracle",
    content: "To prevent a single oracle from being a point of failure or issuing fraudulent assertions, Luminar features a decentralized 2-of-3 multi-oracle threshold system. When you request a verification, three independent oracles validate your details and sign the payload. The ZK circuit checks these signatures in the browser. As long as at least two of the oracles provide cryptographically valid signatures, the proof generation succeeds and the user is verified."
  },
  {
    id: "sybil-nullifier",
    title: "Sybil Resistance and Poseidon2 Nullifiers",
    category: "security",
    content: "Sybil attacks are prevented via poseidon2-based nullifiers. A user generates a unique nullifier hash on the client side: Poseidon2(secret, stellar_address). If a user tries to register multiple accounts using the same document, the system will generate the identical nullifier hash on-chain. The Soroban smart contract will reject the transaction because that nullifier has already been recorded in the registry ledger, thereby preventing double registration."
  },
  {
    id: "smart-contracts",
    title: "Soroban Smart Contracts & LSBT",
    category: "contracts",
    content: "Luminar's on-chain layer is written in Rust for Soroban smart contracts. It consists of: 1. Main KYC Registry Contract: coordinates registrations, stores commitment hashes, prevents nullifier reuse, and validates ZK proofs by calling the Verifier contract; 2. SBT Token Contract (LSBT): mints a non-transferable, soulbound compliance token to the user's address upon registration. If registration is revoked, the admin burns the token; 3. Verifier Contract: verifies the mathematical soundness of the ZK proof submitted by the frontend."
  }
];

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "if", "then", "else", "when", "how", "what", "who", "why", "where",
  "is", "are", "was", "were", "be", "been", "being", "to", "of", "in", "on", "at", "by", "for", "with", "about",
  "against", "between", "into", "through", "during", "before", "after", "above", "below", "from", "up",
  "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there",
  "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only",
  "own", "same", "so", "than", "too", "very", "can", "will", "just", "should", "now", "does", "do", "did"
]);

export function retrieveRelevantChunks(query: string, count: number = 3): KnowledgeChunk[] {
  if (!query) return KNOWLEDGE_BASE.slice(0, count);

  // Tokenize and clean query
  const tokens = query
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(t => t.length > 1 && !STOP_WORDS.has(t));

  if (tokens.length === 0) {
    return KNOWLEDGE_BASE.slice(0, count);
  }

  interface ScoredChunk {
    chunk: KnowledgeChunk;
    score: number;
  }

  const scoredChunks: ScoredChunk[] = KNOWLEDGE_BASE.map(chunk => {
    let score = 0;
    const titleLower = chunk.title.toLowerCase();
    const contentLower = chunk.content.toLowerCase();
    const categoryLower = chunk.category.toLowerCase();

    for (const token of tokens) {
      // Direct token match in title (high weight)
      if (titleLower.includes(token)) {
        score += 8;
        // Exact boundary match weight boost
        const regex = new RegExp(`\\b${token}\\b`);
        if (regex.test(titleLower)) score += 4;
      }

      // Direct token match in content
      if (contentLower.includes(token)) {
        score += 3;
        const regex = new RegExp(`\\b${token}\\b`);
        if (regex.test(contentLower)) score += 2;
      }

      // Match in category
      if (categoryLower.includes(token)) {
        score += 4;
      }
    }

    return { chunk, score };
  });

  // Sort by score descending
  const sorted = scoredChunks
    .filter(sc => sc.score > 0)
    .sort((a, b) => b.score - a.score);

  // If no chunks match, return default overview and a couple other chunks
  if (sorted.length === 0) {
    return KNOWLEDGE_BASE.slice(0, count);
  }

  return sorted.map(sc => sc.chunk).slice(0, count);
}
