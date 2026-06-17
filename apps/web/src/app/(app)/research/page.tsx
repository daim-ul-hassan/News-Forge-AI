import type { Metadata } from "next";

import { DataTable } from "@/components/data-display/data-table";
import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/feedback/page-header";

export const metadata: Metadata = {
  title: "Research",
};

export default function ResearchPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Research Center"
        description="Structured research workspace — TODO: connect to /api/v1/research"
      />
      <DataTable
        columns={[
          { key: "topic", header: "Topic" },
          { key: "status", header: "Status" },
          { key: "updated", header: "Updated" },
        ]}
        data={[]}
        emptyMessage="No research items — backend integration pending"
      />
      <EmptyState
        title="No research yet"
        description="Research items will appear when /api/v1/research endpoints are available."
      />
    </div>
  );
}
