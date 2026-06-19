import { createClient } from "@/lib/supabase/client";
import { mapConversation, mapMessageRow } from "@/lib/supabase/mappers";
import type { Conversation, Message } from "@/types/assistant.types";

export const assistantService = {
  async fetchConversation(userId: string): Promise<Conversation | null> {
    const supabase = createClient();

    const { data: conversation, error: convError } = await supabase
      .from("assistant_conversations")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (convError) throw convError;
    if (!conversation) return null;

    const { data: messages, error: msgError } = await supabase
      .from("assistant_messages")
      .select("*")
      .eq("conversation_id", conversation.id)
      .order("created_at", { ascending: true });

    if (msgError) throw msgError;

    return mapConversation(conversation, messages ?? []);
  },

  async ensureConversation(userId: string, conversationId: string): Promise<void> {
    const supabase = createClient();
    const now = new Date().toISOString();
    const { error } = await supabase.from("assistant_conversations").upsert({
      id: conversationId,
      user_id: userId,
      created_at: now,
      updated_at: now,
    });
    if (error) throw error;
  },

  async addMessage(userId: string, conversationId: string, message: Message): Promise<void> {
    const supabase = createClient();
    await this.ensureConversation(userId, conversationId);

    const { error: msgError } = await supabase.from("assistant_messages").upsert({
      id: message.id,
      conversation_id: conversationId,
      role: message.role,
      content: message.content,
      created_at: message.timestamp,
    });
    if (msgError) throw msgError;

    const { error: convError } = await supabase
      .from("assistant_conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId)
      .eq("user_id", userId);
    if (convError) throw convError;
  },

  async updateMessageContent(conversationId: string, messageId: string, content: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from("assistant_messages")
      .update({ content })
      .eq("id", messageId)
      .eq("conversation_id", conversationId);
    if (error) throw error;

    const { error: convError } = await supabase
      .from("assistant_conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId);
    if (convError) throw convError;
  },

  async clearConversation(userId: string, oldConversationId: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from("assistant_conversations")
      .delete()
      .eq("id", oldConversationId)
      .eq("user_id", userId);
    if (error) throw error;
  },

  async fetchMessages(conversationId: string): Promise<Message[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("assistant_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return (data ?? []).map(mapMessageRow);
  },
};
