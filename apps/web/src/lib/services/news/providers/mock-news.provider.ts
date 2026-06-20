import { MOCK_ARTICLES } from "@/lib/data/news.data";
import type { NewsFetchParams, NewsFetchResult } from "../types";
import type { NewsProvider } from "./provider.interface";

export class MockNewsProvider implements NewsProvider {
  async fetchArticles(params: NewsFetchParams): Promise<NewsFetchResult> {
    const pageSize = params.pageSize ?? 20;
    const page = params.page ?? 1;
    const search = params.search?.trim() ?? "";
    const category = params.category ?? "all";

    let filtered = [...MOCK_ARTICLES];

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
