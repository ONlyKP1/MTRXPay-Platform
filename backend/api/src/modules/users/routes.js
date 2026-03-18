const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { query } = require('../../config/database');

// GET /api/me - Get current authenticated user
router.get('/api/me', auth, async (req, res) => {
  res.json(req.user);
});

// GET /api/users/:id - Get user by ID (admin only)
router.get('/api/users/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const result = await query(
      'SELECT id, full_name, email, role, merchant_id, created_at FROM users WHERE id = $1',
      [id]
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
