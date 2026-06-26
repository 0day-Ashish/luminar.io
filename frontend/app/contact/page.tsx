"use client";

import React, { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSuccess(true);
        setFormData({
          name: "",
          email: "",
          subject: "General Inquiry",
          message: "",
        });
      } else {
        alert(data.error || "Failed to submit message. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An unexpected error occurred. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-slate-800 font-clash">
      {/* Page Header */}
      <div className="max-w-3xl mb-16 space-y-4">
        <span className="text-xs font-bold text-[#2EA37A] uppercase tracking-wider bg-[#2EA37A]/10 px-3 py-1 rounded-full">
          Contact Us
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight font-instrument">
          Get in touch with <span className="font-instrument italic">Us</span>.
        </h1>
        <p className="text-base text-slate-600 max-w-xl">
          Have questions about zero-knowledge integrations, smart contracts, or auditing compliance requirements on Stellar? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Form Section (Left) */}
        <div className="lg:col-span-7 bg-[#F4F3EF] border border-slate-300 rounded-3xl p-8 md:p-10 shadow-sm relative overflow-hidden">
          {isSuccess ? (
            <div className="py-12 text-center space-y-6 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#2EA37A]/10 flex items-center justify-center text-[#2EA37A] animate-bounce">
                <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-current" fill="none" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900 font-instrument">Message Sent!</h3>
                <p className="text-sm text-slate-650 max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out. A compliance specialist or engineer from our team will respond to your query shortly.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSuccess(false)}
                className="px-6 py-2.5 border border-slate-350 hover:border-slate-400 text-xs font-bold uppercase tracking-wider rounded-full transition bg-white/50 hover:bg-white cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/60 border border-slate-300 focus:bg-white focus:border-[#2EA37A] focus:ring-1 focus:ring-[#2EA37A] rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none text-sm transition"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/60 border border-slate-300 focus:bg-white focus:border-[#2EA37A] focus:ring-1 focus:ring-[#2EA37A] rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none text-sm transition"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label htmlFor="subject" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Topic of Inquiry
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/60 border border-slate-300 focus:bg-white focus:border-[#2EA37A] focus:ring-1 focus:ring-[#2EA37A] rounded-xl text-slate-900 focus:outline-none text-sm transition"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Integration Support">Integration Support</option>
                  <option value="Security & Audits">Security & Audits</option>
                  <option value="Partnership">Partnership Opportunities</option>
                </select>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/60 border border-slate-300 focus:bg-white focus:border-[#2EA37A] focus:ring-1 focus:ring-[#2EA37A] rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none text-sm transition resize-none"
                  placeholder="How can we assist you?"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#2EA37A] hover:bg-[#2EA37A]/95 disabled:bg-slate-400 text-white text-sm font-bold uppercase tracking-wider rounded-full transition duration-200 shadow-sm cursor-pointer"
              >
                {isSubmitting ? "Sending..." : "Submit Message"}
              </button>
            </form>
          )}
        </div>

        {/* Contact Info Sidebar (Right) */}
        <div className="lg:col-span-5 space-y-8 lg:pl-6">
          {/* Info Card 1 */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 font-instrument">General Contact</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              If you have any quick questions or feedback, feel free to send us an email directly:
            </p>
            <div className="p-4 bg-white/40 border border-slate-300 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2EA37A]/10 flex items-center justify-center text-[#2EA37A] shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current" fill="none" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Email Support</div>
                <a href="mailto:support@luminar.io" className="text-sm font-bold text-slate-900 hover:text-[#2EA37A] transition font-mono">
                  support@luminar.io
                </a>
              </div>
            </div>
          </div>

          {/* Info Card 2 */}
          <div className="space-y-4 pt-6 border-t border-slate-300">
            <h3 className="text-xl font-bold text-slate-900 font-instrument">Developer Ecosystem</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We build open-source identity tooling for the Stellar ledger. Check out our repositories, open issues, or contribute to our SDKs:
            </p>
            <div className="p-4 bg-white/40 border border-slate-300 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">GitHub Organization</div>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-slate-900 hover:text-[#2EA37A] transition font-mono">
                  github.com/luminar-io
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
