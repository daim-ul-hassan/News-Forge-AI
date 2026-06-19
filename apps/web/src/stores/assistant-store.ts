import { create } from "zustand";
import type { Message, Conversation } from "@/types/assistant.types";
import { streamAssistantResponse } from "@/lib/services/assistant/client";

function generateId() {
  return crypto.randomUUID();
}

interface AssistantStore {
  conversation: Conversation;
  isTyping: boolean;
  syncReady: boolean;
  error: string | null;

  hydrate: (conversation: Conversation) => void;
  setSyncReady: (ready: boolean) => void;

  sendMessage: (content: string) => Promise<void>;
  clearConversation: () => void;
  clearError: () => void;
}

function makeConversation(): Conversation {
  const now = new Date().toISOString();
  return { id: generateId(), messages: [], createdAt: now, updatedAt: now };
}

export const useAssistantStore = create<AssistantStore>()((set, get) => ({
  conversation: makeConversation(),
  isTyping: false,
  syncReady: false,
  error: null,

  hydrate: (conversation) => set({ conversation }),

  setSyncReady: (ready) => set({ syncReady: ready }),

  sendMessage: async (content) => {
    if (!content.trim()) return;

    const now = new Date().toISOString();
    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: content.trim(),
      timestamp: now,
    };

    const assistantMessageId = generateId();
    const { conversation } = get();
    const messagesWithUser = [...conversation.messages, userMessage];

    set({
      conversation: {
        ...conversation,
        messages: messagesWithUser,
        updatedAt: now,
      },
      isTyping: true,
      error: null,
    });

    try {
      const history = messagesWithUser.map((m) => ({ role: m.role, content: m.content }));

      await streamAssistantResponse(history, {
        onToken: (token) => {
          set((state) => {
            const messages = [...state.conversation.messages];
            const idx = messages.findIndex((m) => m.id === assistantMessageId);

            if (idx === -1) {
              messages.push({
                id: assistantMessageId,
                role: "assistant",
                content: token,
                timestamp: new Date().toISOString(),
              });
            } else {
              messages[idx] = { ...messages[idx], content: messages[idx].content + token };
            }

            return {
              conversation: {
                ...state.conversation,
                messages,
                updatedAt: new Date().toISOString(),
              },
              isTyping: false,
            };
          });
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to get AI response";
      set((state) => ({
        error: message,
        conversation: {
          ...state.conversation,
          messages: state.conversation.messages.filter((m) => m.id !== assistantMessageId),
        },
      }));
    } finally {
      set({ isTyping: false });
    }
  },

  clearConversation: () => set({ conversation: makeConversation(), isTyping: false, error: null }),

  clearError: () => set({ error: null }),
}));
