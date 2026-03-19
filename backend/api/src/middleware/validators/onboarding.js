/**
 * Onboarding validation middleware
 * Validates all onboarding-related payloads
 * Returns field-based errors: { field: "message" }
 */

const { validationError } = require('../../utils/response');
const { DOCUMENT_TYPES, ADDRESS_TYPES } = require('../../shared/constants');

// Regex patterns
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_REGEX = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
const REGISTRATION_NUMBER_REGEX = /^[A-Z0-9-]{4,20}$/i;

// Valid business types
const BUSINESS_TYPES = [
  'sole_trader',
  'partnership',
  'limited_company',
  'llp',
  'plc',
  'charity',
  'other'
];

// Valid owner roles
const OWNER_ROLES = [
  'director',
  'shareholder',
  'beneficial_owner',
  'authorised_signatory'
];

/**
 * Utility functions
 */
const isNonEmptyString = (value) => {
  return typeof value === 'string' && value.trim().length > 0;
};

const isValidEmail = (email) => {
  return isNonEmptyString(email) && EMAIL_REGEX.test(email.trim());
};

const isValidUrl = (url) => {
  return URL_REGEX.test(url);
};

const isValidDate = (dateStr) => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
};

const isValidDOB = (dateStr) => {
  if (!isValidDate(dateStr)) return false;
  const dob = new Date(dateStr);
  const now = new Date();
  const age = (now - dob) / (365.25 * 24 * 60 * 60 * 1000);
  return age >= 18 && age <= 120;
};

const sanitizeString = (value) => {
  if (typeof value !== 'string') return '';
  return value.trim();
};

/**
 * Validate create merchant profile
 * Required: legal_business_name, business_type, country_of_incorporation
 */
const validateMerchantProfile = (req, res, next) => {
  const {
    legal_business_name,
    business_type,
    country_of_incorporation,
    registration_number,
    website_url
  } = req.body;
  const errors = {};

  // Required fields
  if (!isNonEmptyString(legal_business_name)) {
    errors.legalBusinessName = 'Required';
  } else if (legal_business_name.length > 255) {
    errors.legalBusinessName = 'Must be 255 characters or less';
  }

  if (!isNonEmptyString(business_type)) {
    errors.businessType = 'Required';
  } else if (!BUSINESS_TYPES.includes(business_type.toLowerCase())) {
    errors.businessType = `Must be one of: ${BUSINESS_TYPES.join(', ')}`;
  }

  if (!isNonEmptyString(country_of_incorporation)) {
    errors.countryOfIncorporation = 'Required';
  }

  // Optional but validated if provided
  if (registration_number && !REGISTRATION_NUMBER_REGEX.test(registration_number)) {
    errors.registrationNumber = 'Invalid format';
  }

  if (website_url && !isValidUrl(website_url)) {
    errors.websiteUrl = 'Invalid URL format';
  }

  if (Object.keys(errors).length > 0) {
    return validationError(res, 'Validation failed', errors);
  }

  // Sanitize
  req.body.legal_business_name = sanitizeString(legal_business_name);
  req.body.business_type = sanitizeString(business_type).toLowerCase();
  req.body.country_of_incorporation = sanitizeString(country_of_incorporation);
  if (registration_number) {
    req.body.registration_number = sanitizeString(registration_number).toUpperCase();
  }
  if (website_url) {
    req.body.website_url = sanitizeString(website_url);
  }

  next();
};

/**
 * Validate save business details
 * Validates additional business info including address
 */
const validateBusinessDetails = (req, res, next) => {
  const {
    business_description,
    industry_type,
    tax_number,
    address
  } = req.body;
  const errors = {};

  // Description length check
  if (business_description && business_description.length > 2000) {
    errors.businessDescription = 'Must be 2000 characters or less';
  }

  // Industry required
  if (!isNonEmptyString(industry_type)) {
    errors.industryType = 'Required';
  }

  // Tax number format if provided
  if (tax_number && typeof tax_number !== 'string') {
    errors.taxNumber = 'Must be a string';
  }

  // Address validation
  if (address) {
    if (!isNonEmptyString(address.address_line1)) {
      errors['address.addressLine1'] = 'Required';
    }
    if (!isNonEmptyString(address.city)) {
      errors['address.city'] = 'Required';
    }
    if (!isNonEmptyString(address.postcode)) {
      errors['address.postcode'] = 'Required';
    }
    if (!isNonEmptyString(address.country)) {
      errors['address.country'] = 'Required';
    }
    if (address.address_type && !Object.values(ADDRESS_TYPES).includes(address.address_type)) {
      errors['address.addressType'] = `Must be one of: ${Object.values(ADDRESS_TYPES).join(', ')}`;
    }
  }

  if (Object.keys(errors).length > 0) {
    return validationError(res, 'Validation failed', errors);
  }

  // Sanitize
  if (business_description) {
    req.body.business_description = sanitizeString(business_description);
  }
  req.body.industry_type = sanitizeString(industry_type);
  if (tax_number) {
    req.body.tax_number = sanitizeString(tax_number);
  }

  next();
};

/**
 * Validate add beneficial owner/director
 */
