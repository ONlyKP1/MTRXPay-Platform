/**
 * Mock KYC Provider
 * Day 5: Provider abstraction layer
 *
 * This is where SumSub plugs in (Day 6)
 */

const { KycStatus } = require('../kyc.model');

class MockKycProvider {
  /**
   * Create a verification session for user
   * @param {object} user - User object
   * @returns {object} Provider response with reference and status
   */
  async createVerification(user) {
    return {
      providerRef: 'mock_' + user.id,
      status: KycStatus.IN_PROGRESS
    };
  }

  /**
   * Get verification status from provider
   * @param {string} providerRef - Provider reference ID
   * @returns {object} Current status
   */
  async getVerificationStatus(providerRef) {
    return {
      providerRef,
      status: KycStatus.IN_PROGRESS
    };
  }

  /**
   * Generate verification URL for user
   * Mock returns a placeholder URL
   * @param {object} user - User object
   * @param {string} providerRef - Provider reference ID
   * @returns {string} Verification URL
   */
  async getVerificationUrl(user, providerRef) {
    return `https://mock-kyc.example.com/verify/${providerRef}`;
  }

  /**
   * Handle webhook from provider
   * Mock implementation for testing
   * @param {object} payload - Webhook payload
   * @returns {object} Processed result
   */
  async handleWebhook(payload) {
    return {
      providerRef: payload.providerRef,
      status: payload.status || KycStatus.APPROVED,
      reviewResult: payload.reviewResult || 'GREEN'
    };
  }

  /**
   * Simulate approval (for testing)
   * @param {string} providerRef - Provider reference ID
   * @returns {object} Approved status
   */
  async simulateApproval(providerRef) {
    return {
      providerRef,
      status: KycStatus.APPROVED,
      reviewResult: 'GREEN'
    };
  }

  /**
   * Simulate rejection (for testing)
   * @param {string} providerRef - Provider reference ID
   * @param {string} reason - Rejection reason
   * @returns {object} Rejected status
   */
  async simulateRejection(providerRef, reason = 'Document verification failed') {
    return {
      providerRef,
      status: KycStatus.REJECTED,
      reviewResult: 'RED',
      reason
    };
  }
}

module.exports = MockKycProvider;
