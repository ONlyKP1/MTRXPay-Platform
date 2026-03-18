/**
 * KYC Service
 * Day 5: Verification status tracking
 */

const { query } = require('../../config/database');
const { KycStatus, KycProvider } = require('./kyc.model');

/**
 * Start KYC verification for a user
 * @param {string} userId - User ID
 * @returns {object} Created KYC record
 */
const startKyc = async (userId) => {
  // Create/update KYC verification record
  const result = await query(
    `INSERT INTO kyc_verifications (
      user_id,
      status,
      provider,
      created_at,
      updated_at
    ) VALUES ($1, $2, $3, NOW(), NOW())
    ON CONFLICT (user_id)
    DO UPDATE SET
      status = $2,
      updated_at = NOW()
    RETURNING *`,
    [userId, KycStatus.IN_PROGRESS, KycProvider.MOCK]
  );

  // Sync status to users table for fast checks
  await query(
    `UPDATE users SET kyc_status = $1 WHERE id = $2`,
    [KycStatus.IN_PROGRESS, userId]
  );

  return result.rows[0];
};

/**
 * Get KYC status for a user
 * @param {string} userId - User ID
 * @returns {object|null} KYC record or null
 */
const getStatus = async (userId) => {
  const result = await query(
    `SELECT * FROM kyc_verifications WHERE user_id = $1`,
    [userId]
  );

  return result.rows[0] || null;
};

/**
 * Update KYC status for a user
 * @param {string} userId - User ID
 * @param {string} status - New KYC status
 * @returns {object} Updated KYC record
 */
const updateStatus = async (userId, status) => {
  // Update KYC verification record
  const result = await query(
    `UPDATE kyc_verifications
     SET status = $1, updated_at = NOW()
     WHERE user_id = $2
     RETURNING *`,
    [status, userId]
  );

  // Sync status to users table for fast checks
  await query(
    `UPDATE users SET kyc_status = $1 WHERE id = $2`,
    [status, userId]
  );

  return result.rows[0];
};

/**
 * Get KYC record by provider reference
 * @param {string} providerRef - External provider reference ID
 * @returns {object|null} KYC record or null
 */
const getByProviderRef = async (providerRef) => {
  const result = await query(
    `SELECT * FROM kyc_verifications WHERE provider_ref = $1`,
    [providerRef]
  );

  return result.rows[0] || null;
};

/**
 * Set provider reference (for SumSub integration)
 * @param {string} userId - User ID
 * @param {string} provider - Provider name
 * @param {string} providerRef - External reference ID
 * @returns {object} Updated KYC record
 */
const setProviderRef = async (userId, provider, providerRef) => {
  const result = await query(
    `UPDATE kyc_verifications
     SET provider = $1, provider_ref = $2, updated_at = NOW()
     WHERE user_id = $3
     RETURNING *`,
    [provider, providerRef, userId]
  );

  return result.rows[0];
};

module.exports = {
  startKyc,
  getStatus,
  updateStatus,
  getByProviderRef,
  setProviderRef,
  KycStatus,
  KycProvider
};
