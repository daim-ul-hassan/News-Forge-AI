"use client";

import { AlertTriangle } from "lucide-react";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CommandPalette } from "@/components/search/command-palette";
import { useAuthStore } from "@/stores/auth-store";

interface DashboardShellProps {
  children: React.ReactNode;
}

function AuthBanner() {
  const status = useAuthStore((state) => state.status);

  if (status === "authenticated") return null;

  return (
    <div
      className="flex items-center gap-2 border-b border-primary/20 bg-primary/5 px-4 py-2 text-sm text-foreground"
      role="status"
    >
      <AlertTriangle className="h-4 w-4 shrink-0 text-primary" aria-hidden />
      <span>Sign in required — TODO. Backend auth integration pending.</span>
    </div>
  );
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <MobileNav />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AuthBanner />
        <AppHeader />
        <main id="main-content" className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
