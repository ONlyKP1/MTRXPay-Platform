/**
 * Webhook Routes
 * Day 6: Public webhook endpoints (no auth middleware)
 */

const express = require('express');
const router = express.Router();
const webhookController = require('./webhook.controller');

/**
 * POST /api/webhooks/sumsub
 * Receives webhooks from SumSub KYC provider
 * Protected by signature verification, NOT user auth
 */
router.post('/sumsub', webhookController.handleSumSubWebhook);

module.exports = router;
