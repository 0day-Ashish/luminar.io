"use client";

import React, { useState } from "react";

interface KYCFormProps {
  onSuccess: (data: {
    name_hash: string;
    id_hash: string;
    secret: string;
    dob_timestamp: number;
    doc_type: string;
    oracle_signature: string;
    min_age_secs: number;
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
        oracle_signature: result.oracle_signature,
        min_age_secs: MIN_AGE_SECS,
      });
    } catch (err: any) {
      console.error("KYC Form Error:", err);
      setError(err.message || "Something went wrong. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
        className="w-full py-2.5 bg-luminar hover:bg-[#258262] text-white text-sm font-bold rounded-lg transition duration-200 shadow-sm cursor-pointer disabled:opacity-50"
      >
        {loading ? "Submitting to Oracle..." : "Submit KYC Request"}
      </button>
    </form>
  );
}
