import { NextRequest, NextResponse } from "next/server";

import { getNewsProvider } from "@/lib/services/news";
import type { ArticleCategory } from "@/types/news.types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const search = searchParams.get("search") ?? undefined;
    const category = (searchParams.get("category") ?? "all") as ArticleCategory | "all";
    const page = Number(searchParams.get("page") ?? "1");
    const pageSize = Number(searchParams.get("pageSize") ?? "6");

    const provider = getNewsProvider();
    const result = await provider.fetchArticles({ search, category, page, pageSize });

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch news";
    const status = message.includes("not configured") ? 503 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
