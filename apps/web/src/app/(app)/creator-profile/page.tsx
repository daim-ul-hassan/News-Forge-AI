import type { Metadata } from "next";

import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/feedback/page-header";

export const metadata: Metadata = {
  title: "Creator Profile",
};

export default function CreatorProfilePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Creator Profile"
        description="Your creator identity — TODO: connect to /api/v1/creator-profile"
      />
      <div className="rounded-lg border border-border bg-card p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted font-mono text-xl font-bold text-muted-foreground">
            ?
          </div>
          <div>
            <p className="font-mono text-lg font-semibold">Creator name — TODO</p>
            <p className="text-sm text-muted-foreground">Profile data pending backend integration</p>
          </div>
        </div>
      </div>
      <EmptyState
        title="Profile not loaded"
        description="Creator profile will load when /api/v1/creator-profile endpoints are available."
      />
    </div>
  );
}
