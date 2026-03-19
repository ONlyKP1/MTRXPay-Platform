/**
 * Transaction Eligibility Service
 * Day 6: Reusable helper to check if user can transact
 *
 * Centralizes all eligibility checks in one place.
 * Extensible for future checks (sanctions, suspension, etc.)
 */

const { query } = require('../config/database');
const { KYC_STATUS, USER_STATE } = require('../shared/kycConstants');

// Eligibility check results
const ELIGIBILITY_STATUS = {
  ELIGIBLE: 'ELIGIBLE',
  NOT_ELIGIBLE: 'NOT_ELIGIBLE'
};

// Reasons why user cannot transact
const INELIGIBILITY_REASON = {
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_NOT_AUTHENTICATED: 'USER_NOT_AUTHENTICATED',
  KYC_NOT_STARTED: 'KYC_NOT_STARTED',
  KYC_IN_PROGRESS: 'KYC_IN_PROGRESS',
  KYC_PENDING_REVIEW: 'KYC_PENDING_REVIEW',
  KYC_REJECTED: 'KYC_REJECTED',
  // Future extensibility
  ACCOUNT_SUSPENDED: 'ACCOUNT_SUSPENDED',
  SANCTIONS_MATCH: 'SANCTIONS_MATCH',
  MERCHANT_NOT_APPROVED: 'MERCHANT_NOT_APPROVED',
  WALLET_NOT_READY: 'WALLET_NOT_READY'
};

/**
 * Check if a user can transact
 * Only returns true if ALL conditions are met:
 * - User exists
 * - KYC status is 'approved'
 * - User state is 'KYC_APPROVED'
 *
 * @param {object|string} userOrId - User object or user ID
 * @returns {object} { canTransact, reason, details }
 */
const canUserTransact = async (userOrId) => {
  let user;

  // Handle both user object and user ID
  if (typeof userOrId === 'string') {
    const result = await query(
      `SELECT id, kyc_status, user_state, kyc_rejection_reason
       FROM users WHERE id = $1`,
      [userOrId]
    );

    if (result.rows.length === 0) {
      return {
        canTransact: false,
        reason: INELIGIBILITY_REASON.USER_NOT_FOUND,
        message: 'User not found'
      };
    }

    user = result.rows[0];
  } else if (userOrId && typeof userOrId === 'object') {
    user = userOrId;
  } else {
    return {
      canTransact: false,
      reason: INELIGIBILITY_REASON.USER_NOT_AUTHENTICATED,
      message: 'User not authenticated'
    };
  }

  // Check KYC status
  const kycStatus = user.kyc_status || user.kycStatus;
  const userState = user.user_state || user.userState;

  // Must be approved
  if (kycStatus !== KYC_STATUS.APPROVED) {
    return mapKycStatusToResult(kycStatus, user.kyc_rejection_reason);
  }

  // Must have KYC_APPROVED state
  if (userState !== USER_STATE.KYC_APPROVED) {
    return {
      canTransact: false,
      reason: INELIGIBILITY_REASON.KYC_PENDING_REVIEW,
      message: 'KYC verification pending'
    };
  }

  // All checks passed
  return {
    canTransact: true,
    reason: null,
    message: null
  };
};

/**
 * Map KYC status to eligibility result
 */
const mapKycStatusToResult = (kycStatus, rejectionReason) => {
  switch (kycStatus) {
    case KYC_STATUS.NOT_STARTED:
      return {
        canTransact: false,
        reason: INELIGIBILITY_REASON.KYC_NOT_STARTED,
        message: 'KYC verification required'
      };

    case KYC_STATUS.STARTED:
      return {
        canTransact: false,
        reason: INELIGIBILITY_REASON.KYC_IN_PROGRESS,
        message: 'KYC verification in progress'
      };

    case KYC_STATUS.PENDING:
    case KYC_STATUS.PENDING_MANUAL_REVIEW:
      return {
        canTransact: false,
        reason: INELIGIBILITY_REASON.KYC_PENDING_REVIEW,
        message: 'KYC verification pending review'
      };

    case KYC_STATUS.REJECTED:
      return {
        canTransact: false,
        reason: INELIGIBILITY_REASON.KYC_REJECTED,
        message: rejectionReason || 'KYC verification rejected'
      };

    default:
      return {
        canTransact: false,
        reason: INELIGIBILITY_REASON.KYC_NOT_STARTED,
        message: 'KYC verification required'
      };
  }
};

/**
 * Quick check - returns boolean only
 * Use this when you just need true/false
 */
const canTransact = async (userOrId) => {
  const result = await canUserTransact(userOrId);
  return result.canTransact;
};

/**
 * Get full user with eligibility status
 * Useful for API responses
 */
const getUserWithEligibility = async (userId) => {
  const result = await query(
    `SELECT id, full_name, email, role, kyc_status, user_state,
            kyc_rejection_reason, kyc_reviewed_at, merchant_id
     FROM users WHERE id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const user = result.rows[0];
  const eligibility = await canUserTransact(user);

  return {
    ...user,
    canTransact: eligibility.canTransact,
    transactionBlockReason: eligibility.reason,
    transactionBlockMessage: eligibility.message
  };
};

module.exports = {
  canUserTransact,
  canTransact,
  getUserWithEligibility,
  ELIGIBILITY_STATUS,
  INELIGIBILITY_REASON
};
