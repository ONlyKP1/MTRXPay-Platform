const express = require('express');
const router = express.Router();
const healthRoutes = require('./health');

// Health check
router.use(healthRoutes);

module.exports = router;
