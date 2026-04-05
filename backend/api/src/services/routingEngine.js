/**
 * Routing Engine Service
 * Day 7: Smart provider selection and orchestration
 *
 * Key principle: "We suggest, not force" - regulatory positioning
 * We provide recommendations but user always has choice
 */

const { query } = require('../config/database');
const {
  PROVIDER_TYPE,
  APPROVAL_RATE,
  getApprovalRateScore,
  calculateFee,
  calculateNetAmount,
  formatSettlementTime
} = require('../models/PaymentProvider');

/**
 * Scoring weights for provider ranking
 * These can be adjusted based on business priorities
 */
const SCORING_WEIGHTS = {
  FEE: 0.30,           // Lower fees = higher score
  APPROVAL_RATE: 0.35, // Higher approval = higher score
  SPEED: 0.20,         // Faster settlement = higher score
  MERCHANT_PREF: 0.15  // Merchant preferences
};

/**
 * Get speed label from settlement hours
 */
const getSpeedLabel = (minHours, maxHours) => {
  if (maxHours <= 24) return 'Fast';
  if (maxHours <= 48) return 'Standard';
  if (maxHours <= 72) return 'Slow';
  return 'Very Slow';
};

/**
 * Calculate speed score (0-100)
 */
const getSpeedScore = (minHours, maxHours) => {
  const avgHours = (minHours + maxHours) / 2;
  // 24h = 100, 96h = 0
  return Math.max(0, Math.min(100, 100 - ((avgHours - 24) / 72) * 100));
};

/**
 * Calculate fee score (0-100) - lower fees = higher score
 */
const getFeeScore = (feePercentage, allFees) => {
  const minFee = Math.min(...allFees);
  const maxFee = Math.max(...allFees);
  if (maxFee === minFee) return 100;
  return 100 - ((feePercentage - minFee) / (maxFee - minFee)) * 100;
};

/**
 * Fetch all active providers matching criteria
 */
