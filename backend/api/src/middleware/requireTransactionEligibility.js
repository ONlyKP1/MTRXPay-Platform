/**
 * Transaction Eligibility Middleware
 * Day 6: Protect routes that require transaction eligibility
 *
 * Use this middleware on any route where user must be able to transact.
 * Requires auth middleware to run first.
 */

const { canUserTransact, INELIGIBILITY_REASON } = require('../services/transactionEligibility');

/**
 * Middleware to require transaction eligibility
 * Blocks request if user cannot transact
 */
const requireTransactionEligibility = async (req, res, next) => {
  try {
    // Must have authenticated user
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'NOT_AUTHENTICATED',
          message: 'Authentication required'
        }
      });
    }

    // Check eligibility
    const eligibility = await canUserTransact(req.user.id);

    if (!eligibility.canTransact) {
      // Map reason to appropriate HTTP status
      const statusCode = getStatusCodeForReason(eligibility.reason);

      return res.status(statusCode).json({
        success: false,
        error: {
          code: eligibility.reason,
          message: eligibility.message
        },
        canTransact: false
      });
    }

    // User can transact - continue
    req.canTransact = true;
    next();
  } catch (error) {
    console.error('[ELIGIBILITY MIDDLEWARE ERROR]', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to verify transaction eligibility'
      }
    });
  }
};

/**
 * Get HTTP status code based on ineligibility reason
 */
const getStatusCodeForReason = (reason) => {
  switch (reason) {
    case INELIGIBILITY_REASON.USER_NOT_FOUND:
    case INELIGIBILITY_REASON.USER_NOT_AUTHENTICATED:
      return 401;

    case INELIGIBILITY_REASON.KYC_NOT_STARTED:
    case INELIGIBILITY_REASON.KYC_IN_PROGRESS:
    case INELIGIBILITY_REASON.KYC_PENDING_REVIEW:
    case INELIGIBILITY_REASON.KYC_REJECTED:
    case INELIGIBILITY_REASON.ACCOUNT_SUSPENDED:
    case INELIGIBILITY_REASON.SANCTIONS_MATCH:
    case INELIGIBILITY_REASON.MERCHANT_NOT_APPROVED:
    case INELIGIBILITY_REASON.WALLET_NOT_READY:
      return 403;

    default:
      return 403;
  }
};

/**
 * Optional middleware - adds eligibility info but doesn't block
 * Useful for endpoints that want to show eligibility status
 */
const checkTransactionEligibility = async (req, res, next) => {
  try {
    if (req.user) {
      const eligibility = await canUserTransact(req.user.id);
      req.canTransact = eligibility.canTransact;
      req.eligibilityReason = eligibility.reason;
      req.eligibilityMessage = eligibility.message;
    } else {
      req.canTransact = false;
      req.eligibilityReason = INELIGIBILITY_REASON.USER_NOT_AUTHENTICATED;
    }
    next();
  } catch (error) {
    // Don't block on error, just set defaults
    req.canTransact = false;
    next();
  }
};

module.exports = {
  requireTransactionEligibility,
  checkTransactionEligibility
};
