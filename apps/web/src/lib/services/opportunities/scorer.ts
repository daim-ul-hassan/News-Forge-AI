import type { Opportunity, OpportunityStatus } from "@/types/opportunities.types";
import type { Trend } from "@/types/trends.types";
import type { Article } from "@/types/news.types";

/**
 * Scores opportunities based on:
 * - Trend velocity (40%)
 * - Article frequency (30%)
 * - Recency (20%)
 * - Category relevance (10%)
 */
export class OpportunitiesScorer {
  constructor(
    private trends: Trend[],
    private articles: Article[],
  ) {}

  /**
   * Infer opportunity status based on window and age
   */
  private inferStatus(windowDays: number, ageHours: number): OpportunityStatus {
    if (ageHours < 6) return "new";
    if (windowDays <= 3) return "evaluating";
    if (windowDays <= 7) return "ready";
    if (windowDays <= 1) return "expired";
    return "passed";
  }

  /**
   * Calculate velocity score contribution (40% weight)
   */
  private calculateVelocityScore(trend: Trend): number {
    return trend.velocity; // Already 0-100
  }

  /**
   * Count articles for a given topic/category
   */
  private countArticlesForTopic(topicKeywords: string[]): number {
    return this.articles.filter((article) => {
      const text = `${article.title} ${article.summary}`.toLowerCase();
      return topicKeywords.some((keyword) => text.includes(keyword.toLowerCase()));
    }).length;
  }

  /**
   * Calculate article frequency score contribution (30% weight)
   * Scale: 0-100, where 50+ articles = 100 score
   */
  private calculateFrequencyScore(articleCount: number): number {
    // Normalize: 0 articles = 0, 50+ articles = 100
    return Math.min(100, (articleCount / 50) * 100);
  }

  /**
   * Calculate recency score contribution (20% weight)
   * Decay over time: Recent = 100, 2 weeks old = 20
   */
  private calculateRecencyScore(publishedAt: string): number {
    const now = Date.now();
    const pubTime = new Date(publishedAt).getTime();
    const ageMs = now - pubTime;
    const ageDays = ageMs / (1000 * 60 * 60 * 24);

    // Exponential decay: high score for < 2 days, lower for older
    if (ageDays <= 1) return 100;
    if (ageDays <= 3) return 85;
    if (ageDays <= 7) return 70;
    if (ageDays <= 14) return 50;
    return Math.max(10, 50 - ageDays * 2);
  }

  /**
   * Calculate category relevance score (10% weight)
   * Based on trend stage: discovery/validation > monitoring > declining
   */
  private calculateCategoryScore(trendStage: string): number {
    if (trendStage === "discovery") return 100;
    if (trendStage === "validation") return 90;
    if (trendStage === "monitoring") return 70;
    return 40; // declining
  }

  /**
   * Calculate composite opportunity score
   */
  calculateScore(trend: Trend, topicKeywords: string[]): number {
    const velocityScore = this.calculateVelocityScore(trend);
    const articleCount = this.countArticlesForTopic(topicKeywords);
    const frequencyScore = this.calculateFrequencyScore(articleCount);
    const recencyScore = this.calculateRecencyScore(trend.publishedAt);
    const categoryScore = this.calculateCategoryScore(trend.stage);

    // Weighted average: 40% + 30% + 20% + 10%
    const composite =
      velocityScore * 0.4 +
      frequencyScore * 0.3 +
      recencyScore * 0.2 +
      categoryScore * 0.1;

    return Math.round(Math.min(100, composite));
  }

  /**
   * Calculate audience fit and competition scores using heuristics
   */
  private calculateAudienceAndCompetition(
    trendStage: string,
    articleCount: number,
  ): { audienceFit: number; competition: number } {
    // Audience fit inversely correlates with competition
    // High article count = more competition but clearer audience demand
    const competitionFromArticles = Math.min(100, (articleCount / 30) * 100);

    // Discovery stage trends = new audience
    const discoveryBonus = trendStage === "discovery" ? 15 : 0;

    const audienceFit = Math.min(100, 70 + discoveryBonus - competitionFromArticles * 0.3);
    const competition = competitionFromArticles;

    return { audienceFit: Math.round(audienceFit), competition: Math.round(competition) };
  }

