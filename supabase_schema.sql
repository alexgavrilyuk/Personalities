-- Supabase Database Schema for Personality Assessment App
-- Run this in your Supabase SQL editor

-- User responses table
CREATE TABLE IF NOT EXISTS user_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question_id VARCHAR(20) NOT NULL,
  response_value INTEGER CHECK (response_value >= 1 AND response_value <= 7),
  selected_option CHAR(1) CHECK (selected_option IN ('a', 'b')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- Assessment sessions table
CREATE TABLE IF NOT EXISTS assessment_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  total_responses INTEGER DEFAULT 0,
  last_question_index INTEGER DEFAULT 0
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_responses_user_id ON user_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_responses_user_question ON user_responses(user_id, question_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON assessment_sessions(user_id);

-- Enable Row Level Security
ALTER TABLE user_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can only see their own responses" ON user_responses
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only see their own sessions" ON assessment_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_responses_updated_at BEFORE UPDATE
  ON user_responses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();