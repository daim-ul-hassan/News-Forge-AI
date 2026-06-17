"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { marketingNavItems } from "@/components/navigation/nav-items";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { Button } from "@/components/ui/button";
import { appRoutes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function MarketingNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-colors",
        scrolled ? "border-b border-border bg-background/95 backdrop-blur-sm" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary font-mono text-sm font-bold text-primary-foreground">
            NF
          </span>
          <span className="font-mono text-lg font-semibold">{siteConfig.name}</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Marketing navigation">
          {marketingNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <Link href={appRoutes.dashboard}>Sign in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href={appRoutes.dashboard}>Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
