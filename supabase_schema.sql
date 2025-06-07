-- Supabase Database Schema for Personality Assessment App
-- Run this in your Supabase SQL editor

-- ===== PHASE 1: Update existing tables =====

-- Add assessment_type column to user_responses table
ALTER TABLE user_responses 
ADD COLUMN IF NOT EXISTS assessment_type VARCHAR(50) DEFAULT 'core' NOT NULL;

-- Update all existing responses to be 'core' type
UPDATE user_responses 
SET assessment_type = 'core' 
WHERE assessment_type IS NULL OR assessment_type = '';

-- Update the unique constraint to include assessment_type
ALTER TABLE user_responses 
DROP CONSTRAINT IF EXISTS user_responses_user_id_question_id_key;

ALTER TABLE user_responses 
ADD CONSTRAINT user_responses_user_id_question_id_assessment_type_key 
UNIQUE (user_id, question_id, assessment_type);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_user_responses_type ON user_responses(user_id, assessment_type);

-- ===== PHASE 2: Create new tables =====

-- Simple table to track which assessments each user has completed
CREATE TABLE IF NOT EXISTS user_completions (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_type VARCHAR(50) NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  response_count INTEGER NOT NULL,
  PRIMARY KEY (user_id, assessment_type)
);

-- Enable RLS
ALTER TABLE user_completions ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Users can only see their own completions" ON user_completions
  FOR ALL USING (auth.uid() = user_id);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_completions_user ON user_completions(user_id);

-- ===== PHASE 3: Migrate existing data =====

-- For any user with 200 responses, mark core assessment as complete
INSERT INTO user_completions (user_id, assessment_type, response_count, completed_at)
SELECT 
  user_id, 
  'core' as assessment_type,
  COUNT(*) as response_count,
  MAX(created_at) as completed_at
FROM user_responses
GROUP BY user_id
HAVING COUNT(*) = 200
ON CONFLICT (user_id, assessment_type) DO NOTHING;

-- ===== ORIGINAL SCHEMA (kept for reference) =====

-- User responses table
CREATE TABLE IF NOT EXISTS user_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question_id VARCHAR(20) NOT NULL,
  response_value INTEGER CHECK (response_value >= 1 AND response_value <= 7),
  selected_option CHAR(1) CHECK (selected_option IN ('a', 'b')),
  assessment_type VARCHAR(50) DEFAULT 'core' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, question_id, assessment_type)
);

-- Assessment sessions table (TO BE DEPRECATED)
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
CREATE INDEX IF NOT EXISTS idx_user_responses_type ON user_responses(user_id, assessment_type);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON assessment_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_completions_user ON user_completions(user_id);

-- Enable Row Level Security
ALTER TABLE user_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_completions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can only see their own responses" ON user_responses
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only see their own sessions" ON assessment_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only see their own completions" ON user_completions
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