/**
 * Transaction Eligibility Service Unit Tests
 * Day 6: Tests for canUserTransact functionality
 */

const { query } = require('../../../src/config/database');
const { canUserTransact, INELIGIBILITY_REASON } = require('../../../src/services/transactionEligibility');

describe('Transaction Eligibility Service', () => {
  describe('canUserTransact', () => {
    it('should return true for approved user with KYC_APPROVED state', async () => {
      const user = {
        id: 'user-123',
        kyc_status: 'approved',
        user_state: 'KYC_APPROVED'
      };

      query.mockResolvedValueOnce({ rows: [user] });

      const result = await canUserTransact('user-123');

      expect(result.canTransact).toBe(true);
      expect(result.reason).toBeNull();
    });

    it('should return false for pending user', async () => {
      const user = {
        id: 'user-123',
        kyc_status: 'pending',
        user_state: 'KYC_PENDING'
      };

      query.mockResolvedValueOnce({ rows: [user] });

      const result = await canUserTransact('user-123');

      expect(result.canTransact).toBe(false);
      expect(result.reason).toBe(INELIGIBILITY_REASON.KYC_PENDING_REVIEW);
    });

    it('should return false for rejected user', async () => {
      const user = {
        id: 'user-123',
        kyc_status: 'rejected',
        user_state: 'KYC_REJECTED',
        kyc_rejection_reason: 'Document fraud'
      };

      query.mockResolvedValueOnce({ rows: [user] });

      const result = await canUserTransact('user-123');

      expect(result.canTransact).toBe(false);
      expect(result.reason).toBe(INELIGIBILITY_REASON.KYC_REJECTED);
    });

    it('should return false for not_started user', async () => {
      const user = {
        id: 'user-123',
        kyc_status: 'not_started',
        user_state: 'REGISTERED'
      };

      query.mockResolvedValueOnce({ rows: [user] });

      const result = await canUserTransact('user-123');

      expect(result.canTransact).toBe(false);
      expect(result.reason).toBe(INELIGIBILITY_REASON.KYC_NOT_STARTED);
    });

    it('should return false for in-progress KYC', async () => {
      const user = {
        id: 'user-123',
        kyc_status: 'started',
        user_state: 'KYC_STARTED'
      };

      query.mockResolvedValueOnce({ rows: [user] });

      const result = await canUserTransact('user-123');

      expect(result.canTransact).toBe(false);
      expect(result.reason).toBe(INELIGIBILITY_REASON.KYC_IN_PROGRESS);
    });

    it('should return false for non-existent user', async () => {
      query.mockResolvedValueOnce({ rows: [] });

      const result = await canUserTransact('nonexistent');

      expect(result.canTransact).toBe(false);
      expect(result.reason).toBe(INELIGIBILITY_REASON.USER_NOT_FOUND);
    });

    it('should accept user object directly', async () => {
      const user = {
        id: 'user-123',
        kyc_status: 'approved',
        user_state: 'KYC_APPROVED'
      };

      // No query mock needed - using user object directly
      const result = await canUserTransact(user);

      expect(result.canTransact).toBe(true);
    });

    it('should return false for approved status but wrong user_state', async () => {
      const user = {
        id: 'user-123',
        kyc_status: 'approved',
        user_state: 'KYC_PENDING' // Mismatch
      };

      query.mockResolvedValueOnce({ rows: [user] });

      const result = await canUserTransact('user-123');

      expect(result.canTransact).toBe(false);
      expect(result.reason).toBe(INELIGIBILITY_REASON.KYC_PENDING_REVIEW);
    });
  });
});
