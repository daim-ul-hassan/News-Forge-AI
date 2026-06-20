import { getServerEnv } from "@/config/server-env";
import { ChatMessage, AIProvider } from "./provider.interface";

export class GeminiProvider implements AIProvider {
  name = "gemini";

  isConfigured(): boolean {
    const env = getServerEnv();
    return !!env.GEMINI_API_KEY;
  }

  async generateResponse(messages: ChatMessage[]): Promise<string> {
    const env = getServerEnv();
    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key is not configured");
    }

    const systemMessage = messages.find((m) => m.role === "system");
    const contents = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    interface GeminiRequestBody {
      contents: Array<{
        role: string;
        parts: Array<{ text: string }>;
      }>;
      generationConfig: {
        temperature: number;
        maxOutputTokens: number;
      };
      systemInstruction?: {
        parts: Array<{ text: string }>;
      };
    }

    const body: GeminiRequestBody = {
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    };

    if (systemMessage) {
      body.systemInstruction = {
        parts: [{ text: systemMessage.content }],
      };
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API request failed (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error("Invalid response from Gemini API");
    }

    return text;
  }
}
