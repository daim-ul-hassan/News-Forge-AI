"use client";

import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/feedback/page-header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePreferencesStore } from "@/stores/preferences-store";

export default function SettingsPage() {
  const { density, effectsEnabled, setDensity, setEffectsEnabled } = usePreferencesStore();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Account and preferences — TODO: connect to /api/v1/users"
      />
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="mt-6 space-y-6">
          <div className="rounded-lg border border-border p-6">
            <h3 className="font-mono font-semibold">Account</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Account settings will be available when user endpoints are implemented.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="appearance" className="mt-6 space-y-6">
          <div className="rounded-lg border border-border p-6 space-y-4">
            <h3 className="font-mono font-semibold">Display density</h3>
            <div className="flex gap-2">
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
            <h3 className="font-mono font-semibold">Visual effects</h3>
            <p className="text-sm text-muted-foreground">
              Optional particle and background effects. Disabled by default for usability.
            </p>
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
          <EmptyState
            title="Notification settings"
            description="Notification preferences will be configurable when backend endpoints are available."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
