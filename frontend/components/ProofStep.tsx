"use client";

import React from "react";

interface ProofStepProps {
  stepNumber: number;
  title: string;
  description: string;
  status: "pending" | "current" | "completed";
}

export default function ProofStep({
  stepNumber,
  title,
  description,
  status,
}: ProofStepProps) {
  const statusStyles = {
    pending: {
      container: "bg-white/40 border border-slate-200 opacity-60",
      circle: "bg-slate-100 border-slate-200 text-slate-400",
      title: "text-slate-400 font-medium",
      description: "text-slate-400",
    },
    current: {
      container: "bg-white border-2 border-luminar shadow-[0_8px_30px_rgba(46,163,122,0.12)] scale-[1.01]",
      circle: "bg-luminar border-luminar text-white font-bold ring-4 ring-luminar/20",
      title: "text-slate-900 font-bold",
      description: "text-slate-600",
    },
    completed: {
      container: "bg-white/80 border border-slate-300 shadow-sm",
      circle: "bg-emerald-500 border-emerald-500 text-white font-bold",
      title: "text-slate-800 font-semibold",
      description: "text-slate-500",
    },
  };

  const currentStyles = statusStyles[status];

  return (
    <div className={`flex items-start space-x-4 p-5 rounded-2xl transition-all duration-300 ${currentStyles.container}`}>
      <div
        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all duration-300 shrink-0 ${currentStyles.circle}`}
      >
        {status === "completed" ? "✓" : stepNumber}
      </div>
      <div>
        <h4 className={`text-base font-zodiak transition-all duration-300 ${currentStyles.title}`}>{title}</h4>
        <p className={`text-sm mt-1 font-zodiak transition-all duration-300 ${currentStyles.description}`}>{description}</p>
      </div>
    </div>
  );
}
