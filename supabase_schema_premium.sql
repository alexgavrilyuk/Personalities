-- Premium Features Database Schema Update
-- Run this after the base schema to add premium functionality

-- ===== ASSESSMENT TYPES AND TIERS =====

-- Assessment types and tiers
CREATE TABLE IF NOT EXISTS assessment_types (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  tier VARCHAR(20) NOT NULL CHECK (tier IN ('discovery', 'core', 'premium')),
  question_count INTEGER NOT NULL,
  description TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  prerequisite_assessment VARCHAR(50),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert assessment types
INSERT INTO assessment_types (id, name, tier, question_count, is_premium, description, order_index) VALUES
('discovery', 'Discovery Assessment', 'discovery', 60, FALSE, 'Quick personality snapshot to understand your core traits', 1),
('core', 'Core Personality Assessment', 'core', 200, FALSE, 'Comprehensive personality analysis with detailed insights', 2),
('relationships', 'Relationship Dynamics', 'premium', 50, TRUE, 'Understand your attachment style and relationship patterns', 3),
('career', 'Career Alignment Profile', 'premium', 80, TRUE, 'Discover careers that match your personality and values', 4),
('emotional_intelligence', 'Emotional Intelligence', 'premium', 60, TRUE, 'Map your EQ to your personality profile', 5),
('leadership', 'Leadership Potential', 'premium', 70, TRUE, 'Uncover your leadership style and potential', 6),
('creativity', 'Creative Expression', 'premium', 40, TRUE, 'Explore how your personality influences creativity', 7)
ON CONFLICT (id) DO NOTHING;

-- ===== USER PREMIUM STATUS =====

-- User premium status
CREATE TABLE IF NOT EXISTS user_premium (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  payment_reference VARCHAR(255),
  amount DECIMAL(10,2) DEFAULT 24.99,
  payment_status VARCHAR(50) DEFAULT 'completed'
);

-- Enable RLS
ALTER TABLE user_premium ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Users can only see their own premium status" ON user_premium
  FOR SELECT USING (auth.uid() = user_id);

-- ===== TEAM FUNCTIONALITY =====

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  team_type VARCHAR(50) CHECK (team_type IN ('family', 'friends', 'work', 'other')),
  invite_code VARCHAR(20) UNIQUE DEFAULT substr(md5(random()::text), 0, 9),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team members
CREATE TABLE IF NOT EXISTS team_members (
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  share_level VARCHAR(20) DEFAULT 'full' CHECK (share_level IN ('full', 'basic', 'anonymous')),
  is_active BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (team_id, user_id)
);

-- Team invitations (for tracking pending invites)
CREATE TABLE IF NOT EXISTS team_invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  email VARCHAR(255),
  invited_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  accepted BOOLEAN DEFAULT FALSE,
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ
);

-- Enable RLS for team tables
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;

-- Team RLS Policies
CREATE POLICY "Users can see teams they belong to" ON teams
  FOR SELECT USING (
    auth.uid() = created_by OR 
    EXISTS (SELECT 1 FROM team_members WHERE team_id = teams.id AND user_id = auth.uid())
  );

CREATE POLICY "Users can create teams" ON teams
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Team owners can update their teams" ON teams
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can see team members for their teams" ON team_members
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM team_members tm WHERE tm.team_id = team_members.team_id AND tm.user_id = auth.uid())
  );

-- ===== NARRATIVE CONTENT SYSTEM =====

-- Narrative templates for dynamic report generation
CREATE TABLE IF NOT EXISTS narrative_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  trait_conditions JSONB NOT NULL, -- e.g., {"openness": {"min": 70, "max": 100}, "conscientiousness": {"min": 30, "max": 50}}
  narrative_text TEXT NOT NULL,
  priority INTEGER DEFAULT 0,
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trait interaction rules
CREATE TABLE IF NOT EXISTS trait_interaction_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trait_combination JSONB NOT NULL, -- e.g., {"traits": ["high_openness", "low_conscientiousness"]}
  pattern_name VARCHAR(100),
  insight_text TEXT NOT NULL,
  behavioral_examples TEXT[],
  growth_suggestions TEXT[],
  famous_examples TEXT,
  prevalence_percentage DECIMAL(5,2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Type-specific insights
CREATE TABLE IF NOT EXISTS type_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mbti_type VARCHAR(4) NOT NULL,
  insight_category VARCHAR(50),
  insight_text TEXT NOT NULL,
  context_conditions JSONB, -- Optional conditions like age ranges, etc.
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== SCIENTIFIC REFERENCES =====

-- Scientific references for credibility
CREATE TABLE IF NOT EXISTS scientific_references (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  citation TEXT NOT NULL,
  doi VARCHAR(255),
  category VARCHAR(100),
  relevance_tags TEXT[],
  year INTEGER,
  authors TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== USER ACTIVITY TRACKING =====

-- Track premium assessment completions
CREATE TABLE IF NOT EXISTS premium_assessment_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_type VARCHAR(50) REFERENCES assessment_types(id),
  results JSONB NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, assessment_type)
);

