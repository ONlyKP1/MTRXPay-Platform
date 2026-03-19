/**
 * User Lookup for Webhooks
 * Day 6: Find matching user from webhook payload
 */

const { query } = require('../../config/database');
const systemLogService = require('../../services/systemLogService');
const { LOG_SOURCE } = systemLogService;

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Find user by KYC provider applicant ID or external user ID
 * @param {object} parsed - Parsed webhook payload
 * @returns {object} { userId, lookupMethod, error }
 */
const findUserFromWebhook = async (parsed) => {
  const { providerApplicantId, providerExternalUserId, provider } = parsed;

  // Case 1: No identifiers provided
  if (!providerApplicantId && !providerExternalUserId) {
    await logUserLookupIssue('MISSING_APPLICANT_ID', {
      provider,
      message: 'Webhook received without applicant ID or external user ID'
    });

    return {
      userId: null,
      lookupMethod: null,
      error: 'MISSING_APPLICANT_ID'
    };
  }

  // Case 2: Try to find by external user ID (our user UUID)
  if (providerExternalUserId && UUID_REGEX.test(providerExternalUserId)) {
    const result = await query(
      'SELECT id FROM users WHERE id = $1',
      [providerExternalUserId]
    );

    if (result.rows.length > 0) {
      return {
        userId: result.rows[0].id,
        lookupMethod: 'EXTERNAL_USER_ID',
        error: null
      };
    }
  }

  // Case 3: Try to find by provider applicant ID
  if (providerApplicantId) {
    const result = await query(
      'SELECT id FROM users WHERE kyc_provider_applicant_id = $1',
      [providerApplicantId]
    );

    if (result.rows.length > 0) {
      return {
        userId: result.rows[0].id,
        lookupMethod: 'PROVIDER_APPLICANT_ID',
        error: null
      };
    }
  }

  // Case 4: User not found
  await logUserLookupIssue('USER_NOT_FOUND', {
    provider,
    providerApplicantId,
    providerExternalUserId,
    message: 'No matching user found for webhook'
  });

  return {
    userId: null,
    lookupMethod: null,
    error: 'USER_NOT_FOUND'
  };
};

/**
 * Check if webhook is a duplicate
 * @param {object} parsed - Parsed webhook payload
 * @returns {boolean}
 */
const isDuplicateWebhook = async (parsed) => {
  const { providerApplicantId, eventType, providerDecision, rawPayload } = parsed;

  if (!providerApplicantId) {
    return false;
  }

  // Check for exact same event in last 5 minutes
  const result = await query(
    `SELECT id FROM kyc_events
     WHERE provider = $1
     AND event_type = $2
     AND review_answer = $3
     AND payload->>'applicantId' = $4
     AND received_at > NOW() - INTERVAL '5 minutes'
     LIMIT 1`,
    [parsed.provider, eventType, providerDecision, providerApplicantId]
  );

  if (result.rows.length > 0) {
    await logUserLookupIssue('DUPLICATE_WEBHOOK', {
      provider: parsed.provider,
      providerApplicantId,
      eventType,
      message: 'Duplicate webhook detected within 5 minute window'
    });
    return true;
  }

  return false;
};

/**
 * Log user lookup issues to system_logs
 */
const logUserLookupIssue = async (issue, metadata) => {
  await systemLogService.log({
    action: `WEBHOOK_${issue}`,
    source: LOG_SOURCE.WEBHOOK_HANDLER,
    metadata
  });

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[WEBHOOK] ${issue}:`, metadata);
  }
};

module.exports = {
  findUserFromWebhook,
  isDuplicateWebhook
};
