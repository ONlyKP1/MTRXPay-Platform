const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const { query } = require('../config/database');
const { authError, forbiddenError } = require('../utils/response');

/**
 * Auth middleware - protects routes requiring authentication
 * Reads token, validates it, attaches user to request
 */
const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return authError(res, 'No token provided');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // Get user from database
    const result = await query(
      'SELECT id, full_name, email, role, merchant_id FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return authError(res, 'User not found');
    }

    req.user = result.rows[0];
    next();
  } catch (_error) {
    return authError(res, 'Invalid token');
  }
};

/**
 * Admin middleware - protects admin-only routes
 * Must be used after auth middleware
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return authError(res, 'Authentication required');
  }

  if (req.user.role !== 'admin') {
    return forbiddenError(res, 'Admin access required');
  }

  next();
};

/**
 * Optional auth - attaches user if token present, continues otherwise
 * Useful for routes that behave differently when authenticated
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // No token, continue without user
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const result = await query(
      'SELECT id, full_name, email, role, merchant_id FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length > 0) {
      req.user = result.rows[0];
    }

    next();
  } catch (_error) {
    next(); // Invalid token, continue without user
  }
};

/**
 * Merchant middleware - ensures user is a merchant with merchant_id
 * Must be used after auth middleware
 */
const requireMerchant = (req, res, next) => {
  if (!req.user) {
    return authError(res, 'Authentication required');
  }

  if (req.user.role !== 'merchant' && req.user.role !== 'admin') {
    return forbiddenError(res, 'Merchant access required');
  }

  if (req.user.role === 'merchant' && !req.user.merchant_id) {
    return forbiddenError(res, 'No merchant account linked');
  }

  next();
};

module.exports = auth;
module.exports.auth = auth;
module.exports.requireAdmin = requireAdmin;
module.exports.requireMerchant = requireMerchant;
module.exports.optionalAuth = optionalAuth;
