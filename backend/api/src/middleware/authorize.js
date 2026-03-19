/**
 * Authorization middleware
 * Ownership and permission checks for protected resources
 */

const { forbiddenError, notFoundError, serverError } = require('../utils/response');
const merchantService = require('../services/merchantService');
const { USER_ROLES } = require('../shared/constants');

/**
 * Verify user owns the merchant specified in params
 * Attaches merchant to req.merchant if valid
 */
const requireMerchantOwner = async (req, res, next) => {
  try {
    const { merchantId } = req.params;

    if (!merchantId) {
      return forbiddenError(res, 'Merchant ID required');
    }

    // Get the user's merchant
    const userMerchant = await merchantService.getMerchantForUser(req.user.id);

    if (!userMerchant) {
      return notFoundError(res, 'No merchant profile found for user');
    }

    if (userMerchant.id !== merchantId) {
      return forbiddenError(res, 'Not authorized to access this merchant');
    }

    // Attach merchant to request for downstream use
    req.merchant = userMerchant;
    next();
  } catch (error) {
    return serverError(res, error.message);
  }
};

/**
 * Require user to have admin role
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return forbiddenError(res, 'Authentication required');
  }

  if (req.user.role !== USER_ROLES.ADMIN) {
    return forbiddenError(res, 'Admin access required');
  }

  next();
};

/**
 * Require user to have merchant role
 */
const requireMerchantRole = (req, res, next) => {
  if (!req.user) {
    return forbiddenError(res, 'Authentication required');
  }

  if (req.user.role !== USER_ROLES.MERCHANT && req.user.role !== USER_ROLES.ADMIN) {
    return forbiddenError(res, 'Merchant access required');
  }

  next();
};

/**
 * Allow access if user is admin OR owns the merchant
 * Useful for routes where admins can view any merchant
 */
const requireAdminOrMerchantOwner = async (req, res, next) => {
  try {
    // Admins can access any merchant
    if (req.user.role === USER_ROLES.ADMIN) {
      const { merchantId } = req.params;
      if (merchantId) {
        const merchant = await merchantService.getMerchantById(merchantId);
        if (!merchant) {
          return notFoundError(res, 'Merchant not found');
        }
        req.merchant = merchant;
      }
      return next();
    }

    // For non-admins, verify ownership
    return requireMerchantOwner(req, res, next);
  } catch (error) {
    return serverError(res, error.message);
  }
};

/**
 * Verify user has access to the specified beneficial owner
 * Owner must belong to user's merchant
 */
const requireOwnerAccess = async (req, res, next) => {
  try {
    const { merchantId, ownerId } = req.params;

    // First verify merchant ownership
    const userMerchant = await merchantService.getMerchantForUser(req.user.id);

    if (!userMerchant || userMerchant.id !== merchantId) {
      return forbiddenError(res, 'Not authorized to access this merchant');
    }

    req.merchant = userMerchant;
    req.ownerId = ownerId;
    next();
  } catch (error) {
    return serverError(res, error.message);
  }
};

module.exports = {
  requireMerchantOwner,
  requireAdmin,
  requireMerchantRole,
  requireAdminOrMerchantOwner,
  requireOwnerAccess
};
