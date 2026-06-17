import type { Metadata } from "next";

import { ContentCard } from "@/components/data-display/content-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/feedback/page-header";

export const metadata: Metadata = {
  title: "Opportunities",
};

export default function OpportunitiesPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Opportunity Center"
        description="Discover content angles — TODO: connect to /api/v1/opportunities"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <ContentCard
          title="Opportunity slot"
          description="Placeholder for opportunity cards from the backend."
          meta="TODO"
        />
        <ContentCard
          title="Opportunity slot"
          description="Placeholder for opportunity cards from the backend."
          meta="TODO"
        />
      </div>
      <EmptyState
        title="No opportunities yet"
        description="Opportunities will appear when /api/v1/opportunities endpoints are available."
      />
    </div>
  );
}