-- Enable RLS
ALTER TABLE premium_assessment_results ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Users can only see their own premium results" ON premium_assessment_results
  FOR ALL USING (auth.uid() = user_id);

-- ===== INDEXES FOR PERFORMANCE =====

CREATE INDEX IF NOT EXISTS idx_teams_invite_code ON teams(invite_code) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_team_members_user ON team_members(user_id) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_narrative_templates_active ON narrative_templates(category, is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_trait_interactions_active ON trait_interaction_rules(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_premium_results_user ON premium_assessment_results(user_id);

-- ===== FUNCTIONS AND TRIGGERS =====

-- Function to generate unique invite codes
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
  done BOOLEAN;
BEGIN
  done := FALSE;
  WHILE NOT done LOOP
    new_code := upper(substr(md5(random()::text), 0, 9));
    done := NOT EXISTS(SELECT 1 FROM teams WHERE invite_code = new_code);
  END LOOP;
  RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Update trigger for teams
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE
  ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update trigger for narrative templates
CREATE TRIGGER update_narrative_templates_updated_at BEFORE UPDATE
  ON narrative_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to check premium access
CREATE OR REPLACE FUNCTION has_premium_access(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(SELECT 1 FROM user_premium WHERE user_id = check_user_id);
END;
$$ LANGUAGE plpgsql;

-- ===== INITIAL NARRATIVE CONTENT =====

-- Insert some initial narrative templates
INSERT INTO narrative_templates (category, subcategory, trait_conditions, narrative_text, priority) VALUES
(
  'openness',
  'very_high',
  '{"openness": {"min": 85, "max": 100}}',
  'Your Openness score places you in the {percentile}th percentile, marking you as exceptionally receptive to new experiences and ideas. This isn''t just about being "creative" – it''s a fundamental orientation toward novelty and complexity that shapes how you perceive reality. You likely find yourself drawn to abstract concepts that others find bewildering, and you may experience a rich inner world of imagination that sometimes feels more real than the mundane.',
  10
),
(
  'openness',
  'high',
  '{"openness": {"min": 70, "max": 85}}',
  'With an Openness score in the {percentile}th percentile, you demonstrate a strong inclination toward intellectual curiosity and aesthetic appreciation. Your mind naturally seeks out new perspectives and experiences, though you balance this with practical considerations. You''re likely seen as creative and insightful by others, capable of thinking outside conventional boundaries while still maintaining connection to shared reality.',
  10
),
(
  'trait_interaction',
  'creative_chaos',
  '{"openness": {"min": 70, "max": 100}, "conscientiousness": {"min": 0, "max": 30}}',
  'Your combination of high Openness and low Conscientiousness creates what researchers call the "Creative Chaos" pattern. You''re blessed with exceptional creativity and vision, but cursed with the challenge of bringing those visions to practical fruition. This pattern is found in many revolutionary artists and innovators who changed the world – but also struggled with deadlines, organization, and finishing projects.',
  20
)
ON CONFLICT DO NOTHING;

-- Insert some trait interaction rules
INSERT INTO trait_interaction_rules (pattern_name, trait_combination, insight_text, behavioral_examples, growth_suggestions, prevalence_percentage) VALUES
(
  'Creative Chaos',
  '{"high_openness": true, "low_conscientiousness": true}',
  'This rare combination appears in approximately 3% of the population and is characterized by brilliant creativity coupled with organizational challenges.',
  ARRAY['Starting multiple creative projects with enthusiasm, then losing steam', 'Having brilliant ideas at 3 AM but forgetting them by morning', 'Your workspace looking like a tornado hit it, but you knowing where everything is'],
  ARRAY['Partner with detail-oriented people who can execute your visions', 'Use external structure (apps, accountability partners) to compensate', 'Embrace your pattern but build minimal systems for capturing ideas'],
  3.0
),
(
  'Turbulent Extravert',
  '{"high_extraversion": true, "high_neuroticism": true}',
  'You show a rare combination of high social energy with emotional sensitivity, creating a dynamic but sometimes exhausting inner experience.',
  ARRAY['Feeling energized by social situations but emotionally drained afterward', 'Experiencing intense highs and lows in social contexts', 'Being the life of the party while battling inner anxiety'],
  ARRAY['Build in recovery time after social events', 'Practice emotional regulation techniques', 'Choose your social commitments carefully'],
  5.2
)
ON CONFLICT DO NOTHING;

-- ===== GRANT PERMISSIONS =====

-- Grant necessary permissions to authenticated users
GRANT SELECT ON assessment_types TO authenticated;
GRANT SELECT ON narrative_templates TO authenticated;
GRANT SELECT ON trait_interaction_rules TO authenticated;
GRANT SELECT ON type_insights TO authenticated;
GRANT SELECT ON scientific_references TO authenticated;