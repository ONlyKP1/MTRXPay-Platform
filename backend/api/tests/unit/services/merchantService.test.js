/**
 * Merchant Service Unit Tests
 */

const { query } = require('../../../src/config/database');
const merchantService = require('../../../src/services/merchantService');

describe('Merchant Service', () => {
  describe('createMerchantProfile', () => {
    it('should create a merchant profile and link to user', async () => {
      const mockMerchantData = mockMerchant();

      query
        .mockResolvedValueOnce({ rows: [mockMerchantData] }) // INSERT merchant
        .mockResolvedValueOnce({ rows: [] }); // UPDATE user

      const data = {
        legal_business_name: 'Test Company Ltd',
        business_type: 'limited_company',
        country_of_incorporation: 'United Kingdom'
      };

      const result = await merchantService.createMerchantProfile(data, 'user-123');

      expect(result).toEqual(mockMerchantData);
      expect(query).toHaveBeenCalledTimes(2);
    });
  });

  describe('getMerchantById', () => {
    it('should return merchant when found', async () => {
      const mockMerchantData = mockMerchant();
      query.mockResolvedValueOnce({ rows: [mockMerchantData] });

      const result = await merchantService.getMerchantById('merchant-123');

      expect(result).toEqual(mockMerchantData);
      expect(query).toHaveBeenCalledWith(
        'SELECT * FROM merchants WHERE id = $1',
        ['merchant-123']
      );
    });

    it('should return null when merchant not found', async () => {
      query.mockResolvedValueOnce({ rows: [] });

      const result = await merchantService.getMerchantById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('getMerchantForUser', () => {
    it('should return merchant for user', async () => {
      const mockMerchantData = mockMerchant();
      query.mockResolvedValueOnce({ rows: [mockMerchantData] });

      const result = await merchantService.getMerchantForUser('user-123');

      expect(result).toEqual(mockMerchantData);
    });

    it('should return null when user has no merchant', async () => {
      query.mockResolvedValueOnce({ rows: [] });

      const result = await merchantService.getMerchantForUser('user-no-merchant');

      expect(result).toBeNull();
    });
  });

  describe('updateMerchantProfile', () => {
    it('should update merchant fields', async () => {
      const updatedMerchant = mockMerchant({ trading_name: 'New Trading Name' });
      query.mockResolvedValueOnce({ rows: [updatedMerchant] });

      const result = await merchantService.updateMerchantProfile('merchant-123', {
        trading_name: 'New Trading Name'
      });

      expect(result.trading_name).toBe('New Trading Name');
    });

    it('should throw error when merchant not found', async () => {
      query.mockResolvedValueOnce({ rows: [] });

      await expect(
        merchantService.updateMerchantProfile('nonexistent', { trading_name: 'Test' })
      ).rejects.toThrow('Merchant not found');
    });
  });

  describe('updateMerchantStatus', () => {
    it('should update merchant status', async () => {
      const updatedMerchant = mockMerchant({ status: 'approved' });
      query.mockResolvedValueOnce({ rows: [updatedMerchant] });

      const result = await merchantService.updateMerchantStatus('merchant-123', 'approved');

      expect(result.status).toBe('approved');
    });

    it('should throw error for invalid status', async () => {
      await expect(
        merchantService.updateMerchantStatus('merchant-123', 'invalid_status')
      ).rejects.toThrow('Invalid merchant status');
    });
  });
});
