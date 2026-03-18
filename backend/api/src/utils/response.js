/**
 * Standardized API response helpers
 * Consistent patterns for frontend integration
 *
 * Success format:
 * { success: true, data: {}, message: "..." }
 *
 * Error format:
 * { success: false, message: "...", errors: { field: "message" } }
 */

/**
 * Success response
 * @param {object} res - Express response
 * @param {any} data - Response data
 * @param {string} message - Optional success message
 * @param {number} status - HTTP status (default 200)
 */
const success = (res, data, message = null, status = 200) => {
  const response = {
    success: true,
    data
  };
  if (message) {
    response.message = message;
  }
  return res.status(status).json(response);
};

/**
 * Created response (201)
 * @param {object} res - Express response
 * @param {any} data - Created resource
 * @param {string} message - Optional message
 */
const created = (res, data, message = 'Resource created') => {
  return success(res, data, message, 201);
};

/**
 * Validation error response (400)
 * @param {object} res - Express response
 * @param {string} message - Error message
 * @param {array|object} errors - Validation errors (array or field map)
 */
const validationError = (res, message, errors = {}) => {
  // Convert array of strings to object format if needed
  let errorMap = errors;
  if (Array.isArray(errors)) {
    errorMap = {};
    errors.forEach((err, index) => {
      if (typeof err === 'string') {
        errorMap[`error_${index}`] = err;
      } else if (err.field && err.message) {
        errorMap[err.field] = err.message;
      }
    });
  }

  return res.status(400).json({
    success: false,
    message: message || 'Validation failed',
    errors: errorMap
  });
};

/**
 * Bad request error (400) - for non-validation errors
 * @param {object} res - Express response
 * @param {string} message - Error message
 */
const badRequest = (res, message = 'Bad request') => {
  return res.status(400).json({
    success: false,
    message
  });
};

/**
 * Auth error response (401)
 * @param {object} res - Express response
 * @param {string} message - Error message
 */
const authError = (res, message = 'Authentication required') => {
  return res.status(401).json({
    success: false,
    message
  });
};

/**
 * Forbidden error response (403)
 * @param {object} res - Express response
 * @param {string} message - Error message
 */
const forbiddenError = (res, message = 'Access denied') => {
  return res.status(403).json({
    success: false,
    message
  });
};

/**
 * Not found error response (404)
 * @param {object} res - Express response
 * @param {string} message - Error message
 */
const notFoundError = (res, message = 'Resource not found') => {
  return res.status(404).json({
    success: false,
    message
  });
};

/**
 * Conflict error response (409)
 * @param {object} res - Express response
 * @param {string} message - Error message
 */
const conflictError = (res, message = 'Resource already exists') => {
  return res.status(409).json({
    success: false,
    message
  });
};

/**
 * Server error response (500)
 * @param {object} res - Express response
 * @param {string} message - Error message (sanitized for production)
 */
const serverError = (res, message = 'Internal server error') => {
  // Don't expose internal error details in production
  const safeMessage = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : message;

  return res.status(500).json({
    success: false,
    message: safeMessage
  });
};

/**
 * Paginated response helper
 * @param {object} res - Express response
 * @param {array} items - Array of items
 * @param {object} pagination - Pagination info
 * @param {string} message - Optional message
 */
const paginated = (res, items, pagination, message = null) => {
  const response = {
    success: true,
    data: items,
    pagination: {
      page: pagination.page || 1,
      limit: pagination.limit || 20,
      total: pagination.total || items.length,
      totalPages: Math.ceil((pagination.total || items.length) / (pagination.limit || 20))
    }
  };
  if (message) {
    response.message = message;
  }
  return res.status(200).json(response);
};

module.exports = {
  success,
  created,
  validationError,
  badRequest,
  authError,
  forbiddenError,
  notFoundError,
  conflictError,
  serverError,
  paginated
};
