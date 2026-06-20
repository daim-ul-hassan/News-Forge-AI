export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIProvider {
  name: string;
  isConfigured(): boolean;
  generateResponse(messages: ChatMessage[]): Promise<string>;
}
