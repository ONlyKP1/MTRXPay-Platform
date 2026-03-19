/**
 * Admin routes
 * Protected routes for admin review and management
 */

const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { requireAdmin } = require('../../middleware/authorize');
const { success, notFoundError, serverError, badRequest } = require('../../utils/response');
const { query } = require('../../config/database');
const reviewService = require('../../services/reviewService');

// All admin routes require authentication + admin role
router.use(auth);
router.use(requireAdmin);

// ============================================
// Merchant Review Endpoints
// ============================================

/**
 * @swagger
 * /api/admin/merchants:
 *   get:
 *     summary: List all merchants
 *     description: Returns paginated list of merchants with optional status filter
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, pending_submission, under_review, approved, rejected, suspended]
 *         description: Filter by merchant status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of merchants
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 merchants:
 *                   - id: "uuid-here"
 *                     legal_business_name: "Acme Corp"
 *                     status: "under_review"
 *                     owner_email: "owner@acme.com"
 *                     owner_name: "John Smith"
 *                 pagination:
 *                   page: 1
 *                   limit: 20
 *                   total: 45
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/api/admin/merchants', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let sql = `
      SELECT m.*, u.email as owner_email, u.full_name as owner_name
      FROM merchants m
      LEFT JOIN users u ON m.owner_user_id = u.id
    `;
    const values = [];
    let paramIndex = 1;

    if (status) {
      sql += ` WHERE m.status = $${paramIndex}`;
      values.push(status);
      paramIndex++;
    }

    sql += ` ORDER BY m.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(limit, offset);

    const result = await query(sql, values);

    // Get total count
    let countSql = 'SELECT COUNT(*) as total FROM merchants';
    const countValues = [];
    if (status) {
      countSql += ' WHERE status = $1';
      countValues.push(status);
    }
    const countResult = await query(countSql, countValues);

    return success(res, {
      merchants: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].total)
      }
    });
  } catch (error) {
    return serverError(res, error.message);
  }
});

/**
 * @swagger
 * /api/admin/pending:
 *   get:
 *     summary: List merchants pending review
 *     description: Returns merchants with under_review status for admin review queue
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [submitted_at, created_at, business_name]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *     responses:
 *       200:
 *         description: Pending review queue
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 merchants:
 *                   - id: "uuid-here"
 *                     legal_business_name: "Acme Corp"
 *                     status: "under_review"
 *                     submitted_at: "2026-03-18T10:00:00.000Z"
 *                 total: 10
 *                 limit: 50
 *                 offset: 0
 */
router.get('/api/admin/pending', async (req, res) => {
  try {
    const { limit = 50, offset = 0, sortBy, sortOrder } = req.query;
    const result = await reviewService.getPendingReview({
      limit: parseInt(limit),
      offset: parseInt(offset),
      sortBy,
      sortOrder
    });

    return success(res, result);
  } catch (error) {
    return serverError(res, error.message);
  }
});

/**
 * @swagger
 * /api/admin/merchants/{merchantId}:
 *   get:
 *     summary: Get merchant details for review
 *     description: Returns complete merchant profile including addresses, owners, documents, and review history
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Complete merchant details
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 merchant:
 *                   id: "uuid-here"
 *                   legal_business_name: "Acme Corp"
 *                   business_type: "limited_company"
 *                   status: "under_review"
 *                   owner_email: "owner@acme.com"
 *                 addresses:
 *                   - address_type: "registered"
 *                     address_line1: "123 Business St"
 *                     city: "London"
 *                 beneficial_owners:
 *                   - first_name: "John"
 *                     last_name: "Smith"
 *                     role: "director"
 *                 documents:
 *                   - document_type: "id_proof"
 *                     status: "uploaded"
 *                 review_history:
 *                   submissions: []
 *                   auditLogs: []
 *       404:
 *         description: Merchant not found
 */
