/**
 * Submission Service Unit Tests
 */

const { query } = require('../../../src/config/database');
const submissionService = require('../../../src/services/submissionService');

describe('Submission Service', () => {
  describe('validateSubmissionRules', () => {
    it('should pass validation when all requirements met', async () => {
      const merchant = mockMerchant({ industry_type: 'technology' });

      query
        .mockResolvedValueOnce({ rows: [merchant] }) // getMerchant
        .mockResolvedValueOnce({ rows: [mockAddress()] }) // getAddresses
        .mockResolvedValueOnce({ rows: [mockOwner()] }) // getOwners
        .mockResolvedValueOnce({ rows: [
          mockDocument({ document_type: 'id_proof' }),
          mockDocument({ document_type: 'business_registration' })
        ] }); // getDocuments

      const result = await submissionService.validateSubmissionRules('merchant-123');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when legal business name missing', async () => {
      const merchant = mockMerchant({ legal_business_name: '' });

      query
        .mockResolvedValueOnce({ rows: [merchant] })
        .mockResolvedValueOnce({ rows: [mockAddress()] })
        .mockResolvedValueOnce({ rows: [mockOwner()] })
        .mockResolvedValueOnce({ rows: [mockDocument({ document_type: 'id_proof' })] });

      const result = await submissionService.validateSubmissionRules('merchant-123');

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'legal_business_name')).toBe(true);
    });

    it('should fail when business type missing', async () => {
      const merchant = mockMerchant({ business_type: '' });

      query
        .mockResolvedValueOnce({ rows: [merchant] })
        .mockResolvedValueOnce({ rows: [mockAddress()] })
        .mockResolvedValueOnce({ rows: [mockOwner()] })
        .mockResolvedValueOnce({ rows: [mockDocument({ document_type: 'id_proof' })] });

      const result = await submissionService.validateSubmissionRules('merchant-123');

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'business_type')).toBe(true);
    });

    it('should require registration number for UK limited company', async () => {
      const merchant = mockMerchant({
        business_type: 'limited_company',
        country_of_incorporation: 'United Kingdom',
        registration_number: '',
        industry_type: 'tech'
      });

      query
        .mockResolvedValueOnce({ rows: [merchant] })
        .mockResolvedValueOnce({ rows: [mockAddress()] })
        .mockResolvedValueOnce({ rows: [mockOwner()] })
        .mockResolvedValueOnce({ rows: [
          mockDocument({ document_type: 'id_proof' }),
          mockDocument({ document_type: 'business_registration' })
        ] });

      const result = await submissionService.validateSubmissionRules('merchant-123');

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'registration_number')).toBe(true);
    });

    it('should fail when no registered address', async () => {
      const merchant = mockMerchant({ industry_type: 'tech' });

      query
        .mockResolvedValueOnce({ rows: [merchant] })
        .mockResolvedValueOnce({ rows: [] }) // no addresses
        .mockResolvedValueOnce({ rows: [mockOwner()] })
        .mockResolvedValueOnce({ rows: [
          mockDocument({ document_type: 'id_proof' }),
          mockDocument({ document_type: 'business_registration' })
        ] });

      const result = await submissionService.validateSubmissionRules('merchant-123');

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'address')).toBe(true);
    });

    it('should fail when owners required but missing', async () => {
      const merchant = mockMerchant({
        business_type: 'limited_company',
        industry_type: 'tech'
      });

      query
        .mockResolvedValueOnce({ rows: [merchant] })
        .mockResolvedValueOnce({ rows: [mockAddress()] })
        .mockResolvedValueOnce({ rows: [] }) // no owners
        .mockResolvedValueOnce({ rows: [
          mockDocument({ document_type: 'id_proof' }),
          mockDocument({ document_type: 'business_registration' })
        ] });

      const result = await submissionService.validateSubmissionRules('merchant-123');

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'owners')).toBe(true);
    });

    it('should fail when required documents missing', async () => {
      const merchant = mockMerchant({
        business_type: 'limited_company',
        industry_type: 'tech'
      });

      query
        .mockResolvedValueOnce({ rows: [merchant] })
        .mockResolvedValueOnce({ rows: [mockAddress()] })
        .mockResolvedValueOnce({ rows: [mockOwner()] })
        .mockResolvedValueOnce({ rows: [] }); // no documents

      const result = await submissionService.validateSubmissionRules('merchant-123');

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'documents')).toBe(true);
    });

    it('should fail when documents are rejected', async () => {
      const merchant = mockMerchant({ industry_type: 'tech' });

      query
        .mockResolvedValueOnce({ rows: [merchant] })
        .mockResolvedValueOnce({ rows: [mockAddress()] })
        .mockResolvedValueOnce({ rows: [mockOwner()] })
        .mockResolvedValueOnce({ rows: [
          mockDocument({ document_type: 'id_proof', status: 'rejected' }),
          mockDocument({ document_type: 'business_registration' })
        ] });

      const result = await submissionService.validateSubmissionRules('merchant-123');

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.message.includes('rejected'))).toBe(true);
    });

    it('should return not found error for missing merchant', async () => {
      query.mockResolvedValueOnce({ rows: [] });

      const result = await submissionService.validateSubmissionRules('nonexistent');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Merchant not found');
    });
  });

  describe('checkRegistrationRequired', () => {
    it('should require registration for UK limited company', () => {
      const merchant = {
        business_type: 'limited_company',
        country_of_incorporation: 'United Kingdom'
      };

      const result = submissionService.checkRegistrationRequired(merchant);

      expect(result).toBe(true);
    });

    it('should not require registration for sole trader', () => {
      const merchant = {
        business_type: 'sole_trader',
        country_of_incorporation: 'United Kingdom'
      };

      const result = submissionService.checkRegistrationRequired(merchant);

      expect(result).toBe(false);
    });

    it('should handle null country', () => {
      const merchant = {
        business_type: 'limited_company',
        country_of_incorporation: null
      };

      const result = submissionService.checkRegistrationRequired(merchant);

      expect(result).toBe(false);
    });
  });
});
