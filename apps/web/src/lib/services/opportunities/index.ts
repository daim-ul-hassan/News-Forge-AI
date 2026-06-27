import { getTrendsProvider } from "@/lib/services/trends";
import { getNewsProvider } from "@/lib/services/news";
import { createOpportunitiesScorer } from "@/lib/services/opportunities/scorer";
import type { OpportunitiesProvider } from "@/lib/services/opportunities/types";
import type { OpportunitiesFetchParams, OpportunitiesFetchResult } from "./types";

export class OpportunitiesService implements OpportunitiesProvider {
  async fetchOpportunities(params: OpportunitiesFetchParams): Promise<OpportunitiesFetchResult> {
    const limit = params.limit || 6;

    try {
      // Fetch trends and articles
      const trendsProvider = getTrendsProvider();
      const newsProvider = getNewsProvider();

      const [trendsResult, articlesResult] = await Promise.all([
        trendsProvider.fetchTrends({ limit: 12 }),
        newsProvider.fetchArticles({ pageSize: 50 }),
      ]);

      const trends = trendsResult.trends;
      const articles = articlesResult.articles;

      if (trends.length === 0 || articles.length === 0) {
        return { opportunities: [] };
      }

      // Score opportunities based on trends + articles
      const scorer = createOpportunitiesScorer(trends, articles);
      const allOpportunities = scorer.scoreOpportunities();

      // Sort by score descending and limit results
      const opportunities = allOpportunities.sort((a, b) => b.score - a.score).slice(0, limit);

      return { opportunities };
    } catch (error) {
      console.error("Error fetching opportunities:", error);
      throw error;
    }
  }
}

export function getOpportunitiesProvider(): OpportunitiesProvider {
  return new OpportunitiesService();
}

export type { OpportunitiesProvider, OpportunitiesFetchParams, OpportunitiesFetchResult } from "./types";
