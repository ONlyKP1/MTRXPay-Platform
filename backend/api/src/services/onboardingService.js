/**
 * Onboarding Service
 * Business logic for merchant onboarding flow
 */

const { query } = require('../config/database');
const { MERCHANT_STATUS, ONBOARDING_STEPS, KYC_STATUS } = require('../shared/constants');

/**
 * Save business details for a merchant
 * @param {string} merchantId - Merchant ID
 * @param {object} data - Business details and optional address
 * @returns {object} Updated merchant with address
 */
const saveBusinessDetails = async (merchantId, data) => {
  const {
    business_description,
    industry_type,
    tax_number,
    address
  } = data;

  // Update merchant fields
  const merchantResult = await query(
    `UPDATE merchants SET
      business_description = COALESCE($1, business_description),
      industry_type = COALESCE($2, industry_type),
      tax_number = COALESCE($3, tax_number),
      updated_at = NOW()
     WHERE id = $4
     RETURNING *`,
    [business_description, industry_type, tax_number, merchantId]
  );

  if (merchantResult.rows.length === 0) {
    throw new Error('Merchant not found');
  }

  // Save address if provided
  let savedAddress = null;
  if (address) {
    const addressResult = await query(
      `INSERT INTO merchant_addresses (
        merchant_id, address_line1, address_line2, city, county_or_state,
        postcode, country, address_type
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (merchant_id, address_type)
      DO UPDATE SET
        address_line1 = EXCLUDED.address_line1,
        address_line2 = EXCLUDED.address_line2,
        city = EXCLUDED.city,
        county_or_state = EXCLUDED.county_or_state,
        postcode = EXCLUDED.postcode,
        country = EXCLUDED.country,
        updated_at = NOW()
      RETURNING *`,
      [
        merchantId,
        address.address_line1,
        address.address_line2 || null,
        address.city,
        address.county_or_state || null,
        address.postcode,
        address.country,
        address.address_type || 'registered'
      ]
    );
    savedAddress = addressResult.rows[0];
  }

  // Update onboarding progress
  await updateOnboardingStep(merchantId, ONBOARDING_STEPS.BUSINESS_DETAILS);

  return {
    merchant: merchantResult.rows[0],
    address: savedAddress
  };
};

/**
 * Add a beneficial owner/director
 * @param {string} merchantId - Merchant ID
 * @param {object} data - Owner data
 * @returns {object} Created owner
 */
const addBeneficialOwner = async (merchantId, data) => {
  const {
    first_name,
    last_name,
    dob,
    nationality,
    ownership_percentage,
    role,
    email,
    phone,
    is_primary_contact
  } = data;

  const result = await query(
    `INSERT INTO beneficial_owners (
      merchant_id, first_name, last_name, dob, nationality,
      ownership_percentage, role, email, phone, is_primary_contact
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *`,
    [
      merchantId,
      first_name,
      last_name,
      dob || null,
      nationality || null,
      ownership_percentage || null,
      role || null,
      email || null,
      phone || null,
      is_primary_contact || false
    ]
  );

  // Update onboarding progress
  await updateOnboardingStep(merchantId, ONBOARDING_STEPS.OWNERS);

  return result.rows[0];
};

/**
 * Update a beneficial owner
 * @param {string} ownerId - Owner ID
 * @param {object} data - Fields to update
 * @returns {object} Updated owner
 */
const updateBeneficialOwner = async (ownerId, data) => {
  const allowedFields = [
    'first_name',
    'last_name',
    'dob',
    'nationality',
    'ownership_percentage',
    'role',
    'email',
    'phone',
    'is_primary_contact'
  ];

  const updates = [];
  const values = [];
  let paramIndex = 1;

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updates.push(`${field} = $${paramIndex}`);
      values.push(data[field]);
      paramIndex++;
    }
  }

  if (updates.length === 0) {
    throw new Error('No fields to update');
  }

  updates.push(`updated_at = NOW()`);
  values.push(ownerId);

  const result = await query(
    `UPDATE beneficial_owners SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );

  if (result.rows.length === 0) {
    throw new Error('Beneficial owner not found');
  }

  return result.rows[0];
};

/**
 * Delete a beneficial owner
 * @param {string} ownerId - Owner ID
 * @param {string} merchantId - Merchant ID (for verification)
 * @returns {boolean} Success
 */
const deleteBeneficialOwner = async (ownerId, merchantId) => {
  const result = await query(
    'DELETE FROM beneficial_owners WHERE id = $1 AND merchant_id = $2 RETURNING id',
    [ownerId, merchantId]
  );

  if (result.rows.length === 0) {
    throw new Error('Beneficial owner not found');
  }

  return true;
};

/**
 * Get all beneficial owners for a merchant
 * @param {string} merchantId - Merchant ID
 * @returns {array} List of owners
 */
const getBeneficialOwners = async (merchantId) => {
  const result = await query(
    'SELECT * FROM beneficial_owners WHERE merchant_id = $1 ORDER BY created_at ASC',
    [merchantId]
  );

  return result.rows;
};

/**
 * Get onboarding progress for a merchant
 * @param {string} merchantId - Merchant ID
 * @returns {object} Progress data
 */
const getOnboardingProgress = async (merchantId) => {
  // Get or create progress record
  let result = await query(
    'SELECT * FROM onboarding_progress WHERE merchant_id = $1',
    [merchantId]
  );

  if (result.rows.length === 0) {
    // Create initial progress
    result = await query(
      `INSERT INTO onboarding_progress (merchant_id, current_step, completed_steps, completion_percent)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [merchantId, ONBOARDING_STEPS.BUSINESS_DETAILS, '[]', 0]
    );
  }

  return result.rows[0];
};

