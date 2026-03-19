/**
 * KYC State Service Unit Tests
 * Day 6: Tests for KYC status transitions via webhooks
 */

const { query } = require('../../../src/config/database');
const { mapDecisionToFields, KYC_STATUS, USER_STATE } = require('../../../src/modules/webhooks/kyc.state.service');
const { DECISION } = require('../../../src/modules/webhooks/payload.parser');

describe('KYC State Service', () => {
  describe('mapDecisionToFields', () => {
    it('should map APPROVED decision correctly', () => {
      const result = mapDecisionToFields(DECISION.APPROVED);
      expect(result.kycStatus).toBe(KYC_STATUS.APPROVED);
      expect(result.userState).toBe(USER_STATE.KYC_APPROVED);
    });

    it('should map REJECTED decision correctly', () => {
      const result = mapDecisionToFields(DECISION.REJECTED, 'Document fraud');
      expect(result.kycStatus).toBe(KYC_STATUS.REJECTED);
      expect(result.userState).toBe(USER_STATE.KYC_REJECTED);
      expect(result.kycRejectionReason).toBe('Document fraud');
    });

    it('should map PENDING decision correctly', () => {
      const result = mapDecisionToFields(DECISION.PENDING);
      expect(result.kycStatus).toBe(KYC_STATUS.PENDING_MANUAL_REVIEW);
      expect(result.userState).toBe(USER_STATE.KYC_PENDING);
    });

    it('should map MANUAL_REVIEW decision correctly', () => {
      const result = mapDecisionToFields(DECISION.MANUAL_REVIEW);
      expect(result.kycStatus).toBe(KYC_STATUS.PENDING_MANUAL_REVIEW);
      expect(result.userState).toBe(USER_STATE.KYC_PENDING);
    });

    it('should return null for unknown decision', () => {
      const result = mapDecisionToFields('UNKNOWN');
      expect(result).toBeNull();
    });

    it('should include kycReviewedAt timestamp', () => {
      const result = mapDecisionToFields(DECISION.APPROVED);
      expect(result.kycReviewedAt).toBeInstanceOf(Date);
    });

    it('should clear rejection reason for approved', () => {
      const result = mapDecisionToFields(DECISION.APPROVED);
      expect(result.kycRejectionReason).toBeNull();
    });
  });

  describe('KYC_STATUS enum', () => {
    it('should have all expected statuses', () => {
      expect(KYC_STATUS.NOT_STARTED).toBe('not_started');
      expect(KYC_STATUS.STARTED).toBe('started');
      expect(KYC_STATUS.PENDING).toBe('pending');
      expect(KYC_STATUS.APPROVED).toBe('approved');
      expect(KYC_STATUS.REJECTED).toBe('rejected');
      expect(KYC_STATUS.PENDING_MANUAL_REVIEW).toBe('pending_manual_review');
    });
  });

  describe('USER_STATE enum', () => {
    it('should have all expected states', () => {
      expect(USER_STATE.REGISTERED).toBe('REGISTERED');
      expect(USER_STATE.KYC_STARTED).toBe('KYC_STARTED');
      expect(USER_STATE.KYC_PENDING).toBe('KYC_PENDING');
      expect(USER_STATE.KYC_APPROVED).toBe('KYC_APPROVED');
      expect(USER_STATE.KYC_REJECTED).toBe('KYC_REJECTED');
    });
  });
});
