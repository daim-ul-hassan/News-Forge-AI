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
        console.error("[opportunities-sync] Failed to load:", err);
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
          console.error("[opportunities-sync] Failed to save:", err);
        });
      }
      for (const id of removed) {
        opportunitiesService.unsave(user.id, id).catch((err) => {
          console.error("[opportunities-sync] Failed to unsave:", err);
        });
      }
    });
  }, [user]);
}
