/**
 * KYC State Service
 * Day 6: Maps provider decisions to internal KYC states
 *
 * This service handles the business logic of translating
 * provider results into our internal status system.
 */

const { query } = require('../../config/database');
const systemLogService = require('../../services/systemLogService');
const { LOG_ACTION, LOG_SOURCE } = systemLogService;
const { KYC_STATUS, USER_STATE, DECISION } = require('../../shared/kycConstants');

/**
 * Map provider decision to internal KYC fields
 * @param {string} decision - Internal decision (APPROVED, REJECTED, etc.)
 * @param {string} rejectionReason - Rejection reason if applicable
 * @returns {object} Mapped fields
 */
const mapDecisionToFields = (decision, rejectionReason = null) => {
  switch (decision) {
    case DECISION.APPROVED:
      return {
        kycStatus: KYC_STATUS.APPROVED,
        userState: USER_STATE.KYC_APPROVED,
        kycReviewedAt: new Date(),
        kycRejectionReason: null
      };

    case DECISION.REJECTED:
      return {
        kycStatus: KYC_STATUS.REJECTED,
        userState: USER_STATE.KYC_REJECTED,
        kycReviewedAt: new Date(),
        kycRejectionReason: rejectionReason
      };

    case DECISION.MANUAL_REVIEW:
    case DECISION.PENDING:
      return {
        kycStatus: KYC_STATUS.PENDING_MANUAL_REVIEW,
        userState: USER_STATE.KYC_PENDING,
        kycReviewedAt: new Date(),
        kycRejectionReason: null
      };

    default:
      return null;
  }
};

/**
 * Update user KYC status based on parsed webhook data
 * @param {string} userId - User ID to update
 * @param {object} parsed - Parsed webhook payload
 * @returns {object} Updated user fields
 */
const updateUserKycStatus = async (userId, parsed) => {
  const { decision, rejectionReason, reviewStatus } = parsed;

  // Map decision to internal fields
  const mappedFields = mapDecisionToFields(decision, rejectionReason);

  if (!mappedFields) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[KYC STATE] Unknown decision, no update:', decision);
    }
    return null;
  }

  // Update user in database
  const result = await query(
    `UPDATE users
     SET kyc_status = $1,
         user_state = $2,
         kyc_reviewed_at = $3,
         kyc_rejection_reason = $4,
         updated_at = NOW()
     WHERE id = $5
     RETURNING id, kyc_status, user_state, kyc_reviewed_at, kyc_rejection_reason`,
    [
      mappedFields.kycStatus,
      mappedFields.userState,
      mappedFields.kycReviewedAt,
      mappedFields.kycRejectionReason,
      userId
    ]
  );

  if (result.rows.length === 0) {
    throw new Error(`User not found: ${userId}`);
  }

  const updatedUser = result.rows[0];

  // Log the state change
  await logStateChange(userId, decision, mappedFields, reviewStatus);

  if (process.env.NODE_ENV !== 'production') {
    console.log('[KYC STATE] User updated:', {
      userId,
      kycStatus: mappedFields.kycStatus,
      userState: mappedFields.userState
    });
  }

  return mappedFields;
};

/**
 * Log KYC state change to system logs
 */
const logStateChange = async (userId, decision, fields, reviewStatus) => {
  let action;

  switch (decision) {
    case DECISION.APPROVED:
      action = LOG_ACTION.KYC_APPROVED;
      break;
    case DECISION.REJECTED:
      action = LOG_ACTION.KYC_REJECTED;
      break;
    case DECISION.MANUAL_REVIEW:
    case DECISION.PENDING:
      action = LOG_ACTION.KYC_PENDING;
      break;
    default:
      return;
  }

  await systemLogService.log({
    action,
    source: LOG_SOURCE.KYC_SERVICE,
    userId,
    metadata: {
      decision,
      kycStatus: fields.kycStatus,
      userState: fields.userState,
      reviewStatus,
      rejectionReason: fields.kycRejectionReason
    }
  });
};

/**
 * Get current KYC status for a user
 */
const getUserKycStatus = async (userId) => {
  const result = await query(
    `SELECT kyc_status, user_state, kyc_reviewed_at, kyc_rejection_reason, kyc_provider, kyc_provider_applicant_id
     FROM users WHERE id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
};

module.exports = {
  updateUserKycStatus,
  mapDecisionToFields,
  getUserKycStatus,
  KYC_STATUS,
  USER_STATE
};
