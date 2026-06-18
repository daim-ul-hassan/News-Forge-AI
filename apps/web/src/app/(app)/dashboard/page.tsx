import type { Metadata } from "next";
import type { PlaceholderCard } from "@/components/layout/app-page-scaffold";
import { Activity, BarChart3, FileText, Radar } from "lucide-react";

import { ChartPlaceholder } from "@/components/data-display/chart-placeholder";
import { StatCard } from "@/components/data-display/stat-card";
import { AppPageScaffold } from "@/components/layout/app-page-scaffold";

export const metadata: Metadata = {
  title: "Dashboard",
};

const cards = [
  {
    title: "Signal overview",
    description: "A future command view for narrative movement, source coverage, and workspace readiness.",
    label: "Overview",
    icon: Radar,
  },
  {
    title: "Opportunity queue",
    description: "Reserved space for ranked content angles, creator-fit indicators, and editorial follow-through.",
    label: "Planning",
    icon: Activity,
    tone: "cyan",
  },
  {
    title: "Draft pipeline",
    description: "A placeholder for briefs, scripts, and publish-ready content moving through review.",
    label: "Studio",
    icon: FileText,
  },
] satisfies PlaceholderCard[];

export default function DashboardPage() {
  return (
    <AppPageScaffold
      title="Dashboard"
      description="A high-level operating view for content intelligence once product data is connected."
      notice="TODO: Connect summary metrics, workspace alerts, and recent activity after backend contracts are approved."
      cards={cards}
      emptyTitle="No dashboard activity yet"
      emptyDescription="Workspace summaries will appear here after integrations provide real signals and saved work."
      errorTitle="Dashboard preview unavailable"
      errorDescription="Future dashboard failures can use this space for recovery details and retry actions."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Signals" value="--" description="Waiting for connected sources" trend="TODO" className="bg-card/70" />
        <StatCard title="Trends" value="--" description="Waiting for radar inputs" trend="TODO" className="bg-card/70" />
        <StatCard title="Briefs" value="--" description="Waiting for studio items" trend="TODO" className="bg-card/70" />
        <StatCard title="Profile" value="--" description="Waiting for creator setup" trend="TODO" className="bg-card/70" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <ChartPlaceholder title="Signal velocity TODO" className="app-panel min-h-[280px]" />
        <div className="app-panel rounded-lg p-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-secondary" aria-hidden />
            <h2 className="text-lg font-semibold">Readiness checklist</h2>
          </div>
          <div className="mt-5 space-y-3">
            {["Narrative intake", "Trend scoring", "Editorial drafting"].map((item) => (
              <div key={item} className="flex items-center justify-between gap-4 rounded-md border border-border/70 bg-background/35 p-3">
                <span className="text-sm text-muted-foreground">{item}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">TODO</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppPageScaffold>
  );
}
