"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";

import { Toaster } from "@/components/ui/sonner";
import { EffectsProvider } from "@/components/effects/effects-provider";
import { ModalProvider } from "@/components/modals/modal-provider";
import { QueryProvider } from "@/providers/query-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryProvider>
        <ModalProvider>
          <EffectsProvider>
            {children}
            <Toaster richColors closeButton position="top-right" />
          </EffectsProvider>
        </ModalProvider>
      </QueryProvider>
    </NextThemesProvider>
  );
}
