export interface CreatorProfile {
  displayName: string;
  bio: string;
  niche: string;
  primaryPlatform: string;
  platforms: {
    youtube: string;
    tiktok: string;
    x: string;
    linkedin: string;
    website: string;
    [key: string]: string; // allow dynamic platform keys like "other"
  };
  contentCategories: string[];
  writingTone: string;
  contentTypes: string[];
  topics?: string[];
  /** Persisted completion percentage from Supabase */
  completionPercentage?: number;
}
