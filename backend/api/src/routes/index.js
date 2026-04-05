const express = require('express');
const router = express.Router();

// Core routes
const healthRoutes = require('./health');

// Module routes
const authModule = require('../modules/auth');
const usersModule = require('../modules/users');
const merchantModule = require('../modules/merchant');
const onboardingModule = require('../modules/onboarding');
const documentsModule = require('../modules/documents');
const adminModule = require('../modules/admin');
const kycModule = require('../modules/kyc');
const webhooksModule = require('../modules/webhooks');
const transactionsModule = require('../modules/transactions');
const devWebhookRoutes = require('../modules/webhooks/dev.routes');
const providersRoutes = require('./providers.routes');

// Health check
router.use(healthRoutes);

// Webhook routes (no auth - uses signature verification)
router.use(webhooksModule.routes);

// API modules (auth required)
router.use(authModule.routes);
router.use(usersModule.routes);
router.use(merchantModule.routes);
router.use(onboardingModule.routes);
router.use(documentsModule.routes);
router.use(kycModule.routes);
router.use(transactionsModule.routes);
router.use('/api/providers', providersRoutes);
router.use(adminModule.routes);

// Dev routes (non-production only)
if (process.env.NODE_ENV !== 'production') {
  router.use('/dev', devWebhookRoutes);
}

module.exports = router;
