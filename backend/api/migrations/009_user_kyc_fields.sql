-- Day 6: Add KYC fields to users table
-- Migration: 009_user_kyc_fields.sql

-- Add new KYC fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS kyc_reviewed_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS kyc_provider VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS kyc_provider_applicant_id VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS kyc_rejection_reason TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_state VARCHAR(50) DEFAULT 'REGISTERED';
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Update kyc_status default value (if column exists)
-- Note: Existing values will remain, only new records get new default
ALTER TABLE users ALTER COLUMN kyc_status SET DEFAULT 'not_started';

-- Create indexes for KYC lookups
CREATE INDEX IF NOT EXISTS idx_users_kyc_provider_applicant_id ON users(kyc_provider_applicant_id);
CREATE INDEX IF NOT EXISTS idx_users_user_state ON users(user_state);

-- Update existing users with kyc_status to new format
UPDATE users SET kyc_status = 'not_started' WHERE kyc_status = 'NOT_STARTED';
UPDATE users SET kyc_status = 'started' WHERE kyc_status = 'IN_PROGRESS';
UPDATE users SET kyc_status = 'pending' WHERE kyc_status = 'PENDING_REVIEW';
UPDATE users SET kyc_status = 'approved' WHERE kyc_status = 'APPROVED';
UPDATE users SET kyc_status = 'rejected' WHERE kyc_status = 'REJECTED';

-- Comment on columns
COMMENT ON COLUMN users.kyc_status IS 'KYC verification status: not_started, started, pending, approved, rejected, pending_manual_review';
COMMENT ON COLUMN users.kyc_reviewed_at IS 'Timestamp when KYC was last reviewed';
COMMENT ON COLUMN users.kyc_provider IS 'KYC provider used: SUMSUB, MOCK';
COMMENT ON COLUMN users.kyc_provider_applicant_id IS 'External applicant ID from KYC provider';
COMMENT ON COLUMN users.kyc_rejection_reason IS 'Reason for KYC rejection if applicable';
COMMENT ON COLUMN users.user_state IS 'User lifecycle state: REGISTERED, KYC_STARTED, KYC_PENDING, KYC_APPROVED, KYC_REJECTED';
