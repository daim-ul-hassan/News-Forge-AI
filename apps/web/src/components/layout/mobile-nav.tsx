"use client";

import Link from "next/link";

import { appNavItems } from "@/components/navigation/nav-items";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";
import { useUiStore } from "@/stores/ui-store";

export function MobileNav() {
  const mobileNavOpen = useUiStore((state) => state.mobileNavOpen);
  const setMobileNavOpen = useUiStore((state) => state.setMobileNavOpen);

  return (
    <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
      <SheetContent side="left" className="w-[var(--sidebar-width)] p-0">
        <SheetHeader className="border-b border-border p-4 text-left">
          <SheetTitle className="font-mono">{siteConfig.name}</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 p-4" aria-label="Mobile navigation">
          {appNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button key={item.href} variant="ghost" className="justify-start" asChild>
                <Link href={item.href} onClick={() => setMobileNavOpen(false)}>
                  <Icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
