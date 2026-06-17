import type { Metadata } from "next";

import { DataTable } from "@/components/data-display/data-table";
import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/feedback/page-header";

export const metadata: Metadata = {
  title: "News Feed",
};

export default function NewsFeedPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="News Feed"
        description="Curated news stream — TODO: connect to /api/v1/news-feed"
      />
      <DataTable
        columns={[
          { key: "title", header: "Title" },
          { key: "source", header: "Source" },
          { key: "date", header: "Date" },
        ]}
        data={[]}
        emptyMessage="No news items — backend integration pending"
      />
      <EmptyState
        title="Feed empty"
        description="News items will appear when /api/v1/news-feed endpoints are available."
      />
    </div>
  );
}
