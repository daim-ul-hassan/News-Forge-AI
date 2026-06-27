"use client";

import { useEffect, useRef } from "react";
import { profileService } from "@/lib/supabase/services/profile.service";
import { useAuthStore } from "@/stores/auth-store";
import { useProfileStore } from "@/stores/profile-store";

export function useProfileSync() {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const resetProfile = useProfileStore((s) => s.resetProfile);
  // readyRef gates the subscription so it only persists changes made AFTER
  // the initial hydration fetch completes.
  const readyRef = useRef(false);

  // Hydrate profile from Supabase whenever the authenticated user changes.
  useEffect(() => {
    if (!user) {
      readyRef.current = false;
      resetProfile();
      return;
    }

    // Always reset first to guarantee no stale data from a previous user
    // bleeds into the new session before Supabase responds.
    readyRef.current = false;
    resetProfile();

    let cancelled = false;
    profileService
      .getProfile(user.id)
      .then((p) => {
        if (cancelled) return;
        if (p) updateProfile(p);
        readyRef.current = true;
      })
      .catch(() => {
        if (!cancelled) {
          readyRef.current = true;
        }
      });

    return () => {
      cancelled = true;
      readyRef.current = false;
    };
  }, [user, updateProfile, resetProfile]);

  // Persist profile mutations to Supabase after initial hydration is done.
  useEffect(() => {
    if (!user) return;

    return useProfileStore.subscribe((state, prev) => {
      if (!readyRef.current) return;
      if (state.profile === prev.profile) return;

      profileService.upsertProfile(user.id, state.profile ?? {}).catch(() => {
        // silent — non-critical background persist
      });
    });
  }, [user]);
}
