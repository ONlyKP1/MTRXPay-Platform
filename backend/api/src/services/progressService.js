/**
 * Progress Service
 * Calculates onboarding progress and missing items
 */

const { query } = require('../config/database');
const { ONBOARDING_STEPS, DOCUMENT_TYPES } = require('../shared/constants');

// Define sections and their requirements
const SECTIONS = {
  ACCOUNT_CREATED: 'account_created',
  MERCHANT_PROFILE: 'merchant_profile',
  ADDRESS: 'address',
  OWNERS: 'owners',
  DOCUMENTS: 'documents',
  SUBMITTED: 'submitted'
};

// Section display names
const SECTION_LABELS = {
  [SECTIONS.ACCOUNT_CREATED]: 'Account Created',
  [SECTIONS.MERCHANT_PROFILE]: 'Merchant Profile',
  [SECTIONS.ADDRESS]: 'Business Address',
  [SECTIONS.OWNERS]: 'Owners & Directors',
  [SECTIONS.DOCUMENTS]: 'Documents',
  [SECTIONS.SUBMITTED]: 'Submitted for Review'
};

// Required fields for merchant profile
const MERCHANT_REQUIRED_FIELDS = [
  'legal_business_name',
  'business_type',
  'country_of_incorporation',
  'industry_type'
];

// Business types that require beneficial owners
const BUSINESS_TYPES_REQUIRING_OWNERS = [
  'limited_company',
  'llp',
  'plc',
  'partnership'
];

// Required document types
const REQUIRED_DOCUMENT_TYPES = [
  DOCUMENT_TYPES.ID_PROOF,
  DOCUMENT_TYPES.BUSINESS_REGISTRATION
];

/**
 * Calculate full onboarding progress for a merchant
 * @param {string} merchantId - Merchant ID
 * @returns {object} Progress details
 */
const calculateProgress = async (merchantId) => {
  // Gather all data
  const [merchant, addresses, owners, documents, progressRecord] = await Promise.all([
    getMerchantData(merchantId),
    getAddresses(merchantId),
    getOwners(merchantId),
    getDocuments(merchantId),
    getProgressRecord(merchantId)
  ]);

  if (!merchant) {
    throw new Error('Merchant not found');
  }

  const completedSections = [];
  const missingSections = [];
  const missingItems = [];

  // 1. Account Created - always complete if merchant exists
  completedSections.push(SECTIONS.ACCOUNT_CREATED);

  // 2. Merchant Profile
  const profileStatus = checkMerchantProfile(merchant);
  if (profileStatus.complete) {
    completedSections.push(SECTIONS.MERCHANT_PROFILE);
  } else {
    missingSections.push(SECTIONS.MERCHANT_PROFILE);
    missingItems.push(...profileStatus.missing);
  }

  // 3. Address
  const addressStatus = checkAddress(addresses);
  if (addressStatus.complete) {
    completedSections.push(SECTIONS.ADDRESS);
  } else {
    missingSections.push(SECTIONS.ADDRESS);
    missingItems.push(...addressStatus.missing);
  }

  // 4. Owners/Directors
  const ownersStatus = checkOwners(owners, merchant.business_type);
  if (ownersStatus.complete) {
    completedSections.push(SECTIONS.OWNERS);
  } else {
    missingSections.push(SECTIONS.OWNERS);
    missingItems.push(...ownersStatus.missing);
  }

  // 5. Documents
  const docsStatus = checkDocuments(documents);
  if (docsStatus.complete) {
    completedSections.push(SECTIONS.DOCUMENTS);
  } else {
    missingSections.push(SECTIONS.DOCUMENTS);
    missingItems.push(...docsStatus.missing);
  }

  // 6. Submitted
  const isSubmitted = progressRecord?.is_submitted || false;
  if (isSubmitted) {
    completedSections.push(SECTIONS.SUBMITTED);
  }

  // Calculate completion percentage (exclude submitted from percentage calc)
  const totalSections = Object.keys(SECTIONS).length - 1; // -1 for submitted
  const completedCount = completedSections.filter(s => s !== SECTIONS.SUBMITTED).length;
  const completionPercent = Math.round((completedCount / totalSections) * 100);

  // Determine current step
  const currentStep = determineCurrentStep(completedSections, missingSections);

  // Check if ready to submit
  const canSubmit = missingSections.length === 0 && !isSubmitted;

  return {
    merchantId,
    currentStep,
    completedSections,
    missingSections,
    completionPercent,
    missingItems,
    canSubmit,
    isSubmitted,
    sectionDetails: {
      account: { complete: true, label: SECTION_LABELS[SECTIONS.ACCOUNT_CREATED] },
      profile: {
        complete: profileStatus.complete,
        label: SECTION_LABELS[SECTIONS.MERCHANT_PROFILE],
        missing: profileStatus.missing
      },
      address: {
        complete: addressStatus.complete,
        label: SECTION_LABELS[SECTIONS.ADDRESS],
        missing: addressStatus.missing
      },
      owners: {
        complete: ownersStatus.complete,
        label: SECTION_LABELS[SECTIONS.OWNERS],
        missing: ownersStatus.missing,
        required: ownersStatus.required
      },
      documents: {
        complete: docsStatus.complete,
        label: SECTION_LABELS[SECTIONS.DOCUMENTS],
        missing: docsStatus.missing,
        uploaded: docsStatus.uploaded
      },
      submitted: {
        complete: isSubmitted,
        label: SECTION_LABELS[SECTIONS.SUBMITTED]
      }
    }
  };
};

