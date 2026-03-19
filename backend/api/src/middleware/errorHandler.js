/**
 * Global error handling middleware
 * Catches all errors and returns safe responses
 */

const { NODE_ENV } = require('../config/env');
const { serverError, ERROR_CODES } = require('../utils/response');

/**
 * Log error with readable format
 */
const logError = (err, req) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const userId = req.user?.id || 'anonymous';

  console.error('─'.repeat(50));
  console.error(`[${timestamp}] ERROR`);
  console.error(`${method} ${url}`);
  console.error(`User: ${userId}`);
  console.error(`Message: ${err.message}`);

  // Only log stack trace in development
  if (NODE_ENV === 'development') {
    console.error(`Stack: ${err.stack}`);
  }
  console.error('─'.repeat(50));
};

/**
 * Global error handler middleware
 * Must be registered last in Express app
 */
const errorHandler = (err, req, res, next) => {
  // Log the error (readable logs)
  logError(err, req);

  // Already sent response
  if (res.headersSent) {
    return next(err);
  }

  // Safe error message - no stack traces in production
  // The serverError helper handles sanitization
  const message = NODE_ENV === 'production'
    ? 'An unexpected error occurred'
    : err.message;

  return serverError(res, message, err);
};

/**
 * 404 handler for undefined routes
 */
const notFoundHandler = (req, res) => {
  return res.status(404).json({
    success: false,
    error: {
      code: ERROR_CODES.NOT_FOUND,
      message: `Route ${req.method} ${req.path} not found`
    }
  });
};

/**
 * Async route wrapper - catches async errors
 * Usage: router.get('/route', asyncHandler(async (req, res) => {...}))
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
  logError
};
