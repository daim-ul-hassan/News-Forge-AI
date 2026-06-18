"use client";

import { useMemo, useState } from "react";
import { MOCK_TRENDS } from "@/lib/data/trends.data";
import type { TrendCategory, TrendFilters, TrendSortKey, TrendStage } from "@/types/trends.types";

const DEFAULT_FILTERS: TrendFilters = {
  search: "",
  category: "all",
  sort: "velocity",
  stage: "all",
};

/**
 * Hook for trends data + filtering/sorting.
 * TODO: Replace MOCK_TRENDS with an API call once the backend trends endpoint is ready.
 */
export function useTrends() {
  const [filters, setFilters] = useState<TrendFilters>(DEFAULT_FILTERS);

  const setSearch = (search: string) => setFilters((f) => ({ ...f, search }));
  const setCategory = (category: TrendCategory | "all") => setFilters((f) => ({ ...f, category }));
  const setSort = (sort: TrendSortKey) => setFilters((f) => ({ ...f, sort }));
  const setStage = (stage: TrendStage | "all") => setFilters((f) => ({ ...f, stage }));
  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const trends = useMemo(() => {
    let result = [...MOCK_TRENDS];

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.topic.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q)),
      );
    }

    if (filters.category !== "all") {
      result = result.filter((t) => t.category === filters.category);
    }

    if (filters.stage !== "all") {
      result = result.filter((t) => t.stage === filters.stage);
    }

    result.sort((a, b) => {
      if (filters.sort === "velocity") return b.velocity - a.velocity;
      if (filters.sort === "change") return b.change - a.change;
      // recency
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

    return result;
  }, [filters]);

  return { trends, filters, setSearch, setCategory, setSort, setStage, resetFilters };
}
