/**
 * Submission Service
 * Validates and processes onboarding submissions
 */

const { query } = require('../config/database');
const { MERCHANT_STATUS, KYC_STATUS, DOCUMENT_TYPES } = require('../shared/constants');
const auditService = require('./auditService');

// Countries requiring registration number
const COUNTRIES_REQUIRING_REGISTRATION = [
  'united kingdom',
  'uk',
  'united states',
  'us',
  'germany',
  'france',
  'australia',
  'canada'
];

// Business types requiring registration number
const BUSINESS_TYPES_REQUIRING_REGISTRATION = [
  'limited_company',
  'llp',
  'plc',
  'partnership'
];

// Business types requiring beneficial owners
const BUSINESS_TYPES_REQUIRING_OWNERS = [
  'limited_company',
  'llp',
  'plc',
  'partnership'
];

// Required documents by business type
const REQUIRED_DOCUMENTS = {
  default: [DOCUMENT_TYPES.ID_PROOF],
  limited_company: [DOCUMENT_TYPES.ID_PROOF, DOCUMENT_TYPES.BUSINESS_REGISTRATION],
  llp: [DOCUMENT_TYPES.ID_PROOF, DOCUMENT_TYPES.BUSINESS_REGISTRATION],
  plc: [DOCUMENT_TYPES.ID_PROOF, DOCUMENT_TYPES.BUSINESS_REGISTRATION],
  sole_trader: [DOCUMENT_TYPES.ID_PROOF, DOCUMENT_TYPES.ADDRESS_PROOF]
};

/**
 * Validate submission rules
 * @param {string} merchantId - Merchant ID
 * @returns {object} Validation result with errors
 */
