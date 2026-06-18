import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Message, Conversation } from "@/types/assistant.types";

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

interface AssistantStore {
  conversation: Conversation;
  isTyping: boolean;

  sendMessage: (content: string) => void;
  clearConversation: () => void;
}

function makeConversation(): Conversation {
  const now = new Date().toISOString();
  return { id: generateId(), messages: [], createdAt: now, updatedAt: now };
}

// Static placeholder response — replace with real AI call when backend is ready
const PLACEHOLDER_RESPONSE =
  "AI responses are not yet connected. This conversation architecture is ready for integration with your backend AI service.";

export const useAssistantStore = create<AssistantStore>()(
  persist(
    (set) => ({
      conversation: makeConversation(),
      isTyping: false,

      sendMessage: (content) => {
        if (!content.trim()) return;

        const now = new Date().toISOString();
        const userMessage: Message = {
          id: generateId(),
          role: "user",
          content: content.trim(),
          timestamp: now,
        };

        set((state) => ({
          conversation: {
            ...state.conversation,
            messages: [...state.conversation.messages, userMessage],
            updatedAt: now,
          },
          isTyping: true,
        }));

        // Simulate brief typing delay before placeholder response
        // TODO: Replace this setTimeout with a real API call to your AI backend
        setTimeout(() => {
          const assistantMessage: Message = {
            id: generateId(),
            role: "assistant",
            content: PLACEHOLDER_RESPONSE,
            timestamp: new Date().toISOString(),
          };
          set((state) => ({
            conversation: {
              ...state.conversation,
              messages: [...state.conversation.messages, assistantMessage],
              updatedAt: new Date().toISOString(),
            },
            isTyping: false,
          }));
        }, 800);
      },

      clearConversation: () => set({ conversation: makeConversation(), isTyping: false }),
    }),
    { name: "nf-assistant" },
  ),
);
