"use client";

import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Search,
} from "lucide-react";

import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { PageHeader } from "@/components/feedback/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNewsFeed } from "@/hooks/use-news-feed";
import { cn } from "@/lib/utils";
import type { ArticleCategory } from "@/types/news.types";

const CATEGORIES: Array<{ label: string; value: ArticleCategory | "all" }> = [
  { label: "All", value: "all" },
  { label: "Technology", value: "technology" },
  { label: "Business", value: "business" },
  { label: "Politics", value: "politics" },
  { label: "Science", value: "science" },
  { label: "Health", value: "health" },
  { label: "Environment", value: "environment" },
  { label: "Culture", value: "culture" },
  { label: "Entertainment", value: "entertainment" },
];

function formatTimeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function NewsFeedPage() {
  const {
    articles,
    filters,
    page,
    totalPages,
    total,
    isLoading,
    error,
    refetch,
    setSearch,
    setCategory,
    goToPage,
  } = useNewsFeed();

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <PageHeader
        title="News Feed"
        description="A curated reading surface for staying ahead of the narrative."
        actions={
          <span className="hidden rounded-md border border-border/60 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground sm:inline-flex">
            {total} article{total !== 1 ? "s" : ""}
          </span>
        }
      />

      {isLoading ? (
        <div className="mt-8">
          <LoadingState rows={3} />
        </div>
      ) : error ? (
        <ErrorState
          title="Failed to load news feed"
          description={error}
          onRetry={() => refetch()}
        />
      ) : (
        <>
          {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          placeholder="Search articles, sources, tags…"
          value={filters.search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-muted/30 border-border/60"
          aria-label="Search articles"
        />
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              filters.category === cat.value
                ? "border-secondary bg-secondary/10 text-secondary"
                : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground",
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Article list */}
      {articles.length === 0 ? (
        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-lg border border-dashed border-border text-center">
          <BookOpen className="mb-3 h-8 w-8 text-muted-foreground" />
          <p className="font-medium">No articles match your filters</p>
          <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or category.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <article
              key={article.id}
              className="group flex flex-col gap-3 rounded-lg border border-border/60 bg-card/60 p-5 transition-colors hover:border-secondary/40 sm:flex-row sm:items-start"
            >
              <div className="flex-1 min-w-0">
                {/* Source + category badge */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">{article.source}</span>
                  <span className="rounded border border-border/50 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground capitalize">
                    {article.category}
                  </span>
                  {article.credibilityScore && (
                    <span className={cn(
                      "rounded border px-1.5 py-0.5 text-[10px] font-mono",
                      article.credibilityScore >= 90 ? "border-secondary/30 text-secondary" : "border-border/50 text-muted-foreground"
                    )}>
                      {article.credibilityScore}% credible
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="mt-2 text-sm font-semibold leading-snug group-hover:text-secondary transition-colors">
                  {article.title}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {article.summary}
                </p>

                {/* Tags */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {article.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="rounded bg-muted/40 px-2 py-0.5 text-[10px] text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right meta */}
              <div className="flex flex-row items-center gap-4 sm:flex-col sm:items-end sm:gap-3 shrink-0">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" aria-hidden />
                  {formatTimeAgo(article.publishedAt)}
                </span>
                <span className="text-xs text-muted-foreground">{article.readTimeMinutes} min read</span>
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-secondary"
                  aria-label={`Open ${article.title} on ${article.source}`}
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  Open
                </a>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
            className="border-border/60"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-mono text-xs text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
            className="border-border/60"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
        </>
      )}
    </div>
  );
}
