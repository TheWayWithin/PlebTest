-- PlebTest Core Schema Migration
-- Created: 2026-01-24
-- Description: Creates all core tables, ENUMs, RLS policies, indexes, and triggers
-- Source: architecture.md

-- ============================================================================
-- SECTION 1: ENUMs
-- ============================================================================

-- Subscription tiers
CREATE TYPE subscription_tier AS ENUM (
  'solo',
  'growth',
  'scale',
  'pro'
);

-- Proposal lifecycle
CREATE TYPE proposal_status AS ENUM (
  'draft',
  'submitted',
  'testing',
  'tested',
  'cancelled',
  'archived'
);

-- Validation test status
CREATE TYPE validation_test_status AS ENUM (
  'pending',
  'in_progress',
  'completed',
  'cancelled',
  'failed'
);

-- Session status
CREATE TYPE session_status AS ENUM (
  'pending',
  'active',
  'completed',
  'abandoned',
  'expired'
);

-- Session mode
CREATE TYPE session_mode AS ENUM (
  'interactive',
  'spectator'
);

-- Test mode
CREATE TYPE test_mode AS ENUM (
  'quick',
  'standard',
  'deep'
);

-- Validation mode
CREATE TYPE validation_mode AS ENUM (
  'interactive',
  'spectator',
  'pre_mortem'
);

-- Pushback preset
CREATE TYPE pushback_preset AS ENUM (
  'cheerleader',
  'pragmatist',
  'critic'
);

-- Verdict
CREATE TYPE verdict AS ENUM (
  'kill',
  'pivot',
  'build'
);

-- Confidence level
CREATE TYPE confidence_level AS ENUM (
  'high',
  'medium',
  'low'
);

-- Subscription status
CREATE TYPE subscription_status AS ENUM (
  'trial',
  'active',
  'past_due',
  'cancelled',
  'expired'
);

-- Report status
CREATE TYPE report_status AS ENUM (
  'generating',
  'ready',
  'public',
  'archived'
);

-- ICP-specific ENUMs
CREATE TYPE pain_intensity AS ENUM (
  'annoying',
  'costly',
  'blocking'
);

CREATE TYPE decision_role AS ENUM (
  'decision_maker',
  'influencer',
  'end_user',
  'blocker'
);

CREATE TYPE adoption_tendency AS ENUM (
  'early_adopter',
  'early_majority',
  'late_majority',
  'laggard'
);

CREATE TYPE skepticism_level AS ENUM (
  'low',
  'medium',
  'high'
);

-- Assumption-specific ENUMs
CREATE TYPE assumption_action AS ENUM (
  'validate',
  'pivot',
  'kill',
  'explore'
);

-- ============================================================================
-- SECTION 2: TABLES
-- ============================================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  country TEXT,
  subscription_tier subscription_tier DEFAULT 'solo',
  subscription_status subscription_status DEFAULT 'trial',
  stripe_customer_id TEXT,
  vat_id TEXT,
  trial_ends_at TIMESTAMPTZ,
  billing_cycle_anchor TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ideas table
CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quick_fire_score INTEGER,
  quick_fire_objection TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Proposals table
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  status proposal_status DEFAULT 'draft',
  problem TEXT,
  current_workarounds TEXT,
  solution TEXT,
  hypotheses TEXT,
  pricing_assumption TEXT,
  competitors TEXT,
  external_context TEXT,
  external_source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assumptions table
CREATE TABLE assumptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  statement TEXT NOT NULL,
  priority INTEGER CHECK (priority >= 1 AND priority <= 5),
  confidence_score DECIMAL(5,2) CHECK (confidence_score >= 0 AND confidence_score <= 100),
  evidence_level INTEGER CHECK (evidence_level >= 1 AND evidence_level <= 4),
  evidence_for JSONB,
  evidence_against JSONB,
  recommended_action assumption_action,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ICPs table (Ideal Customer Profiles)
CREATE TABLE icps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  demographics JSONB,
  psychographics JSONB,
  context TEXT,
  pain_intensity pain_intensity,
  current_solutions TEXT,
  decision_role decision_role,
  adoption_tendency adoption_tendency,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Personas table (generated from ICPs)
