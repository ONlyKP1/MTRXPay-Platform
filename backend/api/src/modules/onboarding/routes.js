const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { requireMerchantOwner } = require('../../middleware/authorize');
const {
  validateBusinessDetails,
  validateBeneficialOwner,
  validateDocumentUpload
} = require('../../middleware/validate');
const { success, notFoundError, serverError } = require('../../utils/response');
const onboardingService = require('../../services/onboardingService');
const documentService = require('../../services/documentService');
const progressService = require('../../services/progressService');
const submissionService = require('../../services/submissionService');

// ============================================
// Business Details / Onboarding Endpoints
// ============================================

/**
 * @swagger
 * /api/onboarding/{merchantId}/business-details:
 *   put:
 *     summary: Save business details
 *     description: Updates the business details section of the onboarding flow
 *     tags: [Onboarding]
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
 *             properties:
 *               industryType:
 *                 type: string
 *                 example: "technology"
 *               businessDescription:
 *                 type: string
 *                 example: "Software development and consulting services"
 *               websiteUrl:
 *                 type: string
 *                 example: "https://acme.com"
 *               expectedMonthlyVolume:
 *                 type: string
 *                 example: "10000-50000"
 *               expectedTransactionCount:
 *                 type: string
 *                 example: "100-500"
 *     responses:
 *       200:
 *         description: Business details saved successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Business details saved"
 *               data:
 *                 id: "uuid-here"
 *                 industry_type: "technology"
 *                 business_description: "Software development and consulting services"
 *       400:
 *         description: Validation error
 *       403:
 *         description: Not authorized
 */
router.put(
  '/api/onboarding/:merchantId/business-details',
  auth,
  requireMerchantOwner,
  validateBusinessDetails,
  async (req, res) => {
    try {
      const result = await onboardingService.saveBusinessDetails(req.params.merchantId, req.body);
      return success(res, result, 'Business details saved');
    } catch (error) {
      return serverError(res, error.message);
    }
  }
);

/**
 * @swagger
 * /api/onboarding/{merchantId}:
 *   get:
 *     summary: Get full onboarding data
 *     description: Returns merchant data, progress, owners, and documents in a single call
 *     tags: [Onboarding]
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
 *         description: Full onboarding data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     merchant:
 *                       $ref: '#/components/schemas/Merchant'
 *                     progress:
 *                       $ref: '#/components/schemas/Progress'
 *                     owners:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Owner'
 *                     documents:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Document'
 *       403:
 *         description: Not authorized
 */
router.get('/api/onboarding/:merchantId', auth, requireMerchantOwner, async (req, res) => {
  try {
    const merchant = req.merchant;
    const progress = await progressService.calculateProgress(req.params.merchantId);
    const owners = await onboardingService.getBeneficialOwners(req.params.merchantId);
    const documents = await documentService.listMerchantDocuments(req.params.merchantId);

    return success(res, {
      merchant,
      progress,
      owners,
      documents
    });
  } catch (error) {
    return serverError(res, error.message);
  }
});

/**
 * @swagger
 * /api/onboarding/{merchantId}/progress:
 *   get:
 *     summary: Get onboarding progress
 *     description: Returns detailed progress information including completion percentage and missing items
 *     tags: [Onboarding]
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
 *         description: Progress information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Progress'
 *             example:
 *               success: true
 *               data:
 *                 merchantId: "uuid-here"
 *                 currentStep: "documents"
 *                 completionPercent: 80
 *                 canSubmit: false
 *                 isSubmitted: false
 *                 missingItems:
 *                   - "Business Registration document"
 *                 sectionDetails:
 *                   account:
 *                     complete: true
 *                     label: "Account Created"
 *                   profile:
 *                     complete: true
 *                     label: "Merchant Profile"
 *                   address:
 *                     complete: true
 *                     label: "Business Address"
 *                   owners:
 *                     complete: true
 *                     label: "Owners & Directors"
 *                   documents:
 *                     complete: false
 *                     label: "Documents"
 *                     missing:
 *                       - "Business Registration document"
 *       403:
 *         description: Not authorized
 */
