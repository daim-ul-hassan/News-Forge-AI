"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { fetchNewsFeed } from "@/lib/services/news/client";
import type { ArticleCategory, ArticleStatus, NewsFeedFilters } from "@/types/news.types";

const PAGE_SIZE = 6;

const DEFAULT_FILTERS: NewsFeedFilters = {
  search: "",
  category: "all",
  status: "all",
};

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

  const query = useQuery({
    queryKey: ["news-feed", filters.search, filters.category, page],
    queryFn: () =>
      fetchNewsFeed({
        search: filters.search || undefined,
        category: filters.category,
        page,
        pageSize: PAGE_SIZE,
      }),
    staleTime: 60_000,
    retry: 1,
  });

  const articles =
    filters.status === "all"
      ? (query.data?.articles ?? [])
      : (query.data?.articles ?? []).filter((a) => a.status === filters.status);

  const total =
    filters.status === "all" ? (query.data?.total ?? 0) : articles.length;
  const totalPages =
    filters.status === "all"
      ? (query.data?.totalPages ?? 1)
      : Math.max(1, Math.ceil(articles.length / PAGE_SIZE));

  const goToPage = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));

  return {
    articles,
    filters,
    page,
    totalPages,
    total,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error instanceof Error ? query.error.message : null,
    refetch: query.refetch,
    setSearch,
    setCategory,
    setStatus,
    resetFilters,
    goToPage,
  };
}
