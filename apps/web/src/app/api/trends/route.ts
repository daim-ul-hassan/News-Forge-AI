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
    console.error("Error fetching trends:", err);

    // Always fallback to mock trends on error
    const message = err instanceof Error ? err.message : "Failed to fetch trends";
    const status = message.includes("not configured") ? 503 : 200;

    return NextResponse.json({ trends: MOCK_TRENDS }, { status });
  }
}
