/**
 * KYC Event Storage
 * Day 6: Save webhook events BEFORE updating user
 *
 * IMPORTANT: Events must be stored first so nothing is lost
 * if the user update logic crashes halfway through.
 */

const { query } = require('../../config/database');

/**
 * Save KYC event to database
 * This MUST be called before any user updates
 *
 * @param {object} params - Event parameters
 * @param {string|null} params.userId - User ID if known
 * @param {string} params.provider - KYC provider (SUMSUB, etc.)
 * @param {string} params.eventType - Internal event type
 * @param {string} params.reviewStatus - Review status
 * @param {string} params.providerDecision - Provider's decision (GREEN/RED/YELLOW)
 * @param {object} params.rawPayload - Full raw payload for audit
 * @param {string} params.idempotencyKey - Unique key to prevent duplicates
 * @returns {object} Saved event record
 */
const saveKycEvent = async ({
  userId,
  provider,
  eventType,
  reviewStatus,
  providerDecision,
  rawPayload,
  idempotencyKey
}) => {
  const result = await query(
    `INSERT INTO kyc_events (
      user_id,
      provider,
      event_type,
      review_status,
      review_answer,
      payload,
      idempotency_key,
      received_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
    RETURNING *`,
    [
      userId,
      provider,
      eventType,
      reviewStatus,
      providerDecision,
      JSON.stringify(rawPayload),
      idempotencyKey
    ]
  );

  const savedEvent = result.rows[0];

  if (process.env.NODE_ENV !== 'production') {
    console.log('[WEBHOOK] Event saved:', {
      id: savedEvent.id,
      userId: savedEvent.user_id,
      eventType: savedEvent.event_type,
      reviewAnswer: savedEvent.review_answer
    });
  }

  return savedEvent;
};

/**
 * Get recent events for a user
 */
const getRecentEventsForUser = async (userId, limit = 10) => {
  const result = await query(
    `SELECT * FROM kyc_events
     WHERE user_id = $1
     ORDER BY received_at DESC
     LIMIT $2`,
    [userId, limit]
  );
  return result.rows;
};

/**
 * Get event by ID
 */
const getEventById = async (eventId) => {
  const result = await query(
    'SELECT * FROM kyc_events WHERE id = $1',
    [eventId]
  );
  return result.rows[0] || null;
};

module.exports = {
  saveKycEvent,
  getRecentEventsForUser,
  getEventById
};
