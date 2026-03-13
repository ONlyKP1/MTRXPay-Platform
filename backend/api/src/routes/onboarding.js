const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// GET /api/onboarding/:merchantId - Get onboarding by merchant ID
router.get('/api/onboarding/:merchantId', async (req, res) => {
  try {
    const { merchantId } = req.params;

    const result = await query(
      'SELECT id, merchant_id, status, submitted_at, reviewed_at, notes FROM onboardings WHERE merchant_id = $1',
      [merchantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Onboarding not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
