import { getServerEnv } from "@/config/server-env";
import { createNewsProvider } from "@/lib/services/news/newsapi.provider";
import type { NewsProvider } from "@/lib/services/news/types";

export function getNewsProvider(): NewsProvider {
  const { NEWS_API_KEY } = getServerEnv();

  if (!NEWS_API_KEY) {
    throw new Error("NEWS_API_KEY is not configured");
  }

  return createNewsProvider(NEWS_API_KEY);
}
