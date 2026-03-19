/**
 * Webhook Idempotency
 * Day 6: Prevent duplicate processing of webhook events
 *
 * Strategy:
 * 1. Generate unique key from payload
 * 2. Check if event with this key exists
 * 3. If exists, return early without processing
 * 4. Store key with new event
 */

const crypto = require('crypto');
const { query } = require('../../config/database');

/**
 * Generate idempotency key from webhook payload
 * Uses provider + applicantId + eventType + reviewAnswer to create unique fingerprint
 *
 * @param {object} parsed - Parsed webhook payload
 * @returns {string} Idempotency key
 */
const generateIdempotencyKey = (parsed) => {
  const {
    provider,
    providerApplicantId,
    eventType,
    providerDecision,
    reviewStatus
  } = parsed;

  // Create a unique string from key fields
  const keyParts = [
    provider || 'UNKNOWN',
    providerApplicantId || 'NO_APPLICANT',
    eventType || 'UNKNOWN_EVENT',
    providerDecision || 'NO_DECISION',
    reviewStatus || 'NO_STATUS'
  ];

  const keyString = keyParts.join(':');

  // Hash for consistent length and to avoid special characters
  const hash = crypto
    .createHash('sha256')
    .update(keyString)
    .digest('hex')
    .substring(0, 32);

  // Return readable prefix + hash for debugging
  return `${provider}:${providerApplicantId || 'none'}:${hash}`;
};

/**
 * Check if event with this idempotency key already exists
 *
 * @param {string} idempotencyKey - The key to check
 * @returns {object|null} Existing event or null
 */
const checkExistingEvent = async (idempotencyKey) => {
  const result = await query(
    `SELECT id, user_id, event_type, review_answer, received_at
     FROM kyc_events
     WHERE idempotency_key = $1`,
    [idempotencyKey]
  );

  if (result.rows.length > 0) {
    return result.rows[0];
  }

  return null;
};

/**
 * Full idempotency check - generates key and checks for existing event
 *
 * @param {object} parsed - Parsed webhook payload
 * @returns {object} { isDuplicate, existingEvent, idempotencyKey }
 */
const checkIdempotency = async (parsed) => {
  const idempotencyKey = generateIdempotencyKey(parsed);
  const existingEvent = await checkExistingEvent(idempotencyKey);

  if (existingEvent) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[IDEMPOTENCY] Duplicate detected:', {
        idempotencyKey,
        existingEventId: existingEvent.id,
        receivedAt: existingEvent.received_at
      });
    }

    return {
      isDuplicate: true,
      existingEvent,
      idempotencyKey
    };
  }

  return {
    isDuplicate: false,
    existingEvent: null,
    idempotencyKey
  };
};

module.exports = {
  generateIdempotencyKey,
  checkExistingEvent,
  checkIdempotency
};
