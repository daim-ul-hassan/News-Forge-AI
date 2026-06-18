"use client";

import { Menu } from "lucide-react";

import { BreadcrumbNav } from "@/components/navigation/breadcrumb-nav";
import { SearchBar } from "@/components/search/search-bar";
import { AppUserNav } from "@/components/layout/app-user-nav";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/stores/ui-store";

export function AppHeader() {
  const setMobileNavOpen = useUiStore((state) => state.setMobileNavOpen);

  return (
    <header className="flex h-[var(--header-height)] items-center gap-4 border-b border-border bg-background px-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setMobileNavOpen(true)}
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </Button>
      <BreadcrumbNav className="hidden sm:flex" />
      <div className="ml-auto flex items-center gap-2">
        <SearchBar className="hidden w-64 md:block lg:w-72" />
        <ThemeSwitcher />
        <AppUserNav />
      </div>
    </header>
  );
}
