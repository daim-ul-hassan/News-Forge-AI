import type { Trend } from "@/types/trends.types";

export interface TrendsFetchParams {
  limit?: number;
}

export interface TrendsFetchResult {
  trends: Trend[];
}

export interface TrendsProvider {
  fetchTrends(params: TrendsFetchParams): Promise<TrendsFetchResult>;
}
