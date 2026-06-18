import type { Metadata } from "next";
import type { PlaceholderCard } from "@/components/layout/app-page-scaffold";
import { BookOpenCheck, FileSearch, Library, Rows3 } from "lucide-react";

import { DataTable } from "@/components/data-display/data-table";
import { AppPageScaffold } from "@/components/layout/app-page-scaffold";

export const metadata: Metadata = {
  title: "Research",
};

const cards = [
  {
    title: "Research briefs",
    description: "A future library for structured findings, source notes, and editorial context.",
    label: "Briefs",
    icon: Library,
  },
  {
    title: "Evidence review",
    description: "Reserved space for citations, confidence levels, and open questions.",
    label: "Review",
    icon: BookOpenCheck,
    tone: "cyan",
  },
  {
    title: "Topic exploration",
    description: "Placeholder panels for related themes, entities, and follow-up research paths.",
    label: "Explore",
    icon: FileSearch,
  },
] satisfies PlaceholderCard[];

export default function ResearchPage() {
  return (
    <AppPageScaffold
      title="Research"
      description="A structured workspace for organizing findings before they become content."
      notice="TODO: Connect saved research, source collections, and review status after backend support exists."
      cards={cards}
      emptyTitle="No research saved yet"
      emptyDescription="Research records will appear here after projects, notes, and source collections are connected."
      errorTitle="Research preview unavailable"
      errorDescription="Future research errors can display unavailable collections, stale notes, or recovery options."
    >
      <div className="app-panel rounded-lg p-4">
        <div className="mb-4 flex items-center gap-2">
          <Rows3 className="h-4 w-4 text-secondary" aria-hidden />
          <h2 className="text-lg font-semibold">Research index placeholder</h2>
        </div>
        <DataTable
          columns={[
            { key: "topic", header: "Topic" },
            { key: "status", header: "Status" },
            { key: "updated", header: "Updated" },
          ]}
          data={[]}
          emptyMessage="TODO: Research items will appear after backend integration."
          className="border-border/80 bg-background/35"
        />
      </div>
    </AppPageScaffold>
  );
}
