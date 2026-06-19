import { createClient } from "@/lib/supabase/client";

export const opportunitiesService = {
  async fetchSavedIds(userId: string): Promise<string[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("saved_opportunities")
      .select("opportunity_id")
      .eq("user_id", userId);

    if (error) throw error;
    return (data ?? []).map((row) => row.opportunity_id);
  },

  async save(userId: string, opportunityId: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.from("saved_opportunities").upsert({
      user_id: userId,
      opportunity_id: opportunityId,
    });
    if (error) throw error;
  },

  async unsave(userId: string, opportunityId: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from("saved_opportunities")
      .delete()
      .eq("user_id", userId)
      .eq("opportunity_id", opportunityId);
    if (error) throw error;
  },
};
