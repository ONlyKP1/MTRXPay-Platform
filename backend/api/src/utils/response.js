/**
 * Standardized API response helpers
 * Consistent patterns for frontend integration
 */

/**
 * Success response
 * @param {object} res - Express response
 * @param {any} data - Response data
 * @param {number} status - HTTP status (default 200)
 */
const success = (res, data, status = 200) => {
  return res.status(status).json({
    success: true,
    data
  });
};

/**
 * Created response (201)
 */
const created = (res, data) => {
  return success(res, data, 201);
};

/**
 * Validation error response (400)
 * @param {object} res - Express response
 * @param {string} message - Error message
 * @param {array} errors - Array of validation errors
 */
const validationError = (res, message, errors = []) => {
  return res.status(400).json({
    success: false,
    error: {
      type: 'VALIDATION_ERROR',
      message,
      errors
    }
  });
};

/**
 * Auth error response (401)
 */
const authError = (res, message = 'Authentication required') => {
  return res.status(401).json({
    success: false,
    error: {
      type: 'AUTH_ERROR',
      message
    }
  });
};

/**
 * Forbidden error response (403)
 */
const forbiddenError = (res, message = 'Access denied') => {
  return res.status(403).json({
    success: false,
    error: {
      type: 'FORBIDDEN_ERROR',
      message
    }
  });
};

/**
 * Not found error response (404)
 */
const notFoundError = (res, message = 'Resource not found') => {
  return res.status(404).json({
    success: false,
    error: {
      type: 'NOT_FOUND_ERROR',
      message
    }
  });
};

/**
 * Server error response (500)
 */
const serverError = (res, message = 'Internal server error') => {
  return res.status(500).json({
    success: false,
    error: {
      type: 'SERVER_ERROR',
      message
    }
  });
};

module.exports = {
  success,
  created,
  validationError,
  authError,
  forbiddenError,
  notFoundError,
  serverError
};