CREATE TABLE personas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icp_id UUID NOT NULL REFERENCES icps(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  demographics JSONB,
  psychographics JSONB,
  openness INTEGER CHECK (openness >= 1 AND openness <= 100),
  conscientiousness INTEGER CHECK (conscientiousness >= 1 AND conscientiousness <= 100),
  extraversion INTEGER CHECK (extraversion >= 1 AND extraversion <= 100),
  agreeableness INTEGER CHECK (agreeableness >= 1 AND agreeableness <= 100),
  neuroticism INTEGER CHECK (neuroticism >= 1 AND neuroticism <= 100),
  skepticism_level skepticism_level,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Validation tests table
CREATE TABLE validation_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  parent_test_id UUID REFERENCES validation_tests(id),
  version INTEGER DEFAULT 1,
  test_mode test_mode DEFAULT 'standard',
  validation_mode validation_mode DEFAULT 'interactive',
  pushback_preset pushback_preset DEFAULT 'pragmatist',
  icp_ids UUID[] NOT NULL,
  persona_count INTEGER NOT NULL,
  status validation_test_status DEFAULT 'pending',
  report_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  validation_test_id UUID NOT NULL REFERENCES validation_tests(id) ON DELETE CASCADE,
  persona_id UUID NOT NULL REFERENCES personas(id),
  status session_status DEFAULT 'pending',
  mode session_mode DEFAULT 'interactive',
  conversation JSONB DEFAULT '[]',
  message_count INTEGER DEFAULT 0,
  user_message_count INTEGER DEFAULT 0,
  nudge_count INTEGER DEFAULT 0,
  avg_response_time_seconds INTEGER,
  need_validated BOOLEAN,
  solution_resonated BOOLEAN,
  key_objections JSONB,
  anti_sycophancy_triggers INTEGER DEFAULT 0,
  score DECIMAL(5,2),
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  llm_model_version TEXT,
  prompt_version TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  last_activity_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reports table
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  validation_test_id UUID NOT NULL REFERENCES validation_tests(id) ON DELETE CASCADE,
  status report_status DEFAULT 'generating',
  verdict verdict,
  confidence_level confidence_level,
  need_validation_summary TEXT,
  solution_validation_summary TEXT,
  assumption_board JSONB,
  reality_check_plan JSONB,
  strongest_signals JSONB,
  key_objections JSONB,
  risk_factors JSONB,
  next_steps JSONB,
  pivot_suggestions TEXT,
  pre_mortem_findings JSONB,
  share_token TEXT UNIQUE,
  is_public BOOLEAN DEFAULT FALSE,
  hide_proposal_details BOOLEAN DEFAULT FALSE,
  share_expires_at TIMESTAMPTZ,
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
  generation_version TEXT,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key from validation_tests to reports
ALTER TABLE validation_tests
  ADD CONSTRAINT fk_report
  FOREIGN KEY (report_id) REFERENCES reports(id);

-- Iterations table
CREATE TABLE iterations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  iteration_number INTEGER NOT NULL,
  changes_summary TEXT,
  previous_verdict verdict,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT max_iterations CHECK (iteration_number <= 10)
);

-- Webhook events table (idempotency)
CREATE TABLE webhook_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  status TEXT DEFAULT 'processing',
  processed_at TIMESTAMPTZ,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage tracking table (tier limits)
CREATE TABLE usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  billing_period_start TIMESTAMPTZ NOT NULL,
  billing_period_end TIMESTAMPTZ NOT NULL,
  tests_used INTEGER DEFAULT 0,
  ideas_count INTEGER DEFAULT 0,
  UNIQUE(user_id, billing_period_start)
);

-- ============================================================================
-- SECTION 3: ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE assumptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE icps ENABLE ROW LEVEL SECURITY;
ALTER TABLE personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE validation_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE iterations ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- Users policies
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can select own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- -----------------------------------------------------------------------------
-- Ideas policies
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can select own ideas" ON ideas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ideas" ON ideas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ideas" ON ideas
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own ideas" ON ideas
  FOR DELETE USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- Proposals policies (through idea ownership)
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can select proposals through ideas" ON proposals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM ideas
      WHERE ideas.id = proposals.idea_id
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert proposals through ideas" ON proposals
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM ideas
      WHERE ideas.id = proposals.idea_id
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update proposals through ideas" ON proposals
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM ideas
      WHERE ideas.id = proposals.idea_id
      AND ideas.user_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM ideas
      WHERE ideas.id = proposals.idea_id
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete proposals through ideas" ON proposals
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM ideas
      WHERE ideas.id = proposals.idea_id
      AND ideas.user_id = auth.uid()
    )
  );

