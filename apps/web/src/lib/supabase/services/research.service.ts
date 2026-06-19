import { createClient } from "@/lib/supabase/client";
import { mapResearchHistoryRow, mapResearchNoteRow, mapResearchNoteToRow } from "@/lib/supabase/mappers";
import type { ResearchHistoryItem, ResearchNote } from "@/types/research.types";

export const researchService = {
  async fetchAll(userId: string): Promise<{ notes: ResearchNote[]; history: ResearchHistoryItem[] }> {
    const supabase = createClient();

    const [notesResult, historyResult] = await Promise.all([
      supabase
        .from("research_notes")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false }),
      supabase
        .from("research_history")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

    if (notesResult.error) throw notesResult.error;
    if (historyResult.error) throw historyResult.error;

    return {
      notes: (notesResult.data ?? []).map(mapResearchNoteRow),
      history: (historyResult.data ?? []).map(mapResearchHistoryRow),
    };
  },

  async upsertNote(userId: string, note: ResearchNote): Promise<void> {
    const supabase = createClient();
    const row = mapResearchNoteToRow(note, userId);
    const { error } = await supabase.from("research_notes").upsert(row);
    if (error) throw error;
  },

  async deleteNote(userId: string, id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from("research_notes")
      .delete()
      .eq("user_id", userId)
      .eq("id", id);
    if (error) throw error;
  },

  async upsertHistoryItem(userId: string, item: ResearchHistoryItem): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.from("research_history").upsert({
      id: item.id,
      user_id: userId,
      query: item.query,
      created_at: item.timestamp,
    });
    if (error) throw error;
  },

  async deleteHistoryItem(userId: string, id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from("research_history")
      .delete()
      .eq("user_id", userId)
      .eq("id", id);
    if (error) throw error;
  },

  async clearHistory(userId: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.from("research_history").delete().eq("user_id", userId);
    if (error) throw error;
  },
};
