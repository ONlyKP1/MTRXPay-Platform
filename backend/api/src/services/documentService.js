/**
 * Document Service
 * Business logic for document management
 */

const { query } = require('../config/database');
const { DOCUMENT_STATUS, ONBOARDING_STEPS } = require('../shared/constants');

/**
 * Create a document record (metadata only, file upload handled separately)
 * @param {string} merchantId - Merchant ID
 * @param {object} data - Document data
 * @param {string} uploadedBy - User ID who uploaded
 * @returns {object} Created document record
 */
const createDocumentRecord = async (merchantId, data, uploadedBy) => {
  const {
    document_type,
    file_name,
    mime_type,
    storage_path,
    file_key,
    file_size,
    submission_id
  } = data;

  const result = await query(
    `INSERT INTO documents (
      merchant_id, submission_id, document_type, file_name,
      mime_type, storage_path, file_key, file_size,
      status, uploaded_by, uploaded_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
    RETURNING *`,
    [
      merchantId,
      submission_id || null,
      document_type,
      file_name,
      mime_type || null,
      storage_path || null,
      file_key || null,
      file_size || null,
      DOCUMENT_STATUS.UPLOADED,
      uploadedBy
    ]
  );

  // Update onboarding progress to indicate documents step touched
  await updateDocumentsProgress(merchantId);

  return result.rows[0];
};

/**
 * List all documents for a merchant
 * @param {string} merchantId - Merchant ID
 * @param {object} filters - Optional filters
 * @returns {array} List of documents
 */
const listMerchantDocuments = async (merchantId, filters = {}) => {
  let sql = 'SELECT * FROM documents WHERE merchant_id = $1';
  const values = [merchantId];
  let paramIndex = 2;

  // Apply filters
  if (filters.document_type) {
    sql += ` AND document_type = $${paramIndex}`;
    values.push(filters.document_type);
    paramIndex++;
  }

  if (filters.status) {
    sql += ` AND status = $${paramIndex}`;
    values.push(filters.status);
    paramIndex++;
  }

  if (filters.submission_id) {
    sql += ` AND submission_id = $${paramIndex}`;
    values.push(filters.submission_id);
    paramIndex++;
  }

  sql += ' ORDER BY uploaded_at DESC';

  const result = await query(sql, values);
  return result.rows;
};

/**
 * Get a single document by ID
 * @param {string} documentId - Document ID
 * @param {string} merchantId - Merchant ID (for verification)
 * @returns {object|null} Document or null
 */
const getDocumentById = async (documentId, merchantId) => {
  const result = await query(
    'SELECT * FROM documents WHERE id = $1 AND merchant_id = $2',
    [documentId, merchantId]
  );

  return result.rows[0] || null;
};

/**
 * Update document status (for admin review)
 * @param {string} documentId - Document ID
 * @param {string} status - New status
 * @param {string} reviewedBy - Admin user ID (optional)
 * @returns {object} Updated document
 */
const updateDocumentStatus = async (documentId, status, _reviewedBy = null) => {
  if (!Object.values(DOCUMENT_STATUS).includes(status)) {
    throw new Error('Invalid document status');
  }

  const result = await query(
    `UPDATE documents SET
      status = $1,
      updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [status, documentId]
  );

  if (result.rows.length === 0) {
    throw new Error('Document not found');
  }

  return result.rows[0];
};

/**
 * Delete a document
 * @param {string} documentId - Document ID
 * @param {string} merchantId - Merchant ID (for verification)
 * @returns {boolean} Success
 */
const deleteDocument = async (documentId, merchantId) => {
  const result = await query(
    'DELETE FROM documents WHERE id = $1 AND merchant_id = $2 RETURNING id',
    [documentId, merchantId]
  );

  if (result.rows.length === 0) {
    throw new Error('Document not found');
  }

  return true;
};

/**
 * Get document counts by type for a merchant
 * @param {string} merchantId - Merchant ID
 * @returns {object} Counts by document type
 */
const getDocumentCountsByType = async (merchantId) => {
  const result = await query(
    `SELECT document_type, COUNT(*) as count
     FROM documents
     WHERE merchant_id = $1
     GROUP BY document_type`,
    [merchantId]
  );

  const counts = {};
  for (const row of result.rows) {
    counts[row.document_type] = parseInt(row.count);
  }

  return counts;
};

/**
 * Check if required documents are present
 * @param {string} merchantId - Merchant ID
 * @param {array} requiredTypes - Required document types
 * @returns {object} Validation result
 */
const validateRequiredDocuments = async (merchantId, requiredTypes) => {
  const counts = await getDocumentCountsByType(merchantId);
  const missing = [];

  for (const type of requiredTypes) {
    if (!counts[type] || counts[type] === 0) {
      missing.push(type);
    }
  }

  return {
    complete: missing.length === 0,
    missing,
    uploaded: counts
  };
};

/**
 * Update onboarding progress when documents are added
 * @param {string} merchantId - Merchant ID
 */
const updateDocumentsProgress = async (merchantId) => {
  // Import here to avoid circular dependency
  const { getOnboardingProgress } = require('./onboardingService');

  const progress = await getOnboardingProgress(merchantId);
  const completedSteps = progress.completed_steps || [];

  if (!completedSteps.includes(ONBOARDING_STEPS.DOCUMENTS)) {
    completedSteps.push(ONBOARDING_STEPS.DOCUMENTS);

    await query(
      `UPDATE onboarding_progress SET
        completed_steps = $1,
        last_saved_at = NOW(),
        updated_at = NOW()
       WHERE merchant_id = $2`,
      [JSON.stringify(completedSteps), merchantId]
    );
  }
};

module.exports = {
  createDocumentRecord,
  listMerchantDocuments,
  getDocumentById,
  updateDocumentStatus,
  deleteDocument,
  getDocumentCountsByType,
  validateRequiredDocuments
};
