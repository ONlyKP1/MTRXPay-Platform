/**
 * Webhooks Module
 * Day 6: External provider webhooks
 */

const express = require('express');
const router = express.Router();
const webhookRoutes = require('./webhook.routes');

// Mount webhook routes at /api/webhooks
router.use('/api/webhooks', webhookRoutes);

module.exports = {
  routes: router
};
