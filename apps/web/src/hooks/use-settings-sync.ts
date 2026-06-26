"use client";

import { useEffect, useRef } from "react";
import { settingsService } from "@/lib/supabase/services/settings.service";
import { useAuthStore } from "@/stores/auth-store";
import { useSettingsStore } from "@/stores/settings-store";
import type { UserSettings } from "@/types/settings.types";

export function useSettingsSync() {
  const user = useAuthStore((s) => s.user);
  const updateSettings = useSettingsStore((s) => s.updateSettings);
  const resetSettings = useSettingsStore((s) => s.resetSettings);
  const readyRef = useRef(false);

  useEffect(() => {
    if (!user) {
      readyRef.current = false;
      resetSettings();
      return;
    }

    let cancelled = false;
    settingsService
      .getSettings(user.id)
      .then((s) => {
        if (cancelled) return;
        if (s) updateSettings(s as UserSettings);
        readyRef.current = true;
      })
      .catch((err) => {
        console.warn("[settings-sync] failed to load settings", err);
        if (!cancelled) readyRef.current = true;
      });

    return () => {
      cancelled = true;
      readyRef.current = false;
    };
  }, [user, updateSettings, resetSettings]);

  useEffect(() => {
    if (!user) return;

    return useSettingsStore.subscribe((state, prev) => {
      // Persist on change after hydration
      if (!readyRef.current) return;
      if (state.settings === prev.settings) return;

      settingsService.upsertSettings(user.id, state.settings).catch((err) => {
        console.warn("[settings-sync] failed to persist settings", err);
      });
    });
  }, [user]);
}
