"use client";

import { useAssistantSync } from "@/hooks/use-assistant-sync";
import { useDraftsSync } from "@/hooks/use-drafts-sync";
import { useOpportunitiesSync } from "@/hooks/use-opportunities-sync";
import { useResearchSync } from "@/hooks/use-research-sync";
import { useProfileSync } from "@/hooks/use-profile-sync";
import { useSettingsSync } from "@/hooks/use-settings-sync";

/**
 * Hydrates Zustand stores from Supabase and syncs mutations back.
 * Mount once inside AuthProvider so it runs for authenticated sessions.
 */
export function DataSyncProvider({ children }: { children: React.ReactNode }) {
  useResearchSync();
  useDraftsSync();
  useOpportunitiesSync();
  useAssistantSync();
  useProfileSync();
  useSettingsSync();

  return <>{children}</>;
}
