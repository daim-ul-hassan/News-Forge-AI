import type { Metadata } from "next";
import type { PlaceholderCard } from "@/components/layout/app-page-scaffold";
import { Filter, Newspaper, Rows3, ShieldCheck } from "lucide-react";

import { DataTable } from "@/components/data-display/data-table";
import { AppPageScaffold } from "@/components/layout/app-page-scaffold";

export const metadata: Metadata = {
  title: "News Feed",
};

const cards = [
  {
    title: "Curated intake",
    description: "A future feed for saved sources, filtered stories, and editorial relevance signals.",
    label: "Feed",
    icon: Newspaper,
  },
  {
    title: "Filter controls",
    description: "Reserved space for topic, region, format, and source-type controls.",
    label: "Filters",
    icon: Filter,
    tone: "cyan",
  },
  {
    title: "Source context",
    description: "Placeholder area for credibility notes, coverage density, and reading status.",
    label: "Context",
    icon: ShieldCheck,
  },
] satisfies PlaceholderCard[];

export default function NewsFeedPage() {
  return (
    <AppPageScaffold
      title="News Feed"
      description="A curated reading surface for future source intake, filtering, and triage."
      notice="TODO: Connect source ingestion, saved filters, and article metadata after backend integration is planned."
      cards={cards}
      emptyTitle="No news items yet"
      emptyDescription="Curated stories will appear here after source connections and feed rules are available."
      errorTitle="Feed preview unavailable"
      errorDescription="Future feed errors can show source status, stale content indicators, and retry options."
    >
      <div className="app-panel rounded-lg p-4">
        <div className="mb-4 flex items-center gap-2">
          <Rows3 className="h-4 w-4 text-primary" aria-hidden />
          <h2 className="text-lg font-semibold">Feed table placeholder</h2>
        </div>
        <DataTable
          columns={[
            { key: "title", header: "Title" },
            { key: "source", header: "Source" },
            { key: "status", header: "Status" },
          ]}
          data={[]}
          emptyMessage="TODO: Feed rows will appear after backend integration."
          className="border-border/80 bg-background/35"
        />
      </div>
    </AppPageScaffold>
  );
}
