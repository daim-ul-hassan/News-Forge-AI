import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ResearchNote, ResearchHistoryItem } from "@/types/research.types";

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

interface ResearchStore {
  notes: ResearchNote[];
  history: ResearchHistoryItem[];
  searchQuery: string;

  addNote: (topic: string, content: string, tags?: string[]) => void;
  updateNote: (id: string, partial: Partial<Pick<ResearchNote, "topic" | "content" | "tags">>) => void;
  deleteNote: (id: string) => void;

  addHistory: (query: string) => void;
  clearHistory: () => void;

  setSearch: (query: string) => void;
  filteredNotes: () => ResearchNote[];
}

export const useResearchStore = create<ResearchStore>()(
  persist(
    (set, get) => ({
      notes: [],
      history: [],
      searchQuery: "",

      addNote: (topic, content, tags = []) => {
        const now = new Date().toISOString();
        const note: ResearchNote = {
          id: generateId(),
          topic,
          content,
          tags,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ notes: [note, ...state.notes] }));
      },

      updateNote: (id, partial) => {
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, ...partial, updatedAt: new Date().toISOString() } : n,
          ),
        }));
      },

      deleteNote: (id) => {
        set((state) => ({ notes: state.notes.filter((n) => n.id !== id) }));
      },

      addHistory: (query) => {
        if (!query.trim()) return;
        const item: ResearchHistoryItem = {
          id: generateId(),
          query: query.trim(),
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          // Keep last 20 history items, deduplicate by query
          history: [item, ...state.history.filter((h) => h.query !== query.trim())].slice(0, 20),
        }));
      },

      clearHistory: () => set({ history: [] }),

      setSearch: (query) => set({ searchQuery: query }),

      filteredNotes: () => {
        const { notes, searchQuery } = get();
        if (!searchQuery.trim()) return notes;
        const q = searchQuery.toLowerCase();
        return notes.filter(
          (n) =>
            n.topic.toLowerCase().includes(q) ||
            n.content.toLowerCase().includes(q) ||
            n.tags.some((t) => t.toLowerCase().includes(q)),
        );
      },
    }),
    { name: "nf-research" },
  ),
);
