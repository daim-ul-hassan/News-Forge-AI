export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface StreamCallbacks {
  onToken: (token: string) => void;
  onDone?: () => void;
}

export async function streamAssistantResponse(
  messages: ChatMessage[],
  callbacks: StreamCallbacks,
): Promise<string> {
  const response = await fetch("/api/assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `Assistant request failed (${response.status})`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("No response stream available");
  }

  const decoder = new TextDecoder();
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n");

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      if (data === "[DONE]") {
        callbacks.onDone?.();
        return fullText;
      }

      try {
        const parsed = JSON.parse(data) as { token?: string; error?: string };
        if (parsed.error) throw new Error(parsed.error);
        if (parsed.token) {
          fullText += parsed.token;
          callbacks.onToken(parsed.token);
        }
      } catch (err) {
        if (err instanceof SyntaxError) continue;
        throw err;
      }
    }
  }

  callbacks.onDone?.();
  return fullText;
}
