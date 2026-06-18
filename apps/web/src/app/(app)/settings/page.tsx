"use client";

import type { PlaceholderCard } from "@/components/layout/app-page-scaffold";
import { Bell, MonitorCog, Palette, Settings2, Shield } from "lucide-react";

import { AppPageScaffold } from "@/components/layout/app-page-scaffold";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePreferencesStore } from "@/stores/preferences-store";

const cards = [
  {
    title: "Workspace preferences",
    description: "Future settings for density, navigation, notifications, and workspace behavior.",
    label: "General",
    icon: Settings2,
  },
  {
    title: "Appearance controls",
    description: "Local visual preferences live here while account-backed settings remain pending.",
    label: "Display",
    icon: Palette,
    tone: "cyan",
  },
  {
    title: "Access readiness",
    description: "Placeholder space for future account, security, and team management surfaces.",
    label: "Access",
    icon: Shield,
  },
] satisfies PlaceholderCard[];

export default function SettingsPage() {
  const { density, effectsEnabled, setDensity, setEffectsEnabled } = usePreferencesStore();

  return (
    <AppPageScaffold
      title="Settings"
      description="A preference center for local workspace controls and future account-backed settings."
      notice="TODO: Connect account settings, notification preferences, and saved workspace configuration after backend support exists."
      cards={cards}
      emptyTitle="No account settings connected"
      emptyDescription="Account-backed preferences will appear here after authentication and user settings are implemented."
      errorTitle="Settings preview unavailable"
      errorDescription="Future settings errors can show failed sections, retry actions, and local fallback behavior."
    >
      <Tabs defaultValue="general" className="app-panel rounded-lg p-4 sm:p-5">
        <TabsList className="grid h-auto w-full grid-cols-1 sm:inline-flex sm:w-auto">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <div className="rounded-lg border border-border/80 bg-background/35 p-5">
            <div className="flex items-center gap-2">
              <MonitorCog className="h-5 w-5 text-primary" aria-hidden />
              <h2 className="text-lg font-semibold">Workspace settings</h2>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              TODO: Account-backed preferences are not connected yet. Local display controls remain available in this preview.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="mt-6">
          <div className="space-y-5 rounded-lg border border-border/80 bg-background/35 p-5">
            <div>
              <h2 className="text-lg font-semibold">Display density</h2>
              <p className="mt-1 text-sm text-muted-foreground">Adjust local spacing preference for this workspace shell.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={density === "comfortable" ? "default" : "outline"}
                size="sm"
                onClick={() => setDensity("comfortable")}
              >
                Comfortable
              </Button>
              <Button
                variant={density === "compact" ? "default" : "outline"}
                size="sm"
                onClick={() => setDensity("compact")}
              >
                Compact
              </Button>
            </div>
            <Separator />
            <div>
              <h2 className="text-lg font-semibold">Visual effects</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Optional local visual effects can be toggled while production settings remain pending.
              </p>
            </div>
            <Button
              variant={effectsEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => setEffectsEnabled(!effectsEnabled)}
            >
              {effectsEnabled ? "Effects enabled" : "Effects disabled"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <div className="rounded-lg border border-border/80 bg-background/35 p-5">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-secondary" aria-hidden />
              <h2 className="text-lg font-semibold">Notification preferences</h2>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              TODO: Notification channels and delivery rules will be added after settings storage is available.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </AppPageScaffold>
  );
}
