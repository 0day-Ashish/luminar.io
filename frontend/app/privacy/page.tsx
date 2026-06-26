import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
  description: "Learn about how Luminar handles privacy. We prioritize client-side zero-knowledge proof generation to keep personal identity documents entirely private.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 md:py-24 text-slate-800 font-clash">
      {/* Title & Header */}
      <div className="border-b border-slate-300 pb-10 mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 font-instrument mb-4">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-550">
          Last updated: 22 May 2026
        </p>
      </div>

      {/* Introduction */}
      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider text-[11px] font-mono">
            Introduction
          </h2>
          <p className="text-base leading-relaxed text-slate-650">
            This Privacy Policy sets out how Luminar uses and protects your personal data.
          </p>
        </section>

        {/* Section 1 */}
        <section className="space-y-6 pt-6 border-t border-slate-300">
          <div className="flex items-start gap-4">
            <span className="text-lg font-bold text-slate-900 leading-none">1.</span>
            <div className="space-y-4 flex-grow">
              <h3 className="text-lg font-bold text-slate-900">
                Important information and who we are
              </h3>
              
              <div className="space-y-4 text-slate-650 leading-relaxed text-sm">
                <h4 className="font-bold text-slate-900">Privacy Policy</h4>
                <p>
                  This Privacy Policy gives you information about how Luminar Ltd collects and uses your personal data through your use of our:
                </p>
                
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    website at{" "}
                    <Link href="/" className="text-slate-900 underline hover:text-slate-750 transition">
                      luminar.io
                    </Link>{" "}
                    (&quot;Website&quot;)
                  </li>
                  <li>
                    platform at{" "}
                    <a href="https://app.luminar.io" className="text-slate-900 underline hover:text-slate-750 transition">
                      app.luminar.io
                    </a>{" "}
                    (&quot;Platform&quot;)
                  </li>
                </ul>

                <p>
                  The Platform is not intended for children and we do not knowingly collect data relating to children.
                </p>

                <h4 className="font-bold text-slate-900 mt-6">Luminar is the controller</h4>
                <p>
                  Luminar Ltd is the controller and responsible for your personal data (collectively referred to as &quot;Luminar&quot;, &quot;we&quot;, &quot;us&quot; or &quot;our&quot; in this Privacy Policy).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-6 pt-8 border-t border-slate-300">
          <div className="flex items-start gap-4">
            <span className="text-lg font-bold text-slate-900 leading-none">2.</span>
            <div className="space-y-4 flex-grow">
              <h3 className="text-lg font-bold text-slate-900">
                The types of personal data we collect about you
              </h3>
              
              <div className="space-y-4 text-slate-650 leading-relaxed text-sm">
                <p>
                  Personal data means any information about an individual from which that person can be identified.
                </p>
                <p>
                  We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                </p>
                
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Identity &amp; Wallet Data:</strong> includes your Stellar public key (wallet address), which is used to verify compliance on the ledger.
                  </li>
                  <li>
                    <strong>ZK Proof Metadata:</strong> cryptographic proof files that verify compliance rules locally (e.g. proof of age, residency, and accreditation status) without storing the underlying personal data on our servers.
                  </li>
                  <li>
                    <strong>Contact Data:</strong> includes email address or contact info provided when pre-registering or contacting support.
                  </li>
                  <li>
                    <strong>Technical Data:</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this Website.
                  </li>
                </ul>

                <h4 className="font-bold text-slate-900 mt-6">Zero-Knowledge Guarantee</h4>
                <p>
                  Luminar does not store your government ID, biometric data, or identity documents. Verification happens locally or via approved zero-knowledge anchors; we only process and record the cryptographic proof of compliance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-6 pt-8 border-t border-slate-300">
          <div className="flex items-start gap-4">
            <span className="text-lg font-bold text-slate-900 leading-none">3.</span>
            <div className="space-y-4 flex-grow">
              <h3 className="text-lg font-bold text-slate-900">
                How we use your personal data
              </h3>
              
              <div className="space-y-4 text-slate-650 leading-relaxed text-sm">
                <p>
                  We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>To provide, operate, and maintain our platform compliance verification services.</li>
                  <li>To register and authenticate your wallet address on the Stellar ledger.</li>
                  <li>To verify KYC/AML requirements via zero-knowledge proofs.</li>
                  <li>To answer your support queries and notify you about service changes.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-6 pt-8 border-t border-slate-300">
          <div className="flex items-start gap-4">
            <span className="text-lg font-bold text-slate-900 leading-none">4.</span>
            <div className="space-y-4 flex-grow">
              <h3 className="text-lg font-bold text-slate-900">
                Contact details
              </h3>
              
              <div className="space-y-4 text-slate-650 leading-relaxed text-sm">
                <p>
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                </p>
                <p className="font-mono text-slate-900 bg-slate-100/50 p-4 rounded-xl border border-slate-300 inline-block">
                  Email: privacy@luminar.io
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
