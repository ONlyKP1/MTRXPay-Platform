/**
 * SumSub Webhook Test Fixtures
 * Sample payloads for local development and testing
 */

const crypto = require('crypto');

/**
 * Generate SumSub webhook signature
 * @param {object} payload - Webhook payload
 * @param {string} secretKey - SumSub secret key
 * @returns {string} HMAC-SHA1 signature
 */
const generateSignature = (payload, secretKey) => {
  const hmac = crypto.createHmac('sha1', secretKey);
  hmac.update(JSON.stringify(payload));
  return hmac.digest('hex');
};

/**
 * Base payload structure
 */
const basePayload = (overrides = {}) => ({
  applicantId: 'sumsub-test-123',
  inspectionId: 'inspection-test-123',
  correlationId: `corr-${Date.now()}`,
  externalUserId: null, // Set this to a real user ID when testing
  type: 'applicantReviewed',
  reviewStatus: 'completed',
  createdAt: new Date().toISOString(),
  ...overrides
});

/**
 * APPROVED webhook payload
 * Use this to simulate a successful KYC verification
 */
const approvedPayload = (externalUserId = null) => basePayload({
  externalUserId,
  type: 'applicantReviewed',
  reviewStatus: 'completed',
  reviewResult: {
    reviewAnswer: 'GREEN',
    label: 'APPROVED',
    reviewRejectType: null,
    rejectLabels: [],
    moderationComment: null
  }
});

/**
 * REJECTED webhook payload
 * Use this to simulate a failed KYC verification
 */
const rejectedPayload = (externalUserId = null, rejectLabels = ['DOCUMENT_FRAUD']) => basePayload({
  externalUserId,
  type: 'applicantReviewed',
  reviewStatus: 'completed',
  reviewResult: {
    reviewAnswer: 'RED',
    label: 'REJECTED',
    reviewRejectType: 'FINAL',
    rejectLabels,
    moderationComment: 'Document verification failed'
  }
});

/**
 * PENDING/MANUAL REVIEW webhook payload
 * Use this to simulate KYC pending manual review
 */
const pendingPayload = (externalUserId = null) => basePayload({
  externalUserId,
  type: 'applicantPending',
  reviewStatus: 'pending',
  reviewResult: {
    reviewAnswer: 'YELLOW',
    label: 'PENDING',
    reviewRejectType: null,
    rejectLabels: [],
    moderationComment: 'Requires manual review'
  }
});

/**
 * APPLICANT CREATED webhook payload
 * Use this to simulate initial applicant creation
 */
const applicantCreatedPayload = (externalUserId = null) => basePayload({
  externalUserId,
  type: 'applicantCreated',
  reviewStatus: null,
  reviewResult: null
});

/**
 * DOCUMENTS REQUESTED webhook payload
 */
const documentsRequestedPayload = (externalUserId = null) => basePayload({
  externalUserId,
  type: 'applicantOnHold',
  reviewStatus: 'onHold',
  reviewResult: {
    reviewAnswer: null,
    label: 'ON_HOLD',
    reviewRejectType: null,
    rejectLabels: [],
    moderationComment: 'Additional documents required'
  }
});

/**
 * Common rejection reasons
 */
const REJECTION_REASONS = {
  DOCUMENT_FRAUD: ['DOCUMENT_FRAUD'],
  DOCUMENT_EXPIRED: ['DOCUMENT_EXPIRED'],
  DOCUMENT_POOR_QUALITY: ['DOCUMENT_POOR_QUALITY'],
  FACE_MISMATCH: ['FACE_MISMATCH'],
  SANCTIONS_MATCH: ['SANCTIONS_MATCH'],
  MULTIPLE_REASONS: ['DOCUMENT_FRAUD', 'FACE_MISMATCH']
};

/**
 * Create a signed webhook request
 * Returns the payload and headers needed for a webhook call
 */
const createSignedRequest = (payload, secretKey = process.env.SUMSUB_WEBHOOK_SECRET || 'test-secret') => {
  const signature = generateSignature(payload, secretKey);
  return {
    payload,
    headers: {
      'Content-Type': 'application/json',
      'X-Payload-Digest': signature
    },
    signature
  };
};

module.exports = {
  generateSignature,
  basePayload,
  approvedPayload,
  rejectedPayload,
  pendingPayload,
  applicantCreatedPayload,
  documentsRequestedPayload,
  createSignedRequest,
  REJECTION_REASONS
};
