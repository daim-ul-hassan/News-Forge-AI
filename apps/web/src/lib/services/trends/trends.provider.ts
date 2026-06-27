import type { Trend, TrendCategory, TrendStage } from "@/types/trends.types";
import type { Article } from "@/types/news.types";
import type { TrendsFetchParams, TrendsFetchResult, TrendsProvider } from "./types";

/**
 * Aggregates trending topics from News API data.
 * Extracts patterns, calculates velocity, and maps to trend categories.
 */
export class NewsApiTrendsProvider implements TrendsProvider {
  constructor(private readonly fetchArticles: (search?: string) => Promise<Article[]>) {}

  /**
   * Infer trend stage based on velocity and article count
   */
  private inferStage(velocity: number, sources: number): TrendStage {
    if (velocity > 85) return "discovery";
    if (velocity > 70 && sources > 20) return "validation";
    if (velocity > 40) return "monitoring";
    return "declining";
  }

  /**
   * Extract topic keywords from article titles and summaries
   */
  private extractTopics(articles: Article[]): Map<string, Article[]> {
    const topicMap = new Map<string, Article[]>();

    articles.forEach((article) => {
      // Extract potential trending phrases from title
      const words = (article.title || "")
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter((w) => w.length > 3);

      // Also look for common multi-word phrases
      const title = article.title.toLowerCase();
      const phrases = [
        "AI", "artificial intelligence", "quantum", "crypto", "NFT",
        "climate", "renewable", "nuclear", "longevity", "biotech",
        "creator economy", "spatial computing", "AR", "VR", "metaverse",
        "cyber", "blockchain", "regulation", "policy", "government",
      ];

      const foundPhrases = phrases.filter((p) => title.includes(p.toLowerCase()));

      if (foundPhrases.length > 0) {
        foundPhrases.forEach((phrase) => {
          const key = phrase.toLowerCase();
          if (!topicMap.has(key)) topicMap.set(key, []);
          topicMap.get(key)!.push(article);
        });
      } else if (words.length > 0) {
        // fallback: use first significant word
        const key = words[0];
        if (!topicMap.has(key)) topicMap.set(key, []);
        topicMap.get(key)!.push(article);
      }
    });

    return topicMap;
  }

  /**
   * Map article category to trend category
   */
  private mapCategory(articleCategory: string): TrendCategory {
    const categoryMap: Record<string, TrendCategory> = {
      technology: "technology",
      business: "business",
      politics: "politics",
      science: "science",
      culture: "culture",
      entertainment: "entertainment",
      health: "health",
      environment: "environment",
    };

    return (categoryMap[articleCategory] as TrendCategory) || "technology";
  }

  /**
   * Calculate velocity score (0-100) based on article recency and count
   */
  private calculateVelocity(articles: Article[], totalArticles: number): number {
    if (articles.length === 0) return 0;

    // Recency score: articles published in last 24h get higher weight
    const now = Date.now();
    const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000;

    let recentCount = 0;
    articles.forEach((article) => {
      const pubDate = new Date(article.publishedAt).getTime();
      if (pubDate > twentyFourHoursAgo) {
        recentCount++;
      }
    });

    // Velocity combines: relative frequency + recency
    const relativeFrequency = (articles.length / Math.max(1, totalArticles)) * 50;
    const recencyBonus = (recentCount / Math.max(1, articles.length)) * 50;

    return Math.min(100, Math.round(relativeFrequency + recencyBonus));
  }

  /**
   * Generate a description from article titles
   */
  private generateDescription(articles: Article[]): string {
    if (articles.length === 0) return "";

    // Use most recent article as seed
    const recentArticles = articles
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 3);

    const titleSnippets = recentArticles
      .map((a) => a.summary.split(".")[0])
      .filter(Boolean)
      .join(" ");

    return titleSnippets.slice(0, 180).trim() + (titleSnippets.length > 180 ? "..." : "");
  }

  async fetchTrends(params: TrendsFetchParams): Promise<TrendsFetchResult> {
    try {
      const limit = params.limit || 8;

      // Fetch all recent articles (broad search)
      const articles = await this.fetchArticles();

      if (articles.length === 0) {
        return { trends: [] };
      }

      // Extract topics from articles
      const topicMap = this.extractTopics(articles);

      // Filter out topics with too few articles to be meaningful
      const significantTopics = Array.from(topicMap.entries())
        .filter(([, topicArticles]) => topicArticles.length >= 2)
        .sort((a, b) => b[1].length - a[1].length)
        .slice(0, limit);

      // Convert to Trend objects
      const trends: Trend[] = significantTopics.map(([topic, topicArticles], index) => {
        const category = this.mapCategory(topicArticles[0].category);
        const velocity = this.calculateVelocity(topicArticles, articles.length);
        const stage = this.inferStage(velocity, topicArticles.length);

        // Calculate % change using a simple heuristic:
        // Recent articles (past 24h) vs older articles percentage growth
        const now = Date.now();
        const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000;

        const recent = topicArticles.filter(
          (a) => new Date(a.publishedAt).getTime() > twentyFourHoursAgo
        );
        const change = topicArticles.length > 0 ? Math.round((recent.length / topicArticles.length) * 200) : 0;

        return {
          id: `trend-${index}-${Date.now()}`,
          topic: topic.charAt(0).toUpperCase() + topic.slice(1),
          description: this.generateDescription(topicArticles),
          category,
          velocity,
          change,
          windowHours: 72,
          stage,
          tags: topicArticles
            .slice(0, 3)
            .map((a) => a.source)
            .filter((s, i, arr) => arr.indexOf(s) === i),
          publishedAt: topicArticles[0].publishedAt,
          sources: topicArticles.length,
        };
      });

      return { trends };
    } catch (error) {
      console.error("Error fetching trends:", error);
      throw error;
    }
  }
}

export function createTrendsProvider(
  fetchArticles: (search?: string) => Promise<Article[]>
): TrendsProvider {
  return new NewsApiTrendsProvider(fetchArticles);
}
