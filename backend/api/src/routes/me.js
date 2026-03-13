const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// GET /api/me - Get current user (mock for now, will use auth later)
router.get('/api/me', async (req, res) => {
  try {
    // For now, return the test merchant user
    const result = await query(
      'SELECT id, full_name, email, role, merchant_id, created_at FROM users WHERE email = $1',
      ['merchant@testcompany.com']
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
