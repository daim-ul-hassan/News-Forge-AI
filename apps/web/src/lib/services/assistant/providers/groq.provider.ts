import { getServerEnv } from "@/config/server-env";
import { ChatMessage, AIProvider } from "./provider.interface";

export class GroqProvider implements AIProvider {
  name = "groq";

  isConfigured(): boolean {
    const env = getServerEnv();
    return !!env.GROQ_API_KEY;
  }

  async generateResponse(messages: ChatMessage[]): Promise<string> {
    const env = getServerEnv();
    const apiKey = env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("Groq API key is not configured");
    }

    const model = env.GROQ_MODEL || "llama-3.3-70b-versatile";

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API request failed (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) {
      throw new Error("Invalid response from Groq API");
    }

    return text;
  }
}
