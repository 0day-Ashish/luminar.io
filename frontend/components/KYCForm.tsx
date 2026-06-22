"use client";

import React from "react";

export default function KYCForm() {
  return (
    <form className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4 max-w-md w-full">
      <h3 className="text-xl font-bold text-white">KYC Verification</h3>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Full Name
        </label>
        <input
          type="text"
          placeholder="John Doe"
          className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-luminar"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Government ID / Document Type
        </label>
        <select className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-luminar">
          <option>Passport</option>
          <option>National ID Card</option>
          <option>Driver's License</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full py-2 bg-luminar hover:bg-opacity-95 text-white font-medium rounded-lg transition duration-200"
      >
        Submit KYC Request
      </button>
    </form>
  );
}
