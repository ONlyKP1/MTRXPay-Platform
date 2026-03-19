/**
 * KYC Event Model
 * Day 6: Stores all KYC events from providers for audit trail
 */

// Event types from KYC providers
const KYC_EVENT_TYPE = {
  APPLICANT_CREATED: 'applicantCreated',
  APPLICANT_REVIEWED: 'applicantReviewed',
  APPLICANT_PENDING: 'applicantPending',
  APPLICANT_ON_HOLD: 'applicantOnHold',
  APPLICANT_RESET: 'applicantReset',
  APPLICANT_DELETED: 'applicantDeleted',
  DOCUMENT_UPLOADED: 'documentUploaded',
  VERIFICATION_STARTED: 'verificationStarted',
  VERIFICATION_COMPLETED: 'verificationCompleted'
};

// Review status values
const REVIEW_STATUS = {
  INIT: 'init',
  PENDING: 'pending',
  COMPLETED: 'completed',
  ON_HOLD: 'onHold'
};

// Review answer values
const REVIEW_ANSWER = {
  GREEN: 'GREEN',   // Approved
  RED: 'RED',       // Rejected
  YELLOW: 'YELLOW'  // Needs attention
};

const KycEvent = {
  tableName: 'kyc_events',

  fields: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    user_id: 'UUID REFERENCES users(id) ON DELETE CASCADE',
    provider: 'VARCHAR(50) NOT NULL',
    event_type: 'VARCHAR(100) NOT NULL',
    review_status: 'VARCHAR(50)',
    review_answer: 'VARCHAR(50)',
    payload: 'JSONB',
    received_at: 'TIMESTAMP DEFAULT NOW()'
  },

  KYC_EVENT_TYPE,
  REVIEW_STATUS,
  REVIEW_ANSWER
};

module.exports = KycEvent;
