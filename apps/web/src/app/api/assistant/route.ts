import { NextRequest } from "next/server";

import { getServerEnv } from "@/config/server-env";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const SYSTEM_PROMPT =
  "You are NewsForge AI, a helpful assistant for content creators and journalists. " +
  "Help users research topics, brainstorm content angles, analyze news trends, and draft content ideas. " +
  "Be concise, practical, and actionable.";

export async function POST(request: NextRequest) {
  try {
    const { OPENAI_API_KEY, OPENAI_MODEL } = getServerEnv();

    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: "OPENAI_API_KEY is not configured" }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = (await request.json()) as { messages?: ChatMessage[] };
    const messages = body.messages ?? [];

    if (messages.length === 0) {
      return new Response(JSON.stringify({ error: "Messages are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        stream: true,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!openAiResponse.ok) {
      const errBody = (await openAiResponse.json().catch(() => ({}))) as {
        error?: { message?: string };
      };
      const message = errBody.error?.message ?? `OpenAI request failed (${openAiResponse.status})`;
      return new Response(JSON.stringify({ error: message }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    const encoder = new TextEncoder();
    const reader = openAiResponse.body?.getReader();

    if (!reader) {
      return new Response(JSON.stringify({ error: "No stream from OpenAI" }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    const stream = new ReadableStream({
      async start(controller) {
        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data: ")) continue;

              const data = trimmed.slice(6);
              if (data === "[DONE]") {
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                continue;
              }

              try {
                const parsed = JSON.parse(data) as {
                  choices?: Array<{ delta?: { content?: string } }>;
                };
                const token = parsed.choices?.[0]?.delta?.content;
                if (token) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ token })}\n\n`),
                  );
                }
              } catch {
                // Skip malformed SSE chunks
              }
            }
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } catch (err) {
          const message = err instanceof Error ? err.message : "Stream error";
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`),
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Assistant request failed";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
