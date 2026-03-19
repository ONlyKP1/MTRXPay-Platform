/**
 * Webhook Processor Unit Tests
 * Day 6: Tests for webhook processing and idempotency
 */

const { query } = require('../../../src/config/database');

describe('Webhook Processor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Idempotency', () => {
    const { generateIdempotencyKey, checkIdempotency } = require('../../../src/modules/webhooks/idempotency');

    it('should generate consistent idempotency key for same payload', () => {
      const parsed = {
        provider: 'SUMSUB',
        providerApplicantId: 'applicant-123',
        eventType: 'APPLICANT_REVIEWED',
        decision: 'APPROVED',
        reviewStatus: 'completed'
      };

      const key1 = generateIdempotencyKey(parsed);
      const key2 = generateIdempotencyKey(parsed);

      expect(key1).toBe(key2);
    });

    it('should generate key with correct format', () => {
      const parsed = {
        provider: 'SUMSUB',
        providerApplicantId: 'applicant-123',
        eventType: 'APPLICANT_REVIEWED',
        decision: 'APPROVED'
      };

      const key = generateIdempotencyKey(parsed);
      expect(key).toMatch(/^SUMSUB:applicant-123:/);
    });

    it('should detect duplicate webhook', async () => {
      const existingEvent = { id: 'event-123', idempotency_key: 'existing-key' };

      query.mockResolvedValueOnce({ rows: [existingEvent] });

      const parsed = {
        provider: 'SUMSUB',
        providerApplicantId: 'applicant-123',
        eventType: 'APPLICANT_REVIEWED',
        decision: 'APPROVED'
      };

      const result = await checkIdempotency(parsed);

      expect(result.isDuplicate).toBe(true);
      expect(result.existingEvent).toEqual(existingEvent);
    });

    it('should allow new webhook', async () => {
      query.mockResolvedValueOnce({ rows: [] }); // No existing event

      const parsed = {
        provider: 'SUMSUB',
        providerApplicantId: 'applicant-123',
        eventType: 'APPLICANT_REVIEWED',
        decision: 'APPROVED'
      };

      const result = await checkIdempotency(parsed);

      expect(result.isDuplicate).toBe(false);
      expect(result.existingEvent).toBeNull();
    });
  });

  describe('Payload Parser', () => {
    const { parseWebhookPayload, INTERNAL_EVENT_TYPE, DECISION } = require('../../../src/modules/webhooks/payload.parser');

    it('should parse SumSub approved payload', () => {
      const rawPayload = {
        type: 'applicantReviewed',
        applicantId: 'sumsub-123',
        externalUserId: 'user-123',
        reviewStatus: 'completed',
        reviewResult: {
          reviewAnswer: 'GREEN'
        }
      };

      const result = parseWebhookPayload('SUMSUB', rawPayload);

      expect(result.providerApplicantId).toBe('sumsub-123');
      expect(result.decision).toBe(DECISION.APPROVED);
      expect(result.eventType).toBe(INTERNAL_EVENT_TYPE.APPLICANT_REVIEWED);
    });

    it('should parse SumSub rejected payload', () => {
      const rawPayload = {
        type: 'applicantReviewed',
        applicantId: 'sumsub-123',
        reviewStatus: 'completed',
        reviewResult: {
          reviewAnswer: 'RED',
          rejectLabels: ['DOCUMENT_FRAUD']
        }
      };

      const result = parseWebhookPayload('SUMSUB', rawPayload);

      expect(result.decision).toBe(DECISION.REJECTED);
      expect(result.rejectionReason).toContain('DOCUMENT_FRAUD');
    });

    it('should handle payload without reviewResult', () => {
      const rawPayload = {
        type: 'applicantCreated',
        applicantId: 'sumsub-123'
      };

      const result = parseWebhookPayload('SUMSUB', rawPayload);

      expect(result.providerApplicantId).toBe('sumsub-123');
      expect(result.decision).toBeNull();
    });
  });

  describe('User Lookup', () => {
    const { findUserFromWebhook } = require('../../../src/modules/webhooks/user.lookup');

    it('should find user by provider applicant ID', async () => {
      const user = { id: 'user-123' };
      // Only provider applicant ID lookup (no external user ID provided)
      query.mockResolvedValueOnce({ rows: [user] });

      const parsed = {
        providerApplicantId: 'sumsub-123',
        provider: 'SUMSUB'
      };

      const result = await findUserFromWebhook(parsed);

      expect(result.userId).toBe('user-123');
      expect(result.lookupMethod).toBe('PROVIDER_APPLICANT_ID');
    });

    it('should find user by external user ID when valid UUID', async () => {
      const user = { id: '550e8400-e29b-41d4-a716-446655440000' };
      // External user ID is checked first when it's a valid UUID
      query.mockResolvedValueOnce({ rows: [user] });

      const parsed = {
        providerApplicantId: 'sumsub-123',
        providerExternalUserId: '550e8400-e29b-41d4-a716-446655440000',
        provider: 'SUMSUB'
      };

      const result = await findUserFromWebhook(parsed);

      expect(result.userId).toBe('550e8400-e29b-41d4-a716-446655440000');
      expect(result.lookupMethod).toBe('EXTERNAL_USER_ID');
    });

    it('should return null for unknown applicant', async () => {
      // No external user ID, so only applicant ID lookup
      query.mockResolvedValueOnce({ rows: [] }); // No match by applicant ID

      const parsed = {
        providerApplicantId: 'unknown-123',
        provider: 'SUMSUB'
      };

      const result = await findUserFromWebhook(parsed);

      expect(result.userId).toBeNull();
    });
  });
});
