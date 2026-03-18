/**
 * Request validation utilities
 * Do not trust incoming payloads
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
  const errors = [];

  // Check required fields
  if (!isNonEmptyString(full_name)) {
    errors.push('Full name is required');
  }

  if (!email) {
    errors.push('Email is required');
  } else if (!isValidEmail(email)) {
    errors.push('Invalid email format');
  }

  if (!password) {
    errors.push('Password is required');
  } else if (!isValidPassword(password)) {
    errors.push('Password must be at least 6 characters');
  }

  if (errors.length > 0) {
    return validationError(res, errors[0], errors);
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
  const errors = [];

  if (!email) {
    errors.push('Email is required');
  } else if (!isValidEmail(email)) {
    errors.push('Invalid email format');
  }

  if (!password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return validationError(res, errors[0], errors);
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
  const errors = [];

  if (!isNonEmptyString(business_name)) {
    errors.push('Business name is required');
  } else if (business_name.length > 255) {
    errors.push('Business name too long (max 255 characters)');
  }

  if (trading_name && typeof trading_name !== 'string') {
    errors.push('Trading name must be a string');
  } else if (trading_name && trading_name.length > 255) {
    errors.push('Trading name too long (max 255 characters)');
  }

  if (errors.length > 0) {
    return validationError(res, errors[0], errors);
  }

  // Sanitize
  req.body.business_name = sanitizeString(business_name);
  req.body.trading_name = trading_name ? sanitizeString(trading_name) : null;

  next();
};

module.exports = {
  isNonEmptyString,
  isValidEmail,
  isValidPassword,
  sanitizeString,
  validateRegister,
  validateLogin,
  validateOnboarding
};
