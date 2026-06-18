import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Draft, DraftFormat } from "@/types/drafts.types";

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

interface DraftsStore {
  drafts: Draft[];
  activeDraftId: string | null;
  lastSavedAt: string | null;

  createDraft: (title: string, format: DraftFormat) => string;
  updateDraft: (id: string, partial: Partial<Pick<Draft, "title" | "content" | "status">>) => void;
  deleteDraft: (id: string) => void;
  setActiveDraft: (id: string | null) => void;
  activeDraft: () => Draft | undefined;
}

export const useDraftsStore = create<DraftsStore>()(
  persist(
    (set, get) => ({
      drafts: [],
      activeDraftId: null,
      lastSavedAt: null,

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
        }));
      },

      setActiveDraft: (id) => set({ activeDraftId: id }),

      activeDraft: () => {
        const { drafts, activeDraftId } = get();
        return drafts.find((d) => d.id === activeDraftId);
      },
    }),
    { name: "nf-drafts" },
  ),
);
