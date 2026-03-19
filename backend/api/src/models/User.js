/**
 * User Model
 * Day 6: Extended with KYC fields
 */

const ROLES = {
  MERCHANT: 'merchant',
  ADMIN: 'admin'
};

// KYC Status values
const KYC_STATUS = {
  NOT_STARTED: 'not_started',
  STARTED: 'started',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PENDING_MANUAL_REVIEW: 'pending_manual_review'
};

// User State values (lifecycle state)
const USER_STATE = {
  REGISTERED: 'REGISTERED',
  KYC_STARTED: 'KYC_STARTED',
  KYC_PENDING: 'KYC_PENDING',
  KYC_APPROVED: 'KYC_APPROVED',
  KYC_REJECTED: 'KYC_REJECTED'
};

// KYC Provider values
const KYC_PROVIDER = {
  SUMSUB: 'SUMSUB',
  MOCK: 'MOCK'
};

const User = {
  tableName: 'users',

  fields: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    full_name: 'VARCHAR(255) NOT NULL',
    email: 'VARCHAR(255) UNIQUE NOT NULL',
    password_hash: 'VARCHAR(255)',
    role: "VARCHAR(50) NOT NULL DEFAULT 'merchant'",
    merchant_id: 'UUID REFERENCES merchants(id)',
    // KYC fields
    kyc_status: "VARCHAR(50) DEFAULT 'not_started'",
    kyc_reviewed_at: 'TIMESTAMP',
    kyc_provider: 'VARCHAR(50)',
    kyc_provider_applicant_id: 'VARCHAR(255)',
    kyc_rejection_reason: 'TEXT',
    user_state: "VARCHAR(50) DEFAULT 'REGISTERED'",
    // Timestamps
    created_at: 'TIMESTAMP DEFAULT NOW()',
    updated_at: 'TIMESTAMP DEFAULT NOW()'
  },

  ROLES,
  KYC_STATUS,
  USER_STATE,
  KYC_PROVIDER
};

module.exports = User;
