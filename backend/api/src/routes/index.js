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

// Health check
router.use(healthRoutes);

// API modules
router.use(authModule.routes);
router.use(usersModule.routes);
router.use(merchantModule.routes);
router.use(onboardingModule.routes);
router.use(documentsModule.routes);
router.use(adminModule.routes);

module.exports = router;
