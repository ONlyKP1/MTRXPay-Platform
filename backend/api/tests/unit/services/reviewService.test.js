/**
 * Review Service Unit Tests
 */

const { query } = require('../../../src/config/database');
const reviewService = require('../../../src/services/reviewService');

describe('Review Service', () => {
  describe('markUnderReview', () => {
    it('should transition merchant to under_review status from draft', async () => {
      const merchant = mockMerchant({ status: 'draft' });
      const updatedMerchant = { ...merchant, status: 'under_review' };

      query
        .mockResolvedValueOnce({ rows: [merchant] }) // get merchant
        .mockResolvedValueOnce({ rows: [updatedMerchant] }) // update status
        .mockResolvedValueOnce({ rows: [] }) // update kyc submission
        .mockResolvedValueOnce({ rows: [{ id: 'audit-123' }] }); // audit log

      const result = await reviewService.markUnderReview('merchant-123', 'admin-123');

      expect(result.status).toBe('under_review');
    });

    it('should transition merchant to under_review from pending_submission', async () => {
      const merchant = mockMerchant({ status: 'pending_submission' });
      const updatedMerchant = { ...merchant, status: 'under_review' };

      query
        .mockResolvedValueOnce({ rows: [merchant] }) // get merchant
        .mockResolvedValueOnce({ rows: [updatedMerchant] }) // update status
        .mockResolvedValueOnce({ rows: [] }) // update kyc submission
        .mockResolvedValueOnce({ rows: [{ id: 'audit-123' }] }); // audit log

      const result = await reviewService.markUnderReview('merchant-123', 'admin-123');

      expect(result.status).toBe('under_review');
    });

    it('should reject if merchant already under_review', async () => {
      const merchant = mockMerchant({ status: 'under_review' });
      query.mockResolvedValueOnce({ rows: [merchant] });

      await expect(
        reviewService.markUnderReview('merchant-123', 'admin-123')
      ).rejects.toThrow('Cannot move to under_review');
    });

    it('should throw error for non-existent merchant', async () => {
      query.mockResolvedValueOnce({ rows: [] });

      await expect(
        reviewService.markUnderReview('nonexistent', 'admin-123')
      ).rejects.toThrow('Merchant not found');
    });
  });

  describe('markApproved', () => {
    it('should approve merchant under review', async () => {
      const merchant = mockMerchant({ status: 'under_review' });
      const approvedMerchant = { ...merchant, status: 'approved' };

      query
        .mockResolvedValueOnce({ rows: [merchant] }) // get merchant
        .mockResolvedValueOnce({ rows: [approvedMerchant] }) // update status
        .mockResolvedValueOnce({ rows: [] }) // update kyc submission
        .mockResolvedValueOnce({ rows: [{ id: 'note-123' }] }) // add review note
        .mockResolvedValueOnce({ rows: [{ id: 'audit-note' }] }) // audit for note
        .mockResolvedValueOnce({ rows: [{ id: 'audit-123' }] }); // audit log

      const result = await reviewService.markApproved('merchant-123', 'admin-123', {
        notes: 'All documents verified'
      });

      expect(result.status).toBe('approved');
      expect(result.merchant.status).toBe('approved');
    });

    it('should reject approval for non-review status', async () => {
      const merchant = mockMerchant({ status: 'draft' });
      query.mockResolvedValueOnce({ rows: [merchant] });

      await expect(
        reviewService.markApproved('merchant-123', 'admin-123')
      ).rejects.toThrow('Cannot approve');
    });

    it('should throw error for non-existent merchant', async () => {
      query.mockResolvedValueOnce({ rows: [] });

      await expect(
        reviewService.markApproved('nonexistent', 'admin-123')
      ).rejects.toThrow('Merchant not found');
    });
  });

  describe('markRejected', () => {
    it('should reject merchant with reason', async () => {
      const merchant = mockMerchant({ status: 'under_review' });
      const rejectedMerchant = { ...merchant, status: 'rejected' };

      query
        .mockResolvedValueOnce({ rows: [merchant] }) // get merchant
        .mockResolvedValueOnce({ rows: [rejectedMerchant] }) // update status
        .mockResolvedValueOnce({ rows: [] }) // update kyc submission
        .mockResolvedValueOnce({ rows: [] }) // reset onboarding progress
        .mockResolvedValueOnce({ rows: [{ id: 'note-123' }] }) // add review note
        .mockResolvedValueOnce({ rows: [{ id: 'audit-note' }] }) // audit for note
        .mockResolvedValueOnce({ rows: [{ id: 'audit-123' }] }); // audit log

      const result = await reviewService.markRejected('merchant-123', 'admin-123', {
        reason: 'Invalid business registration'
      });

      expect(result.status).toBe('rejected');
    });

    it('should require rejection reason', async () => {
      // Note: This throws before any DB query is made, so no mock needed
      await expect(
        reviewService.markRejected('merchant-123', 'admin-123', {})
      ).rejects.toThrow('Rejection reason is required');
    });

    it('should reject from non-review status', async () => {
      const merchant = mockMerchant({ status: 'approved' });
      query.mockResolvedValueOnce({ rows: [merchant] });

      await expect(
        reviewService.markRejected('merchant-123', 'admin-123', {
          reason: 'Test reason'
        })
      ).rejects.toThrow('Cannot reject');
    });
  });

  describe('addReviewNote', () => {
    it('should add internal review note', async () => {
      const note = {
        id: 'note-123',
        merchant_id: 'merchant-123',
        notes: '[2026-03-18] Verified business registration'
      };

      query
        .mockResolvedValueOnce({ rows: [note] }) // insert note
        .mockResolvedValueOnce({ rows: [{ id: 'audit-123' }] }); // audit log

      const result = await reviewService.addReviewNote(
        'merchant-123',
        'admin-123',
        'Verified business registration',
        'internal'
      );

      expect(result).toBeTruthy();
      expect(result.notes).toContain('Verified business registration');
    });

    it('should return null for empty note', async () => {
      const result = await reviewService.addReviewNote(
        'merchant-123',
        'admin-123',
        '',
        'internal'
      );

      expect(result).toBeNull();
    });
  });

  describe('getReviewHistory', () => {
    it('should return review history for merchant', async () => {
      const submissions = [
        { id: 'sub-1', status: 'approved', created_at: new Date().toISOString() },
        { id: 'sub-2', status: 'pending', created_at: new Date().toISOString() }
      ];
      const auditLogs = [
        { action: 'MERCHANT_APPROVED', created_at: new Date().toISOString() }
      ];

      query
        .mockResolvedValueOnce({ rows: submissions }) // get submissions
        .mockResolvedValueOnce({ rows: auditLogs }); // get audit logs

      const result = await reviewService.getReviewHistory('merchant-123');

      expect(result.submissions).toHaveLength(2);
      expect(result.auditLogs).toHaveLength(1);
    });
  });

  describe('getPendingReview', () => {
    it('should return merchants pending review', async () => {
      const merchants = [
        mockMerchant({ id: 'merchant-1', status: 'under_review' }),
        mockMerchant({ id: 'merchant-2', status: 'under_review' })
      ];

      query
        .mockResolvedValueOnce({ rows: merchants }) // get merchants
        .mockResolvedValueOnce({ rows: [{ total: '2' }] }); // count

      const result = await reviewService.getPendingReview();

      expect(result.merchants).toHaveLength(2);
      expect(result.total).toBe(2);
    });
  });

  describe('reviewDocument', () => {
    it('should approve document', async () => {
      const document = mockDocument({ status: 'approved' });

      query
        .mockResolvedValueOnce({ rows: [document] }) // update document
        .mockResolvedValueOnce({ rows: [{ id: 'audit-123' }] }); // audit log

      const result = await reviewService.reviewDocument(
        'doc-123',
        'admin-123',
        'approved',
        'Document verified'
      );

      expect(result.status).toBe('approved');
    });

    it('should reject invalid status', async () => {
      await expect(
        reviewService.reviewDocument('doc-123', 'admin-123', 'invalid')
      ).rejects.toThrow('Invalid document status');
    });

    it('should throw error for non-existent document', async () => {
      query.mockResolvedValueOnce({ rows: [] });

      await expect(
        reviewService.reviewDocument('nonexistent', 'admin-123', 'approved')
      ).rejects.toThrow('Document not found');
    });
  });
});
