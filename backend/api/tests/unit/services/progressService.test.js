/**
 * Progress Service Unit Tests
 */

const { query } = require('../../../src/config/database');
const progressService = require('../../../src/services/progressService');

describe('Progress Service', () => {
  describe('calculateProgress', () => {
    it('should calculate 100% when all sections complete', async () => {
      const merchant = mockMerchant({
        industry_type: 'technology',
        business_description: 'Test description'
      });

      query
        .mockResolvedValueOnce({ rows: [merchant] }) // getMerchantData
        .mockResolvedValueOnce({ rows: [mockAddress()] }) // getAddresses
        .mockResolvedValueOnce({ rows: [mockOwner()] }) // getOwners
        .mockResolvedValueOnce({ rows: [
          mockDocument({ document_type: 'id_proof' }),
          mockDocument({ document_type: 'business_registration' })
        ] }) // getDocuments
        .mockResolvedValueOnce({ rows: [{ is_submitted: false }] }); // getProgressRecord

      const result = await progressService.calculateProgress('merchant-123');

      expect(result.completionPercent).toBe(100);
      expect(result.canSubmit).toBe(true);
      expect(result.missingItems).toHaveLength(0);
    });

    it('should show missing items when profile incomplete', async () => {
      const incompleteMerchant = mockMerchant({
        industry_type: null,
        business_description: null
      });

      query
        .mockResolvedValueOnce({ rows: [incompleteMerchant] })
        .mockResolvedValueOnce({ rows: [] }) // no addresses
        .mockResolvedValueOnce({ rows: [] }) // no owners
        .mockResolvedValueOnce({ rows: [] }) // no documents
        .mockResolvedValueOnce({ rows: [] }); // no progress record

      const result = await progressService.calculateProgress('merchant-123');

      expect(result.completionPercent).toBeLessThan(100);
      expect(result.canSubmit).toBe(false);
      expect(result.missingItems.length).toBeGreaterThan(0);
    });

    it('should throw error when merchant not found', async () => {
      // Mock all 5 queries that Promise.all calls
      query
        .mockResolvedValueOnce({ rows: [] }) // getMerchantData - empty
        .mockResolvedValueOnce({ rows: [] }) // getAddresses
        .mockResolvedValueOnce({ rows: [] }) // getOwners
        .mockResolvedValueOnce({ rows: [] }) // getDocuments
        .mockResolvedValueOnce({ rows: [] }); // getProgressRecord

      await expect(
        progressService.calculateProgress('nonexistent')
      ).rejects.toThrow('Merchant not found');
    });

    it('should identify missing registered address', async () => {
      const merchant = mockMerchant({ industry_type: 'tech' });

      query
        .mockResolvedValueOnce({ rows: [merchant] })
        .mockResolvedValueOnce({ rows: [] }) // no addresses
        .mockResolvedValueOnce({ rows: [mockOwner()] })
        .mockResolvedValueOnce({ rows: [mockDocument({ document_type: 'id_proof' }), mockDocument({ document_type: 'business_registration' })] })
        .mockResolvedValueOnce({ rows: [{ is_submitted: false, completed_steps: [] }] });

      const result = await progressService.calculateProgress('merchant-123');

      expect(result.sectionDetails.address.complete).toBe(false);
      expect(result.sectionDetails.address.missing).toContain('Registered business address');
    });

    it('should require owners for company types', async () => {
      const merchant = mockMerchant({
        business_type: 'limited_company',
        industry_type: 'tech'
      });

      query
        .mockResolvedValueOnce({ rows: [merchant] })
        .mockResolvedValueOnce({ rows: [mockAddress()] })
        .mockResolvedValueOnce({ rows: [] }) // no owners
        .mockResolvedValueOnce({ rows: [mockDocument({ document_type: 'id_proof' }), mockDocument({ document_type: 'business_registration' })] })
        .mockResolvedValueOnce({ rows: [{ is_submitted: false, completed_steps: [] }] });

      const result = await progressService.calculateProgress('merchant-123');

      expect(result.sectionDetails.owners.complete).toBe(false);
      expect(result.sectionDetails.owners.required).toBe(true);
    });

    it('should not require owners for sole trader', async () => {
      const merchant = mockMerchant({
        business_type: 'sole_trader',
        industry_type: 'tech'
      });

      query
        .mockResolvedValueOnce({ rows: [merchant] })
        .mockResolvedValueOnce({ rows: [mockAddress()] })
        .mockResolvedValueOnce({ rows: [] }) // no owners - that's ok for sole trader
        .mockResolvedValueOnce({ rows: [mockDocument({ document_type: 'id_proof' }), mockDocument({ document_type: 'business_registration' })] })
        .mockResolvedValueOnce({ rows: [{ is_submitted: false }] });

      const result = await progressService.calculateProgress('merchant-123');

      expect(result.sectionDetails.owners.required).toBe(false);
      expect(result.sectionDetails.owners.complete).toBe(true);
    });

    it('should identify missing documents', async () => {
      const merchant = mockMerchant({ industry_type: 'tech' });

      query
        .mockResolvedValueOnce({ rows: [merchant] })
        .mockResolvedValueOnce({ rows: [mockAddress()] })
        .mockResolvedValueOnce({ rows: [mockOwner()] })
        .mockResolvedValueOnce({ rows: [] }) // no documents
        .mockResolvedValueOnce({ rows: [{ is_submitted: false }] });

      const result = await progressService.calculateProgress('merchant-123');

      expect(result.sectionDetails.documents.complete).toBe(false);
      expect(result.sectionDetails.documents.missing.length).toBeGreaterThan(0);
    });
  });

  describe('getProgressSummary', () => {
    it('should return simplified progress summary', async () => {
      const merchant = mockMerchant({ industry_type: 'technology' });

      query
        .mockResolvedValueOnce({ rows: [merchant] })
        .mockResolvedValueOnce({ rows: [mockAddress()] })
        .mockResolvedValueOnce({ rows: [mockOwner()] })
        .mockResolvedValueOnce({ rows: [
          mockDocument({ document_type: 'id_proof' }),
          mockDocument({ document_type: 'business_registration' })
        ] })
        .mockResolvedValueOnce({ rows: [{ is_submitted: false }] });

      const result = await progressService.getProgressSummary('merchant-123');

      expect(result).toHaveProperty('currentStep');
      expect(result).toHaveProperty('completedSteps');
      expect(result).toHaveProperty('completionPercent');
      expect(result).toHaveProperty('missingItems');
      expect(result).toHaveProperty('canSubmit');
    });
  });
});
