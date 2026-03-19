/**
 * KYC Controller
 * Day 5: Verification endpoints
 */

const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { success, serverError } = require('../../utils/response');
const kycService = require('./kyc.service');

/**
 * @swagger
 * /api/kyc/start:
 *   post:
 *     summary: Start KYC verification
 *     description: Initiates KYC verification process for the authenticated user
 *     tags: [KYC]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: KYC verification started
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/api/kyc/start', auth, async (req, res) => {
  try {
    const kyc = await kycService.startKyc(req.user.id);
    return success(res, kyc, 'KYC verification started');
  } catch (error) {
    console.error('Start KYC error:', error);
    return serverError(res, 'Failed to start KYC verification', error);
  }
});

/**
 * @swagger
 * /api/kyc/status:
 *   get:
 *     summary: Get KYC verification status
 *     description: Returns the current KYC status with transaction eligibility
 *     tags: [KYC]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: KYC status retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       enum: [not_started, started, pending, approved, rejected, pending_manual_review]
 *                     userState:
 *                       type: string
 *                       enum: [REGISTERED, KYC_STARTED, KYC_PENDING, KYC_APPROVED, KYC_REJECTED]
 *                     canTransact:
 *                       type: boolean
 *                       description: True only when KYC is approved
 *                     reason:
 *                       type: string
 *                       description: Why user cannot transact (null if canTransact is true)
 *       401:
 *         description: Unauthorized
 */
router.get('/api/kyc/status', auth, async (req, res) => {
  try {
    const status = await kycService.getStatus(req.user.id);
    return success(res, status);
  } catch (error) {
    console.error('Get KYC status error:', error);
    return serverError(res, 'Failed to get KYC status', error);
  }
});

module.exports = router;
