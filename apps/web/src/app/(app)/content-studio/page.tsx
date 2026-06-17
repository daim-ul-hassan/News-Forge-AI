import type { Metadata } from "next";

import { ContentCard } from "@/components/data-display/content-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/feedback/page-header";

export const metadata: Metadata = {
  title: "Content Studio",
};

export default function ContentStudioPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Content Studio"
        description="Briefs and drafts — TODO: connect to /api/v1/content-briefs"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ContentCard title="Brief slot" description="Placeholder for content briefs." meta="Draft" />
        <ContentCard title="Brief slot" description="Placeholder for content briefs." meta="Draft" />
        <ContentCard title="Brief slot" description="Placeholder for content briefs." meta="Draft" />
      </div>
      <EmptyState
        title="No briefs yet"
        description="Content briefs will appear when /api/v1/content-briefs endpoints are available."
      />
    </div>
  );
}
