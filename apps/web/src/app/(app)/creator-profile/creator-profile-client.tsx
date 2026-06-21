"use client";

import { Loader } from "lucide-react";
import { PageHeader } from "@/components/feedback/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { useProfile } from "@/hooks/use-profile";
import { useState, useEffect } from "react";

const PLATFORM_OPTIONS = [
  { id: "youtube", label: "YouTube" },
  { id: "tiktok", label: "TikTok" },
  { id: "x", label: "X (Twitter)" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "website", label: "Website" },
  { id: "other", label: "Other" },
];

const CONTENT_TYPE_OPTIONS = [
  { id: "video", label: "Videos" },
  { id: "blog", label: "Blog Posts" },
  { id: "podcast", label: "Podcasts" },
  { id: "newsletter", label: "Newsletters" },
  { id: "social", label: "Social Media" },
  { id: "threads", label: "Threads/Tweetstorms" },
  { id: "research", label: "Research" },
  { id: "other", label: "Other" },
];

const TOPIC_OPTIONS = [
  { id: "technology", label: "Technology" },
  { id: "business", label: "Business" },
  { id: "health", label: "Health" },
  { id: "education", label: "Education" },
  { id: "entertainment", label: "Entertainment" },
  { id: "finance", label: "Finance" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "science", label: "Science" },
  { id: "other", label: "Other" },
];

const EXPLANATION_STYLE_OPTIONS = [
  { id: "simple", label: "Simple & Clear" },
  { id: "technical", label: "Technical & Detailed" },
  { id: "casual", label: "Casual & Conversational" },
  { id: "formal", label: "Formal & Professional" },
  { id: "humorous", label: "Humorous & Fun" },
];

