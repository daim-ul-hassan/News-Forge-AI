"use client";

import { UserRoundCog } from "lucide-react";
import { AppPageScaffold } from "@/components/layout/app-page-scaffold";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useProfile } from "@/hooks/use-profile";
import { useState, useEffect } from "react";

export function CreatorProfileClient() {
  const { profile, updateProfile, resetProfile, completionPercentage } = useProfile();
  
  // Local state for the form so we don't save on every keystroke
  const [formData, setFormData] = useState(profile || {
    displayName: "",
    avatarUrl: "",
    bio: "",
    niche: "",
    primaryPlatform: "",
    platforms: {
      youtube: "",
      tiktok: "",
      x: "",
      linkedin: "",
      website: "",
    },
    contentCategories: [],
    writingTone: "",
    contentTypes: [],
  });

  // Sync when profile changes from elsewhere
  useEffect(() => {
    if (profile) setFormData(profile);
  }, [profile]);

  const handleSave = () => {
    updateProfile(formData);
  };

  const handleReset = () => {
    resetProfile();
    setFormData({
      displayName: "",
      avatarUrl: "",
      bio: "",
      niche: "",
      primaryPlatform: "",
      platforms: {
        youtube: "",
        tiktok: "",
        x: "",
        linkedin: "",
        website: "",
      },
      contentCategories: [],
      writingTone: "",
      contentTypes: [],
    });
  };

  const updateField = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updatePlatform = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: {
        ...prev.platforms,
        [platform]: value
      }
    }));
  };

  return (
    <AppPageScaffold
      title="Creator Profile"
      description="Your identity, preferences, and platform links."
    >
      <div className="flex flex-col gap-6 max-w-3xl">
        <div className="app-panel rounded-lg p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-border bg-background/45 text-muted-foreground overflow-hidden">
              {formData.avatarUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                </>
              ) : (
                <UserRoundCog className="h-8 w-8" aria-hidden />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-semibold">Profile Completion: {completionPercentage}%</h2>
              <div className="w-full bg-secondary mt-2 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="app-panel rounded-lg p-6 space-y-6">
          <h3 className="text-lg font-medium">Basic Identity</h3>
          <div className="space-y-4">
            <div className="grid gap-2">
              <label htmlFor="displayName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Display Name</label>
              <Input id="displayName" value={formData.displayName} onChange={e => updateField("displayName", e.target.value)} />
            </div>
            <div className="grid gap-2">
              <label htmlFor="avatarUrl" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Avatar URL</label>
              <Input id="avatarUrl" value={formData.avatarUrl} onChange={e => updateField("avatarUrl", e.target.value)} />
            </div>
            <div className="grid gap-2">
              <label htmlFor="bio" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Bio ({formData.bio.length}/160)</label>
              <textarea id="bio" value={formData.bio} maxLength={160} onChange={e => updateField("bio", e.target.value)} className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="niche" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Niche ({formData.niche.length}/50)</label>
              <Input id="niche" value={formData.niche} maxLength={50} onChange={e => updateField("niche", e.target.value)} />
            </div>
          </div>
        </div>

        <div className="app-panel rounded-lg p-6 space-y-6">
          <h3 className="text-lg font-medium">Platforms</h3>
          <div className="space-y-4">
            <div className="grid gap-2">
              <label htmlFor="primaryPlatform" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Primary Platform</label>
              <Input id="primaryPlatform" placeholder="e.g. YouTube, TikTok, Newsletter" value={formData.primaryPlatform} onChange={e => updateField("primaryPlatform", e.target.value)} />
            </div>
            <div className="grid gap-2">
              <label htmlFor="youtube" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">YouTube</label>
              <Input id="youtube" value={formData.platforms.youtube} onChange={e => updatePlatform("youtube", e.target.value)} />
            </div>
            <div className="grid gap-2">
              <label htmlFor="tiktok" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">TikTok</label>
              <Input id="tiktok" value={formData.platforms.tiktok} onChange={e => updatePlatform("tiktok", e.target.value)} />
            </div>
            <div className="grid gap-2">
              <label htmlFor="x" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">X/Twitter</label>
              <Input id="x" value={formData.platforms.x} onChange={e => updatePlatform("x", e.target.value)} />
            </div>
            <div className="grid gap-2">
              <label htmlFor="linkedin" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">LinkedIn</label>
              <Input id="linkedin" value={formData.platforms.linkedin} onChange={e => updatePlatform("linkedin", e.target.value)} />
            </div>
            <div className="grid gap-2">
              <label htmlFor="website" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Website</label>
              <Input id="website" value={formData.platforms.website} onChange={e => updatePlatform("website", e.target.value)} />
            </div>
          </div>
        </div>

        <div className="app-panel rounded-lg p-6 space-y-6">
          <h3 className="text-lg font-medium">Content Preferences</h3>
          <div className="space-y-4">
            <div className="grid gap-2">
              <label htmlFor="categories" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Content Categories (comma separated)</label>
              <Input 
                id="categories" 
                value={formData.contentCategories.join(", ")} 
                onChange={e => updateField("contentCategories", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} 
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="tone" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Writing Tone</label>
              <Input id="tone" placeholder="e.g. Conversational, Professional, Witty" value={formData.writingTone} onChange={e => updateField("writingTone", e.target.value)} />
            </div>
            <div className="grid gap-2">
              <label htmlFor="types" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Content Types (comma separated)</label>
              <Input 
                id="types" 
                placeholder="e.g. Video Script, Newsletter, Tweet Thread"
                value={formData.contentTypes.join(", ")} 
                onChange={e => updateField("contentTypes", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} 
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={handleSave}>Save Profile</Button>
          <Button variant="outline" onClick={handleReset}>Reset</Button>
        </div>
      </div>
    </AppPageScaffold>
  );
}
