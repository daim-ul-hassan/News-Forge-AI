"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { appNavItems } from "@/components/navigation/nav-items";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";
import { useUiStore } from "@/stores/ui-store";

export function MobileNav() {
  const mobileNavOpen = useUiStore((state) => state.mobileNavOpen);
  const setMobileNavOpen = useUiStore((state) => state.setMobileNavOpen);
  const pathname = usePathname();

  return (
    <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
      <SheetContent side="left" className="w-[var(--sidebar-width)] p-0">
        <SheetHeader className="border-b border-border p-4 text-left">
          <SheetTitle className="font-mono">{siteConfig.name}</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 p-4" aria-label="Mobile navigation">
          {appNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Button key={item.href} variant={isActive ? "secondary" : "ghost"} className="justify-start" asChild>
                <Link href={item.href} onClick={() => setMobileNavOpen(false)} aria-current={isActive ? "page" : undefined}>
                  <Icon className="mr-2 h-4 w-4" aria-hidden />
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
