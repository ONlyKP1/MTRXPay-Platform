/**
 * Shared constants and enums
 * Keep these in one place so frontend and backend stay aligned
 */

// User roles
const USER_ROLES = {
  ADMIN: 'admin',
  MERCHANT: 'merchant'
};

// Merchant status
const MERCHANT_STATUS = {
  DRAFT: 'draft',
  PENDING_SUBMISSION: 'pending_submission',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended'
};

// Document status
const DOCUMENT_STATUS = {
  UPLOADED: 'uploaded',
  PENDING_REVIEW: 'pending_review',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

// Onboarding step status
const STEP_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
};

// Risk level
const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

// Document types (for KYC)
const DOCUMENT_TYPES = {
  ID_PROOF: 'id_proof',
  ADDRESS_PROOF: 'address_proof',
  BUSINESS_REGISTRATION: 'business_registration',
  BANK_STATEMENT: 'bank_statement'
};

// Address types
const ADDRESS_TYPES = {
  REGISTERED: 'registered',
  TRADING: 'trading',
  BILLING: 'billing'
};

// KYC submission types
const SUBMISSION_TYPES = {
  KYC: 'kyc',
  KYB: 'kyb',
  COMBINED: 'combined'
};

// KYC submission status (same as merchant for review flow)
const KYC_STATUS = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

// Onboarding steps
const ONBOARDING_STEPS = {
  BUSINESS_DETAILS: 'business_details',
  ADDRESS: 'address',
  OWNERS: 'owners',
  DOCUMENTS: 'documents',
  REVIEW: 'review'
};

// Legacy - keeping for backwards compatibility
const ONBOARDING_STATUS = {
  NOT_STARTED: 'not_started',
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

module.exports = {
  USER_ROLES,
  MERCHANT_STATUS,
  DOCUMENT_STATUS,
  STEP_STATUS,
  RISK_LEVELS,
  DOCUMENT_TYPES,
  ADDRESS_TYPES,
  SUBMISSION_TYPES,
  KYC_STATUS,
  ONBOARDING_STEPS,
  ONBOARDING_STATUS
};
