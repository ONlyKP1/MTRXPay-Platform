/**
 * Standardized API response helpers
 * Consistent patterns for frontend integration
 *
 * Success format:
 * { success: true, data: {}, message: "..." }
 *
 * Error format (standard):
 * { success: false, error: { code: "ERROR_CODE", message: "Human readable message" } }
 *
 * Error codes follow pattern: DOMAIN_SPECIFIC_ERROR
 * Examples: KYC_NOT_APPROVED, AUTH_INVALID_CREDENTIALS, USER_NOT_FOUND
 */

// Common error codes
const ERROR_CODES = {
  // Auth errors
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_TOKEN_INVALID: 'AUTH_TOKEN_INVALID',

  // User errors
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',

  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',

  // Resource errors
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',

  // Permission errors
  FORBIDDEN: 'FORBIDDEN',
  ACCESS_DENIED: 'ACCESS_DENIED',

  // Server errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',

  // KYC errors (re-exported from transactionEligibility for convenience)
  KYC_NOT_STARTED: 'KYC_NOT_STARTED',
  KYC_IN_PROGRESS: 'KYC_IN_PROGRESS',
  KYC_PENDING_REVIEW: 'KYC_PENDING_REVIEW',
  KYC_REJECTED: 'KYC_REJECTED',
  KYC_NOT_APPROVED: 'KYC_NOT_APPROVED'
};

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
 * @param {string} code - Error code (default: VALIDATION_ERROR)
 */
const validationError = (res, message, errors = {}, code = ERROR_CODES.VALIDATION_ERROR) => {
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
    error: {
      code,
      message: message || 'Validation failed',
      fields: Object.keys(errorMap).length > 0 ? errorMap : undefined
    }
  });
};

/**
 * Bad request error (400) - for non-validation errors
 * @param {object} res - Express response
 * @param {string} message - Error message
 * @param {string} code - Error code (default: BAD_REQUEST)
 */
const badRequest = (res, message = 'Bad request', code = ERROR_CODES.BAD_REQUEST) => {
  return res.status(400).json({
    success: false,
    error: {
      code,
      message
    }
  });
};

/**
 * Auth error response (401)
 * @param {object} res - Express response
 * @param {string} message - Error message
 * @param {string} code - Error code (default: AUTH_REQUIRED)
 */
const authError = (res, message = 'Authentication required', code = ERROR_CODES.AUTH_REQUIRED) => {
  return res.status(401).json({
    success: false,
    error: {
      code,
      message
    }
  });
};

/**
 * Forbidden error response (403)
 * @param {object} res - Express response
 * @param {string} message - Error message
 * @param {string} code - Error code (default: FORBIDDEN)
 */
const forbiddenError = (res, message = 'Access denied', code = ERROR_CODES.FORBIDDEN) => {
  return res.status(403).json({
    success: false,
    error: {
      code,
      message
    }
  });
};

/**
 * Not found error response (404)
 * @param {object} res - Express response
 * @param {string} message - Error message
 * @param {string} code - Error code (default: NOT_FOUND)
 */
const notFoundError = (res, message = 'Resource not found', code = ERROR_CODES.NOT_FOUND) => {
  return res.status(404).json({
    success: false,
    error: {
      code,
      message
    }
  });
};

/**
 * Conflict error response (409)
 * @param {object} res - Express response
 * @param {string} message - Error message
 * @param {string} code - Error code (default: CONFLICT)
 */
const conflictError = (res, message = 'Resource already exists', code = ERROR_CODES.CONFLICT) => {
  return res.status(409).json({
    success: false,
    error: {
      code,
      message
    }
  });
};

/**
 * Server error response (500)
 * @param {object} res - Express response
 * @param {string} message - Error message (sanitized for production)
 * @param {Error} error - Optional error object (for logging, never sent to client)
 */
const serverError = (res, message = 'Internal server error', error = null) => {
  // Log the actual error for debugging (server-side only)
  if (error) {
    console.error('[SERVER ERROR]', error);
  }

  // NEVER expose internal error details in production
  // Always return generic message to prevent information leakage
  const safeMessage = process.env.NODE_ENV === 'production'
    ? 'An unexpected error occurred'
    : message;

  return res.status(500).json({
    success: false,
    error: {
      code: ERROR_CODES.INTERNAL_ERROR,
      message: safeMessage
    }
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
  // Success helpers
  success,
  created,
  paginated,
  // Error helpers
  validationError,
  badRequest,
  authError,
  forbiddenError,
  notFoundError,
  conflictError,
  serverError,
  // Error codes
  ERROR_CODES
};
