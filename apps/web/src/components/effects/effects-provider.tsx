"use client";

import { createContext, useContext } from "react";

import { usePreferencesStore } from "@/stores/preferences-store";

interface EffectsContextValue {
  effectsEnabled: boolean;
}

const EffectsContext = createContext<EffectsContextValue>({ effectsEnabled: false });

export function EffectsProvider({ children }: { children: React.ReactNode }) {
  const effectsEnabled = usePreferencesStore((state) => state.effectsEnabled);

  return <EffectsContext.Provider value={{ effectsEnabled }}>{children}</EffectsContext.Provider>;
}

export function useEffects() {
  return useContext(EffectsContext);
}
