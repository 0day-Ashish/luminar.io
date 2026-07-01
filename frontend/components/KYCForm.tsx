"use client";

import React, { useState } from "react";

interface KYCFormProps {
  onSuccess: (data: {
    name_hash: string;
    id_hash: string;
    secret: string;
    dob_timestamp: number;
    doc_type: string;
    min_age_secs: number;
    oracle1_sig?: string;
    oracle2_sig?: string;
    oracle3_sig?: string;
  }) => void;
}

export default function KYCForm({ onSuccess }: KYCFormProps) {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [country, setCountry] = useState("India");
  const [docType, setDocType] = useState("pan");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const oracleUrl = process.env.NEXT_PUBLIC_ORACLE_URL || "http://localhost:3001";

    try {
      const response = await fetch(`${oracleUrl}/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          dob,
          id_number: idNumber,
          country,
          doc_type: docType,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Verification failed");
      }

      // Default minimum age is 18 years in seconds (567,648,000)
      const MIN_AGE_SECS = 567648000;

      onSuccess({
        name_hash: result.name_hash,
        id_hash: result.id_hash,
        secret: result.secret,
        dob_timestamp: result.dob_timestamp,
        doc_type: result.doc_type,
        oracle1_sig: result.oracle1_sig,
        oracle2_sig: result.oracle2_sig,
        oracle3_sig: result.oracle3_sig,
        min_age_secs: MIN_AGE_SECS,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please check your inputs.";
      console.error("KYC Form Error:", err);
      setError(message);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white border border-slate-300 rounded-2xl space-y-4 max-w-md w-full text-slate-800 shadow-sm"
      >
        <div className="border-b border-slate-100 pb-3 mb-2">
          <h3 className="text-lg font-bold text-slate-900 font-instrument">Secure Identity Verification</h3>
          <p className="text-xs text-slate-500 mt-1">
            Provide your information to get a signed commitment from the oracle.
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs px-3.5 py-2.5 rounded-lg font-medium leading-relaxed">
            ⚠️ {error}
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-luminar focus:ring-1 focus:ring-luminar text-sm font-clash"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              required
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-luminar focus:ring-1 focus:ring-luminar text-sm font-clash"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Country
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-luminar focus:ring-1 focus:ring-luminar text-sm font-clash"
              >
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Document Type
              </label>
              <select
                value={docType}
                onChange={(e) => {
                  setDocType(e.target.value);
                  setIdNumber("");
                }}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-luminar focus:ring-1 focus:ring-luminar text-sm font-clash"
              >
                <option value="pan">PAN Card</option>
                <option value="aadhaar">Aadhaar</option>
                <option value="passport">Passport</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Document Number
            </label>
            <input
              type="text"
              required
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              placeholder={
                docType === "pan"
                  ? "ABCDE1234F"
                  : docType === "aadhaar"
                  ? "123456789012"
                  : "A1234567"
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-luminar focus:ring-1 focus:ring-luminar text-sm font-clash"
            />
            <p className="text-[10px] text-slate-400 mt-1 font-mono">
              {docType === "pan" && "Format: 5 letters + 4 digits + 1 letter"}
              {docType === "aadhaar" && "Format: 12 digits"}
              {docType === "passport" && "Format: 1 letter + 7 digits"}
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-luminar hover:bg-[#258262] text-white text-sm font-bold rounded-lg transition duration-200 shadow-sm cursor-pointer disabled:opacity-50 animate-fade-in"
        >
          {loading ? "Submitting to Oracle..." : "Submit KYC Request"}
        </button>
      </form>

      {/* Error Modal */}
      {showErrorModal && error && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setShowErrorModal(false)}
          />
          {/* Modal Box */}
          <div className="bg-[#F2F0EF] border border-slate-300 rounded-3xl p-6 md:p-8 max-w-md w-full relative z-10 shadow-[0_20px_50px_rgba(0,0,0,0.15)] transform transition-all duration-300 scale-100 flex flex-col items-center text-center space-y-6">
            {/* Badge Icon */}
            <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 text-2xl font-bold animate-pulse">
              ⚠️
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 font-instrument">
                Verification Failed
              </h3>
              <p className="text-slate-500 text-xs font-semibold bg-rose-50/50 border border-rose-200/60 px-3 py-2 rounded-xl mt-1 max-w-full text-rose-700 font-mono">
                {error}
              </p>
            </div>

            <div className="space-y-4 text-xs text-slate-650 leading-relaxed font-clash text-left w-full">
              <p className="font-semibold text-slate-800">Possible issues & solutions:</p>
              <ul className="list-disc pl-5 space-y-2">
                {error.toLowerCase().includes("pan verification failed") || error.toLowerCase().includes("invalid pan") ? (
                  <>
                    <li>
                      <span className="font-bold text-slate-800">Mock Data Requirements:</span> Since you are utilizing the Surepass Sandbox environment, verify that you are testing with whitelisted mock identifiers (e.g. <code className="bg-slate-200/60 px-1 py-0.5 rounded text-[10px] font-mono">ABCDE1234I</code>).
                    </li>
                    <li>
                      <span className="font-bold text-slate-800">Character Typo:</span> Double-check the document number format. PAN cards must exactly follow: 5 uppercase letters, 4 numeric digits, and 1 uppercase letter.
                    </li>
                  </>
                ) : error.toLowerCase().includes("fetch") || error.toLowerCase().includes("connect") || error.toLowerCase().includes("network") ? (
                  <>
                    <li>
                      <span className="font-bold text-slate-800">Oracle Server Down:</span> The local Oracle backend server is not responding. Please launch it by running <code className="bg-slate-200/60 px-1 py-0.5 rounded text-[10px] font-mono">npm run dev</code> in the <code className="bg-slate-200/60 px-1 py-0.5 rounded text-[10px] font-mono">oracle</code> directory.
                    </li>
                    <li>
                      <span className="font-bold text-slate-800">CORS or Network Block:</span> Make sure no firewall or proxy is blocking communication with port <code className="bg-slate-200/60 px-1 py-0.5 rounded text-[10px] font-mono">3001</code>.
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <span className="font-bold text-slate-800">Formatting Match:</span> Verify that your Name and DOB format matches the expected values (Name in uppercase, DOB in YYYY-MM-DD format).
                    </li>
                    <li>
                      <span className="font-bold text-slate-800">Server Configuration:</span> The server might be missing environment configuration variables (e.g. `SUREPASS_TOKEN` or `ORACLE_SECRET_KEY`).
                    </li>
                  </>
                )}
              </ul>
            </div>

            <button
              onClick={() => setShowErrorModal(false)}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-full shadow-sm transition duration-200 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </>
  );
}
