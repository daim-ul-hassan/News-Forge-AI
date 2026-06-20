import { useProfileStore } from "@/stores/profile-store";

export function useProfile() {
  const { profile, updateProfile, resetProfile } = useProfileStore();

  const completionPercentage = (() => {
    if (!profile) return 0;
    let score = 0;
    if (profile.displayName?.trim()) score += 10;
    if (profile.bio?.trim()) score += 15;
    if (profile.niche?.trim()) score += 15;
    if (profile.primaryPlatform?.trim()) score += 15;
    
    const platformsFilled = Object.values(profile.platforms).some((v) => v.trim());
    if (platformsFilled) score += 15;
    
    if (profile.contentCategories && profile.contentCategories.length > 0) score += 15;
    if (profile.writingTone?.trim()) score += 15;
    
    return score;
  })();

  return {
    profile,
    updateProfile,
    resetProfile,
    completionPercentage,
  };
}
