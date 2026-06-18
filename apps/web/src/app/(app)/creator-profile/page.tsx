import type { Metadata } from "next";
import type { PlaceholderCard } from "@/components/layout/app-page-scaffold";
import { BadgeCheck, CircleUserRound, Tags, UserRoundCog } from "lucide-react";

import { AppPageScaffold } from "@/components/layout/app-page-scaffold";

export const metadata: Metadata = {
  title: "Creator Profile",
};

const cards = [
  {
    title: "Creator identity",
    description: "Future profile fields for publication focus, voice, platforms, and audience context.",
    label: "Identity",
    icon: CircleUserRound,
  },
  {
    title: "Preference signals",
    description: "Reserved controls for niches, formats, cadence, and opportunity matching preferences.",
    label: "Signals",
    icon: Tags,
    tone: "cyan",
  },
  {
    title: "Readiness checks",
    description: "Placeholder guidance for incomplete setup and future profile validation.",
    label: "Readiness",
    icon: BadgeCheck,
  },
] satisfies PlaceholderCard[];

export default function CreatorProfilePage() {
  return (
    <AppPageScaffold
      title="Creator Profile"
      description="A profile foundation for future personalization, editorial fit, and workspace defaults."
      notice="TODO: Connect creator fields, saved preferences, and validation once profile models exist."
      cards={cards}
      emptyTitle="Creator profile is empty"
      emptyDescription="Profile details will appear here after editable creator settings are connected."
      errorTitle="Profile preview unavailable"
      errorDescription="Future profile errors can explain unavailable settings or failed preference loading."
    >
      <div className="app-panel rounded-lg p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-border bg-background/45 text-muted-foreground">
            <UserRoundCog className="h-8 w-8" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold">Creator setup placeholder</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              TODO: Add editable fields only after persistence, validation, and profile ownership are defined.
            </p>
          </div>
          <span className="w-fit rounded-md border border-primary/25 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
            Not configured
          </span>
        </div>
      </div>
    </AppPageScaffold>
  );
}
