const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// GET /api/merchant/:id - Get merchant by ID
router.get('/api/merchant/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT id, business_name, trading_name, status, created_at FROM merchants WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Merchant not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
