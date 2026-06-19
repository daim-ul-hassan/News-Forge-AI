-- NewsForge AI user data tables
-- Run this in the Supabase SQL Editor or via Supabase CLI

-- Research notes
CREATE TABLE IF NOT EXISTS research_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS research_notes_user_id_idx ON research_notes(user_id);

-- Research search history
CREATE TABLE IF NOT EXISTS research_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS research_history_user_id_idx ON research_history(user_id);

-- Content drafts
CREATE TABLE IF NOT EXISTS content_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  format TEXT NOT NULL CHECK (format IN ('article', 'script', 'thread', 'newsletter', 'brief')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in-review', 'ready')),
  word_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS content_drafts_user_id_idx ON content_drafts(user_id);

-- Saved opportunity bookmarks
CREATE TABLE IF NOT EXISTS saved_opportunities (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, opportunity_id)
);

-- Assistant conversations (one active conversation per user for now)
CREATE TABLE IF NOT EXISTS assistant_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS assistant_conversations_user_id_idx ON assistant_conversations(user_id);

-- Assistant messages
CREATE TABLE IF NOT EXISTS assistant_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES assistant_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS assistant_messages_conversation_id_idx ON assistant_messages(conversation_id);

-- Row Level Security
ALTER TABLE research_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistant_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistant_messages ENABLE ROW LEVEL SECURITY;

-- Research notes policies
CREATE POLICY "Users manage own research notes"
  ON research_notes FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Research history policies
CREATE POLICY "Users manage own research history"
  ON research_history FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Content drafts policies
CREATE POLICY "Users manage own content drafts"
  ON content_drafts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Saved opportunities policies
CREATE POLICY "Users manage own saved opportunities"
  ON saved_opportunities FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Assistant conversations policies
CREATE POLICY "Users manage own conversations"
  ON assistant_conversations FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Assistant messages policies (via conversation ownership)
CREATE POLICY "Users manage own messages"
  ON assistant_messages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM assistant_conversations c
      WHERE c.id = conversation_id AND c.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM assistant_conversations c
      WHERE c.id = conversation_id AND c.user_id = auth.uid()
    )
  );

-- Updated-at trigger for research_notes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER research_notes_updated_at
  BEFORE UPDATE ON research_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER content_drafts_updated_at
  BEFORE UPDATE ON content_drafts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER assistant_conversations_updated_at
  BEFORE UPDATE ON assistant_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
