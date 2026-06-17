import type { Metadata } from "next";

import { ChartPlaceholder } from "@/components/data-display/chart-placeholder";
import { StatCard } from "@/components/data-display/stat-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/feedback/page-header";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Your content intelligence overview — TODO: connect to /api/v1/dashboard"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active trends" value="—" description="Awaiting backend" />
        <StatCard title="Research items" value="—" description="Awaiting backend" />
        <StatCard title="Opportunities" value="—" description="Awaiting backend" />
        <StatCard title="Briefs" value="—" description="Awaiting backend" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartPlaceholder title="Engagement overview — TODO" />
        <ChartPlaceholder title="Trend momentum — TODO" />
      </div>
      <EmptyState
        title="No dashboard data yet"
        description="Backend integration pending. Data will appear when /api/v1/dashboard endpoints are available."
      />
    </div>
  );
}
