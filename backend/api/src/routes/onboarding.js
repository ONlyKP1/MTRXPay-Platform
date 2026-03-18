const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { auth, requireMerchant } = require('../middleware/auth');
const { validateOnboarding } = require('../middleware/validate');

// GET /api/onboarding - Get onboarding for current user
router.get('/api/onboarding', auth, async (req, res) => {
  try {
    const { merchant_id } = req.user;

    // If user has no merchant_id, return empty state
    if (!merchant_id) {
      return res.json({
        status: 'not_started',
        data: null
      });
    }

    const result = await query(
      'SELECT id, merchant_id, status, submitted_at, reviewed_at, notes, updated_at FROM onboardings WHERE merchant_id = $1',
      [merchant_id]
    );

    if (result.rows.length === 0) {
      // Return default empty response if not yet created
      return res.json({
        status: 'not_started',
        data: null
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/onboarding - Create or update onboarding for current user
router.post('/api/onboarding', auth, validateOnboarding, async (req, res) => {
  try {
    let { merchant_id } = req.user;
    const { business_name, trading_name, notes } = req.body;

    // If user doesn't have a merchant, create one
    if (!merchant_id) {
      const merchantResult = await query(
        'INSERT INTO merchants (business_name, trading_name, status) VALUES ($1, $2, $3) RETURNING id',
        [business_name, trading_name || null, 'pending']
      );
      merchant_id = merchantResult.rows[0].id;

      // Link merchant to user
      await query(
        'UPDATE users SET merchant_id = $1, updated_at = NOW() WHERE id = $2',
        [merchant_id, req.user.id]
      );
    } else {
      // Update existing merchant
      await query(
        'UPDATE merchants SET business_name = $1, trading_name = $2, updated_at = NOW() WHERE id = $3',
        [business_name, trading_name || null, merchant_id]
      );
    }

    // Check if onboarding exists
    const existing = await query(
      'SELECT id FROM onboardings WHERE merchant_id = $1',
      [merchant_id]
    );

    let onboarding;
    if (existing.rows.length > 0) {
      // Update existing onboarding
      const result = await query(
        'UPDATE onboardings SET notes = $1, updated_at = NOW() WHERE merchant_id = $2 RETURNING *',
        [notes || null, merchant_id]
      );
      onboarding = result.rows[0];
    } else {
      // Create new onboarding
      const result = await query(
        'INSERT INTO onboardings (merchant_id, status, notes) VALUES ($1, $2, $3) RETURNING *',
        [merchant_id, 'draft', notes || null]
      );
      onboarding = result.rows[0];
    }

    res.status(201).json({
      onboarding,
      merchant_id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/onboarding - Update onboarding for current user
router.put('/api/onboarding', auth, requireMerchant, async (req, res) => {
  try {
    const { merchant_id } = req.user;
    const { business_name, trading_name, notes, status } = req.body;

    // Update merchant details if provided
    if (business_name) {
      await query(
        'UPDATE merchants SET business_name = $1, trading_name = $2, updated_at = NOW() WHERE id = $3',
        [business_name, trading_name || null, merchant_id]
      );
    }

    // Check onboarding exists
    const existing = await query(
      'SELECT id, status FROM onboardings WHERE merchant_id = $1',
      [merchant_id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Onboarding not found. Use POST to create.' });
    }

    // Only allow status changes to 'submitted' by user
    let newStatus = existing.rows[0].status;
    let submittedAt = null;
    if (status === 'submitted' && existing.rows[0].status === 'draft') {
      newStatus = 'submitted';
      submittedAt = new Date();
    }

    const result = await query(
      `UPDATE onboardings
       SET notes = COALESCE($1, notes),
           status = $2,
           submitted_at = COALESCE($3, submitted_at),
           updated_at = NOW()
       WHERE merchant_id = $4
       RETURNING *`,
      [notes, newStatus, submittedAt, merchant_id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