router.get('/api/onboarding/:merchantId/progress', auth, requireMerchantOwner, async (req, res) => {
  try {
    const progress = await progressService.calculateProgress(req.params.merchantId);
    return success(res, progress);
  } catch (error) {
    return serverError(res, error.message);
  }
});

// ============================================
// Owner/Director Endpoints
// ============================================

/**
 * @swagger
 * /api/onboarding/{merchantId}/owners:
 *   post:
 *     summary: Add beneficial owner/director
 *     description: Adds a new beneficial owner or director to the merchant
 *     tags: [Owners]
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
 *             $ref: '#/components/schemas/OwnerCreate'
 *           example:
 *             firstName: "John"
 *             lastName: "Smith"
 *             email: "john.smith@acme.com"
 *             phone: "+44 7700 900000"
 *             dateOfBirth: "1985-06-15"
 *             nationality: "British"
 *             role: "director"
 *             ownershipPercentage: 50
 *     responses:
 *       201:
 *         description: Owner added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Beneficial owner added"
 *                 data:
 *                   $ref: '#/components/schemas/Owner'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       403:
 *         description: Not authorized
 */
router.post(
  '/api/onboarding/:merchantId/owners',
  auth,
  requireMerchantOwner,
  validateBeneficialOwner,
  async (req, res) => {
    try {
      const owner = await onboardingService.addBeneficialOwner(req.params.merchantId, req.body);
      return success(res, owner, 'Beneficial owner added', 201);
    } catch (error) {
      return serverError(res, error.message);
    }
  }
);

/**
 * @swagger
 * /api/onboarding/{merchantId}/owners:
 *   get:
 *     summary: List all owners/directors
 *     description: Returns all beneficial owners and directors for a merchant
 *     tags: [Owners]
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
 *         description: List of owners
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Owner'
 *       403:
 *         description: Not authorized
 */
router.get('/api/onboarding/:merchantId/owners', auth, requireMerchantOwner, async (req, res) => {
  try {
    const owners = await onboardingService.getBeneficialOwners(req.params.merchantId);
    return success(res, owners);
  } catch (error) {
    return serverError(res, error.message);
  }
});

/**
 * @swagger
 * /api/onboarding/{merchantId}/owners/{ownerId}:
 *   patch:
 *     summary: Update owner/director
 *     description: Updates an existing beneficial owner or director
 *     tags: [Owners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: ownerId
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
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               ownershipPercentage:
 *                 type: number
 *           example:
 *             ownershipPercentage: 60
 *     responses:
 *       200:
 *         description: Owner updated successfully
 *       404:
 *         description: Owner not found
 *       403:
 *         description: Not authorized
 */
router.patch(
  '/api/onboarding/:merchantId/owners/:ownerId',
  auth,
  requireMerchantOwner,
  async (req, res) => {
    try {
      const owner = await onboardingService.updateBeneficialOwner(req.params.ownerId, req.body);
      return success(res, owner, 'Beneficial owner updated');
    } catch (error) {
      if (error.message === 'Beneficial owner not found') {
        return notFoundError(res, error.message);
      }
      return serverError(res, error.message);
    }
  }
);

/**
 * @swagger
 * /api/onboarding/{merchantId}/owners/{ownerId}:
 *   delete:
 *     summary: Delete owner/director
 *     description: Removes a beneficial owner or director from the merchant
 *     tags: [Owners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: ownerId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Owner deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Beneficial owner deleted"
 *       404:
 *         description: Owner not found
 *       403:
 *         description: Not authorized
 */
router.delete(
  '/api/onboarding/:merchantId/owners/:ownerId',
  auth,
  requireMerchantOwner,
  async (req, res) => {
    try {
      await onboardingService.deleteBeneficialOwner(req.params.ownerId, req.params.merchantId);
      return success(res, null, 'Beneficial owner deleted');
    } catch (error) {
      if (error.message === 'Beneficial owner not found') {
        return notFoundError(res, error.message);
      }
      return serverError(res, error.message);
    }
  }
);

// ============================================
// Document Metadata Endpoints
// ============================================

