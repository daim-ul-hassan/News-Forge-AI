"use client";

import { useUiStore } from "@/stores/ui-store";

export function useSidebar() {
  const sidebarCollapsed = useUiStore((state) => state.sidebarCollapsed);
  const sidebarOpen = useUiStore((state) => state.sidebarOpen);
  const setSidebarCollapsed = useUiStore((state) => state.setSidebarCollapsed);
  const toggleSidebarCollapsed = useUiStore((state) => state.toggleSidebarCollapsed);
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);

  return {
    sidebarCollapsed,
    sidebarOpen,
    setSidebarCollapsed,
    toggleSidebarCollapsed,
    setSidebarOpen,
  };
}
