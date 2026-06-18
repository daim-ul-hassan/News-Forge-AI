import type { Metadata } from "next";
import type { PlaceholderCard } from "@/components/layout/app-page-scaffold";
import { Compass, Lightbulb, ListChecks, Target } from "lucide-react";

import { AppPageScaffold } from "@/components/layout/app-page-scaffold";

export const metadata: Metadata = {
  title: "Opportunities",
};

const cards = [
  {
    title: "Angle discovery",
    description: "Future cards for story angles, audience fit, and creative positioning.",
    label: "Angles",
    icon: Lightbulb,
  },
  {
    title: "Priority lanes",
    description: "Reserved lanes for quick wins, strategic bets, and follow-up opportunities.",
    label: "Priorities",
    icon: Target,
    tone: "cyan",
  },
  {
    title: "Action planning",
    description: "Placeholder sections for next steps, owners, and editorial readiness.",
    label: "Planning",
    icon: ListChecks,
  },
] satisfies PlaceholderCard[];

export default function OpportunitiesPage() {
  return (
    <AppPageScaffold
      title="Opportunities"
      description="A planning surface for turning timely signals into practical content opportunities."
      notice="TODO: Connect opportunity scoring, saved ideas, and workflow status after backend planning."
      cards={cards}
      emptyTitle="No opportunities yet"
      emptyDescription="Ranked opportunities will appear here after signals, profile context, and workflow data are connected."
      errorTitle="Opportunity preview unavailable"
      errorDescription="Future opportunity errors can explain unavailable scoring, stale inputs, or retry paths."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {["Capture", "Evaluate", "Prepare"].map((label) => (
          <div key={label} className="app-panel rounded-lg p-5">
            <Compass className="h-5 w-5 text-primary" aria-hidden />
            <h2 className="mt-4 text-lg font-semibold">{label}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              TODO: Add workflow controls when opportunity data and user actions are defined.
            </p>
          </div>
        ))}
      </div>
    </AppPageScaffold>
  );
}
