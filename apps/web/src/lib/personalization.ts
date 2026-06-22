import type { CreatorProfile } from "@/types/profile.types";
import type { Article } from "@/types/news.types";
import type { Trend } from "@/types/trends.types";
import type { Opportunity } from "@/types/opportunities.types";

function listProfileKeywords(profile: CreatorProfile) {
  const topics = profile.topics || [];
  const categories = profile.contentCategories || [];
  const contentTypes = profile.contentTypes || [];

  const platforms = Object.keys(profile.platforms || {}).filter(
    (k) => (profile.platforms as Record<string, string>)[k]?.trim(),
  );

  return { topics, categories, contentTypes, platforms };
}

function countMatches(text: string, keywords: string[]) {
  if (!text || keywords.length === 0) return 0;
  const lower = text.toLowerCase();
  let matches = 0;
  for (const kw of keywords) {
    if (!kw) continue;
    if (lower.includes(kw)) matches++;
  }
  return matches;
}

export function summarizeProfile(profile: CreatorProfile | null): string {
  if (!profile) return "";
  const parts: string[] = [];
  if (profile.displayName) parts.push(`Creator: ${profile.displayName}`);
  const platforms = Object.keys(profile.platforms || {}).filter(
    (k) => (profile.platforms as Record<string, string>)[k]?.trim(),
  );
  if (platforms.length) parts.push(`Platforms: ${platforms.join(", ")}`);
  if (profile.topics && profile.topics.length) parts.push(`Topics: ${profile.topics.join(", ")}`);
  if (profile.contentTypes && profile.contentTypes.length)
    parts.push(`Content Types: ${profile.contentTypes.join(", ")}`);
  if (profile.writingTone) parts.push(`Preferred Styles: ${profile.writingTone}`);
  return parts.join("\n");
}

export function scoreArticleForProfile(article: Article, profile: CreatorProfile | null): number {
  if (!profile) return 50; // neutral
  const { topics, categories, contentTypes, platforms } = listProfileKeywords(profile);

  const text = `${article.title} ${article.summary || ''} ${article.category || ''} ${article.source || ''}`.toLowerCase();

  // Weighted matching
  const topicMatches = countMatches(text, topics.map((t) => t.toLowerCase()));
  const typeMatches = countMatches(text, contentTypes.map((t) => t.toLowerCase()));
  const categoryMatches = countMatches(text, categories.map((c) => c.toLowerCase()));
  const platformMatches = countMatches(text, platforms.map((p) => p.toLowerCase()));

  const score = Math.min(
    100,
    Math.round(
      50 * Math.min(1, topicMatches) + // topics strongest (0-50)
        25 * Math.min(1, typeMatches) + // content types (0-25)
        15 * Math.min(1, categoryMatches) + // categories (0-15)
        10 * Math.min(1, platformMatches),
    ),
  );

  // If no explicit matches, fall back to moderate relevance
  return score > 0 ? score : 40;
}

export function scoreTrendForProfile(trend: Trend, profile: CreatorProfile | null): number {
  if (!profile) return 50;
  const { topics, categories } = listProfileKeywords(profile);

  const text = `${trend.topic} ${trend.description} ${(trend.tags || []).join(' ')}`.toLowerCase();

  const topicMatches = countMatches(text, topics.map((t) => t.toLowerCase()));
  const tagMatches = countMatches(text, (trend.tags || []).map((t) => t.toLowerCase()));
  const categoryMatch = categories.includes(trend.category) ? 1 : 0;

  const base = Math.min(100, Math.round(topicMatches * 50 + tagMatches * 25 + categoryMatch * 25));
  return base > 0 ? base : 35;
}

export function scoreOpportunityForProfile(opp: Opportunity, profile: CreatorProfile | null): number {
  if (!profile) return opp.score || 50;
  const { topics, categories } = listProfileKeywords(profile);
  const text = `${opp.title} ${opp.description} ${(opp.tags || []).join(' ')}`.toLowerCase();

  const topicMatches = countMatches(text, topics.map((t) => t.toLowerCase()));
  const tagMatches = countMatches(text, (opp.tags || []).map((t) => t.toLowerCase()));
  const categoryMatch = categories.includes(opp.category) ? 1 : 0;

  const fit = Math.min(100, Math.round(topicMatches * 50 + tagMatches * 30 + categoryMatch * 20));

  // Blend original score with fit (70% original, 30% fit)
  const original = opp.score ?? 50;
  const blended = Math.round(original * 0.7 + fit * 0.3);
  return blended;
}

