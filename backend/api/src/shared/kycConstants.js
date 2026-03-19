/**
 * KYC Constants
 * Central definition of all KYC-related status values
 * Import from here instead of defining locally
 */

// Internal KYC status values (stored in users.kyc_status)
const KYC_STATUS = {
  NOT_STARTED: 'not_started',
  STARTED: 'started',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PENDING_MANUAL_REVIEW: 'pending_manual_review'
};

// User lifecycle state values (stored in users.user_state)
const USER_STATE = {
  REGISTERED: 'REGISTERED',
  KYC_STARTED: 'KYC_STARTED',
  KYC_PENDING: 'KYC_PENDING',
  KYC_APPROVED: 'KYC_APPROVED',
  KYC_REJECTED: 'KYC_REJECTED'
};

// Provider decision values (normalized from webhook)
const DECISION = {
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  PENDING: 'PENDING',
  MANUAL_REVIEW: 'MANUAL_REVIEW'
};

// Internal event types
const INTERNAL_EVENT_TYPE = {
  APPLICANT_CREATED: 'APPLICANT_CREATED',
  APPLICANT_REVIEWED: 'APPLICANT_REVIEWED',
  APPLICANT_PENDING: 'APPLICANT_PENDING',
  APPLICANT_ON_HOLD: 'APPLICANT_ON_HOLD',
  DOCUMENTS_REQUESTED: 'DOCUMENTS_REQUESTED',
  UNKNOWN: 'UNKNOWN'
};

module.exports = {
  KYC_STATUS,
  USER_STATE,
  DECISION,
  INTERNAL_EVENT_TYPE
};