const validateBeneficialOwner = (req, res, next) => {
  const {
    first_name,
    last_name,
    dob,
    ownership_percentage,
    role,
    email,
    phone
  } = req.body;
  const errors = {};

  // Required fields
  if (!isNonEmptyString(first_name)) {
    errors.firstName = 'Required';
  } else if (first_name.length > 100) {
    errors.firstName = 'Must be 100 characters or less';
  }

  if (!isNonEmptyString(last_name)) {
    errors.lastName = 'Required';
  } else if (last_name.length > 100) {
    errors.lastName = 'Must be 100 characters or less';
  }

  // DOB validation
  if (dob && !isValidDOB(dob)) {
    errors.dob = 'Must be a valid date (18+ years old)';
  }

  // Ownership percentage
  if (ownership_percentage !== undefined && ownership_percentage !== null) {
    const pct = parseFloat(ownership_percentage);
    if (isNaN(pct) || pct < 0 || pct > 100) {
      errors.ownershipPercentage = 'Must be between 0 and 100';
    }
  }

  // Role validation
  if (role && !OWNER_ROLES.includes(role.toLowerCase())) {
    errors.role = `Must be one of: ${OWNER_ROLES.join(', ')}`;
  }

  // Email validation
  if (email && !isValidEmail(email)) {
    errors.email = 'Invalid email format';
  }

  // Phone validation (basic)
  if (phone && (typeof phone !== 'string' || phone.length > 50)) {
    errors.phone = 'Invalid phone number';
  }

  if (Object.keys(errors).length > 0) {
    return validationError(res, 'Validation failed', errors);
  }

  // Sanitize
  req.body.first_name = sanitizeString(first_name);
  req.body.last_name = sanitizeString(last_name);
  if (req.body.nationality) req.body.nationality = sanitizeString(req.body.nationality);
  if (role) req.body.role = sanitizeString(role).toLowerCase();
  if (email) req.body.email = sanitizeString(email).toLowerCase();
  if (phone) req.body.phone = sanitizeString(phone);

  next();
};

/**
 * Validate submit onboarding
 * Checks merchant exists and valid UUID
 */
const validateSubmitOnboarding = (req, res, next) => {
  const { merchant_id } = req.body;
  const errors = {};

  // Merchant ID required
  if (!isNonEmptyString(merchant_id)) {
    errors.merchantId = 'Required';
  } else {
    // UUID format check
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(merchant_id)) {
      errors.merchantId = 'Invalid format';
    }
  }

  if (Object.keys(errors).length > 0) {
    return validationError(res, 'Validation failed', errors);
  }

  next();
};

/**
 * Validate document upload metadata
 */
const validateDocumentUpload = (req, res, next) => {
  const { document_type, file_name } = req.body;
  const errors = {};

  if (!isNonEmptyString(document_type)) {
    errors.documentType = 'Required';
  } else if (!Object.values(DOCUMENT_TYPES).includes(document_type)) {
    errors.documentType = `Must be one of: ${Object.values(DOCUMENT_TYPES).join(', ')}`;
  }

  if (!isNonEmptyString(file_name)) {
    errors.fileName = 'Required';
  }

  if (Object.keys(errors).length > 0) {
    return validationError(res, 'Validation failed', errors);
  }

  req.body.document_type = sanitizeString(document_type);
  req.body.file_name = sanitizeString(file_name);

  next();
};

/**
 * Validate address creation/update
 */
const validateAddress = (req, res, next) => {
  const {
    address_line1,
    city,
    postcode,
    country,
    address_type
  } = req.body;
  const errors = {};

  if (!isNonEmptyString(address_line1)) {
    errors.addressLine1 = 'Required';
  }
  if (!isNonEmptyString(city)) {
    errors.city = 'Required';
  }
  if (!isNonEmptyString(postcode)) {
    errors.postcode = 'Required';
  }
  if (!isNonEmptyString(country)) {
    errors.country = 'Required';
  }
  if (address_type && !Object.values(ADDRESS_TYPES).includes(address_type)) {
    errors.addressType = `Must be one of: ${Object.values(ADDRESS_TYPES).join(', ')}`;
  }

  if (Object.keys(errors).length > 0) {
    return validationError(res, 'Validation failed', errors);
  }

  req.body.address_line1 = sanitizeString(address_line1);
  req.body.city = sanitizeString(city);
  req.body.postcode = sanitizeString(postcode);
  req.body.country = sanitizeString(country);
  if (req.body.address_line2) {
    req.body.address_line2 = sanitizeString(req.body.address_line2);
  }
  if (req.body.county_or_state) {
    req.body.county_or_state = sanitizeString(req.body.county_or_state);
  }

  next();
};

module.exports = {
  validateMerchantProfile,
  validateBusinessDetails,
  validateBeneficialOwner,
  validateSubmitOnboarding,
  validateDocumentUpload,
  validateAddress,
  // Export utilities for reuse
  isNonEmptyString,
  isValidEmail,
  isValidUrl,
  isValidDate,
  isValidDOB,
  sanitizeString,
  // Export constants for reference
  BUSINESS_TYPES,
  OWNER_ROLES
};
