"use client";

import {
  ArrowUpRight,
  ChevronDown,
  Filter,
  Search,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useState } from "react";

import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { PageHeader } from "@/components/feedback/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTrends } from "@/hooks/use-trends";
import { cn } from "@/lib/utils";
import type { TrendCategory, TrendStage } from "@/types/trends.types";

const CATEGORIES: Array<{ label: string; value: TrendCategory | "all" }> = [
  { label: "All", value: "all" },
  { label: "Technology", value: "technology" },
  { label: "Business", value: "business" },
  { label: "Politics", value: "politics" },
  { label: "Science", value: "science" },
  { label: "Health", value: "health" },
  { label: "Environment", value: "environment" },
  { label: "Culture", value: "culture" },
];

const SORT_OPTIONS = [
  { label: "Velocity", value: "velocity" as const },
  { label: "Change %", value: "change" as const },
  { label: "Recency", value: "recency" as const },
];

const STAGE_COLORS: Record<TrendStage, string> = {
  discovery: "text-secondary border-secondary/30 bg-secondary/10",
  validation: "text-primary border-primary/30 bg-primary/10",
  monitoring: "text-muted-foreground border-border bg-muted/30",
  declining: "text-red-400 border-red-400/30 bg-red-400/10",
};

const VELOCITY_COLOR = (v: number) => {
  if (v >= 85) return "bg-primary";
  if (v >= 65) return "bg-secondary";
  return "bg-muted-foreground";
};

export default function TrendsPage() {
  const { trends, filters, setSearch, setCategory, setSort, resetFilters, isLoading, error } = useTrends();
  const [sortOpen, setSortOpen] = useState(false);

  const hasActiveFilters =
    filters.search || filters.category !== "all" || filters.sort !== "velocity";

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <PageHeader
        title="Trend Radar"
        description="Monitor narrative momentum and discover emerging signals before they peak."
        actions={
          <div className="flex items-center gap-2">
            <span className="hidden rounded-md border border-border/60 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground sm:inline-flex">
              {trends.length} signal{trends.length !== 1 ? "s" : ""}
            </span>
          </div>
        }
      />

      {isLoading ? (
        <div className="mt-8">
          <LoadingState rows={3} />
        </div>
      ) : error ? (
        <ErrorState
          title="Failed to load trends"
          description="There was an error connecting to the trend scoring service."
        />
      ) : (
        <>
          {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            placeholder="Search trends, tags…"
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted/30 border-border/60"
            aria-label="Search trends"
          />
        </div>
        <div className="flex items-center gap-2">
          {/* Sort dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-border/60"
              onClick={() => setSortOpen((v) => !v)}
              aria-label="Sort trends"
            >
              <Filter className="h-3.5 w-3.5" />
              {SORT_OPTIONS.find((s) => s.value === filters.sort)?.label ?? "Sort"}
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
            {sortOpen && (
              <div className="absolute right-0 top-full z-20 mt-1 w-36 rounded-md border border-border bg-card p-1 shadow-lg">
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
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground">
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Category filter chips */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              filters.category === cat.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground",
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Trend cards grid */}
      {trends.length === 0 ? (
        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-lg border border-dashed border-border text-center">
          <TrendingUp className="mb-3 h-8 w-8 text-muted-foreground" />
          <p className="font-medium">No trends match your filters</p>
          <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or category.</p>
          <Button variant="ghost" size="sm" className="mt-4" onClick={resetFilters}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {trends.map((trend) => (
            <article
              key={trend.id}
              className="group flex flex-col rounded-lg border border-border/60 bg-card/60 p-5 transition-colors hover:border-primary/40 hover:bg-card/90"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <span
                  className={cn(
                    "shrink-0 rounded-md border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em]",
                    STAGE_COLORS[trend.stage],
                  )}
                >
                  {trend.stage}
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden />
              </div>

              {/* Topic */}
              <h3 className="mt-4 text-sm font-semibold leading-snug">{trend.topic}</h3>
              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {trend.description}
              </p>

              {/* Velocity bar */}
              <div className="mt-4 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Zap className="h-3 w-3" aria-hidden />
                    Velocity
                  </span>
                  <span className="font-mono font-semibold">{trend.velocity}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/40">
                  <div
                    className={cn("h-full rounded-full transition-all", VELOCITY_COLOR(trend.velocity))}
                    style={{ width: `${trend.velocity}%` }}
                    role="meter"
                    aria-valuenow={trend.velocity}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Velocity: ${trend.velocity}`}
                  />
                </div>
              </div>

              {/* Footer meta */}
              <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3 text-xs text-muted-foreground">
                <span className="capitalize">{trend.category}</span>
                <span className="font-mono text-secondary">+{trend.change}%</span>
              </div>
            </article>
          ))}
        </div>
      )}
        </>
      )}
    </div>
  );
}
