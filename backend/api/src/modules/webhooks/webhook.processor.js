/**
 * Webhook Processor
 * Day 6: Transactional processing of webhook events
 *
 * Ensures event insert, user update, and logging all happen
 * together in a single transaction to prevent inconsistent state.
 */

const { withTransaction } = require('../../config/database');
const { KYC_STATUS, USER_STATE, DECISION } = require('../../shared/kycConstants');

/**
 * Process webhook in a transaction
 * - Inserts KYC event
 * - Updates user KYC status
 * - Inserts system log
 * All or nothing - if any fails, all are rolled back
 *
 * @param {object} params - Processing parameters
 * @returns {object} { event, userUpdated }
 */
const processWebhookTransaction = async ({
  userId,
  parsed,
  idempotencyKey
}) => {
  return withTransaction(async (client) => {
    // ============================================================
    // STEP 1: Insert KYC event
    // ============================================================
    const eventResult = await client.query(
      `INSERT INTO kyc_events (
        user_id, provider, event_type, review_status,
        review_answer, payload, idempotency_key, received_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *`,
      [
        userId,
        parsed.provider,
        parsed.eventType,
        parsed.reviewStatus,
        parsed.providerDecision,
        JSON.stringify(parsed.rawPayload),
        idempotencyKey
      ]
    );
    const savedEvent = eventResult.rows[0];

    // ============================================================
    // STEP 2: Update user KYC status (if user exists and decision made)
    // ============================================================
    let userUpdated = false;
    let mappedFields = null;

    if (userId && parsed.decision) {
      mappedFields = mapDecisionToFields(parsed.decision, parsed.rejectionReason);

      if (mappedFields) {
        const updateResult = await client.query(
          `UPDATE users
           SET kyc_status = $1,
               user_state = $2,
               kyc_reviewed_at = $3,
               kyc_rejection_reason = $4,
               updated_at = NOW()
           WHERE id = $5
           RETURNING id, kyc_status, user_state`,
          [
            mappedFields.kycStatus,
            mappedFields.userState,
            new Date(),
            mappedFields.kycRejectionReason,
            userId
          ]
        );
        userUpdated = updateResult.rowCount > 0;
      }
    }

    // ============================================================
    // STEP 3: Insert system log
    // ============================================================
    const logAction = getLogAction(parsed.decision);
    if (logAction) {
      await client.query(
        `INSERT INTO system_logs (user_id, action, source, metadata, created_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [
          userId,
          logAction,
          'KYC_SERVICE',
          JSON.stringify({
            eventId: savedEvent.id,
            decision: parsed.decision,
            kycStatus: mappedFields?.kycStatus,
            userState: mappedFields?.userState,
            reviewStatus: parsed.reviewStatus,
            rejectionReason: parsed.rejectionReason
          })
        ]
      );
    }

    // Log in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('[TRANSACTION] Completed:', {
        eventId: savedEvent.id,
        userId,
        userUpdated,
        kycStatus: mappedFields?.kycStatus
      });
    }

    return {
      event: savedEvent,
      userUpdated,
      mappedFields
    };
  });
};

/**
 * Map decision to internal fields
 */
const mapDecisionToFields = (decision, rejectionReason) => {
  switch (decision) {
    case DECISION.APPROVED:
      return {
        kycStatus: KYC_STATUS.APPROVED,
        userState: USER_STATE.KYC_APPROVED,
        kycRejectionReason: null
      };

    case DECISION.REJECTED:
      return {
        kycStatus: KYC_STATUS.REJECTED,
        userState: USER_STATE.KYC_REJECTED,
        kycRejectionReason: rejectionReason
      };

    case DECISION.MANUAL_REVIEW:
    case DECISION.PENDING:
      return {
        kycStatus: KYC_STATUS.PENDING_MANUAL_REVIEW,
        userState: USER_STATE.KYC_PENDING,
        kycRejectionReason: null
      };

    default:
      return null;
  }
};

/**
 * Get log action based on decision
 */
const getLogAction = (decision) => {
  switch (decision) {
    case DECISION.APPROVED:
      return 'KYC_APPROVED';
    case DECISION.REJECTED:
      return 'KYC_REJECTED';
    case DECISION.MANUAL_REVIEW:
    case DECISION.PENDING:
      return 'KYC_PENDING';
    default:
      return null;
  }
};

module.exports = {
  processWebhookTransaction
};
