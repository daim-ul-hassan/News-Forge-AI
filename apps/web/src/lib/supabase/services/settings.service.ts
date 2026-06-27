import { createClient } from "@/lib/supabase/client";
import type { UserSettings } from "@/types/settings.types";

export const settingsService = {
  async getSettings(userId: string): Promise<UserSettings | null> {
    try {
    const supabase = createClient();
    // table typing not present in generated types; use escape hatch
    const { data, error } = await supabase
      .from(/* eslint-disable-line @typescript-eslint/no-explicit-any */ "user_settings" as any)
      .select("theme, density, effects, notifications, ai_provider_order")
      .eq("id", userId)
      .single();
      if (error) {
        console.warn("[settingsService] getSettings error", error.message);
        return null;
      }
      if (!data) return null;
      const row = data as unknown as {
        theme?: "system" | "light" | "dark" | string;
        density?: "comfortable" | "compact" | "dense" | string;
        effects?: boolean;
        notifications?: Record<string, boolean>;
        ai_provider_order?: string[];
      };

      const theme = row.theme === "light" || row.theme === "dark" ? (row.theme as "light" | "dark") : "system";
      const density = row.density === "compact" || row.density === "dense" ? (row.density as "compact" | "dense") : "comfortable";

      const notifications = row.notifications
        ? {
            research: Boolean(row.notifications.research),
            trends: Boolean(row.notifications.trends),
            opportunities: Boolean(row.notifications.opportunities),
          }
        : { research: true, trends: true, opportunities: true };

      const settings: UserSettings = {
        theme,
        density,
        effectsEnabled: row.effects ?? true,
        notifications,
        aiPreferences: {
          providerOrder: row.ai_provider_order ?? ["gemini", "groq", "openai"],
          defaultModel: "gemini-1.5-flash",
          streaming: true,
        },
      };

      return settings;
    } catch (err) {
      console.warn("[settingsService] getSettings unexpected", err);
      return null;
    }
  },

  async upsertSettings(userId: string, partial: Partial<UserSettings>) {
    try {
      const supabase = createClient();
      const row: Record<string, unknown> = { id: userId };
      if (partial.theme !== undefined) row.theme = partial.theme;
      if (partial.density !== undefined) row.density = partial.density;
      if (partial.effectsEnabled !== undefined) row.effects = partial.effectsEnabled;
      if (partial.notifications !== undefined) row.notifications = partial.notifications;
      const providerOrder = partial.aiPreferences?.providerOrder;
      if (providerOrder !== undefined) row.ai_provider_order = providerOrder;

      const { error } = await supabase.from(/* eslint-disable-line @typescript-eslint/no-explicit-any */ "user_settings" as any).upsert(row as unknown as Record<string, unknown>);
      if (error) console.warn("[settingsService] upsertSettings error", error.message);
      return !error;
    } catch (err) {
      console.warn("[settingsService] upsertSettings unexpected", err);
      return false;
    }
  },


  async ensureSettings(userId: string) {
    try {
      const supabase = createClient();
      const { data } = await supabase.from("user_settings" as any).select("id").eq("id", userId).single(); // eslint-disable-line @typescript-eslint/no-explicit-any
      if (!data) {
        const defaultRow = {
          id: userId,
          theme: "system",
          density: "comfortable",
          effects: true,
          notifications: { research: true, trends: true, opportunities: true },
          ai_provider_order: ["gemini", "groq", "openai"],
        };
        const { error } = await supabase.from(/* eslint-disable-line @typescript-eslint/no-explicit-any */ "user_settings" as any).insert(defaultRow as unknown as Record<string, unknown>);
        if (error) console.warn("[settingsService] ensureSettings insert error", error.message);
      }
      return true;
    } catch (err) {
      console.warn("[settingsService] ensureSettings unexpected", err);
      return false;
    }
  },
};