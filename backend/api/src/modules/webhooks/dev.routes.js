/**
 * Development Webhook Routes
 * These routes are ONLY available in non-production environments
 * They allow simulating webhook events without signature verification
 */

const express = require('express');
const router = express.Router();
const { processWebhook } = require('./webhook.processor');
const { parseWebhookPayload } = require('./payload.parser');
const { success, serverError, badRequest } = require('../../utils/response');

// Block all routes in production
router.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Route not found'
      }
    });
  }
  next();
});

/**
 * POST /api/dev/webhooks/simulate
 * Simulate a webhook event for testing
 *
 * Body:
 *   - event: 'approved' | 'rejected' | 'pending' | 'created'
 *   - userId: UUID (optional - the user to update)
 *   - applicantId: string (optional - custom applicant ID)
 *   - rejectReasons: string[] (optional - for rejected events)
 */
router.post('/webhooks/simulate', async (req, res) => {
  try {
    const { event, userId, applicantId, rejectReasons } = req.body;

    if (!event) {
      return badRequest(res, 'Event type is required');
    }

    const validEvents = ['approved', 'rejected', 'pending', 'created'];
    if (!validEvents.includes(event)) {
      return badRequest(res, `Invalid event. Valid events: ${validEvents.join(', ')}`);
    }

    // Build the simulated payload
    const payload = buildSimulatedPayload(event, {
      userId,
      applicantId: applicantId || `dev-applicant-${Date.now()}`,
      rejectReasons
    });

    // Parse the payload
    const parsed = parseWebhookPayload('SUMSUB', payload);

    // Process through the same pipeline as real webhooks
    const result = await processWebhook(parsed, payload);

    return success(res, {
      message: 'Webhook simulated successfully',
      event,
      payload,
      parsed,
      result
    });
  } catch (error) {
    console.error('[DEV WEBHOOK] Simulation error:', error);
    return serverError(res, 'Failed to simulate webhook');
  }
});

/**
 * POST /api/dev/webhooks/replay
 * Replay a raw webhook payload
 * Useful for replaying captured production payloads in dev
 */
router.post('/webhooks/replay', async (req, res) => {
  try {
    const { provider = 'SUMSUB', payload } = req.body;

    if (!payload) {
      return badRequest(res, 'Payload is required');
    }

    // Parse the payload
    const parsed = parseWebhookPayload(provider, payload);

    // Process through the webhook pipeline
    const result = await processWebhook(parsed, payload);

    return success(res, {
      message: 'Webhook replayed successfully',
      provider,
      parsed,
      result
    });
  } catch (error) {
    console.error('[DEV WEBHOOK] Replay error:', error);
    return serverError(res, 'Failed to replay webhook');
  }
});

/**
 * GET /api/dev/webhooks/templates
 * Get sample webhook payload templates
 */
router.get('/webhooks/templates', (req, res) => {
  const templates = {
    approved: buildSimulatedPayload('approved', { userId: '<USER_UUID>', applicantId: 'sample-123' }),
    rejected: buildSimulatedPayload('rejected', { userId: '<USER_UUID>', applicantId: 'sample-123', rejectReasons: ['DOCUMENT_FRAUD'] }),
    pending: buildSimulatedPayload('pending', { userId: '<USER_UUID>', applicantId: 'sample-123' }),
    created: buildSimulatedPayload('created', { userId: '<USER_UUID>', applicantId: 'sample-123' })
  };

  return success(res, {
    message: 'Available webhook templates',
    templates,
    usage: {
      simulate: 'POST /api/dev/webhooks/simulate with { event, userId, applicantId }',
      replay: 'POST /api/dev/webhooks/replay with { provider, payload }'
    }
  });
});

/**
 * Build a simulated webhook payload
 */
function buildSimulatedPayload(event, options = {}) {
  const { userId, applicantId, rejectReasons = ['DOCUMENT_FRAUD'] } = options;

  const base = {
    applicantId: applicantId || `dev-${Date.now()}`,
    inspectionId: `inspection-dev-${Date.now()}`,
    correlationId: `corr-dev-${Date.now()}`,
    externalUserId: userId || null,
    createdAt: new Date().toISOString()
  };

  switch (event) {
    case 'approved':
      return {
        ...base,
        type: 'applicantReviewed',
        reviewStatus: 'completed',
        reviewResult: {
          reviewAnswer: 'GREEN',
          label: 'APPROVED',
          reviewRejectType: null,
          rejectLabels: []
        }
      };

    case 'rejected':
      return {
        ...base,
        type: 'applicantReviewed',
        reviewStatus: 'completed',
        reviewResult: {
          reviewAnswer: 'RED',
          label: 'REJECTED',
          reviewRejectType: 'FINAL',
          rejectLabels: rejectReasons
        }
      };

    case 'pending':
      return {
        ...base,
        type: 'applicantPending',
        reviewStatus: 'pending',
        reviewResult: {
          reviewAnswer: 'YELLOW',
          label: 'PENDING',
          reviewRejectType: null,
          rejectLabels: []
        }
      };

    case 'created':
      return {
        ...base,
        type: 'applicantCreated',
        reviewStatus: null,
        reviewResult: null
      };

    default:
      return base;
  }
}

module.exports = router;
