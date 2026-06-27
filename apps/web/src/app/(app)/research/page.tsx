"use client";

import { Clock, FileSearch, Plus, Search, Tag, Trash2, Pin, PinOff, BarChart2, CalendarDays, History } from "lucide-react";
import { useState } from "react";

import { PageHeader } from "@/components/feedback/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useResearchStore } from "@/stores/research-store";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function ResearchPage() {
  const { notes, history, searchQuery, syncReady, addNote, deleteNote, setSearch, filteredNotes, addHistory, clearHistory, pinnedIds, recentIds, sortOrder, togglePin, markViewed, setSortOrder } =
    useResearchStore();
  const user = useAuthStore((s) => s.user);
  const isLoading = !!user && !syncReady;

  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  const displayed = filteredNotes();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !content.trim()) return;
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    addNote(topic.trim(), content.trim(), tags);
    if (topic.trim()) addHistory(topic.trim());
    setTopic("");
    setContent("");
    setTagsInput("");
    setFormOpen(false);
  };

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <PageHeader
        title="Research"
        description="Save findings, track topics, and build a knowledge base for your content."
        actions={
          <Button size="sm" onClick={() => setFormOpen((v) => !v)} className="gap-1.5">
            <Plus className="h-4 w-4" />
            New note
          </Button>
        }
      />

      {/* Add note form */}
      {formOpen && (
        <form
          onSubmit={handleAdd}
          className="rounded-lg border border-primary/30 bg-primary/5 p-5 space-y-4"
        >
          <h2 className="text-sm font-semibold">New research note</h2>
          <div className="space-y-3">
            <Input
              placeholder="Topic / headline"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
              className="bg-muted/30 border-border/60"
              aria-label="Note topic"
            />
            <textarea
              placeholder="Write your findings, summary, or notes here…"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={4}
              className="w-full resize-none rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label="Note content"
            />
            <Input
              placeholder="Tags (comma separated): AI, Research, Tech"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="bg-muted/30 border-border/60"
              aria-label="Note tags"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" size="sm">Save note</Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Stats row */}
      {!isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-lg border border-border/60 bg-card/40 p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <FileSearch className="h-4 w-4" />
              <h3 className="text-xs font-medium uppercase tracking-wider">Total Notes</h3>
            </div>
            <p className="text-2xl font-semibold">{notes.length}</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-card/40 p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Pin className="h-4 w-4" />
              <h3 className="text-xs font-medium uppercase tracking-wider">Pinned</h3>
            </div>
            <p className="text-2xl font-semibold">{pinnedIds.length}</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-card/40 p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <CalendarDays className="h-4 w-4" />
              <h3 className="text-xs font-medium uppercase tracking-wider">This Week</h3>
            </div>
            <p className="text-2xl font-semibold">
              {notes.filter(n => new Date(n.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
            </p>
          </div>
          <div className="rounded-lg border border-border/60 bg-card/40 p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <BarChart2 className="h-4 w-4" />
              <h3 className="text-xs font-medium uppercase tracking-wider">Topics</h3>
            </div>
            <p className="text-2xl font-semibold">{new Set(notes.map(n => n.topic)).size}</p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-lg" />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <Skeleton className="h-6 w-32" />
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
          {/* Notes column */}
        <div className="space-y-4">
          {/* Search */}
          <div className="flex gap-3 relative">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                placeholder="Search notes…"
                value={searchQuery}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-muted/30 border-border/60"
                aria-label="Search notes"
              />
            </div>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest" | "alphabetical")}
              className="rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label="Sort notes"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="alphabetical">A-Z</option>
            </select>
          </div>

          {displayed.length === 0 ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-lg border border-dashed border-border text-center">
              <FileSearch className="mb-3 h-8 w-8 text-muted-foreground" />
              <p className="font-medium">
                {notes.length === 0 ? "No notes yet" : "No notes match your search"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {notes.length === 0
                  ? "Create your first research note to get started."
                  : "Try a different search term."}
              </p>
              {notes.length === 0 && (
                <Button variant="ghost" size="sm" className="mt-4" onClick={() => setFormOpen(true)}>
                  New note
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {displayed.map((note) => (
                <article
                  key={note.id}
                  onClick={() => markViewed(note.id)}
                  className="group cursor-pointer rounded-lg border border-border/60 bg-card/60 p-5 transition-colors hover:border-secondary/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {pinnedIds.includes(note.id) && (
                        <Pin className="h-3.5 w-3.5 text-primary fill-primary" />
                      )}
                      <h3 className="text-sm font-semibold leading-snug">{note.topic}</h3>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => { e.stopPropagation(); togglePin(note.id); }}
                        aria-label={`${pinnedIds.includes(note.id) ? "Unpin" : "Pin"} note`}
                        className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
                      >
                        {pinnedIds.includes(note.id) ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                        aria-label={`Delete note: ${note.topic}`}
                        className="h-7 w-7 shrink-0 text-muted-foreground hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground line-clamp-4">
                    {note.content}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {note.tags.map((tag) => (
                      <span key={tag} className="flex items-center gap-1 rounded bg-muted/40 px-2 py-0.5 text-[10px] text-muted-foreground">
                        <Tag className="h-2.5 w-2.5" aria-hidden />
                        {tag}
                      </span>
                    ))}
                    <span className="ml-auto flex flex-col items-end gap-0.5 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" aria-hidden />
                        {formatDate(note.createdAt)}
                      </span>
                      {note.updatedAt !== note.createdAt && (
                        <span className="text-[9px] opacity-70">
                          Edited: {formatDate(note.updatedAt)}
                        </span>
                      )}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* History sidebar */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <History className="h-4 w-4" />
                Recent searches
              </h2>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <p className="text-xs text-muted-foreground">Searches will appear here.</p>
            ) : (
              <ul className="space-y-1.5">
                {history.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setSearch(item.query)}
                      className={cn(
                        "w-full rounded-md px-3 py-2 text-left text-xs transition-colors hover:bg-muted/50",
                        searchQuery === item.query ? "bg-muted/50 text-foreground" : "text-muted-foreground",
                      )}
                    >
                      <span className="block truncate">{item.query}</span>
                      <span className="mt-0.5 block text-[10px] text-muted-foreground/60">
                        {formatDate(item.timestamp)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="space-y-3">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Recently viewed notes
            </h2>
            {recentIds.length === 0 ? (
              <p className="text-xs text-muted-foreground">Notes you click on will appear here.</p>
            ) : (
              <ul className="space-y-1.5">
                {recentIds.map((id) => {
                  const note = notes.find(n => n.id === id);
                  if (!note) return null;
                  return (
                    <li key={id}>
                      <button
                        onClick={() => setSearch('')}
                        className="w-full rounded-md px-3 py-2 text-left text-xs transition-colors hover:bg-muted/50 text-muted-foreground"
                      >
                        <span className="block truncate font-medium text-foreground">{note.topic}</span>
                        <span className="mt-0.5 block truncate text-[10px]">
                          {note.content.substring(0, 40)}...
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
