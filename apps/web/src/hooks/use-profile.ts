import { useProfileStore } from "@/stores/profile-store";

export function useProfile() {
  const { profile, updateProfile, resetProfile } = useProfileStore();

  const completionPercentage = (() => {
    if (!profile) return 0;
    let score = 0;

    // Required fields (totaling 70%)
    if (profile.displayName?.trim()) score += 20;

    const platformsFilled = Object.values(profile.platforms).some((v) => v.trim());
    if (platformsFilled) score += 25;

    if (profile.contentTypes && profile.contentTypes.length > 0) score += 25;

    // Optional fields (totaling 30%)
    if (profile.bio?.trim()) score += 10;
    if (profile.niche?.trim()) score += 10;
    if (profile.topics && profile.topics.length > 0) score += 5;
    if (profile.writingTone?.trim()) score += 5;

    return Math.min(score, 100);
  })();

  const isProfileComplete = completionPercentage >= 70;

  return {
    profile,
    updateProfile,
    resetProfile,
    completionPercentage,
    isProfileComplete,
  };
}

