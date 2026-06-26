import { createClient } from "@/lib/supabase/client";

export const subscriptionsService = {
  async getSubscription(userId: string) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from(/* eslint-disable-line @typescript-eslint/no-explicit-any */ "subscriptions" as any)
        .select("plan, status, started_at, expires_at")
        .eq("user_id", userId)
        .single();
      if (error) {
        console.warn("[subscriptionsService] getSubscription error", error.message);
        return null;
      }
      return data || null;
    } catch (err) {
      console.warn("[subscriptionsService] getSubscription unexpected", err);
      return null;
    }
  },

  async ensureSubscription(userId: string) {
    try {
      const supabase = createClient();
      const { data } = await supabase.from(/* eslint-disable-line @typescript-eslint/no-explicit-any */ "subscriptions" as any).select("id").eq("user_id", userId).single();
      if (!data) {
        const defaultRow = {
          user_id: userId,
          plan: "starter",
          status: "inactive",
          started_at: new Date().toISOString(),
          expires_at: null,
        };
        const { error } = await supabase.from(/* eslint-disable-line @typescript-eslint/no-explicit-any */ "subscriptions" as any).insert(defaultRow as unknown as Record<string, unknown>);
        if (error) console.warn("[subscriptionsService] ensureSubscription insert error", error.message);
      }
      return true;
    } catch (err) {
      console.warn("[subscriptionsService] ensureSubscription unexpected", err);
      return false;
    }
  },
};