const getActiveProviders = async (providerType, currency, country) => {
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
      fee_currency,
      approval_rate,
      approval_rate_value,
      settlement_hours_min,
      settlement_hours_max,
      supported_currencies,
      supported_countries,
      restricted_industries,
      preferred_industries,
      min_transaction,
      max_transaction,
      is_recommended,
      priority
    FROM payment_providers
    WHERE is_active = true
      AND (provider_type = $1 OR provider_type = 'BOTH')
      AND supported_currencies @> $2::jsonb
      AND supported_countries @> $3::jsonb
    ORDER BY priority ASC
  `, [providerType, JSON.stringify([currency]), JSON.stringify([country])]);

  return result.rows;
};

/**
 * Get merchant provider preferences
 */
const getMerchantPreferences = async (merchantId) => {
  if (!merchantId) return { preferred: [], blocked: [] };

  const result = await query(`
    SELECT
      provider_id,
      preference_type,
      custom_fee_percentage
    FROM merchant_provider_preferences
    WHERE merchant_id = $1
  `, [merchantId]);

  const preferred = [];
  const blocked = [];
  const customFees = {};

  for (const row of result.rows) {
    if (row.preference_type === 'PREFERRED') {
      preferred.push(row.provider_id);
    } else if (row.preference_type === 'BLOCKED') {
      blocked.push(row.provider_id);
    }
    if (row.custom_fee_percentage) {
      customFees[row.provider_id] = row.custom_fee_percentage;
    }
  }

  return { preferred, blocked, customFees };
};

/**
 * Apply routing rules to adjust provider scores
 */
const applyRoutingRules = async (providers, context) => {
  const { amount, currency, country, industry, merchantId } = context;

  const result = await query(`
    SELECT
      provider_id,
      conditions,
      score_modifier
    FROM routing_rules
    WHERE is_active = true
    ORDER BY priority ASC
  `);

  const modifiers = {};

  for (const rule of result.rows) {
    const conditions = rule.conditions;
    let matches = true;

    // Check each condition
    if (conditions.industry && conditions.industry !== industry) matches = false;
    if (conditions.country && conditions.country !== country) matches = false;
    if (conditions.currency && conditions.currency !== currency) matches = false;
    if (conditions.amount_min && amount < conditions.amount_min) matches = false;
    if (conditions.amount_max && amount > conditions.amount_max) matches = false;

    if (matches && rule.provider_id) {
      modifiers[rule.provider_id] = (modifiers[rule.provider_id] || 0) + rule.score_modifier;
    }
  }

  return modifiers;
};

/**
 * Check if provider can handle the transaction
 */
const isProviderEligible = (provider, amount, industry) => {
  // Check amount limits
  if (amount < provider.min_transaction) return false;
  if (amount > provider.max_transaction) return false;

  // Check industry restrictions
  const restricted = provider.restricted_industries || [];
  if (restricted.includes(industry)) return false;

  return true;
};

/**
 * Score and rank providers
 */
const scoreProviders = (providers, context, merchantPrefs, routingModifiers) => {
  const { amount, industry } = context;
  const allFees = providers.map(p => parseFloat(p.fee_percentage));

  const scored = providers
    .filter(p => isProviderEligible(p, amount, industry))
    .filter(p => !merchantPrefs.blocked.includes(p.id))
    .map(provider => {
      // Apply custom fee if negotiated
      const effectiveFee = merchantPrefs.customFees[provider.id]
        ? parseFloat(merchantPrefs.customFees[provider.id])
        : parseFloat(provider.fee_percentage);

      // Calculate component scores
      const feeScore = getFeeScore(effectiveFee, allFees);
      const approvalScore = getApprovalRateScore(provider.approval_rate);
      const speedScore = getSpeedScore(
        provider.settlement_hours_min,
        provider.settlement_hours_max
      );

      // Merchant preference bonus
      const prefScore = merchantPrefs.preferred.includes(provider.id) ? 100 : 50;

      // Calculate weighted score
      let totalScore =
        (feeScore * SCORING_WEIGHTS.FEE) +
        (approvalScore * SCORING_WEIGHTS.APPROVAL_RATE) +
        (speedScore * SCORING_WEIGHTS.SPEED) +
        (prefScore * SCORING_WEIGHTS.MERCHANT_PREF);

      // Apply routing rule modifiers
      if (routingModifiers[provider.id]) {
        totalScore += routingModifiers[provider.id];
      }

      // Industry preference bonus
      const preferredIndustries = provider.preferred_industries || [];
      if (preferredIndustries.includes(industry)) {
        totalScore += 10;
      }

      // Clamp score to 0-100
      totalScore = Math.max(0, Math.min(100, totalScore));

      return {
        provider,
        effectiveFee,
        feeScore,
        approvalScore,
        speedScore,
        totalScore: Math.round(totalScore)
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore);

  return scored;
};

/**
 * Build the orchestration response
 * Key: We "suggest" - user always has choice
 */
const buildOrchestrationResponse = (scoredProviders, amount) => {
  if (scoredProviders.length === 0) {
    return {
      recommended: null,
      options: [],
      message: 'No providers available for this transaction'
    };
  }

  const options = scoredProviders.map((scored, index) => {
    const { provider, effectiveFee, totalScore } = scored;
    const fee = calculateFee({
      fee_percentage: effectiveFee,
      fee_fixed: provider.fee_fixed
    }, amount);

    return {
      providerId: provider.id,
      providerCode: provider.code,
      name: provider.name,
      description: provider.description,
      logoUrl: provider.logo_url,

      // Fee information
      fee: fee,
      feePercentage: effectiveFee,
      feeDisplay: `${effectiveFee}%`,
      netAmount: calculateNetAmount({
        fee_percentage: effectiveFee,
        fee_fixed: provider.fee_fixed
      }, amount),

      // Performance info
      approvalRate: provider.approval_rate,
      approvalRateValue: provider.approval_rate_value,
      settlementTime: formatSettlementTime(
        provider.settlement_hours_min,
        provider.settlement_hours_max
      ),
      speedLabel: getSpeedLabel(
        provider.settlement_hours_min,
        provider.settlement_hours_max
      ),

      // Scoring
      score: totalScore,
      recommended: index === 0
    };
  });

  // Generate recommendation reason
  const topProvider = scoredProviders[0];
  let reason = 'Best overall match';

  if (topProvider.approvalScore >= 75) {
    reason = 'Highest approval rate for your profile';
  } else if (topProvider.feeScore >= 80) {
    reason = 'Best value with competitive fees';
  } else if (topProvider.speedScore >= 80) {
    reason = 'Fastest settlement time';
  }

  return {
    recommended: {
      providerId: topProvider.provider.id,
      providerCode: topProvider.provider.code,
      name: topProvider.provider.name,
      reason: reason
    },
    options: options,
    // Regulatory positioning: We suggest, not force
    disclaimer: 'This is a suggestion based on your profile. You may choose any available provider.'
  };
};

/**
 * Main orchestration function
 * Get provider recommendations for a transaction
 */
const getProviderRecommendations = async (request) => {
  const {
    amount,
    currency = 'GBP',
    country = 'GB',
    industry = null,
    merchantId = null,
    type = 'ONRAMP'
  } = request;

  // 1. Get active providers matching criteria
  const providers = await getActiveProviders(type, currency, country);

  if (providers.length === 0) {
    return {
      recommended: null,
      options: [],
      message: 'No providers available for this currency/country combination'
    };
  }

  // 2. Get merchant preferences
  const merchantPrefs = await getMerchantPreferences(merchantId);

  // 3. Get routing rule modifiers
  const routingModifiers = await applyRoutingRules(providers, {
    amount,
    currency,
    country,
    industry,
    merchantId
  });

  // 4. Score and rank providers
  const scoredProviders = scoreProviders(
    providers,
    { amount, industry },
    merchantPrefs,
    routingModifiers
  );

  // 5. Build response
  return buildOrchestrationResponse(scoredProviders, amount);
};

/**
 * Record route selection (audit trail)
 */
const recordRouteSelection = async (selection) => {
  const {
    transactionId,
    merchantId,
    userId,
    amount,
    currency,
    recommendedProviderId,
    recommendedReason,
    optionsPresented,
    selectedProviderId,
    userOverrodeRecommendation,
    outcome
  } = selection;

  const result = await query(`
    INSERT INTO route_selections (
      transaction_id,
      merchant_id,
      user_id,
      amount,
      currency,
      recommended_provider_id,
      recommended_reason,
      options_presented,
      selected_provider_id,
      user_overrode_recommendation,
      selection_outcome
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING id
  `, [
    transactionId,
    merchantId,
    userId,
    amount,
    currency,
    recommendedProviderId,
    recommendedReason,
    JSON.stringify(optionsPresented),
    selectedProviderId,
    userOverrodeRecommendation,
    outcome
  ]);

  return result.rows[0];
};

/**
 * Get provider by ID
 */
const getProviderById = async (providerId) => {
  const result = await query(`
    SELECT * FROM payment_providers WHERE id = $1
  `, [providerId]);
  return result.rows[0] || null;
};

/**
 * Get provider by code
 */
const getProviderByCode = async (code) => {
  const result = await query(`
    SELECT * FROM payment_providers WHERE code = $1
  `, [code]);
  return result.rows[0] || null;
};

module.exports = {
  getProviderRecommendations,
  recordRouteSelection,
  getProviderById,
  getProviderByCode,
  getActiveProviders,
  SCORING_WEIGHTS
};
