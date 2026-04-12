-- Migration: Create core tables
-- Date: 2026-03-13

-- Merchants table (must be created first due to FK reference)
CREATE TABLE IF NOT EXISTS merchants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name VARCHAR(255) NOT NULL,
  trading_name VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  role VARCHAR(50) NOT NULL DEFAULT 'merchant',
  merchant_id UUID REFERENCES merchants(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Onboardings table
CREATE TABLE IF NOT EXISTS onboardings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES merchants(id) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  submitted_at TIMESTAMP,
  reviewed_at TIMESTAMP,
  notes TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_merchant_id ON users(merchant_id);
CREATE INDEX IF NOT EXISTS idx_onboardings_merchant_id ON onboardings(merchant_id);
CREATE INDEX IF NOT EXISTS idx_onboardings_status ON onboardings(status);
-- Migration: Update user roles from merchant to user
-- Date: 2026-03-13

-- Update existing merchant roles to user
UPDATE users SET role = 'user' WHERE role = 'merchant';

-- Update default value
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'user';
-- Migration: Update user roles from user to merchant
-- Date: 2026-03-14

-- Update existing user roles to merchant
UPDATE users SET role = 'merchant' WHERE role = 'user';

-- Update default value
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'merchant';
-- Migration: Add profiles table and updated_at columns
-- Date: 2026-03-14

-- Profiles table (app-level user details)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  phone VARCHAR(50),
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add updated_at to existing tables
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
ALTER TABLE onboardings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Index for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
-- Migration: Day 4 Onboarding Entities
-- Date: 2026-03-18

-- A. Expand Merchant table with additional fields
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS owner_user_id UUID REFERENCES users(id);
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS legal_business_name VARCHAR(255);
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS business_type VARCHAR(100);
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS registration_number VARCHAR(100);
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS country_of_incorporation VARCHAR(100);
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS tax_number VARCHAR(100);
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS website_url VARCHAR(500);
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS industry_type VARCHAR(100);
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS business_description TEXT;

-- B. Merchant Address table
CREATE TABLE IF NOT EXISTS merchant_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  county_or_state VARCHAR(100),
  postcode VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  address_type VARCHAR(50) NOT NULL DEFAULT 'registered',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- C. KYC/KYB Submission table
CREATE TABLE IF NOT EXISTS kyc_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  submission_type VARCHAR(50) NOT NULL DEFAULT 'combined',
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMP,
  reviewed_at TIMESTAMP,
  reviewed_by UUID REFERENCES users(id),
  risk_level VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- D. Beneficial Owner / Director table
CREATE TABLE IF NOT EXISTS beneficial_owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  dob DATE,
  nationality VARCHAR(100),
  ownership_percentage DECIMAL(5, 2),
  role VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(50),
  is_primary_contact BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- E. Document Metadata table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  submission_id UUID REFERENCES kyc_submissions(id) ON DELETE SET NULL,
  document_type VARCHAR(100) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100),
  storage_path VARCHAR(500),
  file_key VARCHAR(255),
  file_size INTEGER,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- F. Onboarding Progress Tracker table
CREATE TABLE IF NOT EXISTS onboarding_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE UNIQUE NOT NULL,
  current_step VARCHAR(100) NOT NULL DEFAULT 'business_details',
  completed_steps JSONB DEFAULT '[]',
  completion_percent INTEGER DEFAULT 0,
  last_saved_at TIMESTAMP DEFAULT NOW(),
  is_submitted BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_merchant_addresses_merchant_id ON merchant_addresses(merchant_id);
