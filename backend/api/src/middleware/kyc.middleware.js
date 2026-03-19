/**
 * KYC Middleware
 * Day 6: Route protection based on KYC status
 *
 * Use these middleware to protect business routes:
 * - requireKycApproved: For transaction/payment routes
 * - requireKycStarted: For less strict routes
 * - blockIfRejected: Block rejected users
 */

const { query } = require('../config/database');
const { canUserTransact, INELIGIBILITY_REASON } = require('../services/transactionEligibility');
const systemLogService = require('../services/systemLogService');
const { LOG_ACTION, LOG_SOURCE } = require('../models/SystemLog');

/**
 * Standard error response for KYC-related blocks
 */
const kycError = (res, statusCode, reason, message) => {
  return res.status(statusCode).json({
    success: false,
    error: {
      code: reason,
      message: message
    },
    canTransact: false
  });
};

/**
 * Require KYC approved status to access route
 * Use for: create transaction, wallet creation, payment initiation, escrow funding
 *
 * Must be used AFTER auth middleware
 */
const requireKycApproved = async (req, res, next) => {
  try {
    // Must have authenticated user
    if (!req.user) {
      return kycError(res, 401, 'NOT_AUTHENTICATED', 'Authentication required');
    }

    // Fetch current user KYC status from database
    const result = await query(
      'SELECT kyc_status, user_state, kyc_rejection_reason FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return kycError(res, 401, 'USER_NOT_FOUND', 'User not found');
    }

    const user = result.rows[0];

    // Check if KYC is approved
    if (user.kyc_status !== 'approved' || user.user_state !== 'KYC_APPROVED') {
      const { reason, message } = getKycBlockMessage(user.kyc_status, user.kyc_rejection_reason);

      // Log transaction blocked due to KYC not approved
      await systemLogService.log({
        action: LOG_ACTION.TRANSACTION_BLOCKED_KYC_NOT_APPROVED,
        source: LOG_SOURCE.TRANSACTION_SERVICE,
        userId: req.user.id,
        metadata: {
          kycStatus: user.kyc_status,
          userState: user.user_state,
          blockReason: reason,
          route: req.originalUrl,
          method: req.method
        }
      });

      return kycError(res, 403, reason, message);
    }

    // KYC approved - allow access
    req.kycApproved = true;
    next();
  } catch (error) {
    console.error('[KYC MIDDLEWARE ERROR]', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to verify KYC status'
      }
    });
  }
};

/**
 * Require KYC to be started (in progress or completed)
 * Use for: profile routes, onboarding save draft
 * Less strict than requireKycApproved
 */
const requireKycStarted = async (req, res, next) => {
  try {
    if (!req.user) {
      return kycError(res, 401, 'NOT_AUTHENTICATED', 'Authentication required');
    }

    const result = await query(
      'SELECT kyc_status FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return kycError(res, 401, 'USER_NOT_FOUND', 'User not found');
    }

    const user = result.rows[0];

    if (user.kyc_status === 'not_started') {
      return kycError(
        res,
        403,
        INELIGIBILITY_REASON.KYC_NOT_STARTED,
        'Please start KYC verification to access this resource'
      );
    }

    next();
  } catch (error) {
    console.error('[KYC MIDDLEWARE ERROR]', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to verify KYC status'
      }
    });
  }
};

/**
 * Block access if KYC is rejected
 * Use to prevent rejected users from certain actions
 */
const blockIfRejected = async (req, res, next) => {
  try {
    if (!req.user) {
      return kycError(res, 401, 'NOT_AUTHENTICATED', 'Authentication required');
    }

    const result = await query(
      'SELECT kyc_status, kyc_rejection_reason FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return kycError(res, 401, 'USER_NOT_FOUND', 'User not found');
    }

    const user = result.rows[0];

    if (user.kyc_status === 'rejected') {
      return kycError(
        res,
        403,
        INELIGIBILITY_REASON.KYC_REJECTED,
        user.kyc_rejection_reason || 'KYC verification was rejected. Please contact support.'
      );
    }

    next();
  } catch (error) {
    console.error('[KYC MIDDLEWARE ERROR]', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to verify KYC status'
      }
    });
  }
};

/**
 * Get appropriate block message based on KYC status
 */
const getKycBlockMessage = (kycStatus, rejectionReason) => {
  switch (kycStatus) {
    case 'not_started':
      return {
        reason: INELIGIBILITY_REASON.KYC_NOT_STARTED,
        message: 'KYC verification required to access this resource'
      };

    case 'started':
      return {
        reason: INELIGIBILITY_REASON.KYC_IN_PROGRESS,
        message: 'KYC verification in progress. Please complete verification to continue.'
      };

    case 'pending':
    case 'pending_manual_review':
      return {
        reason: INELIGIBILITY_REASON.KYC_PENDING_REVIEW,
        message: 'KYC verification pending review. Please wait for approval.'
      };

    case 'rejected':
      return {
        reason: INELIGIBILITY_REASON.KYC_REJECTED,
        message: rejectionReason || 'KYC verification was rejected. Please contact support.'
      };

    default:
      return {
        reason: INELIGIBILITY_REASON.KYC_NOT_STARTED,
        message: 'KYC verification required'
      };
  }
};

// Legacy alias for backward compatibility
const requireKyc = requireKycApproved;

module.exports = {
  requireKycApproved,
  requireKycStarted,
  blockIfRejected,
  requireKyc // Legacy alias
};
