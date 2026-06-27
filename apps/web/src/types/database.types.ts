export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          display_name: string | null;
          bio: string | null;
          niche: string | null;
          platforms: string[] | null;
          topics: string[] | null;
          content_types: string[] | null;
          writing_styles: string[] | null;
          completion_percentage: number | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email?: string;
          full_name?: string | null;
          display_name?: string | null;
          bio?: string | null;
          niche?: string | null;
          platforms?: string[] | null;
          topics?: string[] | null;
          content_types?: string[] | null;
          writing_styles?: string[] | null;
          completion_percentage?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          display_name?: string | null;
          bio?: string | null;
          niche?: string | null;
          platforms?: string[] | null;
          topics?: string[] | null;
          content_types?: string[] | null;
          writing_styles?: string[] | null;
          completion_percentage?: number | null;
          created_at?: string;
        };
        Relationships: [];
      };
      research_notes: {
        Row: {
          id: string;
          user_id: string;
          topic: string;
          content: string;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          topic: string;
          content?: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          topic?: string;
          content?: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      research_history: {
        Row: {
          id: string;
          user_id: string;
          query: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          query: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          query?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      content_drafts: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          format: string;
          status: string;
          word_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content?: string;
          format: string;
          status?: string;
          word_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          format?: string;
          status?: string;
          word_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      saved_opportunities: {
        Row: {
          user_id: string;
          opportunity_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          opportunity_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          opportunity_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      assistant_conversations: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      assistant_messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          role: string;
          content?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          role?: string;
          content?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Convenience row aliases for mappers
export type ResearchNoteRow = Database["public"]["Tables"]["research_notes"]["Row"];
export type ResearchHistoryRow = Database["public"]["Tables"]["research_history"]["Row"];
export type ContentDraftRow = Database["public"]["Tables"]["content_drafts"]["Row"];
export type SavedOpportunityRow = Database["public"]["Tables"]["saved_opportunities"]["Row"];
export type AssistantConversationRow = Database["public"]["Tables"]["assistant_conversations"]["Row"];
export type AssistantMessageRow = Database["public"]["Tables"]["assistant_messages"]["Row"];

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}