router.get('/api/admin/merchants/:merchantId', async (req, res) => {
  try {
    const { merchantId } = req.params;

    // Get merchant with owner info
    const merchantResult = await query(`
      SELECT m.*, u.email as owner_email, u.full_name as owner_name
      FROM merchants m
      LEFT JOIN users u ON m.owner_user_id = u.id
      WHERE m.id = $1
    `, [merchantId]);

    if (merchantResult.rows.length === 0) {
      return notFoundError(res, 'Merchant not found');
    }

    // Get addresses
    const addressesResult = await query(
      'SELECT * FROM merchant_addresses WHERE merchant_id = $1',
      [merchantId]
    );

    // Get beneficial owners
    const ownersResult = await query(
      'SELECT * FROM beneficial_owners WHERE merchant_id = $1',
      [merchantId]
    );

    // Get documents
    const docsResult = await query(
      'SELECT * FROM documents WHERE merchant_id = $1',
      [merchantId]
    );

    // Get review history
    const reviewHistory = await reviewService.getReviewHistory(merchantId);

    return success(res, {
      merchant: merchantResult.rows[0],
      addresses: addressesResult.rows,
      beneficial_owners: ownersResult.rows,
      documents: docsResult.rows,
      review_history: reviewHistory
    });
  } catch (error) {
    return serverError(res, error.message);
  }
});

/**
 * @swagger
 * /api/admin/merchants/{merchantId}/under-review:
 *   post:
 *     summary: Mark merchant as under review
 *     description: Transitions merchant from draft/pending_submission to under_review status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 example: "Starting review process"
 *     responses:
 *       200:
 *         description: Merchant marked as under review
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Merchant marked as under review"
 *               data:
 *                 id: "uuid-here"
 *                 status: "under_review"
 *       400:
 *         description: Invalid status transition
 *       404:
 *         description: Merchant not found
 */
router.post('/api/admin/merchants/:merchantId/under-review', async (req, res) => {
  try {
    const { merchantId } = req.params;
    const { notes } = req.body;

    const merchant = await reviewService.markUnderReview(merchantId, req.user.id, { notes });
    return success(res, merchant, 'Merchant marked as under review');
  } catch (error) {
    if (error.message.includes('not found')) {
      return notFoundError(res, error.message);
    }
    if (error.message.includes('Cannot move')) {
      return badRequest(res, error.message, 'INVALID_STATUS_TRANSITION');
    }
    return serverError(res, error.message);
  }
});

/**
 * @swagger
 * /api/admin/merchants/{merchantId}/approve:
 *   post:
 *     summary: Approve merchant
 *     description: Approves a merchant that is under review
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewAction'
 *           example:
 *             notes: "All documents verified successfully"
 *             riskLevel: "low"
 *     responses:
 *       200:
 *         description: Merchant approved
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Merchant approved"
 *               data:
 *                 merchant:
 *                   id: "uuid-here"
 *                   status: "approved"
 *                 status: "approved"
 *                 approvedAt: "2026-03-18T12:00:00.000Z"
 *                 riskLevel: "low"
 *       400:
 *         description: Cannot approve - invalid status
 *       404:
 *         description: Merchant not found
 */
router.post('/api/admin/merchants/:merchantId/approve', async (req, res) => {
  try {
    const { merchantId } = req.params;
    const { notes, riskLevel } = req.body;

    const result = await reviewService.markApproved(merchantId, req.user.id, {
      notes,
      riskLevel
    });

    return success(res, result, 'Merchant approved');
  } catch (error) {
    if (error.message.includes('not found')) {
      return notFoundError(res, error.message);
    }
    if (error.message.includes('Cannot approve')) {
      return badRequest(res, error.message, 'INVALID_STATUS_TRANSITION');
    }
    return serverError(res, error.message);
  }
});

/**
 * @swagger
 * /api/admin/merchants/{merchantId}/reject:
 *   post:
 *     summary: Reject merchant
 *     description: Rejects a merchant that is under review
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RejectAction'
 *           example:
 *             reason: "Invalid business registration document"
 *             notes: "Document appears to be expired"
 *             allowResubmission: true
 *     responses:
 *       200:
 *         description: Merchant rejected
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Merchant rejected"
 *               data:
 *                 merchant:
 *                   id: "uuid-here"
 *                   status: "rejected"
 *                 status: "rejected"
 *                 rejectedAt: "2026-03-18T12:00:00.000Z"
 *                 reason: "Invalid business registration document"
 *                 allowResubmission: true
 *       400:
 *         description: Rejection reason required or invalid status
 *       404:
 *         description: Merchant not found
 */
