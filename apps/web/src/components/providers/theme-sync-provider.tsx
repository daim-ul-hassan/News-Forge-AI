"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useSettingsStore } from "@/stores/settings-store";

export function ThemeSyncProvider() {
  const [mounted, setMounted] = useState(false);
  const { setTheme } = useTheme();
  const { settings } = useSettingsStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && settings.theme) {
      setTheme(settings.theme);
    }
  }, [mounted, settings.theme, setTheme]);

  return null;
}

