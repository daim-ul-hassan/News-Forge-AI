import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CreatorProfile } from "@/types/profile.types";

interface ProfileState {
  profile: CreatorProfile | null;
  updateProfile: (partial: Partial<CreatorProfile>) => void;
  resetProfile: () => void;
}

const defaultProfile: CreatorProfile = {
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
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: null,
      updateProfile: (partial) =>
        set((state) => ({
          profile: {
            ...(state.profile || defaultProfile),
            ...partial,
            platforms: {
              ...(state.profile?.platforms || defaultProfile.platforms),
              ...(partial.platforms || {}),
            },
          },
        })),
      resetProfile: () => set({ profile: null }),
    }),
    {
      name: "nf-creator-profile",
    },
  ),
);
