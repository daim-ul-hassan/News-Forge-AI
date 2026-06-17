import type { Metadata } from "next";

import { ContentCard } from "@/components/data-display/content-card";

export const metadata: Metadata = {
  title: "Features",
};

const featureAreas = [
  {
    title: "Dashboard",
    description: "Central hub for your content intelligence workflow.",
    meta: "Overview",
  },
  {
    title: "Research Center",
    description: "Structured research tools for journalists and creators.",
    meta: "Research",
  },
  {
    title: "Trend Radar",
    description: "Monitor emerging topics and narrative momentum.",
    meta: "Trends",
  },
  {
    title: "Opportunity Center",
    description: "Discover content angles worth pursuing.",
    meta: "Opportunities",
  },
  {
    title: "News Feed",
    description: "Curated stream of relevant stories and signals.",
    meta: "News",
  },
  {
    title: "Content Studio",
    description: "Draft briefs and shape stories from your research.",
    meta: "Studio",
  },
  {
    title: "AI Assistant",
    description: "Conversational support for research and ideation.",
    meta: "AI",
  },
  {
    title: "Creator Profile",
    description: "Define your voice, niche and platform presence.",
    meta: "Profile",
  },
];

export default function FeaturesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-mono text-4xl font-bold">Features</h1>
        <p className="mt-4 text-muted-foreground">
          A full content intelligence stack designed for creators who move fast without sacrificing accuracy.
        </p>
      </div>
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featureAreas.map((feature) => (
          <ContentCard
            key={feature.title}
            title={feature.title}
            description={feature.description}
            meta={feature.meta}
          />
        ))}
      </div>
    </div>
  );
}
