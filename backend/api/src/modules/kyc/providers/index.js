/**
 * KYC Provider Factory
 * Day 5: Provider abstraction layer
 *
 * Switch providers by changing KYC_PROVIDER env var
 * Day 6: Add SumSub provider here
 */

const MockKycProvider = require('./mock.provider');

const providers = {
  MOCK: MockKycProvider,
  // SUMSUB: SumSubProvider, // Day 6
};

/**
 * Get KYC provider instance
 * @param {string} providerName - Provider name (defaults to env var or MOCK)
 * @returns {object} Provider instance
 */
const getProvider = (providerName) => {
  const name = providerName || process.env.KYC_PROVIDER || 'MOCK';
  const Provider = providers[name];

  if (!Provider) {
    throw new Error(`Unknown KYC provider: ${name}`);
  }

  return new Provider();
};

/**
 * Get current provider name
 * @returns {string} Current provider name
 */
const getCurrentProviderName = () => {
  return process.env.KYC_PROVIDER || 'MOCK';
};

module.exports = {
  getProvider,
  getCurrentProviderName,
  MockKycProvider
};
