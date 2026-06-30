import { NextRequest, NextResponse } from "next/server";
import { retrieveRelevantChunks } from "../../../lib/knowledge-base";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request. 'messages' array is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Groq API key not configured on server." },
        { status: 500 }
      );
    }

    // RAG step: get latest user query
    const userMessages = messages.filter(m => m.role === "user");
    const lastQuery = userMessages[userMessages.length - 1]?.content || "";
    const relevantChunks = retrieveRelevantChunks(lastQuery, 3);

    const contextString = relevantChunks
      .map(c => `--- DOCUMENT: ${c.title} (${c.category}) ---\n${c.content}`)
      .join("\n\n");

    const systemMessage = {
      role: "system",
      content: `You are Luminar Assistant, a highly capable AI guide for Luminar.
Luminar is a privacy-first decentralized KYC registry on Stellar using Aztec's Noir ZK-SNARKs and multi-oracle threshold signatures.

Your role is STRICTLY to explain:
1. What the Luminar platform is about.
2. How to USE the platform (connecting wallets, submitting KYC documents, ZK proof generation, on-chain soulbound LSBT token minting).

CRITICAL SECURITY CONSTRAINT:
- The Luminar codebase is proprietary and NOT open source.
- You MUST NOT assist with compiling circuits, deploying smart contracts, setting up local environment variables, running tests, starting the Express oracle server, or running the codebase locally.
- Do NOT provide CLI commands or shell instructions for local setup/deployment (such as nargo, cargo, or stellar CLI).
- If the user asks about local deployment, compilation, setup, or running servers, you must politely respond that the Luminar platform codebase is proprietary and you are not authorized to provide deployment or local setup instructions.

Answer questions accurately using the context documentation below. Keep your responses concise and precise.

Luminar Documentation Context:
${contextString}`
    };

    // Forward to Groq completions
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [systemMessage, ...messages],
        temperature: 0.3,
        stream: true
      })
    });

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      console.error("Groq API error response:", errText);
      return NextResponse.json(
        { error: "Failed to communicate with Groq API." },
        { status: groqResponse.status }
      );
    }

    // Set up a ReadableStream to stream raw response back to the client
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        if (!groqResponse.body) {
          controller.close();
          return;
        }

        const reader = groqResponse.body.getReader();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            
            // Keep the last partial line in the buffer
            buffer = lines.pop() || "";

            for (const line of lines) {
              const cleanedLine = line.trim();
              if (!cleanedLine) continue;
              if (cleanedLine === "data: [DONE]") continue;

              if (cleanedLine.startsWith("data: ")) {
                try {
                  const dataStr = cleanedLine.slice(6);
                  const parsed = JSON.parse(dataStr);
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    controller.enqueue(encoder.encode(content));
                  }
                } catch (e) {
                  // Ignore JSON parse errors for incomplete chunk lines
                }
              }
            }
          }
          
          // Process final remaining buffer
          if (buffer && buffer.startsWith("data: ")) {
            try {
              const dataStr = buffer.slice(6).trim();
              if (dataStr !== "[DONE]") {
                const parsed = JSON.parse(dataStr);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(encoder.encode(content));
                }
              }
            } catch (e) {
              // Ignore
            }
          }
        } catch (error) {
          controller.error(error);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      }
    });

  } catch (error) {
    console.error("Error in chat API route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
