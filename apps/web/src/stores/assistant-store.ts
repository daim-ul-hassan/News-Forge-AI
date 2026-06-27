import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Message, Conversation } from "@/types/assistant.types";
import { streamAssistantResponse } from "@/lib/services/assistant/client";
import { useProfileStore } from "@/stores/profile-store";
import { summarizeProfile } from "@/lib/personalization";

export type AssistantSortOrder = "newest" | "oldest" | "alphabetical";

function generateId() {
  return crypto.randomUUID();
}

interface AssistantStore {
  conversation: Conversation;
  history: Conversation[];
  isTyping: boolean;
  syncReady: boolean;
  error: string | null;

  searchQuery: string;
  sortOrder: AssistantSortOrder;

  hydrate: (conversation: Conversation) => void;
  setSyncReady: (ready: boolean) => void;

  sendMessage: (content: string) => Promise<void>;
  clearConversation: () => void;
  clearError: () => void;

  loadConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  renameConversation: (id: string, title: string) => void;
  setSearchQuery: (query: string) => void;
  setSortOrder: (order: AssistantSortOrder) => void;
  filteredHistory: () => Conversation[];
}

function makeConversation(): Conversation {
  const now = new Date().toISOString();
  return { id: generateId(), messages: [], createdAt: now, updatedAt: now };
}

export const useAssistantStore = create<AssistantStore>()(
  persist(
    (set, get) => ({
      conversation: makeConversation(),
      history: [],
      isTyping: false,
      syncReady: false,
      error: null,

      searchQuery: "",
      sortOrder: "newest",

      hydrate: (conversation) => set((state) => {
        // Only hydrate if we don't already have it in history, or update it
        const exists = state.history.some(c => c.id === conversation.id);
        const newHistory = exists 
          ? state.history.map(c => c.id === conversation.id ? conversation : c)
          : [conversation, ...state.history];
        
        return { 
          conversation,
          history: newHistory
        };
      }),

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

        // Generate title if it's the first message
        const title = conversation.title || (messagesWithUser.length === 1 ? content.trim().slice(0, 40) + (content.length > 40 ? "..." : "") : undefined);

        const updatedConversation = {
          ...conversation,
          title,
          messages: messagesWithUser,
          updatedAt: now,
        };

        // Update active conversation and history
        set((state) => {
          const exists = state.history.some(c => c.id === updatedConversation.id);
          return {
            conversation: updatedConversation,
            history: exists 
              ? state.history.map(c => c.id === updatedConversation.id ? updatedConversation : c)
              : [updatedConversation, ...state.history],
            isTyping: true,
            error: null,
          };
        });

        try {
          const apiHistory = messagesWithUser.map((m) => ({ role: m.role, content: m.content }));

          const profile = useProfileStore.getState().profile;
          const baseSystem =
            "You are NewsForge AI, a helpful assistant for content creators and journalists. " +
            "Help users research topics, brainstorm content angles, analyze news trends, and draft content ideas. " +
            "Be concise, practical, and actionable.";
          const profileContext = summarizeProfile(profile);
          const systemMessage = profileContext ? `${baseSystem}\n\n${profileContext}` : baseSystem;

          await streamAssistantResponse([{ role: "system", content: systemMessage }, ...apiHistory], {
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

                const newConv = {
                  ...state.conversation,
                  messages,
                  updatedAt: new Date().toISOString(),
                };

                return {
                  conversation: newConv,
                  history: state.history.map(c => c.id === newConv.id ? newConv : c),
                  isTyping: false,
                };
              });
            },
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Failed to get AI response";
          set((state) => {
            const newConv = {
              ...state.conversation,
              messages: state.conversation.messages.filter((m) => m.id !== assistantMessageId),
            };
            return {
              error: message,
              conversation: newConv,
              history: state.history.map(c => c.id === newConv.id ? newConv : c),
            };
          });
        } finally {
          set({ isTyping: false });
        }
      },

      clearConversation: () => {
        const newConv = makeConversation();
        set((state) => ({ 
          conversation: newConv, 
          history: [newConv, ...state.history],
          isTyping: false, 
          error: null 
        }));
      },

      clearError: () => set({ error: null }),

      loadConversation: (id) => {
        const { history } = get();
        const target = history.find(c => c.id === id);
        if (target) {
          set({ conversation: target, isTyping: false, error: null });
        }
      },

      deleteConversation: (id) => {
        set((state) => {
          const newHistory = state.history.filter(c => c.id !== id);
          let newConv = state.conversation;
          if (state.conversation.id === id) {
            newConv = newHistory[0] || makeConversation();
            if (!newHistory.some(c => c.id === newConv.id)) {
              newHistory.unshift(newConv);
            }
          }
          return { history: newHistory, conversation: newConv };
        });
      },

      renameConversation: (id, title) => {
        set((state) => {
          const newHistory = state.history.map(c => c.id === id ? { ...c, title } : c);
          const newConv = state.conversation.id === id ? { ...state.conversation, title } : state.conversation;
          return { history: newHistory, conversation: newConv };
        });
      },

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSortOrder: (order) => set({ sortOrder: order }),

      filteredHistory: () => {
        const { history, searchQuery, sortOrder } = get();
        // Hide completely empty conversations from history unless it's the active one
        // Wait, it's better to hide empty conversations
        let result = history.filter(c => c.messages.length > 0);

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          result = result.filter(
            (c) => (c.title && c.title.toLowerCase().includes(q)) || 
                   c.messages.some(m => m.content.toLowerCase().includes(q))
          );
        }

        result = [...result].sort((a, b) => {
          if (sortOrder === "newest") {
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          } else if (sortOrder === "oldest") {
            return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          } else {
            const titleA = a.title || "Untitled";
            const titleB = b.title || "Untitled";
            return titleA.localeCompare(titleB);
          }
        });

        return result;
      },
    }),
    {
      name: "assistant-storage",
      partialize: (state) => ({
        history: state.history,
        sortOrder: state.sortOrder,
      }),
    }
  )
);
