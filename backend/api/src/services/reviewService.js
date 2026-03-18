/**
 * Review Service
 * Admin review lifecycle management for merchant onboarding
 */

const { query } = require('../config/database');
const { MERCHANT_STATUS, KYC_STATUS, RISK_LEVELS } = require('../shared/constants');
const auditService = require('./auditService');

/**
 * Mark merchant as under review
 * @param {string} merchantId - Merchant ID
 * @param {string} adminUserId - Admin user ID
 * @param {object} options - Additional options
 * @returns {object} Updated merchant
 */
const markUnderReview = async (merchantId, adminUserId, options = {}) => {
  const { notes = null } = options;

  // Get current merchant state
  const merchant = await getMerchant(merchantId);
  if (!merchant) {
    throw new Error('Merchant not found');
  }

  // Validate state transition
  const validFromStates = [MERCHANT_STATUS.PENDING_SUBMISSION, MERCHANT_STATUS.DRAFT];
  if (!validFromStates.includes(merchant.status)) {
    throw new Error(`Cannot move to under_review from ${merchant.status}`);
  }

  // Update merchant status
  const result = await query(
    `UPDATE merchants SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [MERCHANT_STATUS.UNDER_REVIEW, merchantId]
  );

  // Update KYC submission if exists
  await query(
    `UPDATE kyc_submissions SET status = $1, reviewed_by = $2, notes = COALESCE($3, notes)
     WHERE merchant_id = $4 AND status = $5`,
    [KYC_STATUS.UNDER_REVIEW, adminUserId, notes, merchantId, KYC_STATUS.PENDING]
  );

  // Add review note if provided
  if (notes) {
    await addReviewNote(merchantId, adminUserId, notes, 'status_change');
  }

  // Audit log
  await auditService.log({
    action: 'MERCHANT_STATUS_CHANGED',
    merchantId,
    userId: adminUserId,
    details: {
      fromStatus: merchant.status,
      toStatus: MERCHANT_STATUS.UNDER_REVIEW,
      notes
    }
  });

  return result.rows[0];
};

/**
 * Mark merchant as approved
 * @param {string} merchantId - Merchant ID
 * @param {string} adminUserId - Admin user ID
 * @param {object} options - Additional options
 * @returns {object} Updated merchant
 */
const markApproved = async (merchantId, adminUserId, options = {}) => {
  const { notes = null, riskLevel = RISK_LEVELS.LOW } = options;

  // Get current merchant state
  const merchant = await getMerchant(merchantId);
  if (!merchant) {
    throw new Error('Merchant not found');
  }

  // Validate state transition
  if (merchant.status !== MERCHANT_STATUS.UNDER_REVIEW) {
    throw new Error(`Cannot approve merchant with status ${merchant.status}. Must be under_review.`);
  }

  // Update merchant status
  const result = await query(
    `UPDATE merchants SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [MERCHANT_STATUS.APPROVED, merchantId]
  );

  // Update KYC submission
  await query(
    `UPDATE kyc_submissions SET
      status = $1,
      reviewed_at = NOW(),
      reviewed_by = $2,
      risk_level = $3,
      notes = COALESCE($4, notes)
     WHERE merchant_id = $5 AND status = $6`,
    [KYC_STATUS.APPROVED, adminUserId, riskLevel, notes, merchantId, KYC_STATUS.UNDER_REVIEW]
  );

  // Add approval note
  await addReviewNote(merchantId, adminUserId, notes || 'Merchant approved', 'approval');

  // Audit log
  await auditService.log({
    action: 'MERCHANT_APPROVED',
    merchantId,
    userId: adminUserId,
    details: {
      riskLevel,
      notes
    }
  });

  return {
    merchant: result.rows[0],
    status: MERCHANT_STATUS.APPROVED,
    approvedAt: new Date().toISOString(),
    approvedBy: adminUserId,
    riskLevel
  };
};

/**
 * Mark merchant as rejected
 * @param {string} merchantId - Merchant ID
 * @param {string} adminUserId - Admin user ID
 * @param {object} options - Rejection details (reason required)
 * @returns {object} Updated merchant
 */
