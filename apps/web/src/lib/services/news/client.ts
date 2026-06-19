import type { Article, ArticleCategory } from "@/types/news.types";

export interface NewsApiQueryParams {
  search?: string;
  category?: ArticleCategory | "all";
  page?: number;
  pageSize?: number;
}

export interface NewsApiResponse {
  articles: Article[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function fetchNewsFeed(params: NewsApiQueryParams): Promise<NewsApiResponse> {
  const searchParams = new URLSearchParams();

  if (params.search) searchParams.set("search", params.search);
  if (params.category) searchParams.set("category", params.category);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.pageSize) searchParams.set("pageSize", String(params.pageSize));

  const response = await fetch(`/api/news?${searchParams.toString()}`);

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `Failed to fetch news (${response.status})`);
  }

  return response.json() as Promise<NewsApiResponse>;
}
