import type { Article, ArticleCategory } from "@/types/news.types";

export interface NewsFetchParams {
  category?: ArticleCategory | "all";
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface NewsFetchResult {
  articles: Article[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface NewsProvider {
  fetchArticles(params: NewsFetchParams): Promise<NewsFetchResult>;
}
