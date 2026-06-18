export type TrendCategory =
  | "technology"
  | "business"
  | "politics"
  | "science"
  | "culture"
  | "entertainment"
  | "health"
  | "environment";

export type TrendStage = "discovery" | "validation" | "monitoring" | "declining";

export interface Trend {
  id: string;
  topic: string;
  description: string;
  category: TrendCategory;
  /** 0–100 velocity score */
  velocity: number;
  /** Percentage change over window, e.g. +120 */
  change: number;
  /** Time window in hours */
  windowHours: number;
  stage: TrendStage;
  tags: string[];
  publishedAt: string; // ISO date string
  sources: number;
}

export type TrendSortKey = "velocity" | "recency" | "change";

export interface TrendFilters {
  search: string;
  category: TrendCategory | "all";
  sort: TrendSortKey;
  stage: TrendStage | "all";
}
