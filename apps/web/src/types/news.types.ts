export type ArticleCategory =
  | "technology"
  | "business"
  | "politics"
  | "science"
  | "culture"
  | "entertainment"
  | "health"
  | "environment";

export type ArticleStatus = "unread" | "read" | "saved" | "archived";

export interface Article {
  id: string;
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  author?: string;
  category: ArticleCategory;
  tags: string[];
  /** Estimated read time in minutes */
  readTimeMinutes: number;
  publishedAt: string; // ISO date string
  status: ArticleStatus;
  credibilityScore?: number; // 0–100, populated by backend later
  imageUrl?: string;
}

export interface NewsFeedFilters {
  search: string;
  category: ArticleCategory | "all";
  status: ArticleStatus | "all";
}

export interface NewsFeedPagination {
  page: number;
  pageSize: number;
  total: number;
}
