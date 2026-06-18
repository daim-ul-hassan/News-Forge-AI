"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

export function SearchBar({ className, placeholder = "Search or jump to..." }: SearchBarProps) {
  const setCommandPaletteOpen = useUiStore((state) => state.setCommandPaletteOpen);

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <Input
        type="search"
        placeholder={placeholder}
        className="pl-9"
        onFocus={() => setCommandPaletteOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "/") {
            event.preventDefault();
            setCommandPaletteOpen(true);
          }
        }}
        readOnly
        aria-label="Open command palette"
      />
      <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground sm:inline-block">
        Ctrl K
      </kbd>
    </div>
  );
}