-- -----------------------------------------------------------------------------
-- Assumptions policies (through proposal -> idea ownership)
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can select assumptions through proposals" ON assumptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM proposals
      JOIN ideas ON ideas.id = proposals.idea_id
      WHERE proposals.id = assumptions.proposal_id
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert assumptions through proposals" ON assumptions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM proposals
      JOIN ideas ON ideas.id = proposals.idea_id
      WHERE proposals.id = assumptions.proposal_id
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update assumptions through proposals" ON assumptions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM proposals
      JOIN ideas ON ideas.id = proposals.idea_id
      WHERE proposals.id = assumptions.proposal_id
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete assumptions through proposals" ON assumptions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM proposals
      JOIN ideas ON ideas.id = proposals.idea_id
      WHERE proposals.id = assumptions.proposal_id
      AND ideas.user_id = auth.uid()
    )
  );

-- -----------------------------------------------------------------------------
-- ICPs policies (through proposal -> idea ownership)
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can select icps through proposals" ON icps
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM proposals
      JOIN ideas ON ideas.id = proposals.idea_id
      WHERE proposals.id = icps.proposal_id
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert icps through proposals" ON icps
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM proposals
      JOIN ideas ON ideas.id = proposals.idea_id
      WHERE proposals.id = icps.proposal_id
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update icps through proposals" ON icps
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM proposals
      JOIN ideas ON ideas.id = proposals.idea_id
      WHERE proposals.id = icps.proposal_id
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete icps through proposals" ON icps
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM proposals
      JOIN ideas ON ideas.id = proposals.idea_id
      WHERE proposals.id = icps.proposal_id
      AND ideas.user_id = auth.uid()
    )
  );

-- -----------------------------------------------------------------------------
-- Personas policies (through icp -> proposal -> idea ownership)
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can select personas through icps" ON personas
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM icps
      JOIN proposals ON proposals.id = icps.proposal_id
      JOIN ideas ON ideas.id = proposals.idea_id
      WHERE icps.id = personas.icp_id
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert personas through icps" ON personas
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM icps
      JOIN proposals ON proposals.id = icps.proposal_id
      JOIN ideas ON ideas.id = proposals.idea_id
      WHERE icps.id = personas.icp_id
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update personas through icps" ON personas
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM icps
      JOIN proposals ON proposals.id = icps.proposal_id
      JOIN ideas ON ideas.id = proposals.idea_id
      WHERE icps.id = personas.icp_id
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete personas through icps" ON personas
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM icps
      JOIN proposals ON proposals.id = icps.proposal_id
      JOIN ideas ON ideas.id = proposals.idea_id
      WHERE icps.id = personas.icp_id
      AND ideas.user_id = auth.uid()
    )
  );

-- -----------------------------------------------------------------------------
-- Validation tests policies (through proposal -> idea ownership)
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can select validation_tests through proposals" ON validation_tests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM proposals
      JOIN ideas ON ideas.id = proposals.idea_id
      WHERE proposals.id = validation_tests.proposal_id
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert validation_tests through proposals" ON validation_tests
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM proposals
      JOIN ideas ON ideas.id = proposals.idea_id
      WHERE proposals.id = validation_tests.proposal_id
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update validation_tests through proposals" ON validation_tests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM proposals
      JOIN ideas ON ideas.id = proposals.idea_id
      WHERE proposals.id = validation_tests.proposal_id
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete validation_tests through proposals" ON validation_tests
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM proposals
      JOIN ideas ON ideas.id = proposals.idea_id
      WHERE proposals.id = validation_tests.proposal_id
      AND ideas.user_id = auth.uid()
    )
  );

