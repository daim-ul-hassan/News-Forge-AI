import { NextRequest, NextResponse } from "next/server";
import { getOpportunitiesProvider } from "@/lib/services/opportunities";
import { MOCK_OPPORTUNITIES } from "@/lib/data/opportunities.data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const limit = Number(searchParams.get("limit") ?? "6");

    const provider = getOpportunitiesProvider();
    const result = await provider.fetchOpportunities({ limit });

    // Fallback to mock opportunities if no scored opportunities found
    const opportunities = result.opportunities.length > 0 ? result.opportunities : MOCK_OPPORTUNITIES;

    return NextResponse.json({ opportunities });
  } catch (err) {
    console.error("Error fetching opportunities:", err);

    // Always fallback to mock opportunities on error
    return NextResponse.json({ opportunities: MOCK_OPPORTUNITIES }, { status: 200 });
  }
}
