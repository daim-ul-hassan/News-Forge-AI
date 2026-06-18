import type { Metadata } from "next";
import type { PlaceholderCard } from "@/components/layout/app-page-scaffold";
import { FileText, LayoutTemplate, PenLine, Workflow } from "lucide-react";

import { AppPageScaffold } from "@/components/layout/app-page-scaffold";

export const metadata: Metadata = {
  title: "Content Studio",
};

const cards = [
  {
    title: "Brief builder",
    description: "Future surfaces for outlines, references, angles, and publishing goals.",
    label: "Briefs",
    icon: FileText,
  },
  {
    title: "Format templates",
    description: "Reserved cards for scripts, threads, articles, and newsletter structures.",
    label: "Templates",
    icon: LayoutTemplate,
    tone: "cyan",
  },
  {
    title: "Review workflow",
    description: "Placeholder lanes for drafts, feedback, approvals, and publish readiness.",
    label: "Workflow",
    icon: Workflow,
  },
] satisfies PlaceholderCard[];

export default function ContentStudioPage() {
  return (
    <AppPageScaffold
      title="Content Studio"
      description="A drafting workspace for turning research and opportunities into production-ready content."
      notice="TODO: Connect briefs, drafts, and editorial workflow after content data models are approved."
      cards={cards}
      emptyTitle="No briefs or drafts yet"
      emptyDescription="Content work will appear here after draft storage and workflow states are connected."
      errorTitle="Studio preview unavailable"
      errorDescription="Future studio errors can explain draft loading issues and preserve unsaved work guidance."
    >
      <div className="app-panel rounded-lg p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Draft canvas placeholder</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              TODO: Add editor controls only after draft behavior and persistence are defined.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-md border border-secondary/25 bg-secondary/10 px-3 py-1 text-sm text-secondary">
            <PenLine className="h-4 w-4" aria-hidden />
            Editor shell pending
          </span>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {["Outline", "Source notes", "Publishing checklist"].map((item) => (
            <div key={item} className="rounded-md border border-border/70 bg-background/35 p-4 text-sm text-muted-foreground">
              {item}
            </div>
          ))}
        </div>
      </div>
    </AppPageScaffold>
  );
}