/**
 * @swagger
 * /api/onboarding/{merchantId}/documents:
 *   post:
 *     summary: Create document record
 *     description: Creates a document metadata record (file upload handled separately)
 *     tags: [Documents]
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
 *             $ref: '#/components/schemas/DocumentCreate'
 *           example:
 *             documentType: "id_proof"
 *             fileName: "passport.pdf"
 *             fileSize: 102400
 *             mimeType: "application/pdf"
 *     responses:
 *       201:
 *         description: Document record created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Document record created"
 *                 data:
 *                   $ref: '#/components/schemas/Document'
 *       400:
 *         description: Validation error
 *       403:
 *         description: Not authorized
 */
router.post(
  '/api/onboarding/:merchantId/documents',
  auth,
  requireMerchantOwner,
  validateDocumentUpload,
  async (req, res) => {
    try {
      const document = await documentService.createDocumentRecord(
        req.params.merchantId,
        req.body,
        req.user.id
      );
      return success(res, document, 'Document record created', 201);
    } catch (error) {
      return serverError(res, error.message);
    }
  }
);

/**
 * @swagger
 * /api/onboarding/{merchantId}/documents:
 *   get:
 *     summary: List merchant documents
 *     description: Returns all documents for a merchant with optional filters
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [id_proof, address_proof, business_registration, bank_statement]
 *         description: Filter by document type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [uploaded, pending_review, approved, rejected]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: List of documents
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Document'
 *       403:
 *         description: Not authorized
 */
router.get('/api/onboarding/:merchantId/documents', auth, requireMerchantOwner, async (req, res) => {
  try {
    const filters = {
      document_type: req.query.type,
      status: req.query.status
    };
    const documents = await documentService.listMerchantDocuments(req.params.merchantId, filters);
    return success(res, documents);
  } catch (error) {
    return serverError(res, error.message);
  }
});

// ============================================
// Submission Endpoint
// ============================================

/**
 * @swagger
 * /api/onboarding/{merchantId}/validate:
 *   get:
 *     summary: Validate submission rules
 *     description: Checks if the onboarding is ready for submission without actually submitting
 *     tags: [Submission]
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
 *         description: Validation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/SubmissionValidation'
 *             example:
 *               success: true
 *               data:
 *                 valid: false
 *                 errors:
 *                   - field: "documents"
 *                     message: "Missing required document: Business Registration"
 *                   - field: "owners"
 *                     message: "At least one beneficial owner required"
 *       403:
 *         description: Not authorized
 */
router.get(
  '/api/onboarding/:merchantId/validate',
  auth,
  requireMerchantOwner,
  async (req, res) => {
    try {
      const validation = await submissionService.validateSubmissionRules(req.params.merchantId);
      return success(res, validation);
    } catch (error) {
      return serverError(res, error.message);
    }
  }
);

/**
 * @swagger
 * /api/onboarding/{merchantId}/submit:
 *   post:
 *     summary: Submit onboarding for review
 *     description: Validates all rules and submits the onboarding for admin review
 *     tags: [Submission]
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
 *         description: Submission successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubmissionResult'
 *             example:
 *               success: true
 *               message: "Onboarding submitted for review"
 *               data:
 *                 merchantId: "uuid-here"
 *                 status: "under_review"
 *                 submittedAt: "2026-03-18T12:00:00.000Z"
 *       400:
 *         description: Validation failed - cannot submit
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Submission validation failed"
 *               errors:
 *                 - field: "documents"
 *                   message: "Missing required document: ID Proof"
 *       403:
 *         description: Not authorized
 */
router.post(
  '/api/onboarding/:merchantId/submit',
  auth,
  requireMerchantOwner,
  async (req, res) => {
    try {
      const result = await submissionService.processSubmission(
        req.params.merchantId,
        req.user.id
      );

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'SUBMISSION_VALIDATION_FAILED',
            message: 'Submission validation failed',
            fields: result.errors
          },
          warnings: result.warnings
        });
      }

      return success(res, result, 'Onboarding submitted for review');
    } catch (error) {
      return serverError(res, error.message);
    }
  }
);

module.exports = router;