export function CreatorProfileClient() {
  const { profile, updateProfile, resetProfile, completionPercentage } = useProfile();

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
    topics: [],
  });

  const [platformsOther, setPlatformsOther] = useState("");
  const [contentTypesOther, setContentTypesOther] = useState("");
  const [topicsOther, setTopicsOther] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Extract which platforms are selected from platform links
  const selectedPlatforms = Object.entries(formData.platforms)
    .filter(([, value]) => value.trim())
    .map(([key]) => key);

  // Derive selected content types from contentTypes array
  const selectedContentTypes = formData.contentTypes || [];

  // Derive selected explanation styles from writingTone (comma-separated)
  const selectedStyles = formData.writingTone
    ? formData.writingTone.split(",").map(s => s.trim()).filter(Boolean)
    : [];

  useEffect(() => {
    if (profile) setFormData(profile);
  }, [profile]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      updateProfile(formData);
      // Simulate save completion with slight delay
      await new Promise(resolve => setTimeout(resolve, 600));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } finally {
      setIsLoading(false);
    }
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
      topics: [],
    });
    setPlatformsOther("");
    setContentTypesOther("");
    setTopicsOther("");
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

  const toggleCheckbox = (type: "platforms" | "contentTypes" | "topics" | "styles", value: string) => {
    if (type === "platforms") {
      if (selectedPlatforms.includes(value)) {
        updatePlatform(value, "");
      } else {
        updatePlatform(value, value);
      }
    } else if (type === "contentTypes") {
      const updated = selectedContentTypes.includes(value)
        ? selectedContentTypes.filter(t => t !== value)
        : [...selectedContentTypes, value];
      updateField("contentTypes", updated);
    } else if (type === "topics") {
      const updated = (formData.topics || []).includes(value)
        ? (formData.topics || []).filter(t => t !== value)
        : [...(formData.topics || []), value];
      updateField("topics", updated);
    } else if (type === "styles") {
      const updated = selectedStyles.includes(value)
        ? selectedStyles.filter(s => s !== value)
        : [...selectedStyles.slice(0, 2), value].slice(0, 3);
      updateField("writingTone", updated.join(", "));
    }
  };

  const handleOtherCheckbox = (type: "platforms" | "contentTypes" | "topics", checked: boolean) => {
    if (type === "platforms" && checked) {
      updatePlatform("other", platformsOther || "other");
    } else if (type === "platforms" && !checked) {
      updatePlatform("other", "");
      setPlatformsOther("");
    } else if (type === "contentTypes" && checked) {
      if (!selectedContentTypes.includes("other")) {
        updateField("contentTypes", [...selectedContentTypes, "other"]);
      }
    } else if (type === "contentTypes" && !checked) {
      updateField("contentTypes", selectedContentTypes.filter(t => t !== "other"));
      setContentTypesOther("");
    } else if (type === "topics" && checked) {
      if (!(formData.topics || []).includes("other")) {
        updateField("topics", [...(formData.topics || []), "other"]);
      }
    } else if (type === "topics" && !checked) {
      updateField("topics", (formData.topics || []).filter(t => t !== "other"));
      setTopicsOther("");
    }
  };

  return (
    <div className="min-w-0 space-y-8 overflow-x-hidden">
      <PageHeader
        title="Creator Profile"
        description="Tell us about yourself so we can personalize your experience."
      />

      <div className="flex flex-col gap-6 max-w-3xl">
        <div className="app-panel rounded-lg p-6">
          <div className="flex flex-col gap-5">
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-semibold">Profile Completion: {completionPercentage}%</h2>
              <div className="w-full bg-secondary mt-2 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {completionPercentage >= 70
                  ? "✓ Your profile is complete! Personalization unlocked."
                  : `Complete your profile to unlock personalized features (${70 - completionPercentage}% to go)`}
              </p>
            </div>
          </div>
        </div>

        {/* Basic Identity Section */}
        <div className="app-panel rounded-lg p-6 space-y-6">
          <h3 className="text-lg font-medium">Basic Identity</h3>
          <div className="space-y-4">
            <div className="grid gap-2">
              <label htmlFor="displayName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Display Name *</label>
              <Input id="displayName" value={formData.displayName} onChange={e => updateField("displayName", e.target.value)} placeholder="Your name" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="avatarUrl" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Avatar URL</label>
              <Input id="avatarUrl" value={formData.avatarUrl} onChange={e => updateField("avatarUrl", e.target.value)} placeholder="https://..." />
            </div>
            <div className="grid gap-2">
              <label htmlFor="bio" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Tell us about yourself ({formData.bio.length}/160)</label>
              <textarea id="bio" value={formData.bio} maxLength={160} onChange={e => updateField("bio", e.target.value)} placeholder="Brief bio or introduction" className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="niche" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">What do you create content about? ({formData.niche.length}/50)</label>
              <Input id="niche" value={formData.niche} maxLength={50} onChange={e => updateField("niche", e.target.value)} placeholder="e.g., AI, Marketing, Personal Finance" />
            </div>
          </div>
        </div>

        {/* Platforms Section */}
        <div className="app-panel rounded-lg p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium">Where do you publish your content? *</h3>
            <p className="text-sm text-muted-foreground mt-1">Select 1-10 platforms and add your profile links</p>
          </div>

          <div className="space-y-4">
            {/* Platform checkboxes */}
            <div className="space-y-3">
              {PLATFORM_OPTIONS.map((option) => (
                <div key={option.id}>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`platform-${option.id}`}
                      checked={selectedPlatforms.includes(option.id)}
                      onChange={() => toggleCheckbox("platforms", option.id)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor={`platform-${option.id}`} className="text-sm font-medium cursor-pointer">{option.label}</label>
                  </div>

                  {/* Input field only for "other" */}
                  {option.id === "other" && selectedPlatforms.includes("other") && (
                    <div className="ml-7 mt-2">
                      <Input
                        placeholder="Other platform (e.g., Substack, Patreon)"
                        value={platformsOther}
                        onChange={(e) => setPlatformsOther(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Types Section */}
        <div className="app-panel rounded-lg p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium">What kind of content do you create? *</h3>
            <p className="text-sm text-muted-foreground mt-1">Select the types of content you work with</p>
          </div>

          <div className="space-y-3">
            {CONTENT_TYPE_OPTIONS.map((option) => (
              <div key={option.id}>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={`type-${option.id}`}
                    checked={selectedContentTypes.includes(option.id)}
                    onChange={(e) => {
                      if (option.id === "other") {
                        handleOtherCheckbox("contentTypes", e.target.checked);
                      } else {
                        toggleCheckbox("contentTypes", option.id);
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor={`type-${option.id}`} className="text-sm font-medium cursor-pointer">{option.label}</label>
                </div>

                {option.id === "other" && selectedContentTypes.includes("other") && (
                  <div className="ml-7 mt-2">
                    <Input
                      placeholder="Other content type"
                      value={contentTypesOther}
                      onChange={(e) => setContentTypesOther(e.target.value)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Topics Section */}
        <div className="app-panel rounded-lg p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium">Choose topics you care about</h3>
            <p className="text-sm text-muted-foreground mt-1">Optional - helps us personalize content recommendations</p>
          </div>

          <div className="space-y-3">
            {TOPIC_OPTIONS.map((option) => (
              <div key={option.id}>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={`topic-${option.id}`}
                    checked={(formData.topics || []).includes(option.id)}
                    onChange={(e) => {
                      if (option.id === "other") {
                        handleOtherCheckbox("topics", e.target.checked);
                      } else {
                        toggleCheckbox("topics", option.id);
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor={`topic-${option.id}`} className="text-sm font-medium cursor-pointer">{option.label}</label>
                </div>

                {option.id === "other" && (formData.topics || []).includes("other") && (
                  <div className="ml-7 mt-2">
                    <Input
                      placeholder="Other topics"
                      value={topicsOther}
                      onChange={(e) => setTopicsOther(e.target.value)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Explanation Style Section */}
        <div className="app-panel rounded-lg p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium">How should News Forge AI explain things to you?</h3>
            <p className="text-sm text-muted-foreground mt-1">Optional - select up to 3 preferred explanation styles</p>
          </div>

          <div className="space-y-3">
            {EXPLANATION_STYLE_OPTIONS.map((option) => (
              <div key={option.id} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id={`style-${option.id}`}
                  checked={selectedStyles.includes(option.id)}
                  onChange={() => toggleCheckbox("styles", option.id)}
                  disabled={selectedStyles.length >= 3 && !selectedStyles.includes(option.id)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50"
                />
                <label htmlFor={`style-${option.id}`} className="text-sm font-medium cursor-pointer">{option.label}</label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="flex items-center gap-4">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading && <Loader className="h-4 w-4 animate-spin" />}
            {showSuccess ? "✓ Profile saved" : isLoading ? "Saving..." : "Save Profile"}
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={isLoading}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
