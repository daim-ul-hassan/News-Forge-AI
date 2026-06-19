"use client";

import { useEffect, useRef } from "react";

import { researchService } from "@/lib/supabase/services/research.service";
import { useAuthStore } from "@/stores/auth-store";
import { useResearchStore } from "@/stores/research-store";
import type { ResearchHistoryItem, ResearchNote } from "@/types/research.types";

function diffNotes(prev: ResearchNote[], next: ResearchNote[]) {
  const prevMap = new Map(prev.map((n) => [n.id, n]));
  const nextMap = new Map(next.map((n) => [n.id, n]));

  const added = next.filter((n) => !prevMap.has(n.id));
  const removed = prev.filter((n) => !nextMap.has(n.id));
  const updated = next.filter((n) => {
    const old = prevMap.get(n.id);
    return old && old.updatedAt !== n.updatedAt;
  });

  return { added, removed, updated };
}

function diffHistory(prev: ResearchHistoryItem[], next: ResearchHistoryItem[]) {
  const prevIds = new Set(prev.map((h) => h.id));
  const nextIds = new Set(next.map((h) => h.id));

  const added = next.filter((h) => !prevIds.has(h.id));
  const removed = prev.filter((h) => !nextIds.has(h.id));

  return { added, removed };
}

export function useResearchSync() {
  const user = useAuthStore((s) => s.user);
  const hydrate = useResearchStore((s) => s.hydrate);
  const setSyncReady = useResearchStore((s) => s.setSyncReady);
  const readyRef = useRef(false);

  useEffect(() => {
    if (!user) {
      readyRef.current = false;
      setSyncReady(false);
      return;
    }

    let cancelled = false;

    researchService
      .fetchAll(user.id)
      .then((data) => {
        if (cancelled) return;
        hydrate(data);
        readyRef.current = true;
        setSyncReady(true);
      })
      .catch((err) => {
        console.error("[research-sync] Failed to load:", err);
      });

    return () => {
      cancelled = true;
      readyRef.current = false;
    };
  }, [user, hydrate, setSyncReady]);

  useEffect(() => {
    if (!user) return;

    return useResearchStore.subscribe((state, prev) => {
      if (!readyRef.current) return;

      const { added, removed, updated } = diffNotes(prev.notes, state.notes);
      for (const note of [...added, ...updated]) {
        researchService.upsertNote(user.id, note).catch((err) => {
          console.error("[research-sync] Failed to upsert note:", err);
        });
      }
      for (const note of removed) {
        researchService.deleteNote(user.id, note.id).catch((err) => {
          console.error("[research-sync] Failed to delete note:", err);
        });
      }

      if (prev.history.length > 0 && state.history.length === 0 && prev.history !== state.history) {
        researchService.clearHistory(user.id).catch((err) => {
          console.error("[research-sync] Failed to clear history:", err);
        });
        return;
      }

      const historyDiff = diffHistory(prev.history, state.history);
      for (const item of historyDiff.added) {
        researchService.upsertHistoryItem(user.id, item).catch((err) => {
          console.error("[research-sync] Failed to upsert history:", err);
        });
      }
      for (const item of historyDiff.removed) {
        researchService.deleteHistoryItem(user.id, item.id).catch((err) => {
          console.error("[research-sync] Failed to delete history item:", err);
        });
      }
    });
  }, [user]);
}
