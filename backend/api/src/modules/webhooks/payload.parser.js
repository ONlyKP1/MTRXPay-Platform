/**
 * Webhook Payload Parser
 * Day 6: Normalizes provider-specific payloads into clean internal format
 */

const { DECISION, INTERNAL_EVENT_TYPE } = require('../../shared/kycConstants');

/**
 * Map SumSub event types to internal event types
 */
const SUMSUB_EVENT_MAP = {
  'applicantCreated': INTERNAL_EVENT_TYPE.APPLICANT_CREATED,
  'applicantReviewed': INTERNAL_EVENT_TYPE.APPLICANT_REVIEWED,
  'applicantPending': INTERNAL_EVENT_TYPE.APPLICANT_PENDING,
  'applicantOnHold': INTERNAL_EVENT_TYPE.APPLICANT_ON_HOLD
};

/**
 * Map SumSub review answers to internal decisions
 */
const SUMSUB_DECISION_MAP = {
  'GREEN': DECISION.APPROVED,
  'RED': DECISION.REJECTED,
  'YELLOW': DECISION.MANUAL_REVIEW
};

/**
 * Parse SumSub webhook payload into internal format
 * @param {object} payload - Raw SumSub webhook payload
 * @returns {object} Normalized internal object
 */
const parseSumSubPayload = (payload) => {
  const {
    applicantId,
    externalUserId,
    type,
    reviewStatus,
    reviewResult
  } = payload;

  // Extract review answer and rejection reasons
  const reviewAnswer = reviewResult?.reviewAnswer || null;
  const rejectLabels = reviewResult?.rejectLabels || [];
  const reviewRejectType = reviewResult?.reviewRejectType || null;

  // Build rejection reason string if rejected
  let rejectionReason = null;
  if (reviewAnswer === 'RED' && rejectLabels.length > 0) {
    rejectionReason = rejectLabels.join(', ');
    if (reviewRejectType) {
      rejectionReason = `${reviewRejectType}: ${rejectionReason}`;
    }
  }

  return {
    // Provider info
    provider: 'SUMSUB',
    providerApplicantId: applicantId || null,
    providerExternalUserId: externalUserId || null,

    // Normalized event type
    eventType: SUMSUB_EVENT_MAP[type] || INTERNAL_EVENT_TYPE.UNKNOWN,
    providerEventType: type,

    // Decision info
    decision: reviewAnswer ? (SUMSUB_DECISION_MAP[reviewAnswer] || DECISION.UNKNOWN) : null,
    providerDecision: reviewAnswer,
    reviewStatus: reviewStatus || null,

    // Rejection details
    rejectionReason,
    rejectLabels,

    // Raw payload for audit
    rawPayload: payload
  };
};

/**
 * Parse webhook payload based on provider
 * @param {string} provider - Provider name (SUMSUB, etc.)
 * @param {object} payload - Raw webhook payload
 * @returns {object} Normalized internal object
 */
const parseWebhookPayload = (provider, payload) => {
  switch (provider.toUpperCase()) {
    case 'SUMSUB':
      return parseSumSubPayload(payload);

    default:
      // Return generic structure for unknown providers
      return {
        provider: provider.toUpperCase(),
        providerApplicantId: null,
        providerExternalUserId: null,
        eventType: INTERNAL_EVENT_TYPE.UNKNOWN,
        providerEventType: payload.type || null,
        decision: null,
        providerDecision: null,
        reviewStatus: null,
        rejectionReason: null,
        rejectLabels: [],
        rawPayload: payload
      };
  }
};

module.exports = {
  parseWebhookPayload,
  parseSumSubPayload,
  INTERNAL_EVENT_TYPE,
  DECISION
};
