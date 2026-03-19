const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { validateMerchantProfile } = require('../../middleware/validate');
const { success, notFoundError, serverError, badRequest, forbiddenError, ERROR_CODES } = require('../../utils/response');
const merchantService = require('../../services/merchantService');

/**
 * @swagger
 * /api/merchants:
 *   post:
 *     summary: Create merchant profile
 *     description: Creates a new merchant profile for the authenticated user
 *     tags: [Merchants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MerchantCreate'
 *           example:
 *             legalBusinessName: "Acme Corporation Ltd"
 *             tradingName: "Acme Corp"
 *             businessType: "limited_company"
 *             countryOfIncorporation: "United Kingdom"
 *             registrationNumber: "12345678"
 *     responses:
 *       201:
 *         description: Merchant profile created successfully
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
 *                   example: "Merchant profile created"
 *                 data:
 *                   $ref: '#/components/schemas/Merchant'
 *       400:
 *         description: Validation error or user already has merchant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized - invalid or missing token
 */
router.post('/api/merchants', auth, validateMerchantProfile, async (req, res) => {
  try {
    // Check if user already has a merchant
    const existing = await merchantService.getMerchantForUser(req.user.id);
    if (existing) {
      return badRequest(res, 'User already has a merchant profile', 'MERCHANT_ALREADY_EXISTS');
    }

    const merchant = await merchantService.createMerchantProfile(req.body, req.user.id);
    return success(res, merchant, 'Merchant profile created', 201);
  } catch (error) {
    return serverError(res, error.message);
  }
});

/**
 * @swagger
 * /api/merchants/me:
 *   get:
 *     summary: Get current user's merchant profile
 *     description: Returns the merchant profile associated with the authenticated user
 *     tags: [Merchants]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Merchant profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Merchant'
 *       404:
 *         description: No merchant profile found for user
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "No merchant profile found"
 *       401:
 *         description: Unauthorized
 */
router.get('/api/merchants/me', auth, async (req, res) => {
  try {
    const merchant = await merchantService.getMerchantForUser(req.user.id);

    if (!merchant) {
      return notFoundError(res, 'No merchant profile found');
    }

    return success(res, merchant);
  } catch (error) {
    return serverError(res, error.message);
  }
});

/**
 * @swagger
 * /api/merchants/{merchantId}:
 *   patch:
 *     summary: Update merchant profile
 *     description: Updates an existing merchant profile. User must be the owner.
 *     tags: [Merchants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The merchant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MerchantUpdate'
 *           example:
 *             tradingName: "Acme Corp"
 *             industryType: "technology"
 *             businessDescription: "Software development services"
 *             websiteUrl: "https://acme.com"
 *     responses:
 *       200:
 *         description: Merchant profile updated successfully
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
 *                   example: "Merchant profile updated"
 *                 data:
 *                   $ref: '#/components/schemas/Merchant'
 *       403:
 *         description: Not authorized to update this merchant
 *       404:
 *         description: Merchant not found
 */
router.patch('/api/merchants/:merchantId', auth, async (req, res) => {
  try {
    const { merchantId } = req.params;

    // Verify user owns this merchant
    const userMerchant = await merchantService.getMerchantForUser(req.user.id);
    if (!userMerchant || userMerchant.id !== merchantId) {
      return forbiddenError(res, 'Not authorized to update this merchant', ERROR_CODES.ACCESS_DENIED);
    }

    const merchant = await merchantService.updateMerchantProfile(merchantId, req.body);
    return success(res, merchant, 'Merchant profile updated');
  } catch (error) {
    if (error.message === 'Merchant not found') {
      return notFoundError(res, error.message);
    }
    return serverError(res, error.message);
  }
});

/**
 * @swagger
 * /api/merchants/{merchantId}:
 *   get:
 *     summary: Get merchant by ID (public info)
 *     description: Returns limited public information about a merchant
 *     tags: [Merchants]
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The merchant ID
 *     responses:
 *       200:
 *         description: Merchant public info retrieved
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
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     business_name:
 *                       type: string
 *                     trading_name:
 *                       type: string
 *                     status:
 *                       type: string
 *       404:
 *         description: Merchant not found
 */
router.get('/api/merchants/:merchantId', async (req, res) => {
  try {
    const merchant = await merchantService.getMerchantById(req.params.merchantId);

    if (!merchant) {
      return notFoundError(res, 'Merchant not found');
    }

    // Return limited public info
    const publicInfo = {
      id: merchant.id,
      business_name: merchant.business_name,
      trading_name: merchant.trading_name,
      status: merchant.status
    };

    return success(res, publicInfo);
  } catch (error) {
    return serverError(res, error.message);
  }
});

module.exports = router;
