export interface BlogPost {
  id: string;
  title: string;
  category: "Engineering" | "Privacy" | "Compliance";
  description: string;
  date: string;
  author: string;
  readTime: string;
  featured?: boolean;
  content: string; // Detailed content for the dynamic reader
  coverImage?: string; // Optional custom cover image path
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "scaling-zk-proofs",
    title: "Scaling Zero-Knowledge Proofs on the Stellar Ledger",
    category: "Engineering",
    description: "How we optimize zk-SNARK verifiers in Soroban smart contracts to enable instant compliance verification with minimal gas consumption.",
    date: "June 24, 2026",
    author: "Ashish",
    readTime: "6 min read",
    featured: true,
    coverImage: "/assets/hero.png",
    content: `
      Zero-Knowledge cryptography is transitioning from a theoretical privacy tool to a vital scaling mechanism for decentralized finance. On the Stellar network, the integration of the Soroban smart contract platform offers a highly optimized WebAssembly environment, but executing ZK verifiers (such as Aztec’s UltraHonk) directly on-chain can still be computationally intensive. 
      
      In this article, we outline our optimization strategies: reducing the verifier payload size, utilizing Poseidon2 hashing to minimize circuit constraints, and modularly reducing public keys to fit BN254 fields. These techniques combined bring the Soroban verification gas cost down by 40%, enabling frictionless on-chain identity verification.
      
      ### The Gas Cost Challenge
      Soroban contracts run inside a WASM virtual machine, which charges CPU instructions and memory access fees. For complex cryptographic tasks like pairing checks and scalar multiplication, standard naive implementations quickly hit the ledger limits. By tailoring our Noir verifier contract specifically to the native Soroban host functions, we bypass intermediate allocations, keeping verification execution times well under the block limit.
      
      ### Future Roadmap
      In the next version, we plan to implement recursive proofs, aggregating multiple user verifications into a single proof submission, reducing the marginal on-chain verification cost to near-zero.
    `
  },
  {
    id: "zero-pii-future",
    title: "Why Zero PII Storage is the Future of KYC",
    category: "Privacy",
    description: "Exploring the regulatory shift from data accumulation to zero-knowledge verification and how it protects both users and developers.",
    date: "June 18, 2026",
    author: "Elena Rostova",
    readTime: "5 min read",
    coverImage: "/assets/features.jpg",
    content: `
      Traditional financial infrastructure relies on centralized databases storing immense amounts of Personally Identifiable Information (PII) — names, addresses, passport numbers, and social security details. These databases represent prime targets for malicious actors. 
      
      Luminar introduces a paradigm shift: Zero PII storage. By generating cryptographic commitments and nullifiers on the client side, we prove compliance parameters (such as 'user is over 18' or 'user is from an accredited jurisdiction') without writing a single letter of PII to the blockchain. This eliminates data leakage risks and protects both users and developers from security liabilities.
      
      ### Regulatory Compliance
      Regulators are beginning to realize that data hoarding is a liability. Under frameworks like GDPR and CCPA, platforms that do not hold raw user data are subject to fewer compliance hurdles. Luminar gives protocols the best of both worlds: strict, mathematically provable KYC status without the baggage of custodial data storage.
    `
  },
  {
    id: "soroban-contracts-compliance",
    title: "Soroban Smart Contracts: A New Era for Stellar Compliance",
    category: "Compliance",
    description: "An in-depth look at how Stellar's native smart contract platform enables robust, decentralized identity validation systems.",
    date: "June 10, 2026",
    author: "Marcus Vance",
    readTime: "8 min read",
    coverImage: "/assets/credential-card.jpg",
    content: `
      Stellar's Soroban smart contract platform represents a milestone for on-chain identity logic. With native support for cryptographic signatures, structured state storage, and efficient host functions, Soroban is uniquely positioned to handle complex verification states. 
      
      We explore how Soroban contracts handle registry states, how we bind compliance status directly to non-transferable Soulbound Tokens (SBTs), and the mechanics of contract-level revocations that execute in milliseconds. This architecture makes it simple for third-party Stellar DApps to query compliance state with a single, gas-efficient on-chain function call.
      
      ### Custom SBT Minting
      Luminar's registry automatically interfaces with the Luminar Soulbound Token (LSBT). When a user successfully presents a valid ZK proof to the registry, the registry invokes the SBT contract's mint function. The token is tied permanently to the wallet, serving as an on-chain verification badge that other smart contracts can read instantly.
    `
  },
  {
    id: "freighter-zk-integration",
    title: "Under the Hood: Integrating Freighter Wallet with ZK Circuits",
    category: "Engineering",
    description: "A developer walkthrough of binding private keys to anonymous zero-knowledge commitments using the Freighter browser API.",
    date: "May 29, 2026",
    author: "Ashish",
    readTime: "10 min read",
    coverImage: "/assets/team.JPG",
    content: `
      Integrating browser-based wallets with zero-knowledge circuits requires bridging two distinct cryptographic environments. In this developer guide, we walk through how Luminar utilizes the Freighter Wallet browser API to obtain a secure signature, which is then used as a private seed within the client-side Noir circuit.
      
      This seed generates the Poseidon2 nullifier and user commitments. We detail the mechanics of Freighter's API calls, the modular conversion of Ed25519 public keys to BN254 field elements, and how to verify that the generated ZK witness matches the user's connected wallet address without revealing it.
      
      ### Cryptographic Bridge
      Stellar uses Ed25519 public keys, which do not map natively to the BN254 curves used by Aztec's UltraHonk verifiers. To bridge this, we implement a modular reduction technique on the client, transforming the wallet public key into a valid field element inside the circuit, ensuring secure linkage without sacrificing cryptographic integrity.
    `
  },
];
