/**
 * Webhook Logger
 * Day 6: Central logging for all webhook outcomes
 *
 * Logs every important action without exposing secrets.
 */

const { query } = require('../../config/database');

// Webhook-specific log actions
const WEBHOOK_LOG_ACTION = {
  // Webhook lifecycle
  WEBHOOK_RECEIVED: 'WEBHOOK_RECEIVED',
  WEBHOOK_SIGNATURE_VERIFIED: 'WEBHOOK_SIGNATURE_VERIFIED',
  WEBHOOK_SIGNATURE_FAILED: 'WEBHOOK_SIGNATURE_FAILED',

  // User matching
  APPLICANT_MATCHED: 'APPLICANT_MATCHED',
  APPLICANT_NOT_MATCHED: 'APPLICANT_NOT_MATCHED',

  // KYC decisions
  KYC_APPROVED: 'KYC_APPROVED',
  KYC_REJECTED: 'KYC_REJECTED',
  KYC_PENDING: 'KYC_PENDING',

  // Idempotency
  DUPLICATE_WEBHOOK_IGNORED: 'DUPLICATE_WEBHOOK_IGNORED',

  // Errors
  WEBHOOK_PROCESSING_FAILED: 'WEBHOOK_PROCESSING_FAILED'
};

const SOURCE = 'sumsub_webhook';

/**
 * Log a webhook event to system_logs
 * Does NOT log secrets (signatures, tokens, etc.)
 *
 * @param {string} action - Action from WEBHOOK_LOG_ACTION
 * @param {string|null} userId - User ID if known
 * @param {object} metadata - Additional context (no secrets!)
 */
const logWebhookEvent = async (action, userId = null, metadata = {}) => {
  // Sanitize metadata - remove any potential secrets
  const safeMetadata = sanitizeMetadata(metadata);

  try {
    await query(
      `INSERT INTO system_logs (user_id, action, source, metadata, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [userId, action, SOURCE, JSON.stringify(safeMetadata)]
    );

    // Console log in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[${SOURCE}] ${action}`, userId || 'no-user', safeMetadata);
    }
  } catch (error) {
    // Don't let logging failures break the flow
    console.error('[WEBHOOK LOGGER ERROR]', error.message);
  }
};

/**
 * Remove sensitive fields from metadata
 */
const sanitizeMetadata = (metadata) => {
  const sensitiveKeys = [
    'signature', 'secret', 'token', 'password', 'key',
    'x-payload-digest', 'authorization', 'rawBody'
  ];

  const sanitized = { ...metadata };

  for (const key of Object.keys(sanitized)) {
    const lowerKey = key.toLowerCase();
    if (sensitiveKeys.some(s => lowerKey.includes(s))) {
      delete sanitized[key];
    }
  }

  return sanitized;
};

// ============================================================
// Convenience logging functions for each outcome
// ============================================================

const logReceived = (applicantId, eventType) =>
  logWebhookEvent(WEBHOOK_LOG_ACTION.WEBHOOK_RECEIVED, null, {
    applicantId,
    eventType,
    source: SOURCE
  });

const logSignatureVerified = (applicantId) =>
  logWebhookEvent(WEBHOOK_LOG_ACTION.WEBHOOK_SIGNATURE_VERIFIED, null, {
    applicantId,
    source: SOURCE
  });

const logSignatureFailed = (applicantId) =>
  logWebhookEvent(WEBHOOK_LOG_ACTION.WEBHOOK_SIGNATURE_FAILED, null, {
    applicantId,
    source: SOURCE
  });

const logApplicantMatched = (userId, applicantId, lookupMethod) =>
  logWebhookEvent(WEBHOOK_LOG_ACTION.APPLICANT_MATCHED, userId, {
    applicantId,
    lookupMethod,
    source: SOURCE
  });

const logApplicantNotMatched = (applicantId) =>
  logWebhookEvent(WEBHOOK_LOG_ACTION.APPLICANT_NOT_MATCHED, null, {
    applicantId,
    source: SOURCE
  });

const logKycApproved = (userId, applicantId, eventType) =>
  logWebhookEvent(WEBHOOK_LOG_ACTION.KYC_APPROVED, userId, {
    applicantId,
    eventType,
    decision: 'APPROVED',
    source: SOURCE
  });

const logKycRejected = (userId, applicantId, eventType, rejectionReason) =>
  logWebhookEvent(WEBHOOK_LOG_ACTION.KYC_REJECTED, userId, {
    applicantId,
    eventType,
    decision: 'REJECTED',
    rejectionReason,
    source: SOURCE
  });

const logKycPending = (userId, applicantId, eventType) =>
  logWebhookEvent(WEBHOOK_LOG_ACTION.KYC_PENDING, userId, {
    applicantId,
    eventType,
    decision: 'PENDING',
    source: SOURCE
  });

const logDuplicateIgnored = (applicantId, existingEventId) =>
  logWebhookEvent(WEBHOOK_LOG_ACTION.DUPLICATE_WEBHOOK_IGNORED, null, {
    applicantId,
    existingEventId,
    source: SOURCE
  });

const logProcessingFailed = (userId, applicantId, error) =>
  logWebhookEvent(WEBHOOK_LOG_ACTION.WEBHOOK_PROCESSING_FAILED, userId, {
    applicantId,
    error: error.message || error,
    source: SOURCE
  });

module.exports = {
  logWebhookEvent,
  WEBHOOK_LOG_ACTION,

  // Convenience functions
  logReceived,
  logSignatureVerified,
  logSignatureFailed,
  logApplicantMatched,
  logApplicantNotMatched,
  logKycApproved,
  logKycRejected,
  logKycPending,
  logDuplicateIgnored,
  logProcessingFailed
};
