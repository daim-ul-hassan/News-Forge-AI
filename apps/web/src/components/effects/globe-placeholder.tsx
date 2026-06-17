"use client";

import { Globe } from "lucide-react";

import { useEffects } from "./effects-provider";

export function GlobePlaceholder() {
  const { effectsEnabled } = useEffects();

  if (!effectsEnabled) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
        <p className="text-sm text-muted-foreground">Interactive globe — TODO</p>
      </div>
    );
  }

  return (
    <div className="relative flex h-48 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/30">
      <Globe className="h-16 w-16 text-secondary animate-pulse" aria-hidden />
      <p className="absolute bottom-4 text-xs text-muted-foreground">Interactive globe — TODO</p>
    </div>
  );
}
