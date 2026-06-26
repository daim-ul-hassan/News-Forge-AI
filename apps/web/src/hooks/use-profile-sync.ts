"use client";

import { useEffect, useRef } from "react";
import { profileService } from "@/lib/supabase/services/profile.service";
import { useAuthStore } from "@/stores/auth-store";
import { useProfileStore } from "@/stores/profile-store";

export function useProfileSync() {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const resetProfile = useProfileStore((s) => s.resetProfile);
  const readyRef = useRef(false);

  useEffect(() => {
    if (!user) {
      readyRef.current = false;
      resetProfile();
      return;
    }

    let cancelled = false;
    profileService
      .getProfile(user.id)
      .then((p) => {
        if (cancelled) return;
        if (p) updateProfile(p);
        readyRef.current = true;
      })
      .catch((err) => {
        console.warn("[profile-sync] failed to load profile", err);
        if (!cancelled) {
          readyRef.current = true;
        }
      });

    return () => {
      cancelled = true;
      readyRef.current = false;
    };
  }, [user, updateProfile, resetProfile]);

  useEffect(() => {
    if (!user) return;

    return useProfileStore.subscribe((state, prev) => {
      if (!readyRef.current) return;
      if (state.profile === prev.profile) return;

      // Persist changes to Supabase
      profileService.upsertProfile(user.id, state.profile ?? {}).catch((err) => {
        console.warn("[profile-sync] failed to persist profile", err);
      });
    });
  }, [user]);
}
