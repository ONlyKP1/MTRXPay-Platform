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
