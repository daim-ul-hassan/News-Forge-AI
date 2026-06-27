"use client";

import { Check, ChevronDown, Clock, FileText, PenLine, Plus, Save, Trash2, Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { PageHeader } from "@/components/feedback/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDraftsStore } from "@/stores/drafts-store";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";
import type { DraftFormat, DraftStatus } from "@/types/drafts.types";

const FORMATS: DraftFormat[] = ["article", "script", "thread", "newsletter", "brief"];

const STATUS_LABELS: Record<DraftStatus, { label: string; color: string }> = {
  draft: { label: "Draft", color: "text-muted-foreground border-border/60" },
  "in-review": { label: "In Review", color: "text-primary border-primary/30" },
  ready: { label: "Ready", color: "text-secondary border-secondary/30" },
};

const AUTOSAVE_DELAY_MS = 1500;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function ContentStudioPage() {
  const { 
    drafts, activeDraftId, lastSavedAt, syncReady, 
    createDraft, updateDraft, deleteDraft, setActiveDraft, activeDraft,
    searchQuery, sortOrder, filterStatus, filterFormat, recentIds,
    setSearch, setSortOrder, setFilterStatus, setFilterFormat, filteredDrafts
  } = useDraftsStore();

  const draft = activeDraft();
  const displayed = filteredDrafts();
  const user = useAuthStore((s) => s.user);
  const isLoading = !!user && !syncReady;

  const [newTitle, setNewTitle] = useState("");
  const [newFormat, setNewFormat] = useState<DraftFormat>("article");
  const [createOpen, setCreateOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Local editor state (before autosave)
  const [localContent, setLocalContent] = useState(draft?.content ?? "");
  const [localTitle, setLocalTitle] = useState(draft?.title ?? "");

  // Sync local state when active draft changes
  useEffect(() => {
    setLocalContent(draft?.content ?? "");
    setLocalTitle(draft?.title ?? "");
  }, [activeDraftId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Autosave
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleContentChange = useCallback(
    (value: string) => {
      setLocalContent(value);
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
      autosaveTimer.current = setTimeout(() => {
        if (activeDraftId) {
          setSaving(true);
          updateDraft(activeDraftId, { content: value });
          setTimeout(() => setSaving(false), 600);
        }
      }, AUTOSAVE_DELAY_MS);
    },
    [activeDraftId, updateDraft],
  );

  const handleTitleBlur = () => {
    if (activeDraftId && localTitle !== draft?.title) {
      updateDraft(activeDraftId, { title: localTitle });
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createDraft(newTitle.trim(), newFormat);
    setNewTitle("");
    setNewFormat("article");
    setCreateOpen(false);
  };

  return (
    <div className="min-w-0 overflow-x-hidden">
      <PageHeader
        title="Content Studio"
        description="Draft, edit, and manage your content from research to ready-to-publish."
        actions={
          <Button size="sm" onClick={() => setCreateOpen((v) => !v)} className="gap-1.5">
            <Plus className="h-4 w-4" />
            New draft
          </Button>
        }
      />

      {/* Create form */}
      {createOpen && (
        <form
          onSubmit={handleCreate}
          className="mt-6 rounded-lg border border-primary/30 bg-primary/5 p-5 space-y-4"
        >
          <h2 className="text-sm font-semibold">Create new draft</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="Draft title…"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
              className="flex-1 bg-muted/30 border-border/60"
              aria-label="Draft title"
            />
            <select
              value={newFormat}
              onChange={(e) => setNewFormat(e.target.value as DraftFormat)}
              className="rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label="Draft format"
            >
              {FORMATS.map((f) => (
                <option key={f} value={f} className="capitalize bg-background">
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" size="sm">Create</Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Stats row */}
      {!isLoading && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-lg border border-border/60 bg-card/40 p-4">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Total Drafts</h3>
            <p className="text-2xl font-semibold">{drafts.length}</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-card/40 p-4">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Total Words</h3>
            <p className="text-2xl font-semibold">{drafts.reduce((sum, d) => sum + d.wordCount, 0)}</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-card/40 p-4">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">In Review</h3>
            <p className="text-2xl font-semibold">{drafts.filter(d => d.status === "in-review").length}</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-card/40 p-4">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Ready</h3>
            <p className="text-2xl font-semibold">{drafts.filter(d => d.status === "ready").length}</p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
          <div className="space-y-3">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-96 w-full rounded-lg" />
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Drafts list */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                placeholder="Search drafts…"
                value={searchQuery}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-muted/30 border-border/60"
                aria-label="Search drafts"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest" | "alphabetical")}
                className="w-full rounded-md border border-border/60 bg-muted/30 px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="Sort drafts"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="alphabetical">A-Z</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as "all" | DraftStatus)}
                className="w-full rounded-md border border-border/60 bg-muted/30 px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="Filter status"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="in-review">In Review</option>
                <option value="ready">Ready</option>
              </select>
              <select
                value={filterFormat}
                onChange={(e) => setFilterFormat(e.target.value as "all" | DraftFormat)}
                className="w-full rounded-md border border-border/60 bg-muted/30 px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="Filter format"
              >
                <option value="all">All Formats</option>
                {FORMATS.map(f => <option key={f} value={f} className="capitalize">{f}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
              Drafts ({displayed.length})
            </h2>
            {displayed.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-6 text-center">
                <FileText className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">No drafts found.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {displayed.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setActiveDraft(d.id)}
                    className={cn(
                      "w-full rounded-lg border p-3 text-left transition-colors",
                      activeDraftId === d.id
                        ? "border-primary/40 bg-primary/5"
                        : "border-border/60 bg-card/40 hover:border-border hover:bg-card/70",
                    )}
                    aria-label={`Open draft: ${d.title}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-medium leading-snug line-clamp-2">{d.title || "Untitled"}</span>
                      <span className={cn("shrink-0 rounded border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide", STATUS_LABELS[d.status].color)}>
                        {STATUS_LABELS[d.status].label}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span className="capitalize">{d.format}</span>
                      <span>·</span>
                      <span>{d.wordCount} words</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {recentIds.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> Recently Edited
              </h2>
              <div className="space-y-1.5">
                {recentIds.map(id => {
                  const d = drafts.find(n => n.id === id);
                  if (!d) return null;
                  return (
                    <button
                      key={d.id}
                      onClick={() => setActiveDraft(d.id)}
                      className="w-full rounded-md px-2 py-1.5 text-left text-xs transition-colors hover:bg-muted/50 text-muted-foreground"
                    >
                      <span className="block truncate font-medium text-foreground">{d.title || "Untitled"}</span>
                      <span className="mt-0.5 block truncate text-[10px]">Updated {formatDate(d.updatedAt)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Editor */}
        {draft ? (
          <div className="flex flex-col gap-4">
            {/* Editor toolbar */}
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/60 bg-card/40 p-3">
              <Input
                value={localTitle}
                onChange={(e) => setLocalTitle(e.target.value)}
                onBlur={handleTitleBlur}
                className="flex-1 border-none bg-transparent px-0 text-base font-semibold focus-visible:ring-0 focus-visible:ring-offset-0"
                aria-label="Draft title"
              />
              <div className="flex items-center gap-2 ml-auto">
                {/* Status selector */}
                <div className="relative">
                  <button
                    onClick={() => setStatusOpen((v) => !v)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                      STATUS_LABELS[draft.status].color,
                    )}
                    aria-label="Change draft status"
                  >
                    {STATUS_LABELS[draft.status].label}
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  {statusOpen && (
                    <div className="absolute right-0 top-full z-20 mt-1 w-32 rounded-md border border-border bg-card p-1 shadow-lg">
                      {(Object.keys(STATUS_LABELS) as DraftStatus[]).map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            updateDraft(draft.id, { status: s });
                            setStatusOpen(false);
                          }}
                          className={cn(
                            "w-full rounded px-3 py-1.5 text-left text-xs hover:bg-muted/50",
                            draft.status === s && "font-semibold",
                          )}
                        >
                          {STATUS_LABELS[s].label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {/* Autosave indicator */}
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  {saving ? (
                    <>
                      <Save className="h-3 w-3 animate-pulse" aria-hidden />
                      Saving…
                    </>
                  ) : lastSavedAt ? (
                    <>
                      <Check className="h-3 w-3 text-secondary" aria-hidden />
                      Saved
                    </>
                  ) : null}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteDraft(draft.id)}
                  aria-label="Delete draft"
                  className="h-7 w-7 text-muted-foreground hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Text editor */}
            <div className="flex-1 rounded-lg border border-border/60 bg-card/40">
              <textarea
                value={localContent}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Start writing your draft here…"
                className="h-full min-h-[420px] w-full resize-none rounded-lg bg-transparent px-5 py-4 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                aria-label="Draft content editor"
              />
            </div>

            {/* Footer meta */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <PenLine className="h-3 w-3" aria-hidden />
                {draft.wordCount} words
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" aria-hidden />
                Updated {formatDate(draft.updatedAt)}
              </span>
              <span className="capitalize">{draft.format}</span>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-border text-center">
            <PenLine className="mb-3 h-8 w-8 text-muted-foreground" />
            <p className="font-medium">No draft selected</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {drafts.length > 0 ? "Select a draft from the list to edit." : "Create your first draft to get started."}
            </p>
            {drafts.length === 0 && (
              <Button size="sm" className="mt-4 gap-1.5" onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4" />
                New draft
              </Button>
            )}
          </div>
        )}
      </div>
      )}
    </div>
  );
}
