import type { NewsFetchParams, NewsFetchResult } from "../types";

export interface NewsProvider {
  fetchArticles(params: NewsFetchParams): Promise<NewsFetchResult>;
}
