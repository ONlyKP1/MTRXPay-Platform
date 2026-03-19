/**
 * Request validation utilities
 * Do not trust incoming payloads
 * Returns field-based errors: { field: "message" }
 */

const { validationError } = require('../utils/response');

// Email regex pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate value is a non-empty string
 */
const isNonEmptyString = (value) => {
  return typeof value === 'string' && value.trim().length > 0;
};

/**
 * Validate email format
 */
const isValidEmail = (email) => {
  return isNonEmptyString(email) && EMAIL_REGEX.test(email.trim());
};

/**
 * Validate password meets requirements
 */
const isValidPassword = (password) => {
  return typeof password === 'string' && password.length >= 6;
};

/**
 * Sanitize string input (trim whitespace)
 */
const sanitizeString = (value) => {
  if (typeof value !== 'string') return '';
  return value.trim();
};

/**
 * Validate register body
 */
const validateRegister = (req, res, next) => {
  const { full_name, email, password } = req.body;
  const errors = {};

  // Check required fields
  if (!isNonEmptyString(full_name)) {
    errors.fullName = 'Required';
  }

  if (!email) {
    errors.email = 'Required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Invalid email format';
  }

  if (!password) {
    errors.password = 'Required';
  } else if (!isValidPassword(password)) {
    errors.password = 'Must be at least 6 characters';
  }

  if (Object.keys(errors).length > 0) {
    return validationError(res, 'Validation failed', errors);
  }

  // Sanitize inputs
  req.body.full_name = sanitizeString(full_name);
  req.body.email = sanitizeString(email).toLowerCase();

  next();
};

/**
 * Validate login body
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = {};

  if (!email) {
    errors.email = 'Required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Invalid email format';
  }

  if (!password) {
    errors.password = 'Required';
  }

  if (Object.keys(errors).length > 0) {
    return validationError(res, 'Validation failed', errors);
  }

  // Sanitize
  req.body.email = sanitizeString(email).toLowerCase();

  next();
};

/**
 * Validate onboarding body
 */
const validateOnboarding = (req, res, next) => {
  const { business_name, trading_name } = req.body;
  const errors = {};

  if (!isNonEmptyString(business_name)) {
    errors.businessName = 'Required';
  } else if (business_name.length > 255) {
    errors.businessName = 'Must be 255 characters or less';
  }

  if (trading_name && typeof trading_name !== 'string') {
    errors.tradingName = 'Must be a string';
  } else if (trading_name && trading_name.length > 255) {
    errors.tradingName = 'Must be 255 characters or less';
  }

  if (Object.keys(errors).length > 0) {
    return validationError(res, 'Validation failed', errors);
  }

  // Sanitize
  req.body.business_name = sanitizeString(business_name);
  req.body.trading_name = trading_name ? sanitizeString(trading_name) : null;

  next();
};

// Import onboarding validators
const onboardingValidators = require('./validators/onboarding');

module.exports = {
  isNonEmptyString,
  isValidEmail,
  isValidPassword,
  sanitizeString,
  validateRegister,
  validateLogin,
  validateOnboarding,
  // Re-export onboarding validators
  ...onboardingValidators
};
