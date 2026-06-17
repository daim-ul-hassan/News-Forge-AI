"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Link from "next/link";

import { SidebarNav } from "@/components/navigation/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const { sidebarCollapsed, toggleSidebarCollapsed } = useSidebar();

  return (
    <aside
      className={cn(
        "hidden h-full flex-col border-r border-border bg-card lg:flex",
        sidebarCollapsed ? "w-[var(--sidebar-width-collapsed)]" : "w-[var(--sidebar-width)]",
      )}
    >
      <div className={cn("flex h-[var(--header-height)] items-center border-b border-border px-4", sidebarCollapsed && "justify-center px-2")}>
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary font-mono text-xs font-bold text-primary-foreground">
            NF
          </span>
          {!sidebarCollapsed && <span className="truncate font-mono text-sm font-semibold">{siteConfig.name}</span>}
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <SidebarNav />
      </div>
      <Separator />
      <div className="p-2">
        <Button
          variant="ghost"
          size={sidebarCollapsed ? "icon" : "sm"}
          onClick={toggleSidebarCollapsed}
          className={cn("w-full", !sidebarCollapsed && "justify-start")}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          {!sidebarCollapsed && <span className="ml-2">Collapse</span>}
        </Button>
      </div>
    </aside>
  );
}
