"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import logo from "../public/assets/logo.png";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function Markdown({ content }: { content: string }) {
  // Split content by code blocks: ```...```
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2 select-text">
      {parts.map((part, index) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          // Extract language and code
          const match = part.match(/```(\w*)\n([\s\S]*?)```/);
          const language = match ? match[1] : "";
          const code = match ? match[2].trim() : part.slice(3, -3).trim();

          return (
            <pre
              key={index}
              className="bg-slate-950 text-slate-100 p-3.5 rounded-xl my-2.5 w-full max-w-full overflow-x-auto font-mono text-[11px] leading-relaxed border border-slate-800 relative group"
            >
              <div className="text-[9px] font-mono text-slate-500 uppercase mb-1.5 border-b border-slate-800/80 pb-1 flex justify-between items-center select-none">
                <span>{language || "code"}</span>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(code)}
                  className="hover:text-slate-300 transition-colors cursor-pointer text-[10px]"
                >
                  Copy
                </button>
              </div>
              <code>{code}</code>
            </pre>
          );
        }

        // Regular text block: split by newlines to render paragraphs/lists
        const lines = part.split("\n");
        return (
          <div key={index} className="space-y-1">
            {lines.map((line, lineIdx) => {
              const trimmed = line.trim();
              if (!trimmed) {
                return <div key={lineIdx} className="h-1.5" />;
              }

              // Check for unordered list item (- or *)
              const isListItem = line.startsWith("- ") || line.startsWith("* ");
              const cleanText = isListItem ? line.substring(2) : line;

              // Parse bold and inline code segments
              const segmentPattern = /(\*\*[^*]+\*\*|`[^`]+`)/g;
              const segments = cleanText.split(segmentPattern);

              const renderedSegments = segments.map((seg, segIdx) => {
                if (seg.startsWith("**") && seg.endsWith("**")) {
                  return (
                    <strong key={segIdx} className="font-bold text-slate-900 font-instrument">
                      {seg.slice(2, -2)}
                    </strong>
                  );
                }
                if (seg.startsWith("`") && seg.endsWith("`")) {
                  return (
                    <code
                      key={segIdx}
                      className="bg-slate-100 text-slate-900 px-1.5 py-0.5 rounded font-mono text-[11px] font-semibold border border-slate-200"
                    >
                      {seg.slice(1, -1)}
                    </code>
                  );
                }
                return seg;
              });

              if (isListItem) {
                return (
                  <li key={lineIdx} className="list-disc ml-4 pl-1 text-[13px] text-slate-850 font-instrument leading-relaxed">
                    {renderedSegments}
                  </li>
                );
              }

              return (
                <p key={lineIdx} className="text-[13px] text-slate-850 font-instrument leading-relaxed">
                  {renderedSegments}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I am your Luminar Assistant. Ask me anything about our ZK proving circuits, Soroban smart contracts, multi-oracle KYC threshold consensus, or how to get started."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Open chatbot when custom event is dispatched (e.g. from Header)
  useEffect(() => {
    const handleToggleChat = () => {
      setIsOpen(prev => {
        if (!prev) setHasNewMessages(false);
        return !prev;
      });
    };
    window.addEventListener("toggle-chat", handleToggleChat);
    return () => {
      window.removeEventListener("toggle-chat", handleToggleChat);
    };
  }, []);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: textToSend };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        throw new Error("Failed to connect to assistant API");
      }

      if (!response.body) {
        throw new Error("No response body received");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botReply = "";

      // Add a placeholder message for the assistant
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        botReply += chunk;

        setMessages(prev => {
          const next = [...prev];
          const lastMsg = next[next.length - 1];
          if (lastMsg && lastMsg.role === "assistant") {
            lastMsg.content = botReply;
          }
          return next;
        });
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error communicating with the API. Please ensure the Groq API key is configured correctly in `.env.local`."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewMessages(false);
    }
  };

  const suggestions = [
    "How does the ZK proof verify age?",
    "What is LSBT?",
    "How does 2-of-3 consensus work?",
    "How does Luminar preserve privacy?"
  ];

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 font-clash flex flex-col items-end">
      {/* Floating Chat Panel */}
      {isOpen && (
        <div
          ref={chatContainerRef}
          data-lenis-prevent
          className="mb-4 w-[380px] max-w-[calc(100vw-2rem)] h-[540px] max-h-[calc(100vh-8rem)] bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden transition-all duration-300 transform scale-100 origin-bottom-right"
        >
          {/* Header */}
          <div className="px-6 h-16 bg-[#F2F0EF]/80 border-b border-slate-200/50 flex items-center justify-between -ml-16">
            <div className="flex items-center">
              <Image
                src={logo}
                alt="Luminar Logo"
                priority
                className="h-45 w-auto object-contain pointer-events-none"
              />
            </div>
            
            <button
              onClick={toggleChat}
              className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100/60 transition cursor-pointer"
              aria-label="Close Assistant"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-grow p-5 overflow-y-auto space-y-4 scroll-smooth min-h-0 flex flex-col scrollbar-thin scrollbar-thumb-slate-300">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col max-w-[85%] min-w-0 ${
                  msg.role === "user" ? "self-end items-end" : "self-start items-start"
                }`}
              >
                <div
                  className={`p-3.5 text-sm leading-relaxed w-full min-w-0 ${
                    msg.role === "user"
                      ? "bg-slate-800 text-[#F2F0EF] rounded-2xl rounded-tr-none shadow-sm"
                      : "bg-white/80 border border-slate-200/65 text-slate-800 rounded-2xl rounded-tl-none shadow-[0_2px_12px_rgba(0,0,0,0.02)]"
                  }`}
                >
                  {msg.content ? (
                    <Markdown content={msg.content} />
                  ) : (
                    /* Loading bubble */
                    <div className="flex items-center gap-1.5 py-1 px-2">
                      <span className="w-2 h-2 bg-slate-450 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-slate-450 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-slate-450 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 font-mono mt-1 px-1">
                  {msg.role === "user" ? "You" : "Assistant"}
                </span>
              </div>
            ))}

            {/* Suggestions Chips - Show when only welcome message or ready */}
            {!isLoading && messages.length === 1 && (
              <div className="pt-2 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-clash px-1">
                  Suggested topics
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-3 py-1.5 bg-white/90 border border-slate-200 hover:border-luminar text-[11px] font-bold text-slate-650 hover:text-luminar rounded-xl transition cursor-pointer text-left leading-snug shadow-sm max-w-full"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="p-4 bg-[#F2F0EF]/80 border-t border-slate-200/50 flex gap-2.5 items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              placeholder="Ask about ZK KYC, multi-oracles, LSBT..."
              className="flex-grow px-4 py-2.5 bg-white border border-slate-350 focus:border-luminar focus:ring-1 focus:ring-luminar rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none text-xs transition"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-9 h-9 rounded-xl bg-luminar hover:bg-luminar/95 disabled:bg-slate-300 text-white flex items-center justify-center shadow-md hover:shadow transition duration-200 cursor-pointer shrink-0"
              aria-label="Send message"
            >
              <svg className="w-4 h-4 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={toggleChat}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition duration-300 cursor-pointer transform hover:scale-105 active:scale-95 ${
          isOpen ? "bg-slate-800 rotate-90" : "bg-luminar"
        } relative`}
        aria-label="Toggle Assistant"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
        
        {/* Pulse indicator on welcome */}
        {!isOpen && hasNewMessages && (
          <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-red-500 border-4 border-[#F2F0EF]" />
        )}
      </button>
    </div>
  );
}
