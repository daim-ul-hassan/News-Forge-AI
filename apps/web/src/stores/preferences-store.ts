import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Density = "comfortable" | "compact";

interface PreferencesState {
  density: Density;
  effectsEnabled: boolean;
  defaultLandingTab: string;
  setDensity: (density: Density) => void;
  setEffectsEnabled: (enabled: boolean) => void;
  setDefaultLandingTab: (tab: string) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      density: "comfortable",
      effectsEnabled: false,
      defaultLandingTab: "dashboard",
      setDensity: (density) => set({ density }),
      setEffectsEnabled: (enabled) => set({ effectsEnabled: enabled }),
      setDefaultLandingTab: (tab) => set({ defaultLandingTab: tab }),
    }),
    {
      name: "newsforge-preferences",
    },
  ),
);
