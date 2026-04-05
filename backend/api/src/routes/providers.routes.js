/**
 * Provider Routes
 * Day 7: Payment provider and routing endpoints
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  getProviderRecommendations,
  recordRouteSelection,
  getProviderById,
  getProviderByCode,
  getActiveProviders
} = require('../services/routingEngine');
const { SELECTION_OUTCOME } = require('../models/PaymentProvider');
const { query } = require('../config/database');

/**
 * GET /api/providers
 * List all active providers
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const { type = 'ONRAMP', currency, country } = req.query;

    const result = await query(`
      SELECT
        id,
        code,
        name,
        description,
        logo_url,
        provider_type,
        fee_percentage,
        fee_fixed,
        approval_rate,
        approval_rate_value,
        settlement_hours_min,
        settlement_hours_max,
        supported_currencies,
        supported_countries,
        min_transaction,
        max_transaction,
        is_recommended
      FROM payment_providers
      WHERE is_active = true
        AND (provider_type = $1 OR provider_type = 'BOTH')
      ORDER BY priority ASC
    `, [type]);

    res.json({
      success: true,
      data: {
        providers: result.rows
      }
    });
  } catch (error) {
    console.error('Error fetching providers:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch providers' }
    });
  }
});

/**
 * GET /api/providers/:id
 * Get single provider details
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    // Try by ID first, then by code
    let provider = await getProviderById(id);
    if (!provider) {
      provider = await getProviderByCode(id);
    }

    if (!provider) {
      return res.status(404).json({
        success: false,
        error: { message: 'Provider not found' }
      });
    }

    res.json({
      success: true,
      data: { provider }
    });
  } catch (error) {
    console.error('Error fetching provider:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch provider' }
    });
  }
});

/**
 * POST /api/providers/recommend
 * Get provider recommendations for a transaction
 *
 * "We suggest, not force" - returns ranked options with recommendation
 */
router.post('/recommend', authenticate, async (req, res) => {
  try {
    const {
      amount,
      currency = 'GBP',
      country = 'GB',
      industry = null,
      type = 'ONRAMP'
    } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Valid amount is required' }
      });
    }

    // Get user's merchant ID if they have one
    const merchantId = req.user.merchant_id || null;

    const recommendations = await getProviderRecommendations({
      amount,
      currency,
      country,
      industry,
      merchantId,
      type
    });

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get provider recommendations' }
    });
  }
});

/**
 * POST /api/providers/select
 * Record user's provider selection
 *
 * Called when user picks a provider (whether recommended or not)
 */
router.post('/select', authenticate, async (req, res) => {
  try {
    const {
      transactionId,
      amount,
      currency,
      providerId,
      recommendedProviderId,
      recommendedReason,
      optionsPresented
    } = req.body;

    if (!providerId || !amount) {
      return res.status(400).json({
        success: false,
        error: { message: 'Provider ID and amount are required' }
      });
    }

    const userOverrode = recommendedProviderId && providerId !== recommendedProviderId;

    const selection = await recordRouteSelection({
      transactionId,
      merchantId: req.user.merchant_id,
      userId: req.user.id,
      amount,
      currency: currency || 'GBP',
      recommendedProviderId,
      recommendedReason,
      optionsPresented: optionsPresented || [],
      selectedProviderId: providerId,
      userOverrodeRecommendation: userOverrode,
      outcome: SELECTION_OUTCOME.ACCEPTED
    });

    // Get the selected provider details
    const provider = await getProviderById(providerId);

    res.json({
      success: true,
      data: {
        selectionId: selection.id,
        provider: provider,
        userOverrodeRecommendation: userOverrode
      }
    });
  } catch (error) {
    console.error('Error recording selection:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to record provider selection' }
    });
  }
});

/**
 * GET /api/providers/stats/selections
 * Get route selection analytics (for dashboards)
 */
router.get('/stats/selections', authenticate, async (req, res) => {
  try {
    const { days = 30 } = req.query;

    // Overall stats
    const statsResult = await query(`
      SELECT
        COUNT(*) as total_selections,
        COUNT(*) FILTER (WHERE user_overrode_recommendation = true) as overrides,
        COUNT(*) FILTER (WHERE selection_outcome = 'ACCEPTED') as accepted,
        COUNT(*) FILTER (WHERE selection_outcome = 'CANCELLED') as cancelled
      FROM route_selections
      WHERE created_at > NOW() - INTERVAL '1 day' * $1
    `, [days]);

    // Top selected providers
    const topProvidersResult = await query(`
      SELECT
        p.name,
        p.code,
        COUNT(*) as selection_count,
        COUNT(*) FILTER (WHERE rs.recommended_provider_id = rs.selected_provider_id) as recommended_and_selected
      FROM route_selections rs
      JOIN payment_providers p ON p.id = rs.selected_provider_id
      WHERE rs.created_at > NOW() - INTERVAL '1 day' * $1
      GROUP BY p.id, p.name, p.code
      ORDER BY selection_count DESC
      LIMIT 5
    `, [days]);

    const stats = statsResult.rows[0];
    const overrideRate = stats.total_selections > 0
      ? ((parseInt(stats.overrides) / parseInt(stats.total_selections)) * 100).toFixed(1)
      : 0;

    res.json({
      success: true,
      data: {
        period: `${days} days`,
        totalSelections: parseInt(stats.total_selections),
        overrideRate: `${overrideRate}%`,
        acceptedCount: parseInt(stats.accepted),
        cancelledCount: parseInt(stats.cancelled),
        topProviders: topProvidersResult.rows
      }
    });
  } catch (error) {
    console.error('Error fetching selection stats:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch selection statistics' }
    });
  }
});

module.exports = router;