-- -----------------------------------------------------------------------------
-- Sessions policies (through validation_test -> proposal -> idea ownership)
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can select sessions through validation_tests" ON sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM validation_tests
      JOIN proposals ON proposals.id = validation_tests.proposal_id
      JOIN ideas ON ideas.id = proposals.idea_id
      WHERE validation_tests.id = sessions.validation_test_id
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert sessions through validation_tests" ON sessions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM validation_tests
      JOIN proposals ON proposals.id = validation_tests.proposal_id
      JOIN ideas ON ideas.id = proposals.idea_id
      WHERE validation_tests.id = sessions.validation_test_id
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update sessions through validation_tests" ON sessions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM validation_tests
      JOIN proposals ON proposals.id = validation_tests.proposal_id
      JOIN ideas ON ideas.id = proposals.idea_id
      WHERE validation_tests.id = sessions.validation_test_id
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete sessions through validation_tests" ON sessions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM validation_tests
      JOIN proposals ON proposals.id = validation_tests.proposal_id
      JOIN ideas ON ideas.id = proposals.idea_id
      WHERE validation_tests.id = sessions.validation_test_id
      AND ideas.user_id = auth.uid()
    )
  );

-- -----------------------------------------------------------------------------
-- Reports policies (through validation_test -> proposal -> idea ownership)
-- Public reports accessed via server route that validates token
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can select reports through validation_tests" ON reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM validation_tests
      JOIN proposals ON proposals.id = validation_tests.proposal_id
      JOIN ideas ON ideas.id = proposals.idea_id
      WHERE validation_tests.id = reports.validation_test_id
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert reports through validation_tests" ON reports
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM validation_tests
      JOIN proposals ON proposals.id = validation_tests.proposal_id
      JOIN ideas ON ideas.id = proposals.idea_id
      WHERE validation_tests.id = reports.validation_test_id
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update reports through validation_tests" ON reports
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM validation_tests
      JOIN proposals ON proposals.id = validation_tests.proposal_id
      JOIN ideas ON ideas.id = proposals.idea_id
      WHERE validation_tests.id = reports.validation_test_id
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete reports through validation_tests" ON reports
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM validation_tests
      JOIN proposals ON proposals.id = validation_tests.proposal_id
      JOIN ideas ON ideas.id = proposals.idea_id
      WHERE validation_tests.id = reports.validation_test_id
      AND ideas.user_id = auth.uid()
    )
  );

-- -----------------------------------------------------------------------------
-- Iterations policies (through proposal -> idea ownership)
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can select iterations through proposals" ON iterations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM proposals
      JOIN ideas ON ideas.id = proposals.idea_id
      WHERE proposals.id = iterations.proposal_id
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert iterations through proposals" ON iterations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM proposals
      JOIN ideas ON ideas.id = proposals.idea_id
      WHERE proposals.id = iterations.proposal_id
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update iterations through proposals" ON iterations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM proposals
      JOIN ideas ON ideas.id = proposals.idea_id
      WHERE proposals.id = iterations.proposal_id
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete iterations through proposals" ON iterations
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM proposals
      JOIN ideas ON ideas.id = proposals.idea_id
      WHERE proposals.id = iterations.proposal_id
      AND ideas.user_id = auth.uid()
    )
  );

-- -----------------------------------------------------------------------------
-- Usage tracking policies (direct user_id)
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can select own usage_tracking" ON usage_tracking
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage_tracking" ON usage_tracking
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own usage_tracking" ON usage_tracking
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- SECTION 4: INDEXES
-- ============================================================================

CREATE INDEX idx_ideas_user_id ON ideas(user_id);
CREATE INDEX idx_proposals_idea_id ON proposals(idea_id);
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_validation_tests_proposal_id ON validation_tests(proposal_id);
CREATE INDEX idx_validation_tests_status ON validation_tests(status);
CREATE INDEX idx_sessions_validation_test_id ON sessions(validation_test_id);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_sessions_last_activity ON sessions(last_activity_at);
CREATE INDEX idx_reports_share_token ON reports(share_token);
CREATE INDEX idx_usage_tracking_user_period ON usage_tracking(user_id, billing_period_start);

-- ============================================================================
-- SECTION 5: TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER ideas_updated_at BEFORE UPDATE ON ideas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER proposals_updated_at BEFORE UPDATE ON proposals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER icps_updated_at BEFORE UPDATE ON icps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
