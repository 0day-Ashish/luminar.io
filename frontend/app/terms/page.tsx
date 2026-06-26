import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 md:py-24 text-slate-800 font-clash">
      {/* Title & Header */}
      <div className="border-b border-slate-300 pb-10 mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 font-instrument mb-4">
          Platform Terms of Service
        </h1>
        <p className="text-sm text-slate-550">
          Last updated: 1 March 2026
        </p>
      </div>

      {/* Terms Body */}
      <div className="space-y-10">
        
        {/* Clause 1: Interpretation */}
        <section className="space-y-6">
          <div className="flex items-start gap-4">
            <span className="text-lg font-bold text-slate-900 leading-none">1.</span>
            <div className="space-y-6 flex-grow">
              <h3 className="text-lg font-bold text-slate-900 leading-none">
                Interpretation
              </h3>
              
              <div className="space-y-4 text-slate-650 leading-relaxed text-sm">
                <div className="flex items-start gap-3">
                  <span className="font-bold text-slate-900 shrink-0">1.1.</span>
                  <p>
                    The definitions and rules of interpretation in this clause 1 copy in this Agreement.
                  </p>
                </div>

                {/* Definitions List */}
                <div className="space-y-4 pl-6 pt-2">
                  <p>
                    <strong className="text-slate-900">Agreement:</strong> the Order Form and these Terms.
                  </p>
                  
                  <p>
                    <strong className="text-slate-900">Business Day:</strong> a day, other than a Saturday, Sunday or public holiday in England when banks in London are open for business.
                  </p>
                  
                  <p>
                    <strong className="text-slate-900">Customer Data:</strong> any information that is provided by or on behalf of the Customer to Luminar as part of the Customer&apos;s use of the Platform (such as inputs to the Dashboard).
                  </p>
                  
                  <p>
                    <strong className="text-slate-900">Dashboard:</strong> the online software application provided by Luminar as part of the Platform and available via{" "}
                    <a href="https://app.luminar.io" className="text-slate-900 underline hover:text-slate-750 transition">
                      app.luminar.io
                    </a>.
                  </p>
                  
                  <p>
                    <strong className="text-slate-900">Effective Date:</strong> the effective date specified in the Order Form.
                  </p>
                  
                  <p>
                    <strong className="text-slate-900">Extended Term:</strong> has the meaning given in 11.1.
                  </p>
                  
                  <p>
                    <strong className="text-slate-900">Fair Use Policy:</strong> any use of the Platform by the Customer that Luminar believes (acting reasonably and in good faith) to be excessive or is, or could, materially affect(ing) its ability to service its other customers.
                  </p>
                  
                  <p>
                    <strong className="text-slate-900">Feedback:</strong> any feedback or suggestions provided by the Customer during the Term in relation to the Platform.
                  </p>
                  
                  <p>
                    <strong className="text-slate-900">Fees:</strong> the fees payable to Luminar, as specified in the Order Form.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Clause 2: Use of the Platform */}
        <section className="space-y-6 pt-8 border-t border-slate-300">
          <div className="flex items-start gap-4">
            <span className="text-lg font-bold text-slate-900 leading-none">2.</span>
            <div className="space-y-6 flex-grow">
              <h3 className="text-lg font-bold text-slate-900 leading-none">
                Use of the Platform
              </h3>
              
              <div className="space-y-4 text-slate-650 leading-relaxed text-sm">
                <div className="flex items-start gap-3">
                  <span className="font-bold text-slate-900 shrink-0">2.1.</span>
                  <p>
                    Luminar grants the Customer a non-exclusive, non-transferable, revocable right to access and use the Platform during the Term solely for the Customer&apos;s internal business operations.
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="font-bold text-slate-900 shrink-0">2.2.</span>
                  <p>
                    The Customer shall not access, store, distribute or transmit any Viruses, or any material during the course of its use of the Platform that is unlawful, harmful, or infringes intellectual property rights.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
      </div>
    </div>
  );
}