  /**
   * Generate relevance tags based on trend
   */
  private generateTags(trend: Trend): string[] {
    const tags = [trend.stage.charAt(0).toUpperCase() + trend.stage.slice(1)];

    if (trend.velocity >= 85) {
      tags.push("High Velocity");
    }
    if (trend.stage === "discovery") {
      tags.push("Early Signal");
    }
    if (trend.tags) {
      tags.push(...trend.tags.slice(0, 2));
    }

    return tags;
  }

  /**
   * Calculate days remaining in relevance window
   * Based on trend stage and velocity decay
   */
  private calculateWindowDays(trend: Trend): number {
    const baseWindow: Record<string, number> = {
      discovery: 3, // Fast-moving
      validation: 7, // Moderate window
      monitoring: 14, // Stable
      declining: 1, // Closing quickly
    };

    return baseWindow[trend.stage] || 7;
  }

  /**
   * Score all opportunities from trends
   */
  scoreOpportunities(): Opportunity[] {
    const opportunities: Opportunity[] = [];
    const categoryMentionCounts: Record<string, number> = {};

    // Count mentions per category
    this.trends.forEach((trend) => {
      if (!categoryMentionCounts[trend.category]) {
        categoryMentionCounts[trend.category] = 0;
      }
      categoryMentionCounts[trend.category]++;
    });

    // Generate opportunities from trends
    this.trends.forEach((trend, index) => {
      const topicKeywords = [trend.topic.toLowerCase(), ...trend.tags.map((t) => t.toLowerCase())];
      const articleCount = this.countArticlesForTopic(topicKeywords);

      // Only generate opportunities for trends with some article coverage
      if (articleCount < 2) return;

      const score = this.calculateScore(trend, topicKeywords);
      const { audienceFit, competition } = this.calculateAudienceAndCompetition(
        trend.stage,
        articleCount,
      );
      const windowDays = this.calculateWindowDays(trend);
      const ageHours = (Date.now() - new Date(trend.publishedAt).getTime()) / (1000 * 60 * 60);
      const status = this.inferStatus(windowDays, ageHours);

      // Generate a compelling opportunity title and description
      const title = this.generateOpportunityTitle(trend, score);
      const description = this.generateOpportunityDescription(trend);

      opportunities.push({
        id: `opp-${trend.id}-${index}`,
        title,
        description,
        category: trend.category,
        score,
        audienceFit,
        competition,
        windowDays,
        status,
        tags: this.generateTags(trend),
        trendId: trend.id,
        createdAt: new Date().toISOString(),
      });
    });

    return opportunities;
  }

  /**
   * Generate a compelling opportunity title
   */
  private generateOpportunityTitle(trend: Trend, score: number): string {
    const contentTypes = ["Explainer", "Deep-dive", "Analysis", "Overview", "Guide"];
    const contentType = contentTypes[Math.floor(Math.random() * contentTypes.length)];

    if (score >= 90) {
      return `First-mover ${contentType.toLowerCase()}: ${trend.topic}`;
    } else if (score >= 80) {
      return `${contentType}: ${trend.topic} Market Analysis`;
    } else if (score >= 70) {
      return `The ${trend.topic} Landscape: An Honest Assessment`;
    } else {
      return `Understanding ${trend.topic}: What Creators Need to Know`;
    }
  }

  /**
   * Generate a compelling opportunity description
   */
  private generateOpportunityDescription(trend: Trend): string {
    const templates = [
      `No major outlet has yet published a comprehensive overview of ${trend.topic.toLowerCase()}. A well-structured piece would serve researchers, journalists, and business leaders.`,
      `Interest in ${trend.topic.toLowerCase()} is high but credible, in-depth coverage is sparse. A detailed analysis would fill a clear gap.`,
      `Multiple signals point to accelerating momentum in ${trend.topic.toLowerCase()}. Early coverage now could establish thought leadership.`,
      `${trend.topic} is rapidly evolving but narratives remain fragmented. A cohesive overview would resonate with audiences.`,
    ];

    return templates[Math.floor(Math.random() * templates.length)];
  }
}

export function createOpportunitiesScorer(
  trends: Trend[],
  articles: Article[],
): OpportunitiesScorer {
  return new OpportunitiesScorer(trends, articles);
}