CREATE INDEX IF NOT EXISTS idx_kyc_submissions_merchant_id ON kyc_submissions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_kyc_submissions_status ON kyc_submissions(status);
CREATE INDEX IF NOT EXISTS idx_beneficial_owners_merchant_id ON beneficial_owners(merchant_id);
CREATE INDEX IF NOT EXISTS idx_documents_merchant_id ON documents(merchant_id);
CREATE INDEX IF NOT EXISTS idx_documents_submission_id ON documents(submission_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_onboarding_progress_merchant_id ON onboarding_progress(merchant_id);

-- Comments
COMMENT ON COLUMN merchant_addresses.address_type IS 'registered, trading, billing';
COMMENT ON COLUMN kyc_submissions.submission_type IS 'kyc, kyb, combined';
COMMENT ON COLUMN kyc_submissions.status IS 'pending, under_review, approved, rejected';
COMMENT ON COLUMN kyc_submissions.risk_level IS 'low, medium, high';
COMMENT ON COLUMN documents.document_type IS 'id_proof, address_proof, business_registration, bank_statement';
COMMENT ON COLUMN documents.status IS 'pending, approved, rejected';
COMMENT ON COLUMN onboarding_progress.current_step IS 'business_details, address, owners, documents, review';
-- Migration: Add missing indexes for Day 4
-- Date: 2026-03-18

-- Additional indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_merchants_owner_user_id ON merchants(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_merchants_status ON merchants(status);
CREATE INDEX IF NOT EXISTS idx_merchants_business_type ON merchants(business_type);
-- Migration: Audit Logs Table
-- Date: 2026-03-18

-- Audit logs table for compliance and debugging
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action VARCHAR(100) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  merchant_id UUID REFERENCES merchants(id) ON DELETE SET NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  details JSONB DEFAULT '{}',
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_merchant_id ON audit_logs(merchant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Comments
COMMENT ON TABLE audit_logs IS 'Audit trail for compliance and debugging';
COMMENT ON COLUMN audit_logs.action IS 'Event type: ONBOARDING_SUBMITTED, MERCHANT_APPROVED, etc.';
COMMENT ON COLUMN audit_logs.details IS 'Additional context as JSON';
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
-- Day 6: Create system logs table
-- Migration: 011_system_logs.sql
-- Purpose: Central place for meaningful backend actions

CREATE TABLE IF NOT EXISTS system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  source VARCHAR(100) NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_system_logs_user_id ON system_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_system_logs_action ON system_logs(action);
CREATE INDEX IF NOT EXISTS idx_system_logs_source ON system_logs(source);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at);

-- GIN index for JSONB metadata queries
CREATE INDEX IF NOT EXISTS idx_system_logs_metadata ON system_logs USING GIN(metadata);

-- Comments
COMMENT ON TABLE system_logs IS 'Central log for meaningful backend actions';
COMMENT ON COLUMN system_logs.user_id IS 'Reference to user (nullable for system events)';
COMMENT ON COLUMN system_logs.action IS 'Action type: KYC_STARTED, WEBHOOK_RECEIVED, KYC_APPROVED, etc.';
COMMENT ON COLUMN system_logs.source IS 'Source of the action: KYC_SERVICE, WEBHOOK_HANDLER, TRANSACTION_SERVICE';
COMMENT ON COLUMN system_logs.metadata IS 'Additional context as JSON';
COMMENT ON COLUMN system_logs.created_at IS 'Timestamp when the log was created';
-- Migration: 012_transactions.sql
-- Day 6: Transaction table structure for transaction gating
-- Created: 2026-03-19

-- Transaction status enum
-- PENDING: Transaction created, awaiting processing
-- PROCESSING: Transaction is being processed
-- COMPLETED: Transaction completed successfully
-- FAILED: Transaction failed (payment error, etc.)
-- BLOCKED: Transaction blocked by eligibility check (KYC, sanctions, etc.)

-- Transaction types enum
-- PAYMENT: Standard payment transaction
-- REFUND: Refund of a previous payment
-- PAYOUT: Payout to merchant
-- ESCROW_FUND: Funding an escrow
-- ESCROW_RELEASE: Releasing escrow funds
-- FEE: Platform fee

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User who initiated the transaction
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,

  -- Optional merchant association
  merchant_id UUID REFERENCES merchants(id) ON DELETE SET NULL,

  -- Transaction details
  amount DECIMAL(18, 8) NOT NULL CHECK (amount > 0),
  currency VARCHAR(10) NOT NULL DEFAULT 'USDC',

  -- Transaction status
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',

  -- Transaction type
  type VARCHAR(30) NOT NULL,

  -- Optional reference to related transaction (e.g., refund -> original payment)
  parent_transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,

  -- Optional external reference (from payment provider)
  external_reference VARCHAR(255),

  -- Failure/block reason if applicable
  failure_reason TEXT,
  block_reason VARCHAR(100),

  -- Metadata for extensibility
  metadata JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,

  -- Constraints
  CONSTRAINT valid_status CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'BLOCKED')),
  CONSTRAINT valid_type CHECK (type IN ('PAYMENT', 'REFUND', 'PAYOUT', 'ESCROW_FUND', 'ESCROW_RELEASE', 'FEE'))
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_merchant_id ON transactions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_user_status ON transactions(user_id, status);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_transactions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS transactions_updated_at ON transactions;
CREATE TRIGGER transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_transactions_updated_at();

-- Comment on table
COMMENT ON TABLE transactions IS 'Core transaction table for payment processing with KYC gating';
COMMENT ON COLUMN transactions.status IS 'PENDING, PROCESSING, COMPLETED, FAILED, BLOCKED';
COMMENT ON COLUMN transactions.type IS 'PAYMENT, REFUND, PAYOUT, ESCROW_FUND, ESCROW_RELEASE, FEE';
COMMENT ON COLUMN transactions.block_reason IS 'Reason if transaction was blocked (e.g., KYC_NOT_APPROVED)';
-- Migration 013: Payment Providers & Routing
-- Day 7: Payment route selection and orchestration