/**
 * Get merchant data
 */
const getMerchantData = async (merchantId) => {
  const result = await query('SELECT * FROM merchants WHERE id = $1', [merchantId]);
  return result.rows[0] || null;
};

/**
 * Get merchant addresses
 */
const getAddresses = async (merchantId) => {
  const result = await query(
    'SELECT * FROM merchant_addresses WHERE merchant_id = $1',
    [merchantId]
  );
  return result.rows;
};

/**
 * Get beneficial owners
 */
const getOwners = async (merchantId) => {
  const result = await query(
    'SELECT * FROM beneficial_owners WHERE merchant_id = $1',
    [merchantId]
  );
  return result.rows;
};

/**
 * Get documents
 */
const getDocuments = async (merchantId) => {
  const result = await query(
    'SELECT * FROM documents WHERE merchant_id = $1',
    [merchantId]
  );
  return result.rows;
};

/**
 * Get progress record
 */
const getProgressRecord = async (merchantId) => {
  const result = await query(
    'SELECT * FROM onboarding_progress WHERE merchant_id = $1',
    [merchantId]
  );
  return result.rows[0] || null;
};

/**
 * Check merchant profile completeness
 */
const checkMerchantProfile = (merchant) => {
  const missing = [];

  for (const field of MERCHANT_REQUIRED_FIELDS) {
    if (!merchant[field] || merchant[field].toString().trim() === '') {
      missing.push(formatFieldName(field));
    }
  }

  return {
    complete: missing.length === 0,
    missing
  };
};

/**
 * Check address completeness
 */
const checkAddress = (addresses) => {
  const missing = [];

  // Need at least one registered address
  const registeredAddress = addresses.find(a => a.address_type === 'registered');

  if (!registeredAddress) {
    missing.push('Registered business address');
  }

  return {
    complete: missing.length === 0,
    missing
  };
};

/**
 * Check owners/directors completeness
 */
const checkOwners = (owners, businessType) => {
  const missing = [];
  const requiresOwners = BUSINESS_TYPES_REQUIRING_OWNERS.includes(businessType);

  if (requiresOwners && owners.length === 0) {
    missing.push('At least one beneficial owner or director');
  }

  // Check if any owner has incomplete info
  for (const owner of owners) {
    if (!owner.first_name || !owner.last_name) {
      missing.push(`Complete details for ${owner.first_name || 'owner'}`);
    }
  }

  return {
    complete: missing.length === 0,
    missing,
    required: requiresOwners,
    count: owners.length
  };
};

/**
 * Check documents completeness
 */
const checkDocuments = (documents) => {
  const missing = [];
  const uploaded = {};

  // Track what's uploaded
  for (const doc of documents) {
    uploaded[doc.document_type] = (uploaded[doc.document_type] || 0) + 1;
  }

  // Check required documents
  for (const docType of REQUIRED_DOCUMENT_TYPES) {
    if (!uploaded[docType]) {
      missing.push(formatDocumentType(docType));
    }
  }

  return {
    complete: missing.length === 0,
    missing,
    uploaded
  };
};

/**
 * Determine current step based on progress
 */
const determineCurrentStep = (completedSections, missingSections) => {
  // If all complete, we're at review
  if (missingSections.length === 0) {
    return ONBOARDING_STEPS.REVIEW;
  }

  // Find first incomplete section and map to step
  const sectionToStep = {
    [SECTIONS.MERCHANT_PROFILE]: ONBOARDING_STEPS.BUSINESS_DETAILS,
    [SECTIONS.ADDRESS]: ONBOARDING_STEPS.ADDRESS,
    [SECTIONS.OWNERS]: ONBOARDING_STEPS.OWNERS,
    [SECTIONS.DOCUMENTS]: ONBOARDING_STEPS.DOCUMENTS
  };

  for (const section of missingSections) {
    if (sectionToStep[section]) {
      return sectionToStep[section];
    }
  }

  return ONBOARDING_STEPS.BUSINESS_DETAILS;
};

/**
 * Format field name for display
 */
const formatFieldName = (field) => {
  return field
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
};

/**
 * Format document type for display
 */
const formatDocumentType = (docType) => {
  const labels = {
    [DOCUMENT_TYPES.ID_PROOF]: 'ID Proof document',
    [DOCUMENT_TYPES.ADDRESS_PROOF]: 'Address Proof document',
    [DOCUMENT_TYPES.BUSINESS_REGISTRATION]: 'Business Registration document',
    [DOCUMENT_TYPES.BANK_STATEMENT]: 'Bank Statement'
  };
  return labels[docType] || docType;
};

/**
 * Get a simple progress summary
 */
const getProgressSummary = async (merchantId) => {
  const progress = await calculateProgress(merchantId);

  return {
    currentStep: progress.currentStep,
    completedSteps: progress.completedSections,
    completionPercent: progress.completionPercent,
    missingItems: progress.missingItems,
    canSubmit: progress.canSubmit
  };
};

module.exports = {
  calculateProgress,
  getProgressSummary,
  SECTIONS,
  SECTION_LABELS
};
