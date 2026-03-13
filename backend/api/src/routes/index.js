const express = require('express');
const router = express.Router();
const healthRoutes = require('./health');
const apiRoutes = require('./api');

// Routes
router.use(healthRoutes);
router.use(apiRoutes);

module.exports = router;
