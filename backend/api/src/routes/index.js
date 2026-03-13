const express = require('express');
const router = express.Router();
const healthRoutes = require('./health');
const apiRoutes = require('./api');
const meRoutes = require('./me');
const merchantRoutes = require('./merchant');
const onboardingRoutes = require('./onboarding');

// Routes
router.use(healthRoutes);
router.use(apiRoutes);
router.use(meRoutes);
router.use(merchantRoutes);
router.use(onboardingRoutes);

module.exports = router;
