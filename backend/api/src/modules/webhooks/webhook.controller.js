/**
 * Webhook Controller
 * Day 6: Handles incoming webhooks from external providers
 */

const crypto = require('crypto');
const env = require('../../config/env');
const { parseWebhookPayload, INTERNAL_EVENT_TYPE } = require('./payload.parser');
const { findUserFromWebhook } = require('./user.lookup');
const { checkIdempotency } = require('./idempotency');
const { processWebhookTransaction } = require('./webhook.processor');
const webhookLogger = require('./webhook.logger');

/**
 * Verify SumSub webhook signature
 * @param {object} req - Express request
 * @returns {boolean} - Whether signature is valid
 */
const verifySumSubSignature = (req) => {
  const signature = req.headers['x-payload-digest'];

  if (!signature) {
    return false;
  }

  // SumSub uses HMAC-SHA1 for webhook signatures
  const hmac = crypto.createHmac('sha1', env.SUMSUB_SECRET_KEY);
  const rawBody = req.rawBody || JSON.stringify(req.body);
  hmac.update(rawBody);
  const expectedSignature = hmac.digest('hex');

  // Check length first to avoid timing attack via length comparison
  if (signature.length !== expectedSignature.length) {
    return false;
  }

  // Use timing-safe comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
};

/**
 * Handle SumSub webhook
 * POST /api/webhooks/sumsub
 */
const handleSumSubWebhook = async (req, res) => {
  let applicantId = null;
  let userId = null;

  try {
    // Parse payload first to get applicantId for logging
    const parsed = parseWebhookPayload('SUMSUB', req.body);
    applicantId = parsed.providerApplicantId;

    // ============================================================
    // LOG: Webhook received
    // ============================================================
    await webhookLogger.logReceived(applicantId, parsed.providerEventType);

    // ============================================================
    // Verify signature
    // ============================================================
    if (!verifySumSubSignature(req)) {
      await webhookLogger.logSignatureFailed(applicantId);
      return res.status(401).json({
        success: false,
        error: {
          code: 'WEBHOOK_SIGNATURE_INVALID',
          message: 'Invalid webhook signature'
        }
      });
    }

    // LOG: Signature verified
    await webhookLogger.logSignatureVerified(applicantId);

    // ============================================================
    // IDEMPOTENCY CHECK: Prevent duplicate processing
    // ============================================================
    const { isDuplicate, existingEvent, idempotencyKey } = await checkIdempotency(parsed);

    if (isDuplicate) {
      await webhookLogger.logDuplicateIgnored(applicantId, existingEvent.id);
      return res.status(200).json({
        success: true,
        message: 'Duplicate webhook - already processed',
        existingEventId: existingEvent.id
      });
    }

    // ============================================================
    // Find matching user in database
    // ============================================================
    const { userId: foundUserId, lookupMethod } = await findUserFromWebhook(parsed);
    userId = foundUserId;

    if (userId) {
      await webhookLogger.logApplicantMatched(userId, applicantId, lookupMethod);
    } else {
      await webhookLogger.logApplicantNotMatched(applicantId);
    }

    // ============================================================
    // TRANSACTIONAL PROCESSING
    // ============================================================
    const { event, userUpdated, mappedFields } = await processWebhookTransaction({
      userId,
      parsed,
      idempotencyKey
    });

    // ============================================================
    // LOG: KYC decision outcome
    // ============================================================
    if (userUpdated && mappedFields) {
      switch (parsed.decision) {
        case 'APPROVED':
          await webhookLogger.logKycApproved(userId, applicantId, parsed.eventType);
          break;
        case 'REJECTED':
          await webhookLogger.logKycRejected(userId, applicantId, parsed.eventType, parsed.rejectionReason);
          break;
        case 'MANUAL_REVIEW':
        case 'PENDING':
          await webhookLogger.logKycPending(userId, applicantId, parsed.eventType);
          break;
      }
    }

    res.status(200).json({
      success: true,
      eventId: event.id,
      userUpdated
    });

  } catch (error) {
    // LOG: Processing failed
    await webhookLogger.logProcessingFailed(userId, applicantId, error);

    console.error('[WEBHOOK ERROR]', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'WEBHOOK_PROCESSING_FAILED',
        message: 'Webhook processing failed'
      }
    });
  }
};

module.exports = {
  handleSumSubWebhook,
  verifySumSubSignature
};
