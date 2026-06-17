import type { Metadata } from "next";

import { ChartPlaceholder } from "@/components/data-display/chart-placeholder";
import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/feedback/page-header";

export const metadata: Metadata = {
  title: "Trends",
};

export default function TrendsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Trend Radar"
        description="Monitor emerging topics — TODO: connect to /api/v1/trends"
      />
      <ChartPlaceholder title="Trend timeline — TODO" className="min-h-[240px]" />
      <EmptyState
        title="No trends yet"
        description="Backend integration pending. Trends will appear when /api/v1/trends endpoints are available."
      />
    </div>
  );
}
