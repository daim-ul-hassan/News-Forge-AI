import { getNewsProvider } from "@/lib/services/news";
import { createTrendsProvider } from "@/lib/services/trends/trends.provider";
import type { TrendsProvider } from "@/lib/services/trends/types";

export function getTrendsProvider(): TrendsProvider {
  const newsProvider = getNewsProvider();

  // Create a wrapper to fetch articles from the news provider
  const fetchArticles = async (search?: string) => {
    const result = await newsProvider.fetchArticles({
      search,
      pageSize: 50, // Fetch enough articles for trend analysis
    });
    return result.articles;
  };

  return createTrendsProvider(fetchArticles);
}

export type { TrendsProvider, TrendsFetchParams, TrendsFetchResult } from "./types";
