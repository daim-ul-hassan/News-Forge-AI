import { NextRequest, NextResponse } from "next/server";
import { getTrendsProvider } from "@/lib/services/trends";
import { MOCK_TRENDS } from "@/lib/data/trends.data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const limit = Number(searchParams.get("limit") ?? "8");

    const provider = getTrendsProvider();
    const result = await provider.fetchTrends({ limit });

    // Fallback to mock trends if no real trends found
    const trends = result.trends.length > 0 ? result.trends : MOCK_TRENDS;

    return NextResponse.json({ trends });
  } catch (err) {
    console.warn("[trends-api] Failed to fetch trends, falling back to mock trends:", err instanceof Error ? err.message : err);
    return NextResponse.json({ trends: MOCK_TRENDS }, { status: 200 });
  }
}
