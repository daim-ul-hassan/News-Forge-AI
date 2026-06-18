import type { LucideIcon } from "lucide-react";
import { AlertCircle, CheckCircle2, Clock3 } from "lucide-react";

import { ContentCard } from "@/components/data-display/content-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { PageHeader } from "@/components/feedback/page-header";
import { cn } from "@/lib/utils";

export interface PlaceholderCard {
  title: string;
  description: string;
  label: string;
  icon: LucideIcon;
  tone?: "orange" | "cyan";
}

interface AppPageScaffoldProps {
  title: string;
  description: string;
  notice: string;
  cards: PlaceholderCard[];
  emptyTitle: string;
  emptyDescription: string;
  errorTitle?: string;
  errorDescription?: string;
  children?: React.ReactNode;
}

export function AppPageScaffold({
  title,
  description,
  notice,
  cards,
  emptyTitle,
  emptyDescription,
  errorTitle = "Preview state unavailable",
  errorDescription = "This error treatment is ready for future connected data and retry flows.",
  children,
}: AppPageScaffoldProps) {
  const pageId = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  return (
    <div className="space-y-8">
      <PageHeader
        title={title}
        description={description}
        actions={
          <span className="rounded-md border border-primary/25 bg-primary/10 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
            TODO
          </span>
        }
      />

      <div className="app-panel rounded-lg p-4 sm:p-5" role="note" aria-label="Integration notice">
        <div className="flex gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-primary/25 bg-primary/10 text-primary">
            <Clock3 className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
              Backend integration pending
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{notice}</p>
          </div>
        </div>
      </div>

      <section aria-labelledby={`${pageId}-placeholders`} className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id={`${pageId}-placeholders`} className="text-lg font-semibold">
              Planned workspace
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Production-ready placeholders for the capabilities this page will support.
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <PlaceholderFeatureCard key={card.title} card={card} />
          ))}
        </div>
      </section>

      {children}

      <section aria-labelledby={`${pageId}-states`} className="space-y-4">
        <div>
          <h2 id={`${pageId}-states`} className="text-lg font-semibold">
            Page states
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Empty, loading, and error examples are visible now so future integrations have a clear UX target.
          </p>
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          <StateCard title="Loading state" icon={Clock3}>
            <LoadingState rows={2} />
          </StateCard>
          <StateCard title="Error state" icon={AlertCircle}>
            <ErrorState
              title={errorTitle}
              description={errorDescription}
              className="min-h-[236px] border-border/80 bg-background/35 px-5 py-8"
            />
          </StateCard>
          <EmptyState
            title={emptyTitle}
            description={emptyDescription}
            className="min-h-[288px] bg-background/35 px-5 py-8"
            icon={<CheckCircle2 className="h-6 w-6" aria-hidden />}
          />
        </div>
      </section>
    </div>
  );
}

function PlaceholderFeatureCard({ card }: { card: PlaceholderCard }) {
  const Icon = card.icon;

  return (
    <ContentCard
      title={card.title}
      description={card.description}
      meta={card.label}
      className="app-panel group min-h-[210px] bg-card/70"
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">TODO</span>
          <span
            className={cn(
              "h-1.5 w-10 rounded-full transition-all duration-300 group-hover:w-14",
              card.tone === "cyan" ? "bg-secondary" : "bg-primary",
            )}
          />
        </div>
      }
    >
      <div
        className={cn(
          "mb-4 flex h-10 w-10 items-center justify-center rounded-md border",
          card.tone === "cyan"
            ? "border-secondary/30 bg-secondary/10 text-secondary"
            : "border-primary/30 bg-primary/10 text-primary",
        )}
      >
        <Icon className="h-5 w-5" aria-hidden />
      </div>
    </ContentCard>
  );
}

function StateCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <div className="app-panel rounded-lg p-5">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <Icon className="h-4 w-4" aria-hidden />
        <h3>{title}</h3>
      </div>
      {children}
    </div>
  );
}
