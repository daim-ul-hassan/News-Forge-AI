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
      setUser(user);
      if (user) {
        // Ensure DB rows exist and hydrate stores
        try {
          await Promise.all([
            profileService.ensureProfile(user.id),
            settingsService.ensureSettings(user.id),
            subscriptionsService.ensureSubscription(user.id),
          ]);

          const [profile, settings, _subscription] = await Promise.all([
            profileService.getProfile(user.id),
            settingsService.getSettings(user.id),
            subscriptionsService.getSubscription(user.id),
          ]);

          if (profile) useProfileStore.getState().updateProfile(profile);
          if (settings) useSettingsStore.getState().updateSettings(settings as UserSettings);
          // subscription can be used by components via API call when needed
        } catch (err) {
          console.warn("[AuthProvider] Hydration failed", err);
        }
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user ?? null;
      setUser(user);

      if (user) {
        try {
          await Promise.all([
            profileService.ensureProfile(user.id),
            settingsService.ensureSettings(user.id),
            subscriptionsService.ensureSubscription(user.id),
          ]);

          const [profile, settings, _subscription] = await Promise.all([
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
        // clear profile/settings on sign out
        useProfileStore.getState().resetProfile();
        useSettingsStore.getState().resetSettings();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser]);

  return <>{children}</>;
}
