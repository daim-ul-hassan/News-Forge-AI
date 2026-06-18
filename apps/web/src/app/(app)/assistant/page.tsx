import type { Metadata } from "next";
import type { PlaceholderCard } from "@/components/layout/app-page-scaffold";
import { Bot, MessageSquareText, PanelRight, Sparkles } from "lucide-react";

import { AppPageScaffold } from "@/components/layout/app-page-scaffold";

export const metadata: Metadata = {
  title: "Assistant",
};

const cards = [
  {
    title: "Conversation space",
    description: "A future interface for workspace-aware questions, follow-ups, and context review.",
    label: "Conversation",
    icon: MessageSquareText,
  },
  {
    title: "Context drawer",
    description: "Reserved panels for selected sources, active briefs, and cited research.",
    label: "Context",
    icon: PanelRight,
    tone: "cyan",
  },
  {
    title: "Suggested actions",
    description: "Placeholder cards for future next-step prompts and workflow handoffs.",
    label: "Actions",
    icon: Sparkles,
  },
] satisfies PlaceholderCard[];

export default function AssistantPage() {
  return (
    <AppPageScaffold
      title="Assistant"
      description="A prepared assistant workspace shell for future conversational support."
      notice="TODO: Add assistant behavior only after product requirements, safety rules, and backend contracts are defined."
      cards={cards}
      emptyTitle="Assistant is not connected"
      emptyDescription="Conversation history and prompt controls will appear here after assistant integration is approved."
      errorTitle="Assistant preview unavailable"
      errorDescription="Future assistant errors can describe unavailable context, interrupted sessions, or retry guidance."
    >
      <div className="app-panel rounded-lg p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
            <Bot className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h2 className="text-lg font-semibold">Conversation placeholder</h2>
            <p className="text-sm text-muted-foreground">TODO: Message input and streaming states are intentionally not implemented.</p>
          </div>
        </div>
        <div className="mt-5 space-y-3">
          <div className="max-w-[82%] rounded-lg border border-border/70 bg-background/35 p-4 text-sm text-muted-foreground">
            Future assistant messages will render here.
          </div>
          <div className="ml-auto max-w-[82%] rounded-lg border border-secondary/25 bg-secondary/10 p-4 text-sm text-secondary">
            Future user prompts will render here.
          </div>
        </div>
      </div>
    </AppPageScaffold>
  );
}
