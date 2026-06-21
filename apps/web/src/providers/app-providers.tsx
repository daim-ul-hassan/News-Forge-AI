"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";

import { Toaster } from "@/components/ui/sonner";
import { EffectsProvider } from "@/components/effects/effects-provider";
import { ModalProvider } from "@/components/modals/modal-provider";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { DataSyncProvider } from "@/providers/data-sync-provider";
import { ThemeSyncProvider } from "@/components/providers/theme-sync-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <ThemeSyncProvider />
      <QueryProvider>
        <AuthProvider>
          <DataSyncProvider>
            <ModalProvider>
              <EffectsProvider>
                {children}
                <Toaster richColors closeButton position="top-right" />
              </EffectsProvider>
            </ModalProvider>
          </DataSyncProvider>
        </AuthProvider>
      </QueryProvider>
    </NextThemesProvider>
  );
}
