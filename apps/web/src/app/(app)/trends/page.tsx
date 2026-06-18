import type { Metadata } from "next";
import type { PlaceholderCard } from "@/components/layout/app-page-scaffold";
import { ArrowUpRight, LineChart, Radar, SearchCheck } from "lucide-react";

import { ChartPlaceholder } from "@/components/data-display/chart-placeholder";
import { AppPageScaffold } from "@/components/layout/app-page-scaffold";

export const metadata: Metadata = {
  title: "Trends",
};

const cards = [
  {
    title: "Momentum radar",
    description: "Placeholder panels for emerging topics, timing windows, and audience movement.",
    label: "Radar",
    icon: Radar,
  },
  {
    title: "Velocity scoring",
    description: "A reserved surface for future strength, saturation, and decay indicators.",
    label: "Scoring",
    icon: LineChart,
    tone: "cyan",
  },
  {
    title: "Signal review",
    description: "Future review lanes for trend validation, source confidence, and watchlist notes.",
    label: "Review",
    icon: SearchCheck,
  },
] satisfies PlaceholderCard[];

export default function TrendsPage() {
  return (
    <AppPageScaffold
      title="Trend Radar"
      description="A workspace for monitoring narrative movement and preparing timely editorial action."
      notice="TODO: Connect trend sources, watchlists, and scoring once data contracts are defined."
      cards={cards}
      emptyTitle="No trend streams yet"
      emptyDescription="Custom trend streams will appear here after source inputs and tracking rules are configured."
      errorTitle="Trend preview unavailable"
      errorDescription="Future trend failures can show stale-state context, refresh options, and recovery guidance."
    >
      <ChartPlaceholder title="Narrative momentum TODO" className="app-panel min-h-[260px]" />

      <div className="grid gap-4 md:grid-cols-3">
        {["Discovery", "Validation", "Monitoring"].map((stage, index) => (
          <div key={stage} className="app-panel rounded-lg p-5 transition-colors hover:border-primary/40">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Stage {index + 1}
              </span>
              <ArrowUpRight className="h-4 w-4 text-secondary" aria-hidden />
            </div>
            <h3 className="mt-4 text-base font-semibold">{stage}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Placeholder lane for future trend intelligence once connected signals are available.
            </p>
          </div>
        ))}
      </div>
    </AppPageScaffold>
  );
}
