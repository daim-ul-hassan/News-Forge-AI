"use client";

import { useEffect, useRef } from "react";

import { draftsService } from "@/lib/supabase/services/drafts.service";
import { useAuthStore } from "@/stores/auth-store";
import { useDraftsStore } from "@/stores/drafts-store";
import type { Draft } from "@/types/drafts.types";

function diffDrafts(prev: Draft[], next: Draft[]) {
  const prevMap = new Map(prev.map((d) => [d.id, d]));
  const nextMap = new Map(next.map((d) => [d.id, d]));

  const added = next.filter((d) => !prevMap.has(d.id));
  const removed = prev.filter((d) => !nextMap.has(d.id));
  const updated = next.filter((d) => {
    const old = prevMap.get(d.id);
    return old && old.updatedAt !== d.updatedAt;
  });

  return { added, removed, updated };
}

export function useDraftsSync() {
  const user = useAuthStore((s) => s.user);
  const hydrate = useDraftsStore((s) => s.hydrate);
  const setSyncReady = useDraftsStore((s) => s.setSyncReady);
  const readyRef = useRef(false);

  useEffect(() => {
    if (!user) {
      readyRef.current = false;
      setSyncReady(false);
      return;
    }

    let cancelled = false;

    draftsService
      .fetchAll(user.id)
      .then((drafts) => {
        if (cancelled) return;
        hydrate(drafts);
        readyRef.current = true;
        setSyncReady(true);
      })
      .catch((err) => {
        console.error("[drafts-sync] Failed to load:", err);
      });

    return () => {
      cancelled = true;
      readyRef.current = false;
    };
  }, [user, hydrate, setSyncReady]);

  useEffect(() => {
    if (!user) return;

    return useDraftsStore.subscribe((state, prev) => {
      if (!readyRef.current) return;

      const { added, removed, updated } = diffDrafts(prev.drafts, state.drafts);
      for (const draft of [...added, ...updated]) {
        draftsService.upsertDraft(user.id, draft).catch((err) => {
          console.error("[drafts-sync] Failed to upsert draft:", err);
        });
      }
      for (const draft of removed) {
        draftsService.deleteDraft(user.id, draft.id).catch((err) => {
          console.error("[drafts-sync] Failed to delete draft:", err);
        });
      }
    });
  }, [user]);
}
