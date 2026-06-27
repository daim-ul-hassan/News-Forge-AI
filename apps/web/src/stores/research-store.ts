import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ResearchNote, ResearchHistoryItem, SortOrder } from "@/types/research.types";

function generateId() {
  return crypto.randomUUID();
}

interface ResearchStore {
  notes: ResearchNote[];
  history: ResearchHistoryItem[];
  searchQuery: string;
  syncReady: boolean;

  pinnedIds: string[];
  recentIds: string[];
  sortOrder: SortOrder;

  hydrate: (data: { notes: ResearchNote[]; history: ResearchHistoryItem[] }) => void;
  setSyncReady: (ready: boolean) => void;

  addNote: (topic: string, content: string, tags?: string[]) => void;
  updateNote: (id: string, partial: Partial<Pick<ResearchNote, "topic" | "content" | "tags">>) => void;
  deleteNote: (id: string) => void;

  addHistory: (query: string) => void;
  clearHistory: () => void;

  setSearch: (query: string) => void;
  filteredNotes: () => ResearchNote[];

  togglePin: (id: string) => void;
  markViewed: (id: string) => void;
  setSortOrder: (order: SortOrder) => void;
}

export const useResearchStore = create<ResearchStore>()(
  persist(
    (set, get) => ({
      notes: [],
      history: [],
      searchQuery: "",
      syncReady: false,

      pinnedIds: [],
      recentIds: [],
      sortOrder: "newest",

      hydrate: (data) => set({ notes: data.notes, history: data.history }),

      setSyncReady: (ready) => set({ syncReady: ready }),

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
        set((state) => ({ 
          notes: state.notes.filter((n) => n.id !== id),
          pinnedIds: state.pinnedIds.filter((pid) => pid !== id),
          recentIds: state.recentIds.filter((rid) => rid !== id),
        }));
      },

      addHistory: (query) => {
        if (!query.trim()) return;
        const item: ResearchHistoryItem = {
          id: generateId(),
          query: query.trim(),
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          history: [item, ...state.history.filter((h) => h.query !== query.trim())].slice(0, 20),
        }));
      },

      clearHistory: () => set({ history: [] }),

      setSearch: (query) => set({ searchQuery: query }),

      togglePin: (id) => {
        set((state) => ({
          pinnedIds: state.pinnedIds.includes(id)
            ? state.pinnedIds.filter((pid) => pid !== id)
            : [...state.pinnedIds, id],
        }));
      },

      markViewed: (id) => {
        set((state) => ({
          recentIds: [id, ...state.recentIds.filter((rid) => rid !== id)].slice(0, 5),
        }));
      },

      setSortOrder: (order) => set({ sortOrder: order }),

      filteredNotes: () => {
        const { notes, searchQuery, sortOrder, pinnedIds } = get();
        let result = notes;
        
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          result = result.filter(
            (n) =>
              n.topic.toLowerCase().includes(q) ||
              n.content.toLowerCase().includes(q) ||
              n.tags.some((t) => t.toLowerCase().includes(q)),
          );
        }
        
        result = [...result].sort((a, b) => {
          const aPinned = pinnedIds.includes(a.id);
          const bPinned = pinnedIds.includes(b.id);
          if (aPinned && !bPinned) return -1;
          if (!aPinned && bPinned) return 1;
          
          if (sortOrder === "newest") {
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          } else if (sortOrder === "oldest") {
            return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          } else {
            return a.topic.localeCompare(b.topic);
          }
        });
        
        return result;
      },
    }),
    {
      name: "research-storage",
      partialize: (state) => ({
        pinnedIds: state.pinnedIds,
        recentIds: state.recentIds,
        sortOrder: state.sortOrder,
      }),
    }
  )
);
