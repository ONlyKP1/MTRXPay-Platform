const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// GET /api/me - Get current authenticated user
router.get('/api/me', auth, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