-- Payment providers (OnRamps)
CREATE TABLE IF NOT EXISTS payment_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Provider identity
    code VARCHAR(50) UNIQUE NOT NULL,           -- e.g., 'ONRAMP_A', 'ONRAMP_B'
    name VARCHAR(100) NOT NULL,                  -- Display name
    description TEXT,
    logo_url VARCHAR(500),

    -- Provider type
    provider_type VARCHAR(30) NOT NULL DEFAULT 'ONRAMP',  -- ONRAMP, OFFRAMP, BOTH

    -- Fee structure
    fee_percentage DECIMAL(5, 3) NOT NULL,       -- e.g., 3.100 for 3.1%
    fee_fixed DECIMAL(10, 2) DEFAULT 0,          -- Fixed fee component
    fee_currency VARCHAR(10) DEFAULT 'GBP',

    -- Performance metrics
    approval_rate VARCHAR(20) DEFAULT 'MEDIUM',  -- HIGH, MEDIUM_HIGH, MEDIUM, LOW
    approval_rate_value DECIMAL(5, 2),           -- Actual percentage if known
    settlement_hours_min INT DEFAULT 24,
    settlement_hours_max INT DEFAULT 48,

    -- Supported currencies
    supported_currencies JSONB DEFAULT '["GBP", "EUR", "USD"]',

    -- Supported countries
    supported_countries JSONB DEFAULT '["GB", "EU"]',

    -- Industry restrictions (which industries this provider WON'T serve)
    restricted_industries JSONB DEFAULT '[]',

    -- Preferred industries (which industries this provider specializes in)
    preferred_industries JSONB DEFAULT '[]',

    -- Volume limits
    min_transaction DECIMAL(18, 2) DEFAULT 10,
    max_transaction DECIMAL(18, 2) DEFAULT 100000,
    daily_limit DECIMAL(18, 2),
    monthly_limit DECIMAL(18, 2),

    -- Status
    is_active BOOLEAN DEFAULT true,
    is_recommended BOOLEAN DEFAULT false,        -- Default recommendation
    priority INT DEFAULT 100,                    -- Lower = higher priority

    -- Integration details (encrypted in production)
    api_endpoint VARCHAR(500),
    webhook_url VARCHAR(500),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Provider routing rules
CREATE TABLE IF NOT EXISTS routing_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Rule identity
    name VARCHAR(100) NOT NULL,
    description TEXT,

    -- Rule conditions (JSONB for flexibility)
    conditions JSONB NOT NULL,
    -- Example: {"industry": "gaming", "country": "GB", "amount_min": 100}

    -- Provider to route to
    provider_id UUID REFERENCES payment_providers(id),

    -- Rule priority (lower = evaluated first)
    priority INT DEFAULT 100,

    -- Boost or penalty to provider score
    score_modifier INT DEFAULT 0,  -- +10 boosts, -10 penalizes

    -- Rule status
    is_active BOOLEAN DEFAULT true,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Merchant provider preferences
CREATE TABLE IF NOT EXISTS merchant_provider_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    provider_id UUID NOT NULL REFERENCES payment_providers(id),

    -- Preference type
    preference_type VARCHAR(20) NOT NULL,  -- 'PREFERRED', 'BLOCKED', 'DEFAULT'

    -- Custom fee override (if negotiated)
    custom_fee_percentage DECIMAL(5, 3),

    -- Notes
    notes TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(merchant_id, provider_id)
);

-- Route selection history (audit trail)
CREATE TABLE IF NOT EXISTS route_selections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Transaction context
    transaction_id UUID REFERENCES transactions(id),
    merchant_id UUID REFERENCES merchants(id),
    user_id UUID REFERENCES users(id),

    -- Request details
    amount DECIMAL(18, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL,

    -- What we recommended
    recommended_provider_id UUID REFERENCES payment_providers(id),
    recommended_reason TEXT,

    -- All options presented
    options_presented JSONB NOT NULL,  -- Array of provider options with scores

    -- What user selected
    selected_provider_id UUID REFERENCES payment_providers(id),
    user_overrode_recommendation BOOLEAN DEFAULT false,

    -- Outcome
    selection_outcome VARCHAR(30),  -- 'ACCEPTED', 'CHANGED', 'CANCELLED'

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_providers_active ON payment_providers(is_active);
CREATE INDEX idx_providers_type ON payment_providers(provider_type);
CREATE INDEX idx_routing_rules_priority ON routing_rules(priority) WHERE is_active = true;
CREATE INDEX idx_merchant_prefs_merchant ON merchant_provider_preferences(merchant_id);
CREATE INDEX idx_route_selections_merchant ON route_selections(merchant_id);
CREATE INDEX idx_route_selections_created ON route_selections(created_at);

-- Seed initial providers
INSERT INTO payment_providers (code, name, description, fee_percentage, approval_rate, approval_rate_value, settlement_hours_min, settlement_hours_max, priority, is_recommended)
VALUES
    ('ONRAMP_A', 'OnRamp A', 'Premium provider with high approval rates', 3.100, 'HIGH', 94.5, 24, 48, 10, true),
    ('ONRAMP_B', 'OnRamp B', 'Cost-effective option with good approval', 2.400, 'MEDIUM_HIGH', 87.0, 48, 72, 20, false),
    ('ONRAMP_C', 'OnRamp C', 'Standard provider', 3.500, 'MEDIUM', 78.5, 48, 72, 30, false),
    ('ONRAMP_D', 'OnRamp D', 'Budget option with lower approval', 2.900, 'LOW', 65.0, 72, 96, 40, false)
ON CONFLICT (code) DO NOTHING;
