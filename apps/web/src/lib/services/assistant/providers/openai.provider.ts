import { getServerEnv } from "@/config/server-env";
import { ChatMessage, AIProvider } from "./provider.interface";

export class OpenAIProvider implements AIProvider {
  name = "openai";

  isConfigured(): boolean {
    const env = getServerEnv();
    return !!env.OPENAI_API_KEY;
  }

  async generateResponse(messages: ChatMessage[]): Promise<string> {
    const env = getServerEnv();
    const apiKey = env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OpenAI API key is not configured");
    }

    const model = env.OPENAI_MODEL || "gpt-4o-mini";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
      throw new Error(`OpenAI API request failed (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) {
      throw new Error("Invalid response from OpenAI API");
    }

    return text;
  }
}
