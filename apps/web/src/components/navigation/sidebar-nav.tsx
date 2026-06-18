"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { appNavItems } from "@/components/navigation/nav-items";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/use-sidebar";

export function SidebarNav() {
  const pathname = usePathname();
  const { sidebarCollapsed } = useSidebar();

  return (
    <nav className="flex flex-col gap-1 px-2" aria-label="Main navigation">
      {appNavItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              sidebarCollapsed && "justify-center px-2",
            )}
            title={sidebarCollapsed ? item.title : undefined}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {!sidebarCollapsed && <span>{item.title}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
