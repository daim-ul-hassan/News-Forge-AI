import type { Metadata } from "next";

import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/feedback/page-header";

export const metadata: Metadata = {
  title: "AI Assistant",
};

export default function AssistantPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Assistant"
        description="Conversational research support — TODO: connect to /api/v1/assistant"
      />
      <div className="rounded-lg border border-dashed border-border bg-muted/20 p-8">
        <p className="text-center text-sm text-muted-foreground">
          Chat interface placeholder. Streaming and message history will be implemented when assistant endpoints are available.
        </p>
      </div>
      <EmptyState
        title="Assistant not connected"
        description="The AI assistant will be available when /api/v1/assistant endpoints are defined."
      />
    </div>
  );
}
