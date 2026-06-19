import { createClient } from "@/lib/supabase/client";
import { mapDraftRow, mapDraftToRow } from "@/lib/supabase/mappers";
import type { Draft } from "@/types/drafts.types";

export const draftsService = {
  async fetchAll(userId: string): Promise<Draft[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("content_drafts")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return (data ?? []).map(mapDraftRow);
  },

  async upsertDraft(userId: string, draft: Draft): Promise<void> {
    const supabase = createClient();
    const row = mapDraftToRow(draft, userId);
    const { error } = await supabase.from("content_drafts").upsert(row);
    if (error) throw error;
  },

  async deleteDraft(userId: string, id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from("content_drafts")
      .delete()
      .eq("user_id", userId)
      .eq("id", id);
    if (error) throw error;
  },
};
