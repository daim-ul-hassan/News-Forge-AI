import { providerFactory } from "@/lib/services/news/providers/provider-factory";
import type { NewsProvider } from "@/lib/services/news/types";

export function getNewsProvider(): NewsProvider {
  return providerFactory;
}
