"use client";

import { useMemo, useState } from "react";
import { MOCK_ARTICLES } from "@/lib/data/news.data";
import type { ArticleCategory, ArticleStatus, NewsFeedFilters } from "@/types/news.types";

const PAGE_SIZE = 6;

const DEFAULT_FILTERS: NewsFeedFilters = {
  search: "",
  category: "all",
  status: "all",
};

/**
 * Hook for news feed data + filtering/search/pagination.
 * TODO: Replace MOCK_ARTICLES with an API call once the backend news endpoint is ready.
 */
export function useNewsFeed() {
  const [filters, setFilters] = useState<NewsFeedFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);

  const setSearch = (search: string) => {
    setFilters((f) => ({ ...f, search }));
    setPage(1);
  };
  const setCategory = (category: ArticleCategory | "all") => {
    setFilters((f) => ({ ...f, category }));
    setPage(1);
  };
  const setStatus = (status: ArticleStatus | "all") => {
    setFilters((f) => ({ ...f, status }));
    setPage(1);
  };
  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const filtered = useMemo(() => {
    let result = [...MOCK_ARTICLES];

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.source.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    if (filters.category !== "all") {
      result = result.filter((a) => a.category === filters.category);
    }

    if (filters.status !== "all") {
      result = result.filter((a) => a.status === filters.status);
    }

    return result;
  }, [filters]);

  const total = filtered.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const articles = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goToPage = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));

  return {
    articles,
    filters,
    page,
    totalPages,
    total,
    setSearch,
    setCategory,
    setStatus,
    resetFilters,
    goToPage,
  };
}
