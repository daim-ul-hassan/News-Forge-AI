import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserSettings } from "@/types/settings.types";

interface SettingsState {
  settings: UserSettings;
  updateSettings: (partial: Partial<UserSettings>) => void;
  resetSettings: () => void;
  clearAllData: () => void;
}

const defaultSettings: UserSettings = {
  theme: "system",
  notifications: {
    research: true,
    trends: true,
    opportunities: true,
  },
  aiPreferences: {
    providerOrder: ["gemini", "groq", "openai"],
    defaultModel: "gemini-1.5-flash",
    streaming: true,
  },
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (partial) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...partial,
            notifications: {
              ...state.settings.notifications,
              ...(partial.notifications || {}),
            },
            aiPreferences: {
              ...state.settings.aiPreferences,
              ...(partial.aiPreferences || {}),
            },
          },
        })),
      resetSettings: () => set({ settings: defaultSettings }),
      clearAllData: () => {
        // Clear all local storage manually and reload
        window.localStorage.clear();
        window.location.reload();
      },
    }),
    {
      name: "nf-user-settings",
    },
  ),
);
