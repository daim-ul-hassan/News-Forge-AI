import { createClient } from "@/lib/supabase/client";
import type { CreatorProfile } from "@/types/profile.types";

/**
 * Compute completion percentage from a CreatorProfile.
 * Must stay in sync with the scoring logic in use-profile.ts.
 */
function computeCompletion(p: Partial<CreatorProfile>): number {
  let score = 0;

  // Required fields (totaling 70%)
  if (p.displayName?.trim()) score += 20;

  const platformsFilled = p.platforms
    ? Object.values(p.platforms).some((v) => v?.trim())
    : false;
  if (platformsFilled) score += 25;

  if (p.contentTypes && p.contentTypes.length > 0) score += 25;

  // Optional fields (totaling 30%)
  if (p.bio?.trim()) score += 10;
  if (p.niche?.trim()) score += 10;
  if (p.topics && p.topics.length > 0) score += 5;
  if (p.writingTone?.trim()) score += 5;

  return Math.min(score, 100);
}

/** Convert the platforms object to a text[] of selected platform keys */
function platformsObjectToArray(
  platforms: CreatorProfile["platforms"] | undefined,
): string[] {
  if (!platforms) return [];
  return Object.entries(platforms)
    .filter(([, url]) => url?.trim())
    .map(([key]) => key);
}

/** Convert a text[] of platform keys back to the platforms object */
function platformsArrayToObject(
  arr: string[] | null | undefined,
): CreatorProfile["platforms"] {
  const obj: CreatorProfile["platforms"] = {
    youtube: "",
    tiktok: "",
    x: "",
    linkedin: "",
    website: "",
  };
  if (!arr) return obj;
  for (const key of arr) {
    if (key in obj) {
      // Store the key itself as a truthy marker (the UI uses non-empty = selected)
      (obj as Record<string, string>)[key] = key;
    } else {
      // Unknown platform keys (e.g. "other") — store on the object dynamically
      (obj as Record<string, string>)[key] = key;
    }
  }
  return obj;
}

export const profileService = {
  async getProfile(userId: string): Promise<CreatorProfile | null> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "display_name, bio, niche, platforms, topics, content_types, writing_styles, completion_percentage",
        )
        .eq("id", userId)
        .single();
      if (error) {
        console.warn("[profileService] getProfile error", error.message);
        return null;
      }
      if (!data) return null;

      const row = data as unknown as {
        display_name?: string;
        bio?: string;
        niche?: string;
        platforms?: string[];
        topics?: string[];
        content_types?: string[];
        writing_styles?: string[];
        completion_percentage?: number;
      };

      const platformsObj = platformsArrayToObject(row.platforms);

      const profile: CreatorProfile = {
        displayName: row.display_name || "",
        bio: row.bio || "",
        niche: row.niche || "",
        primaryPlatform: (row.platforms && row.platforms[0]) || "",
        platforms: platformsObj,
        contentCategories: row.content_types || [],
        writingTone:
          row.writing_styles && row.writing_styles.length > 0
            ? row.writing_styles.join(", ")
            : "",
        contentTypes: row.content_types || [],
        topics: row.topics || [],
        completionPercentage: row.completion_percentage ?? 0,
      };

      return profile;
    } catch (err) {
      console.warn("[profileService] getProfile unexpected error", err);
      return null;
    }
  },

  async upsertProfile(userId: string, partial: Partial<CreatorProfile>) {
    console.log("B1 Entered upsertProfile");
    try {
      const supabase = createClient();
      console.log("B2 Building row");
      const row: Record<string, unknown> = { id: userId };

      if (partial.displayName !== undefined)
        row.display_name = partial.displayName;
      if (partial.bio !== undefined) row.bio = partial.bio;
      if (partial.niche !== undefined) row.niche = partial.niche;
      if (partial.topics !== undefined) row.topics = partial.topics;
      if (partial.contentTypes !== undefined)
        row.content_types = partial.contentTypes;

      if (partial.writingTone !== undefined) {
        row.writing_styles = partial.writingTone
          ? partial.writingTone
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];
      }

      if (partial.platforms !== undefined) {
        row.platforms = platformsObjectToArray(partial.platforms);
      }

      row.completion_percentage = computeCompletion(partial);

      console.log("B3 Before supabase.from()");
      console.log("ROW", row);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const query = supabase.from("profiles").upsert(row as any);
      console.log("B4 Before await");
      const { error } = await query;
      console.log("B5 After await");
      if (error) {
        console.warn("[profileService] upsertProfile error", error.message);
        return false;
      }
      console.log("B6 Returning");
      return true;
    } catch (err) {
      console.error("FAILED HERE", err);
      return false;
    }
  },

  async setCompletionPercentage(userId: string, completion: number) {
    try {
      const supabase = createClient();
      const row: Record<string, unknown> = {
        id: userId,
        completion_percentage: completion,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await supabase.from("profiles").upsert(row as any);
      if (error)
        console.warn(
          "[profileService] setCompletionPercentage error",
          error.message,
        );
      return !error;
    } catch (err) {
      console.warn("[profileService] setCompletionPercentage unexpected", err);
      return false;
    }
  },

  async ensureProfile(userId: string) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .single();
      if (error) {
        // If it's a "no rows" style error, continue; otherwise log
        const code = (error as { code?: string })?.code;
        if (code && code !== "PGRST116")
          console.warn(
            "[profileService] ensureProfile select error",
            error.message,
          );
      }
      if (!data) {
        const defaultRow = {
          id: userId,
          display_name: "",
          bio: "",
          niche: "",
          platforms: [],
          topics: [],
          content_types: [],
          writing_styles: [],
          completion_percentage: 0,
        };
        const { error: insertError } = await supabase
          .from("profiles")
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .insert(defaultRow as any);
        if (insertError)
          console.warn(
            "[profileService] ensureProfile insert error",
            insertError.message,
          );
      }
      return true;
    } catch (err) {
      console.warn("[profileService] ensureProfile unexpected", err);
      return false;
    }
  },
};