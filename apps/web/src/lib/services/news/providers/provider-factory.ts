import { getServerEnv } from "@/config/server-env";
import type { NewsFetchParams, NewsFetchResult } from "../types";
import type { NewsProvider } from "./provider.interface";
import { NewsApiProvider } from "./news-api.provider";
import { MockNewsProvider } from "./mock-news.provider";

export class ProviderFactory implements NewsProvider {
  private newsApiProvider: NewsProvider | null = null;
  private mockNewsProvider: NewsProvider;

  constructor() {
    this.mockNewsProvider = new MockNewsProvider();
  }

  getProvider(): NewsProvider {
    const env = getServerEnv();
    const apiKey = env.NEWS_API_KEY;

    if (!apiKey) {
      return this.mockNewsProvider;
    }

    if (!this.newsApiProvider) {
      this.newsApiProvider = new NewsApiProvider(apiKey);
    }

    return this.newsApiProvider;
  }

  async fetchArticles(params: NewsFetchParams): Promise<NewsFetchResult> {
    const provider = this.getProvider();
    try {
      return await provider.fetchArticles(params);
    } catch (err) {
      console.warn("News API request failed, falling back to mock provider:", err);
      return await this.mockNewsProvider.fetchArticles(params);
    }
  }
}

export const providerFactory = new ProviderFactory();
