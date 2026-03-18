/**
 * Merchant Service
 * Business logic for merchant operations
 */

const { query } = require('../config/database');
const { MERCHANT_STATUS } = require('../shared/constants');

/**
 * Create a new merchant profile
 * @param {object} data - Merchant profile data
 * @param {string} userId - Owner user ID
 * @returns {object} Created merchant
 */
const createMerchantProfile = async (data, userId) => {
  const {
    legal_business_name,
    business_type,
    country_of_incorporation,
    registration_number,
    website_url,
    trading_name
  } = data;

  const result = await query(
    `INSERT INTO merchants (
      owner_user_id,
      business_name,
      legal_business_name,
      trading_name,
      business_type,
      country_of_incorporation,
      registration_number,
      website_url,
      status,
      created_at,
      updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
    RETURNING *`,
    [
      userId,
      legal_business_name, // Use legal name as business_name initially
      legal_business_name,
      trading_name || null,
      business_type,
      country_of_incorporation,
      registration_number || null,
      website_url || null,
      MERCHANT_STATUS.DRAFT
    ]
  );

  // Link merchant to user
  await query(
    'UPDATE users SET merchant_id = $1 WHERE id = $2',
    [result.rows[0].id, userId]
  );

  return result.rows[0];
};

/**
 * Update merchant profile
 * @param {string} merchantId - Merchant ID
 * @param {object} data - Fields to update
 * @returns {object} Updated merchant
 */
const updateMerchantProfile = async (merchantId, data) => {
  const allowedFields = [
    'legal_business_name',
    'trading_name',
    'business_type',
    'country_of_incorporation',
    'registration_number',
    'website_url',
    'tax_number',
    'industry_type',
    'business_description'
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
    // No updates, just return current merchant
    return getMerchantById(merchantId);
  }

  updates.push(`updated_at = NOW()`);
  values.push(merchantId);

  const result = await query(
    `UPDATE merchants SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );

  if (result.rows.length === 0) {
    throw new Error('Merchant not found');
  }

  return result.rows[0];
};

/**
 * Get merchant by ID
 * @param {string} merchantId - Merchant ID
 * @returns {object|null} Merchant or null
 */
const getMerchantById = async (merchantId) => {
  const result = await query(
    'SELECT * FROM merchants WHERE id = $1',
    [merchantId]
  );

  return result.rows[0] || null;
};

/**
 * Get merchant for a user
 * @param {string} userId - User ID
 * @returns {object|null} Merchant or null
 */
const getMerchantForUser = async (userId) => {
  const result = await query(
    `SELECT m.* FROM merchants m
     INNER JOIN users u ON u.merchant_id = m.id
     WHERE u.id = $1`,
    [userId]
  );

  return result.rows[0] || null;
};

/**
 * Update merchant status
 * @param {string} merchantId - Merchant ID
 * @param {string} status - New status
 * @returns {object} Updated merchant
 */
const updateMerchantStatus = async (merchantId, status) => {
  if (!Object.values(MERCHANT_STATUS).includes(status)) {
    throw new Error('Invalid merchant status');
  }

  const result = await query(
    `UPDATE merchants SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [status, merchantId]
  );

  if (result.rows.length === 0) {
    throw new Error('Merchant not found');
  }

  return result.rows[0];
};

module.exports = {
  createMerchantProfile,
  updateMerchantProfile,
  getMerchantById,
  getMerchantForUser,
  updateMerchantStatus
};
