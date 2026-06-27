"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { profileService } from "@/lib/supabase/services/profile.service";
import { settingsService } from "@/lib/supabase/services/settings.service";
import { subscriptionsService } from "@/lib/supabase/services/subscriptions.service";
import { useProfileStore } from "@/stores/profile-store";
import { useSettingsStore } from "@/stores/settings-store";
import type { UserSettings } from "@/types/settings.types";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const supabase = createClient();

    // Check active session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const user = session?.user ?? null;

      // Always reset profile before setting user so no stale data leaks
      // into the new session while Supabase fetch is in flight.
      useProfileStore.getState().resetProfile();

      setUser(user);
      if (user) {
        try {
          await Promise.all([
            profileService.ensureProfile(user.id),
            settingsService.ensureSettings(user.id),
            subscriptionsService.ensureSubscription(user.id),
          ]);

          const [profile, settings] = await Promise.all([
            profileService.getProfile(user.id),
            settingsService.getSettings(user.id),
            subscriptionsService.getSubscription(user.id),
          ]);

          if (profile) useProfileStore.getState().updateProfile(profile);
          if (settings) useSettingsStore.getState().updateSettings(settings as UserSettings);
        } catch (err) {
          console.warn("[AuthProvider] Hydration failed", err);
        }
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Wrap in setTimeout to prevent Supabase onAuthStateChange deadlock
      setTimeout(async () => {
        const user = session?.user ?? null;

        // Always reset profile before hydrating the new user's data.
        // This prevents User A's profile from being visible to User B
        // during the async Supabase fetch.
        useProfileStore.getState().resetProfile();

        setUser(user);

        if (user) {
          try {
            await Promise.all([
              profileService.ensureProfile(user.id),
              settingsService.ensureSettings(user.id),
              subscriptionsService.ensureSubscription(user.id),
            ]);

            const [profile, settings] = await Promise.all([
              profileService.getProfile(user.id),
              settingsService.getSettings(user.id),
              subscriptionsService.getSubscription(user.id),
            ]);

            if (profile) useProfileStore.getState().updateProfile(profile);
            if (settings) useSettingsStore.getState().updateSettings(settings as UserSettings);
          } catch (err) {
            console.warn("[AuthProvider] Hydration failed", err);
          }
        } else {
          // Clear profile and settings on sign out
          useProfileStore.getState().resetProfile();
          useSettingsStore.getState().resetSettings();
        }
      }, 0);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser]);

  return <>{children}</>;
}
