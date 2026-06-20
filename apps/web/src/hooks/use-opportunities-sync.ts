"use client";

import { useEffect, useRef } from "react";

import { opportunitiesService } from "@/lib/supabase/services/opportunities.service";
import { useAuthStore } from "@/stores/auth-store";
import { useOpportunitiesStore } from "@/stores/opportunities-store";

export function useOpportunitiesSync() {
  const user = useAuthStore((s) => s.user);
  const hydrateSavedIds = useOpportunitiesStore((s) => s.hydrateSavedIds);
  const setSyncReady = useOpportunitiesStore((s) => s.setSyncReady);
  const readyRef = useRef(false);

  useEffect(() => {
    if (!user) {
      readyRef.current = false;
      setSyncReady(false);
      return;
    }

    let cancelled = false;

    opportunitiesService
      .fetchSavedIds(user.id)
      .then((ids) => {
        if (cancelled) return;
        hydrateSavedIds(new Set(ids));
        readyRef.current = true;
        setSyncReady(true);
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : (err && typeof err === "object" ? (err as { message?: string; details?: string }).message || (err as { message?: string; details?: string }).details || JSON.stringify(err) : String(err));
        console.warn(`[opportunities-sync] Failed to load (falling back to local state): ${message}`);
        if (!cancelled) {
          hydrateSavedIds(new Set());
          readyRef.current = true;
          setSyncReady(true);
        }
      });

    return () => {
      cancelled = true;
      readyRef.current = false;
    };
  }, [user, hydrateSavedIds, setSyncReady]);

  useEffect(() => {
    if (!user) return;

    return useOpportunitiesStore.subscribe((state, prev) => {
      if (!readyRef.current) return;
      if (state.savedIds === prev.savedIds) return;

      const added = [...state.savedIds].filter((id) => !prev.savedIds.has(id));
      const removed = [...prev.savedIds].filter((id) => !state.savedIds.has(id));

      for (const id of added) {
        opportunitiesService.save(user.id, id).catch((err) => {
          const msg = err instanceof Error ? err.message : (err && typeof err === "object" ? (err as { message?: string; details?: string }).message || (err as { message?: string; details?: string }).details || JSON.stringify(err) : String(err));
          console.warn(`[opportunities-sync] Failed to save: ${msg}`);
        });
      }
      for (const id of removed) {
        opportunitiesService.unsave(user.id, id).catch((err) => {
          const msg = err instanceof Error ? err.message : (err && typeof err === "object" ? (err as { message?: string; details?: string }).message || (err as { message?: string; details?: string }).details || JSON.stringify(err) : String(err));
          console.warn(`[opportunities-sync] Failed to unsave: ${msg}`);
        });
      }
    });
  }, [user]);
}
