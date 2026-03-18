-- Day 5: KYC Verification Tables
-- Run this migration to add KYC tracking

-- Add kyc_status column to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS kyc_status VARCHAR(50) DEFAULT 'NOT_STARTED';

-- Create kyc_verifications table
CREATE TABLE IF NOT EXISTS kyc_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'NOT_STARTED',
  provider VARCHAR(50) NOT NULL DEFAULT 'MOCK',
  provider_ref VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_kyc_verifications_user_id ON kyc_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_verifications_status ON kyc_verifications(status);
CREATE INDEX IF NOT EXISTS idx_kyc_verifications_provider_ref ON kyc_verifications(provider_ref);
CREATE INDEX IF NOT EXISTS idx_users_kyc_status ON users(kyc_status);

-- Comment on table
COMMENT ON TABLE kyc_verifications IS 'KYC verification records - SumSub ready architecture';
COMMENT ON COLUMN kyc_verifications.provider IS 'KYC provider: SUMSUB or MOCK';
COMMENT ON COLUMN kyc_verifications.provider_ref IS 'External provider reference ID (e.g., SumSub applicantId)';
