-- Day 6: Create KYC events table
-- Migration: 010_kyc_events.sql
-- Purpose: Audit trail, debugging, dispute support, compliance history

CREATE TABLE IF NOT EXISTS kyc_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  review_status VARCHAR(50),
  review_answer VARCHAR(50),
  payload JSONB,
  received_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_kyc_events_user_id ON kyc_events(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_events_provider ON kyc_events(provider);
CREATE INDEX IF NOT EXISTS idx_kyc_events_event_type ON kyc_events(event_type);
CREATE INDEX IF NOT EXISTS idx_kyc_events_received_at ON kyc_events(received_at);
CREATE INDEX IF NOT EXISTS idx_kyc_events_review_answer ON kyc_events(review_answer);

-- GIN index for JSONB payload queries
CREATE INDEX IF NOT EXISTS idx_kyc_events_payload ON kyc_events USING GIN(payload);

-- Comments
COMMENT ON TABLE kyc_events IS 'Stores all KYC provider events for audit trail and compliance';
COMMENT ON COLUMN kyc_events.user_id IS 'Reference to the user this event belongs to';
COMMENT ON COLUMN kyc_events.provider IS 'KYC provider: SUMSUB, MOCK, etc.';
COMMENT ON COLUMN kyc_events.event_type IS 'Type of event: applicantReviewed, applicantCreated, etc.';
COMMENT ON COLUMN kyc_events.review_status IS 'Review status: init, pending, completed, onHold';
COMMENT ON COLUMN kyc_events.review_answer IS 'Review result: GREEN (approved), RED (rejected), YELLOW (attention needed)';
COMMENT ON COLUMN kyc_events.payload IS 'Raw JSON payload from the KYC provider';
COMMENT ON COLUMN kyc_events.received_at IS 'Timestamp when the event was received';
