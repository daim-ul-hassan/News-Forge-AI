import type { Article, ArticleCategory } from "@/types/news.types";

import type { NewsFetchParams, NewsFetchResult, NewsProvider } from "./types";

const NEWS_API_BASE = "https://newsapi.org/v2";

const CATEGORY_MAP: Partial<Record<ArticleCategory, string>> = {
  technology: "technology",
  business: "business",
  politics: "general",
  science: "science",
  health: "health",
  environment: "science",
  culture: "entertainment",
  entertainment: "entertainment",
};

interface NewsApiArticle {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsApiArticle[];
  message?: string;
  code?: string;
}

function inferCategory(article: NewsApiArticle): ArticleCategory {
  const text = `${article.title} ${article.description ?? ""}`.toLowerCase();
  if (/tech|ai|software|startup|crypto/.test(text)) return "technology";
  if (/health|medical|vaccine|hospital/.test(text)) return "health";
  if (/climate|environment|carbon|renewable/.test(text)) return "environment";
  if (/science|research|space|nasa/.test(text)) return "science";
  if (/politic|election|government|congress/.test(text)) return "politics";
  if (/sport|movie|music|celebrity/.test(text)) return "entertainment";
  if (/culture|art|book|film/.test(text)) return "culture";
  if (/business|market|economy|stock|finance/.test(text)) return "business";
  return "business";
}

function estimateReadTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function mapArticle(raw: NewsApiArticle, index: number): Article | null {
  if (!raw.title || raw.title === "[Removed]") return null;

  const summary = raw.description ?? raw.content?.split("[+")[0]?.trim() ?? raw.title;
  const category = inferCategory(raw);

  return {
    id: `newsapi-${raw.url}-${index}`,
    title: raw.title,
    summary,
    source: raw.source.name,
    sourceUrl: raw.url,
    author: raw.author ?? undefined,
    category,
    tags: [raw.source.name, category],
    readTimeMinutes: estimateReadTime(summary),
    publishedAt: raw.publishedAt,
    status: "unread",
    imageUrl: raw.urlToImage ?? undefined,
  };
}

export class NewsApiProvider implements NewsProvider {
  constructor(private readonly apiKey: string) {}

  async fetchArticles(params: NewsFetchParams): Promise<NewsFetchResult> {
    const pageSize = params.pageSize ?? 20;
    const page = params.page ?? 1;
    const search = params.search?.trim() ?? "";
    const category = params.category ?? "all";

    const url = new URL(`${NEWS_API_BASE}/top-headlines`);
    url.searchParams.set("language", "en");
    url.searchParams.set("pageSize", String(Math.min(100, pageSize * page)));

    if (search) {
      url.searchParams.set("q", search);
    }

    if (category !== "all" && CATEGORY_MAP[category]) {
      url.searchParams.set("category", CATEGORY_MAP[category]!);
    }

    const response = await fetch(url.toString(), {
      headers: { "X-Api-Key": this.apiKey },
      next: { revalidate: 300 },
    });

    const payload = (await response.json()) as NewsApiResponse;

    if (!response.ok || payload.status === "error") {
      throw new Error(payload.message ?? `News API request failed (${response.status})`);
    }

    const allArticles = payload.articles
      .map((article, index) => mapArticle(article, index))
      .filter((a): a is Article => a !== null);

    let filtered = allArticles;

    if (category !== "all") {
      filtered = filtered.filter((a) => a.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.source.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * pageSize;
    const articles = filtered.slice(start, start + pageSize);

    return { articles, total, page: safePage, pageSize, totalPages };
  }
}

export function createNewsProvider(apiKey: string): NewsProvider {
  return new NewsApiProvider(apiKey);
}
