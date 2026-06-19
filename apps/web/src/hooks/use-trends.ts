"use client";

import { useEffect, useMemo, useState } from "react";
import { MOCK_TRENDS } from "@/lib/data/trends.data";
import type { Trend, TrendCategory, TrendFilters, TrendSortKey, TrendStage } from "@/types/trends.types";

const DEFAULT_FILTERS: TrendFilters = {
  search: "",
  category: "all",
  sort: "velocity",
  stage: "all",
};

/**
 * Hook for trends data + filtering/sorting.
 * Fetches from /api/trends with automatic fallback to mock data.
 */
export function useTrends() {
  const [filters, setFilters] = useState<TrendFilters>(DEFAULT_FILTERS);
  const [allTrends, setAllTrends] = useState<Trend[]>(MOCK_TRENDS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setSearch = (search: string) => setFilters((f) => ({ ...f, search }));
  const setCategory = (category: TrendCategory | "all") => setFilters((f) => ({ ...f, category }));
  const setSort = (sort: TrendSortKey) => setFilters((f) => ({ ...f, sort }));
  const setStage = (stage: TrendStage | "all") => setFilters((f) => ({ ...f, stage }));
  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  // Fetch trends from API on mount
  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/trends?limit=8");
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        if (data.trends && Array.isArray(data.trends)) {
          setAllTrends(data.trends);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch trends";
        console.error("Error fetching trends:", message);
        setError(message);
        // Fallback to mock data
        setAllTrends(MOCK_TRENDS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrends();
  }, []);

  const trends = useMemo(() => {
    let result = [...allTrends];

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
  }, [allTrends, filters]);

  return { trends, filters, setSearch, setCategory, setSort, setStage, resetFilters, isLoading, error };
}
