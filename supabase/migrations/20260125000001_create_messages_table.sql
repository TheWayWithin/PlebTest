-- Migration: Create messages table for streaming session conversations
-- Created: 2026-01-25
-- Purpose: Store individual messages for SSE streaming with checkpoint support

-- Create the updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Messages table for conversation history
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL DEFAULT '',
  token_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for efficient queries
CREATE INDEX idx_messages_session_id ON messages(session_id);
CREATE INDEX idx_messages_created_at ON messages(session_id, created_at);

-- Trigger to update updated_at
CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS policies for messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can read their own messages (through session ownership chain)
CREATE POLICY "Users can read messages for their sessions" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM sessions s
      JOIN validation_tests vt ON s.validation_test_id = vt.id
      JOIN proposals p ON vt.proposal_id = p.id
      JOIN ideas i ON p.idea_id = i.id
      WHERE s.id = messages.session_id
      AND i.user_id = auth.uid()
    )
  );

-- Users can insert messages for their sessions
CREATE POLICY "Users can insert messages for their sessions" ON messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM sessions s
      JOIN validation_tests vt ON s.validation_test_id = vt.id
      JOIN proposals p ON vt.proposal_id = p.id
      JOIN ideas i ON p.idea_id = i.id
      WHERE s.id = messages.session_id
      AND i.user_id = auth.uid()
    )
  );

-- Users can update messages for their sessions (for checkpointing)
CREATE POLICY "Users can update messages for their sessions" ON messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM sessions s
      JOIN validation_tests vt ON s.validation_test_id = vt.id
      JOIN proposals p ON vt.proposal_id = p.id
      JOIN ideas i ON p.idea_id = i.id
      WHERE s.id = messages.session_id
      AND i.user_id = auth.uid()
    )
  );

-- Comment for documentation
COMMENT ON TABLE messages IS 'Individual messages in validation sessions, supports streaming checkpoints';
COMMENT ON COLUMN messages.role IS 'Message sender: user, assistant, or system';
COMMENT ON COLUMN messages.content IS 'Message content, updated incrementally during streaming';
COMMENT ON COLUMN messages.token_count IS 'Estimated token count for the message';
