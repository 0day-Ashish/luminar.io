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
      circle: "bg-slate-800 border-slate-700 text-slate-500",
      title: "text-slate-500",
      description: "text-slate-600",
    },
    current: {
      circle: "bg-luminar/10 border-luminar text-luminar ring-4 ring-luminar/20",
      title: "text-white font-semibold",
      description: "text-slate-300",
    },
    completed: {
      circle: "bg-luminar border-luminar text-black font-bold",
      title: "text-slate-300",
      description: "text-slate-400",
    },
  };

  const currentStyles = statusStyles[status];

  return (
    <div className="flex items-start space-x-4 p-4 border border-slate-800/50 rounded-xl bg-slate-900/30">
      <div
        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all duration-300 ${currentStyles.circle}`}
      >
        {status === "completed" ? "✓" : stepNumber}
      </div>
      <div>
        <h4 className={`text-base font-medium ${currentStyles.title}`}>{title}</h4>
        <p className={`text-sm mt-1 ${currentStyles.description}`}>{description}</p>
      </div>
    </div>
  );
}