const validateSubmissionRules = async (merchantId) => {
  const errors = [];
  const warnings = [];

  // Fetch all required data
  const merchant = await getMerchant(merchantId);
  if (!merchant) {
    return { valid: false, errors: ['Merchant not found'], warnings: [] };
  }

  const addresses = await getAddresses(merchantId);
  const owners = await getOwners(merchantId);
  const documents = await getDocuments(merchantId);

  // Rule 1: Legal business name exists
  if (!merchant.legal_business_name || merchant.legal_business_name.trim() === '') {
    errors.push({
      field: 'legal_business_name',
      message: 'Legal business name is required'
    });
  }

  // Rule 2: Business type exists
  if (!merchant.business_type || merchant.business_type.trim() === '') {
    errors.push({
      field: 'business_type',
      message: 'Business type is required'
    });
  }

  // Rule 3: Country of incorporation exists
  if (!merchant.country_of_incorporation || merchant.country_of_incorporation.trim() === '') {
    errors.push({
      field: 'country_of_incorporation',
      message: 'Country of incorporation is required'
    });
  }

  // Rule 4: Registration number where needed
  const requiresRegistration = checkRegistrationRequired(merchant);
  if (requiresRegistration && (!merchant.registration_number || merchant.registration_number.trim() === '')) {
    errors.push({
      field: 'registration_number',
      message: `Registration number is required for ${merchant.business_type} in ${merchant.country_of_incorporation}`
    });
  }

  // Rule 5: Industry type exists
  if (!merchant.industry_type || merchant.industry_type.trim() === '') {
    errors.push({
      field: 'industry_type',
      message: 'Industry type is required'
    });
  }

  // Rule 6: Business address exists
  const registeredAddress = addresses.find(a => a.address_type === 'registered');
  if (!registeredAddress) {
    errors.push({
      field: 'address',
      message: 'Registered business address is required'
    });
  } else {
    // Validate address completeness
    if (!registeredAddress.address_line1 || !registeredAddress.city ||
        !registeredAddress.postcode || !registeredAddress.country) {
      errors.push({
        field: 'address',
        message: 'Business address is incomplete'
      });
    }
  }

  // Rule 7: At least one owner/director where required
  const requiresOwners = BUSINESS_TYPES_REQUIRING_OWNERS.includes(merchant.business_type);
  if (requiresOwners && owners.length === 0) {
    errors.push({
      field: 'owners',
      message: 'At least one beneficial owner or director is required'
    });
  }

  // Rule 8: Owner details complete
  for (const owner of owners) {
    if (!owner.first_name || !owner.last_name) {
      errors.push({
        field: 'owners',
        message: `Owner "${owner.first_name || 'Unknown'}" has incomplete details`
      });
    }
  }

  // Rule 9: Required documents exist
  const requiredDocs = REQUIRED_DOCUMENTS[merchant.business_type] || REQUIRED_DOCUMENTS.default;
  const uploadedTypes = documents.map(d => d.document_type);

  for (const docType of requiredDocs) {
    if (!uploadedTypes.includes(docType)) {
      errors.push({
        field: 'documents',
        message: `Required document missing: ${formatDocType(docType)}`
      });
    }
  }

  // Rule 10: Check for rejected documents
  const rejectedDocs = documents.filter(d => d.status === 'rejected');
  if (rejectedDocs.length > 0) {
    errors.push({
      field: 'documents',
      message: `${rejectedDocs.length} document(s) have been rejected and need to be re-uploaded`
    });
  }

  // Warnings (non-blocking)
  if (!merchant.website_url) {
    warnings.push({
      field: 'website_url',
      message: 'Website URL is recommended but not required'
    });
  }

  if (!merchant.business_description) {
    warnings.push({
      field: 'business_description',
      message: 'Business description is recommended for faster review'
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    summary: {
      totalErrors: errors.length,
      totalWarnings: warnings.length,
      merchantId,
      businessType: merchant.business_type,
      country: merchant.country_of_incorporation
    }
  };
};

/**
 * Process submission after validation passes
 * @param {string} merchantId - Merchant ID
 * @param {string} userId - User ID making submission
 * @returns {object} Submission result
 */
const processSubmission = async (merchantId, userId) => {
  // Validate first
  const validation = await validateSubmissionRules(merchantId);

  if (!validation.valid) {
    return {
      success: false,
      errors: validation.errors,
      warnings: validation.warnings
    };
  }

  // Create KYC submission record
  const submissionResult = await query(
    `INSERT INTO kyc_submissions (
      merchant_id, submission_type, status, submitted_at
    ) VALUES ($1, 'combined', $2, NOW())
    RETURNING *`,
    [merchantId, KYC_STATUS.PENDING]
  );

  const submission = submissionResult.rows[0];

  // Update merchant status to under_review
  await query(
    `UPDATE merchants SET status = $1, updated_at = NOW() WHERE id = $2`,
    [MERCHANT_STATUS.UNDER_REVIEW, merchantId]
  );

  // Mark onboarding progress as submitted
  await query(
    `UPDATE onboarding_progress SET
      is_submitted = true,
      completion_percent = 100,
      current_step = 'review',
      updated_at = NOW()
     WHERE merchant_id = $1`,
    [merchantId]
  );

  // Link documents to submission
  await query(
    `UPDATE documents SET submission_id = $1 WHERE merchant_id = $2 AND submission_id IS NULL`,
    [submission.id, merchantId]
  );

  // Log audit event
  await auditService.log({
    action: 'ONBOARDING_SUBMITTED',
    merchantId,
    userId,
    details: {
      submissionId: submission.id,
      status: MERCHANT_STATUS.UNDER_REVIEW
    }
  });

  return {
    success: true,
    submission,
    merchantStatus: MERCHANT_STATUS.UNDER_REVIEW,
    message: 'Onboarding submitted for review',
    warnings: validation.warnings
  };
};

/**
 * Check if registration number is required
 */
const checkRegistrationRequired = (merchant) => {
  const countryLower = (merchant.country_of_incorporation || '').toLowerCase();
  const countryRequires = COUNTRIES_REQUIRING_REGISTRATION.some(c =>
    countryLower.includes(c.toLowerCase())
  );
  const typeRequires = BUSINESS_TYPES_REQUIRING_REGISTRATION.includes(merchant.business_type);

  return countryRequires && typeRequires;
};

/**
 * Format document type for display
 */
const formatDocType = (docType) => {
  const labels = {
    [DOCUMENT_TYPES.ID_PROOF]: 'ID Proof',
    [DOCUMENT_TYPES.ADDRESS_PROOF]: 'Address Proof',
    [DOCUMENT_TYPES.BUSINESS_REGISTRATION]: 'Business Registration',
    [DOCUMENT_TYPES.BANK_STATEMENT]: 'Bank Statement'
  };
  return labels[docType] || docType;
};

// Helper functions
const getMerchant = async (merchantId) => {
  const result = await query('SELECT * FROM merchants WHERE id = $1', [merchantId]);
  return result.rows[0] || null;
};

const getAddresses = async (merchantId) => {
  const result = await query(
    'SELECT * FROM merchant_addresses WHERE merchant_id = $1',
    [merchantId]
  );
  return result.rows;
};

const getOwners = async (merchantId) => {
  const result = await query(
    'SELECT * FROM beneficial_owners WHERE merchant_id = $1',
    [merchantId]
  );
  return result.rows;
};

const getDocuments = async (merchantId) => {
  const result = await query(
    'SELECT * FROM documents WHERE merchant_id = $1',
    [merchantId]
  );
  return result.rows;
};

module.exports = {
  validateSubmissionRules,
  processSubmission,
  checkRegistrationRequired,
  COUNTRIES_REQUIRING_REGISTRATION,
  BUSINESS_TYPES_REQUIRING_REGISTRATION,
  REQUIRED_DOCUMENTS
};
