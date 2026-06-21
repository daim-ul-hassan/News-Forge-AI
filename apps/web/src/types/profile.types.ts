export interface CreatorProfile {
  displayName: string;
  avatarUrl: string;
  bio: string;
  niche: string;
  primaryPlatform: string;
  platforms: {
    youtube: string;
    tiktok: string;
    x: string;
    linkedin: string;
    website: string;
  };
  contentCategories: string[];
  writingTone: string;
  contentTypes: string[];
  topics?: string[];
}

