import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Draft, DraftFormat, DraftStatus } from "@/types/drafts.types";

export type DraftSortOrder = "newest" | "oldest" | "alphabetical";

function generateId() {
  return crypto.randomUUID();
}

function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

interface DraftsStore {
  drafts: Draft[];
  activeDraftId: string | null;
  lastSavedAt: string | null;
  syncReady: boolean;

  searchQuery: string;
  sortOrder: DraftSortOrder;
  filterStatus: "all" | DraftStatus;
  filterFormat: "all" | DraftFormat;
  recentIds: string[];

  hydrate: (drafts: Draft[]) => void;
  setSyncReady: (ready: boolean) => void;

  createDraft: (title: string, format: DraftFormat) => string;
  updateDraft: (id: string, partial: Partial<Pick<Draft, "title" | "content" | "status">>) => void;
  deleteDraft: (id: string) => void;
  setActiveDraft: (id: string | null) => void;
  activeDraft: () => Draft | undefined;

  setSearch: (query: string) => void;
  setSortOrder: (order: DraftSortOrder) => void;
  setFilterStatus: (status: "all" | DraftStatus) => void;
  setFilterFormat: (format: "all" | DraftFormat) => void;
  filteredDrafts: () => Draft[];
}

export const useDraftsStore = create<DraftsStore>()(
  persist(
    (set, get) => ({
      drafts: [],
      activeDraftId: null,
      lastSavedAt: null,
      syncReady: false,

      searchQuery: "",
      sortOrder: "newest",
      filterStatus: "all",
      filterFormat: "all",
      recentIds: [],

      hydrate: (drafts) =>
        set((state) => ({
          drafts,
          activeDraftId: state.activeDraftId ?? drafts[0]?.id ?? null,
        })),

      setSyncReady: (ready) => set({ syncReady: ready }),

      createDraft: (title, format) => {
        const now = new Date().toISOString();
        const id = generateId();
        const draft: Draft = {
          id,
          title,
          content: "",
          format,
          status: "draft",
          wordCount: 0,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          drafts: [draft, ...state.drafts],
          activeDraftId: id,
        }));
        return id;
      },

      updateDraft: (id, partial) => {
        const now = new Date().toISOString();
        set((state) => ({
          drafts: state.drafts.map((d) =>
            d.id === id
              ? {
                  ...d,
                  ...partial,
                  wordCount: partial.content !== undefined ? wordCount(partial.content) : d.wordCount,
                  updatedAt: now,
                }
              : d,
          ),
          lastSavedAt: now,
        }));
      },

      deleteDraft: (id) => {
        set((state) => ({
          drafts: state.drafts.filter((d) => d.id !== id),
          activeDraftId: state.activeDraftId === id ? null : state.activeDraftId,
          recentIds: state.recentIds.filter((rid) => rid !== id),
        }));
      },

      setActiveDraft: (id) => {
        set((state) => {
          if (!id) return { activeDraftId: null };
          return {
            activeDraftId: id,
            recentIds: [id, ...state.recentIds.filter((rid) => rid !== id)].slice(0, 5),
          };
        });
      },

      activeDraft: () => {
        const { drafts, activeDraftId } = get();
        return drafts.find((d) => d.id === activeDraftId);
      },

      setSearch: (query) => set({ searchQuery: query }),
      setSortOrder: (order) => set({ sortOrder: order }),
      setFilterStatus: (status) => set({ filterStatus: status }),
      setFilterFormat: (format) => set({ filterFormat: format }),

      filteredDrafts: () => {
        const { drafts, searchQuery, sortOrder, filterStatus, filterFormat } = get();
        let result = drafts;

        if (filterStatus !== "all") {
          result = result.filter((d) => d.status === filterStatus);
        }

        if (filterFormat !== "all") {
          result = result.filter((d) => d.format === filterFormat);
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          result = result.filter(
            (d) => d.title.toLowerCase().includes(q) || d.content.toLowerCase().includes(q),
          );
        }

        result = [...result].sort((a, b) => {
          if (sortOrder === "newest") {
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          } else if (sortOrder === "oldest") {
            return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          } else {
            return a.title.localeCompare(b.title);
          }
        });

        return result;
      },
    }),
    {
      name: "drafts-storage",
      partialize: (state) => ({
        recentIds: state.recentIds,
        sortOrder: state.sortOrder,
        filterStatus: state.filterStatus,
        filterFormat: state.filterFormat,
      }),
    }
  )
);