/**
 * Update onboarding step completion
 * @param {string} merchantId - Merchant ID
 * @param {string} step - Completed step
 * @returns {object} Updated progress
 */
const updateOnboardingStep = async (merchantId, step) => {
  const progress = await getOnboardingProgress(merchantId);
  const completedSteps = progress.completed_steps || [];

  if (!completedSteps.includes(step)) {
    completedSteps.push(step);
  }

  // Calculate completion percentage
  const totalSteps = Object.values(ONBOARDING_STEPS).length;
  const completionPercent = Math.round((completedSteps.length / totalSteps) * 100);

  // Determine next step
  const stepOrder = Object.values(ONBOARDING_STEPS);
  const currentIndex = stepOrder.indexOf(step);
  const nextStep = stepOrder[currentIndex + 1] || step;

  const result = await query(
    `UPDATE onboarding_progress SET
      current_step = $1,
      completed_steps = $2,
      completion_percent = $3,
      last_saved_at = NOW(),
      updated_at = NOW()
     WHERE merchant_id = $4
     RETURNING *`,
    [nextStep, JSON.stringify(completedSteps), completionPercent, merchantId]
  );

  return result.rows[0];
};

/**
 * Submit onboarding for review
 * @param {string} merchantId - Merchant ID
 * @returns {object} Submission result
 */
const submitOnboarding = async (merchantId) => {
  // Validate all requirements are met
  const errors = await validateOnboardingComplete(merchantId);
  if (errors.length > 0) {
    throw new Error(`Onboarding incomplete: ${errors.join(', ')}`);
  }

  // Create KYC submission
  const submissionResult = await query(
    `INSERT INTO kyc_submissions (merchant_id, submission_type, status, submitted_at)
     VALUES ($1, 'combined', $2, NOW())
     RETURNING *`,
    [merchantId, KYC_STATUS.PENDING]
  );

  // Update merchant status
  await query(
    `UPDATE merchants SET status = $1, updated_at = NOW() WHERE id = $2`,
    [MERCHANT_STATUS.UNDER_REVIEW, merchantId]
  );

  // Mark onboarding as submitted
  await query(
    `UPDATE onboarding_progress SET
      is_submitted = true,
      current_step = $1,
      completion_percent = 100,
      updated_at = NOW()
     WHERE merchant_id = $2`,
    [ONBOARDING_STEPS.REVIEW, merchantId]
  );

  return {
    submission: submissionResult.rows[0],
    message: 'Onboarding submitted for review'
  };
};

/**
 * Validate onboarding is complete
 * @param {string} merchantId - Merchant ID
 * @returns {array} List of errors (empty if complete)
 */
const validateOnboardingComplete = async (merchantId) => {
  const errors = [];

  // Check merchant exists and has required fields
  const merchant = await query(
    `SELECT legal_business_name, business_type, country_of_incorporation, industry_type
     FROM merchants WHERE id = $1`,
    [merchantId]
  );

  if (merchant.rows.length === 0) {
    errors.push('Merchant not found');
    return errors;
  }

  const m = merchant.rows[0];
  if (!m.legal_business_name) errors.push('Legal business name required');
  if (!m.business_type) errors.push('Business type required');
  if (!m.country_of_incorporation) errors.push('Country of incorporation required');
  if (!m.industry_type) errors.push('Industry type required');

  // Check for at least one address
  const addresses = await query(
    'SELECT COUNT(*) as count FROM merchant_addresses WHERE merchant_id = $1',
    [merchantId]
  );
  if (parseInt(addresses.rows[0].count) === 0) {
    errors.push('At least one address required');
  }

  // Check for at least one beneficial owner (for company types)
  if (['limited_company', 'llp', 'plc'].includes(m.business_type)) {
    const owners = await query(
      'SELECT COUNT(*) as count FROM beneficial_owners WHERE merchant_id = $1',
      [merchantId]
    );
    if (parseInt(owners.rows[0].count) === 0) {
      errors.push('At least one beneficial owner/director required');
    }
  }

  // Check for required documents
  const docs = await query(
    'SELECT COUNT(*) as count FROM documents WHERE merchant_id = $1',
    [merchantId]
  );
  if (parseInt(docs.rows[0].count) === 0) {
    errors.push('At least one document required');
  }

  return errors;
};

module.exports = {
  saveBusinessDetails,
  addBeneficialOwner,
  updateBeneficialOwner,
  deleteBeneficialOwner,
  getBeneficialOwners,
  getOnboardingProgress,
  updateOnboardingStep,
  submitOnboarding,
  validateOnboardingComplete
};
