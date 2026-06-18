"use client";

import {
  ArrowUpRight,
  Bookmark,
  BookmarkCheck,
  Calendar,
  ChevronDown,
  Filter,
  Search,
  Target,
} from "lucide-react";

import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { PageHeader } from "@/components/feedback/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePageState } from "@/hooks/use-page-state";
import { MOCK_OPPORTUNITIES } from "@/lib/data/opportunities.data";
import { useOpportunitiesStore } from "@/stores/opportunities-store";
import { cn } from "@/lib/utils";
import type { OpportunityFilterKey, OpportunitySortKey } from "@/types/opportunities.types";
import { useState } from "react";

const FILTER_TABS: Array<{ label: string; value: OpportunityFilterKey }> = [
  { label: "All", value: "all" },
  { label: "Saved", value: "saved" },
  { label: "High Score (80+)", value: "high-score" },
  { label: "Expiring (≤7d)", value: "expiring" },
];

const SORT_OPTIONS: Array<{ label: string; value: OpportunitySortKey }> = [
  { label: "Score", value: "score" },
  { label: "Expiry Window", value: "window" },
  { label: "Newest", value: "createdAt" },
];

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? "text-primary" : score >= 60 ? "text-secondary" : "text-muted-foreground";
  return (
    <div className={cn("flex flex-col items-center justify-center", color)}>
      <span className="font-mono text-2xl font-bold">{score}</span>
      <span className="text-[10px] font-medium uppercase tracking-wide opacity-70">score</span>
    </div>
  );
}

export default function OpportunitiesPage() {
  const { filters, toggleSaved, isSaved, setSearch, setFilter, setSort, filterOpportunities } =
    useOpportunitiesStore();
  const { isLoading, error } = usePageState(600);
  const [sortOpen, setSortOpen] = useState(false);

  const opportunities = filterOpportunities(MOCK_OPPORTUNITIES);

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <PageHeader
        title="Opportunities"
        description="Ranked content opportunities identified from active trend signals."
        actions={
          <span className="hidden rounded-md border border-border/60 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground sm:inline-flex">
            {opportunities.length} found
          </span>
        }
      />

      {isLoading ? (
        <div className="mt-8">
          <LoadingState rows={3} />
        </div>
      ) : error ? (
        <ErrorState
          title="Failed to load opportunities"
          description="There was an error connecting to the opportunity scoring engine."
        />
      ) : (
        <>
          {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            placeholder="Search opportunities…"
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted/30 border-border/60"
            aria-label="Search opportunities"
          />
        </div>
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-border/60"
            onClick={() => setSortOpen((v) => !v)}
            aria-label="Sort opportunities"
          >
            <Filter className="h-3.5 w-3.5" />
            Sort: {SORT_OPTIONS.find((s) => s.value === filters.sort)?.label}
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
          {sortOpen && (
            <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded-md border border-border bg-card p-1 shadow-lg">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setSort(opt.value);
                    setSortOpen(false);
                  }}
                  className={cn(
                    "w-full rounded px-3 py-1.5 text-left text-sm hover:bg-muted/50",
                    filters.sort === opt.value && "text-primary font-medium",
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              filters.filter === tab.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Opportunity cards */}
      {opportunities.length === 0 ? (
        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-lg border border-dashed border-border text-center">
          <Target className="mb-3 h-8 w-8 text-muted-foreground" />
          <p className="font-medium">No opportunities match your filters</p>
          <p className="mt-1 text-sm text-muted-foreground">Try switching to &quot;All&quot; or clearing your search.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {opportunities.map((opp) => {
            const saved = isSaved(opp.id);
            return (
              <article
                key={opp.id}
                className="group flex flex-col gap-4 rounded-lg border border-border/60 bg-card/60 p-5 transition-colors hover:border-primary/40 sm:flex-row sm:items-start"
              >
                {/* Score */}
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/20">
                  <ScoreRing score={opp.score} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded border border-border/50 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground capitalize">
                      {opp.category}
                    </span>
                    <span className={cn(
                      "rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                      opp.status === "ready" ? "border-secondary/30 text-secondary" :
                      opp.status === "new" ? "border-primary/30 text-primary" :
                      "border-border/50 text-muted-foreground"
                    )}>
                      {opp.status}
                    </span>
                  </div>
                  <h3 className="mt-2 text-sm font-semibold leading-snug">{opp.title}</h3>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {opp.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {opp.tags.map((tag) => (
                      <span key={tag} className="rounded bg-muted/40 px-2 py-0.5 text-[10px] text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right actions */}
                <div className="flex flex-row items-center gap-3 sm:flex-col sm:items-end shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleSaved(opp.id)}
                    aria-label={saved ? "Remove from saved" : "Save opportunity"}
                    className={cn("h-8 w-8", saved ? "text-primary hover:text-primary/80" : "text-muted-foreground hover:text-foreground")}
                  >
                    {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                  </Button>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" aria-hidden />
                    {opp.windowDays}d left
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden />
                </div>
              </article>
            );
          })}
        </div>
      )}
        </>
      )}
    </div>
  );
}