const markRejected = async (merchantId, adminUserId, options = {}) => {
  const { reason, notes = null, allowResubmission = true } = options;

  if (!reason) {
    throw new Error('Rejection reason is required');
  }

  // Get current merchant state
  const merchant = await getMerchant(merchantId);
  if (!merchant) {
    throw new Error('Merchant not found');
  }

  // Validate state transition
  if (merchant.status !== MERCHANT_STATUS.UNDER_REVIEW) {
    throw new Error(`Cannot reject merchant with status ${merchant.status}. Must be under_review.`);
  }

  // Determine target status
  const targetStatus = allowResubmission ? MERCHANT_STATUS.REJECTED : MERCHANT_STATUS.SUSPENDED;

  // Update merchant status
  const result = await query(
    `UPDATE merchants SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [targetStatus, merchantId]
  );

  // Update KYC submission
  const rejectionNotes = `Reason: ${reason}${notes ? `. Notes: ${notes}` : ''}`;
  await query(
    `UPDATE kyc_submissions SET
      status = $1,
      reviewed_at = NOW(),
      reviewed_by = $2,
      notes = $3
     WHERE merchant_id = $4 AND status = $5`,
    [KYC_STATUS.REJECTED, adminUserId, rejectionNotes, merchantId, KYC_STATUS.UNDER_REVIEW]
  );

  // Reset onboarding progress if resubmission allowed
  if (allowResubmission) {
    await query(
      `UPDATE onboarding_progress SET is_submitted = false, updated_at = NOW() WHERE merchant_id = $1`,
      [merchantId]
    );
  }

  // Add rejection note
  await addReviewNote(merchantId, adminUserId, rejectionNotes, 'rejection');

  // Audit log
  await auditService.log({
    action: 'MERCHANT_REJECTED',
    merchantId,
    userId: adminUserId,
    details: {
      reason,
      notes,
      allowResubmission
    }
  });

  return {
    merchant: result.rows[0],
    status: targetStatus,
    rejectedAt: new Date().toISOString(),
    rejectedBy: adminUserId,
    reason,
    allowResubmission
  };
};

/**
 * Add review note to merchant
 * @param {string} merchantId - Merchant ID
 * @param {string} adminUserId - Admin user ID
 * @param {string} note - Note content
 * @param {string} noteType - Type of note
 * @returns {object} Created note
 */
const addReviewNote = async (merchantId, adminUserId, note, noteType = 'general') => {
  if (!note || note.trim() === '') {
    return null;
  }

  // Store notes in KYC submission for now
  // Could be expanded to dedicated review_notes table
  const result = await query(
    `INSERT INTO kyc_submissions (merchant_id, submission_type, status, notes)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (merchant_id) DO UPDATE SET notes = kyc_submissions.notes || E'\n---\n' || $4
     RETURNING *`,
    [merchantId, noteType, 'note', `[${new Date().toISOString()}] ${note}`]
  );

  // Also log to audit
  await auditService.log({
    action: 'REVIEW_NOTE_ADDED',
    merchantId,
    userId: adminUserId,
    details: {
      noteType,
      note: note.substring(0, 200) // Truncate for audit
    }
  });

  return result.rows[0];
};

/**
 * Get review history for merchant
 * @param {string} merchantId - Merchant ID
 * @returns {object} Review history
 */
const getReviewHistory = async (merchantId) => {
  // Get all KYC submissions
  const submissions = await query(
    `SELECT ks.*, u.full_name as reviewer_name, u.email as reviewer_email
     FROM kyc_submissions ks
     LEFT JOIN users u ON ks.reviewed_by = u.id
     WHERE ks.merchant_id = $1
     ORDER BY ks.created_at DESC`,
    [merchantId]
  );

  // Get audit logs
  const auditLogs = await auditService.getLogsForMerchant(merchantId, {
    limit: 50
  });

  return {
    submissions: submissions.rows,
    auditLogs,
    currentStatus: submissions.rows[0]?.status || null
  };
};

/**
 * Get merchants pending review
 * @param {object} options - Query options
 * @returns {array} Merchants pending review
 */
const getPendingReview = async (options = {}) => {
  const { limit = 50, offset = 0, sortBy = 'submitted_at', sortOrder = 'ASC' } = options;

  const validSortFields = ['submitted_at', 'created_at', 'business_name'];
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'submitted_at';
  const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  const result = await query(
    `SELECT m.*, ks.submitted_at, ks.id as submission_id,
            u.full_name as owner_name, u.email as owner_email
     FROM merchants m
     LEFT JOIN kyc_submissions ks ON m.id = ks.merchant_id
     LEFT JOIN users u ON m.owner_user_id = u.id
     WHERE m.status = $1
     ORDER BY ${sortField === 'submitted_at' ? 'ks.submitted_at' : 'm.' + sortField} ${order}
     LIMIT $2 OFFSET $3`,
    [MERCHANT_STATUS.UNDER_REVIEW, limit, offset]
  );

  // Get count
  const countResult = await query(
    'SELECT COUNT(*) as total FROM merchants WHERE status = $1',
    [MERCHANT_STATUS.UNDER_REVIEW]
  );

  return {
    merchants: result.rows,
    total: parseInt(countResult.rows[0].total),
    limit,
    offset
  };
};

/**
 * Update document status during review
 * @param {string} documentId - Document ID
 * @param {string} adminUserId - Admin user ID
 * @param {string} status - New status
 * @param {string} notes - Review notes
 * @returns {object} Updated document
 */
const reviewDocument = async (documentId, adminUserId, status, notes = null) => {
  const validStatuses = ['approved', 'rejected', 'pending_review'];
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid document status: ${status}`);
  }

  const result = await query(
    `UPDATE documents SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [status, documentId]
  );

  if (result.rows.length === 0) {
    throw new Error('Document not found');
  }

  // Audit log
  await auditService.log({
    action: 'DOCUMENT_REVIEWED',
    merchantId: result.rows[0].merchant_id,
    userId: adminUserId,
    resourceType: 'document',
    resourceId: documentId,
    details: {
      status,
      notes
    }
  });

  return result.rows[0];
};

// Helper function
const getMerchant = async (merchantId) => {
  const result = await query('SELECT * FROM merchants WHERE id = $1', [merchantId]);
  return result.rows[0] || null;
};

module.exports = {
  markUnderReview,
  markApproved,
  markRejected,
  addReviewNote,
  getReviewHistory,
  getPendingReview,
  reviewDocument
};
