import { AIProvider, ChatMessage } from "./provider.interface";
import { GeminiProvider } from "./gemini.provider";
import { GroqProvider } from "./groq.provider";
import { OpenAIProvider } from "./openai.provider";
import { getServerEnv } from "@/config/server-env";

export class ProviderFactory {
  private providers: Record<string, AIProvider>;

  constructor() {
    this.providers = {
      gemini: new GeminiProvider(),
      groq: new GroqProvider(),
      openai: new OpenAIProvider(),
    };
  }

  getProvidersInOrder(): AIProvider[] {
    const env = getServerEnv();
    const orderString = env.AI_PROVIDER_ORDER || "gemini,groq,openai";
    const order = orderString.split(",").map((s) => s.trim().toLowerCase());

    const list: AIProvider[] = [];
    for (const name of order) {
      const provider = this.providers[name];
      if (provider && provider.isConfigured()) {
        list.push(provider);
      }
    }
    return list;
  }

  async generateResponse(messages: ChatMessage[]): Promise<string> {
    const configuredProviders = this.getProvidersInOrder();

    if (configuredProviders.length === 0) {
      return "AI services are temporarily unavailable.";
    }

    for (const provider of configuredProviders) {
      try {
        console.log(`[Assistant] Attempting response with provider: ${provider.name}`);
        const response = await provider.generateResponse(messages);
        return response;
      } catch (error) {
        console.error(`[Assistant] Provider ${provider.name} failed:`, error);
        // Fallback to next provider in list
      }
    }

    return "AI services are temporarily unavailable.";
  }
}

export const providerFactory = new ProviderFactory();
