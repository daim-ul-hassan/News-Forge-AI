export type OpportunityCategory =
  | "technology"
  | "business"
  | "politics"
  | "science"
  | "culture"
  | "entertainment"
  | "health"
  | "environment";

export type OpportunityStatus = "new" | "evaluating" | "ready" | "expired" | "passed";

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: OpportunityCategory;
  /** Overall opportunity score 0–100 */
  score: number;
  /** Audience fit score 0–100 */
  audienceFit: number;
  /** Competition level 0–100 (lower = less competition = better) */
  competition: number;
  /** Days remaining in the relevance window */
  windowDays: number;
  status: OpportunityStatus;
  tags: string[];
  trendId?: string; // links back to a trend if applicable
  createdAt: string; // ISO date string
}

export type OpportunitySortKey = "score" | "window" | "createdAt";

export type OpportunityFilterKey = "all" | "saved" | "high-score" | "expiring";

export interface OpportunityFilters {
  search: string;
  filter: OpportunityFilterKey;
  category: OpportunityCategory | "all";
  sort: OpportunitySortKey;
}
