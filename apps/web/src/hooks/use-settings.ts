import { useSettingsStore } from "@/stores/settings-store";
import { usePreferencesStore } from "@/stores/preferences-store";

export function useSettings() {
  const { settings, updateSettings, resetSettings, clearAllData } = useSettingsStore();
  const { density, effectsEnabled, setDensity, setEffectsEnabled } = usePreferencesStore();

  return {
    settings,
    updateSettings,
    resetSettings,
    clearAllData,
    density,
    effectsEnabled,
    setDensity,
    setEffectsEnabled,
  };
}
