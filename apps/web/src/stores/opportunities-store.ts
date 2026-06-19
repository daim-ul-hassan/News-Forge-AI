import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Opportunity, OpportunityFilters, OpportunitySortKey, OpportunityFilterKey } from "@/types/opportunities.types";

interface OpportunitiesState {
  savedIds: Set<string>;
  filters: OpportunityFilters;
  syncReady: boolean;

  hydrateSavedIds: (ids: Set<string>) => void;
  setSyncReady: (ready: boolean) => void;

  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
  setSearch: (search: string) => void;
  setFilter: (filter: OpportunityFilterKey) => void;
  setSort: (sort: OpportunitySortKey) => void;
  filterOpportunities: (opportunities: Opportunity[]) => Opportunity[];
}

export const useOpportunitiesStore = create<OpportunitiesState>()(
  persist(
    (set, get) => ({
      savedIds: new Set<string>(),
      filters: {
        search: "",
        filter: "all",
        category: "all",
        sort: "score",
      },
      syncReady: false,

      hydrateSavedIds: (ids) => set({ savedIds: ids }),

      setSyncReady: (ready) => set({ syncReady: ready }),

      toggleSaved: (id) =>
        set((state) => {
          const next = new Set(state.savedIds);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return { savedIds: next };
        }),

      isSaved: (id) => get().savedIds.has(id),

      setSearch: (search) =>
        set((state) => ({ filters: { ...state.filters, search } })),

      setFilter: (filter) =>
        set((state) => ({ filters: { ...state.filters, filter } })),

      setSort: (sort) =>
        set((state) => ({ filters: { ...state.filters, sort } })),

      filterOpportunities: (opportunities) => {
        const { search, filter, sort } = get().filters;
        const savedIds = get().savedIds;

        let result = [...opportunities];

        if (search.trim()) {
          const q = search.toLowerCase();
          result = result.filter(
            (o) =>
              o.title.toLowerCase().includes(q) ||
              o.description.toLowerCase().includes(q) ||
              o.tags.some((t) => t.toLowerCase().includes(q)),
          );
        }

        if (filter === "saved") result = result.filter((o) => savedIds.has(o.id));
        if (filter === "high-score") result = result.filter((o) => o.score >= 80);
        if (filter === "expiring") result = result.filter((o) => o.windowDays <= 7);

        result.sort((a, b) => {
          if (sort === "score") return b.score - a.score;
          if (sort === "window") return a.windowDays - b.windowDays;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        return result;
      },
    }),
    {
      name: "nf-opportunities-filters",
      partialize: (state) => ({ filters: state.filters }),
    },
  ),
);
