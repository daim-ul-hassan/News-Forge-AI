"use client";

import { Bell, Shield, User, ArrowUp, ArrowDown, Download, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

import { PageHeader } from "@/components/feedback/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSettings } from "@/hooks/use-settings";
import { useAuthStore } from "@/stores/auth-store";
import { useProfileStore } from "@/stores/profile-store";
import { useResearchStore } from "@/stores/research-store";
import { useDraftsStore } from "@/stores/drafts-store";

export function SettingsClient() {
  const { settings, updateSettings, clearAllData, density, effectsEnabled, setDensity, setEffectsEnabled } = useSettings();
  const { user } = useAuthStore();
  const { profile } = useProfileStore();
  const { notes } = useResearchStore();
  const { drafts } = useDraftsStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const moveProvider = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...settings.aiPreferences.providerOrder];
    if (direction === 'up' && index > 0) {
      [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    } else if (direction === 'down' && index < newOrder.length - 1) {
      [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
    }
    updateSettings({ aiPreferences: { ...settings.aiPreferences, providerOrder: newOrder } });
  };

  const handleExport = (type: 'profile' | 'research' | 'drafts' | 'all') => {
    let dataToExport = {};
    if (type === 'profile') dataToExport = { profile };
    if (type === 'research') dataToExport = { notes };
    if (type === 'drafts') dataToExport = { drafts };
    if (type === 'all') dataToExport = { profile, notes, drafts, settings };

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsforge-export-${type}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (window.confirm("Are you sure? This action cannot be undone.")) {
      clearAllData();
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-w-0 space-y-8 overflow-x-hidden">
      <PageHeader
        title="Settings"
        description="Manage your account, preferences, and local data."
      />
      <Tabs defaultValue="account" className="app-panel rounded-lg p-4 sm:p-5">
        <TabsList className="grid h-auto w-full grid-cols-2 sm:inline-flex sm:w-auto md:grid-cols-5 gap-2">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="ai">AI Preferences</TabsTrigger>
          <TabsTrigger value="privacy">Privacy & Data</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="mt-6">
          <div className="space-y-5 rounded-lg border border-border/80 bg-background/35 p-5">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" aria-hidden />
              <h2 className="text-lg font-semibold">Account Details</h2>
            </div>
            {user ? (
              <div className="space-y-4 pt-2 max-w-sm">
                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                  <Input id="email" value={user.email} readOnly disabled className="bg-muted/50" />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="displayName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Display Name</label>
                  <Input id="displayName" value={user.user_metadata?.full_name || ""} readOnly disabled className="bg-muted/50" />
                  <p className="text-xs text-muted-foreground">To change your display name, edit it in your Creator Profile.</p>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                No active user session found. Please sign in.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="mt-6">
          <div className="space-y-5 rounded-lg border border-border/80 bg-background/35 p-5">
            <div>
              <h2 className="text-lg font-semibold">Theme</h2>
              <p className="mt-1 text-sm text-muted-foreground">Select your color theme preference.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(["system", "light", "dark"] as const).map((theme) => (
                <Button
                  key={theme}
                  variant={settings.theme === theme ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSettings({ theme })}
                  className="capitalize"
                >
                  {theme}
                </Button>
              ))}
            </div>
            <Separator />
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
                Optional local visual effects can be toggled.
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
          <div className="space-y-5 rounded-lg border border-border/80 bg-background/35 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5 text-secondary" aria-hidden />
              <h2 className="text-lg font-semibold">Notification preferences</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-base font-medium leading-none">Research updates</label>
                  <p className="text-sm text-muted-foreground">Get notified about research completion.</p>
                </div>
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={settings.notifications.research} 
                  onChange={(e) => updateSettings({ notifications: { ...settings.notifications, research: e.target.checked } })} 
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-base font-medium leading-none">Trend alerts</label>
                  <p className="text-sm text-muted-foreground">Get notified when new trends are detected.</p>
                </div>
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={settings.notifications.trends} 
                  onChange={(e) => updateSettings({ notifications: { ...settings.notifications, trends: e.target.checked } })} 
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-base font-medium leading-none">Opportunity alerts</label>
                  <p className="text-sm text-muted-foreground">Get notified about high-score content opportunities.</p>
                </div>
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={settings.notifications.opportunities} 
                  onChange={(e) => updateSettings({ notifications: { ...settings.notifications, opportunities: e.target.checked } })} 
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="mt-6">
          <div className="space-y-5 rounded-lg border border-border/80 bg-background/35 p-5">
            <div>
              <h2 className="text-lg font-semibold">Provider Priority</h2>
              <p className="text-sm text-muted-foreground mb-4">Order of fallback providers for AI generation.</p>
              <div className="space-y-2 max-w-sm">
                {settings.aiPreferences.providerOrder.map((provider, idx) => (
                  <div key={provider} className="flex items-center justify-between p-3 border border-border/50 rounded-md bg-background/50">
                    <span className="capitalize font-medium">{provider}</span>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" disabled={idx === 0} onClick={() => moveProvider(idx, 'up')} className="h-8 w-8">
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" disabled={idx === settings.aiPreferences.providerOrder.length - 1} onClick={() => moveProvider(idx, 'down')} className="h-8 w-8">
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Separator />
            <div className="max-w-sm">
              <label className="text-base font-medium leading-none">Default Model Display</label>
              <p className="text-sm text-muted-foreground mb-2">Visual indicator for which model is primarily active.</p>
              <Input 
                value={settings.aiPreferences.defaultModel} 
                onChange={(e) => updateSettings({ aiPreferences: { ...settings.aiPreferences, defaultModel: e.target.value }})} 
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between max-w-sm">
              <div>
                <label className="text-base font-medium leading-none">Streaming Responses</label>
                <p className="text-sm text-muted-foreground">Show AI text generation progressively.</p>
              </div>
              <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={settings.aiPreferences.streaming} 
                onChange={(e) => updateSettings({ aiPreferences: { ...settings.aiPreferences, streaming: e.target.checked } })} 
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="privacy" className="mt-6">
          <div className="space-y-5 rounded-lg border border-border/80 bg-background/35 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-secondary" aria-hidden />
              <h2 className="text-lg font-semibold">Privacy & Data Management</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Export Local Data</h3>
                <p className="text-sm text-muted-foreground mb-3">Download your workspace data as JSON files.</p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" size="sm" onClick={() => handleExport('profile')}><Download className="mr-2 h-4 w-4"/> Export Profile</Button>
                  <Button variant="outline" size="sm" onClick={() => handleExport('research')}><Download className="mr-2 h-4 w-4"/> Export Research</Button>
                  <Button variant="outline" size="sm" onClick={() => handleExport('drafts')}><Download className="mr-2 h-4 w-4"/> Export Drafts</Button>
                  <Button variant="default" size="sm" onClick={() => handleExport('all')}><Download className="mr-2 h-4 w-4"/> Export Everything</Button>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium text-destructive">Danger Zone</h3>
                <p className="text-sm text-muted-foreground mb-3">Clear all local workspace storage and reset application state.</p>
                <Button variant="destructive" onClick={handleClearData}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Local Data
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}