router.post('/api/admin/merchants/:merchantId/reject', async (req, res) => {
  try {
    const { merchantId } = req.params;
    const { reason, notes, allowResubmission } = req.body;

    if (!reason) {
      return badRequest(res, 'Rejection reason required', 'MISSING_REJECTION_REASON');
    }

    const result = await reviewService.markRejected(merchantId, req.user.id, {
      reason,
      notes,
      allowResubmission
    });

    return success(res, result, 'Merchant rejected');
  } catch (error) {
    if (error.message.includes('not found')) {
      return notFoundError(res, error.message);
    }
    if (error.message.includes('Cannot reject')) {
      return badRequest(res, error.message, 'INVALID_STATUS_TRANSITION');
    }
    return serverError(res, error.message);
  }
});

/**
 * @swagger
 * /api/admin/merchants/{merchantId}/notes:
 *   post:
 *     summary: Add review note
 *     description: Adds an internal note to a merchant's review file
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - note
 *             properties:
 *               note:
 *                 type: string
 *                 example: "Called merchant to verify address"
 *               noteType:
 *                 type: string
 *                 enum: [general, internal, compliance]
 *                 example: "internal"
 *     responses:
 *       200:
 *         description: Note added
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Review note added"
 *       400:
 *         description: Note content required
 */
router.post('/api/admin/merchants/:merchantId/notes', async (req, res) => {
  try {
    const { merchantId } = req.params;
    const { note, noteType } = req.body;

    if (!note) {
      return badRequest(res, 'Note content required', 'MISSING_NOTE_CONTENT');
    }

    const result = await reviewService.addReviewNote(merchantId, req.user.id, note, noteType);
    return success(res, result, 'Review note added');
  } catch (error) {
    return serverError(res, error.message);
  }
});

/**
 * @swagger
 * /api/admin/merchants/{merchantId}/history:
 *   get:
 *     summary: Get review history
 *     description: Returns the complete review history including submissions and audit logs
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Review history
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 submissions:
 *                   - id: "uuid"
 *                     status: "approved"
 *                     reviewer_name: "Admin User"
 *                 auditLogs:
 *                   - action: "MERCHANT_APPROVED"
 *                     created_at: "2026-03-18T12:00:00.000Z"
 *                 currentStatus: "approved"
 */
router.get('/api/admin/merchants/:merchantId/history', async (req, res) => {
  try {
    const { merchantId } = req.params;
    const history = await reviewService.getReviewHistory(merchantId);
    return success(res, history);
  } catch (error) {
    return serverError(res, error.message);
  }
});

/**
 * @swagger
 * /api/admin/documents/{documentId}/status:
 *   patch:
 *     summary: Update document status
 *     description: Approve or reject a specific document during review
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected, pending_review]
 *               notes:
 *                 type: string
 *           example:
 *             status: "approved"
 *             notes: "Document verified successfully"
 *     responses:
 *       200:
 *         description: Document status updated
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Document status updated"
 *               data:
 *                 id: "uuid-here"
 *                 status: "approved"
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Document not found
 */
router.patch('/api/admin/documents/:documentId/status', async (req, res) => {
  try {
    const { documentId } = req.params;
    const { status, notes } = req.body;

    const document = await reviewService.reviewDocument(documentId, req.user.id, status, notes);
    return success(res, document, 'Document status updated');
  } catch (error) {
    if (error.message.includes('not found')) {
      return notFoundError(res, error.message);
    }
    if (error.message.includes('Invalid')) {
      return badRequest(res, error.message, 'INVALID_DOCUMENT_STATUS');
    }
    return serverError(res, error.message);
  }
});

module.exports = router;
