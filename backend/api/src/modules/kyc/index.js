/**
 * KYC Module
 * Day 5: Verification tracking
 */

const routes = require('./kyc.controller');
const kycService = require('./kyc.service');
const { KycStatus, KycProvider } = require('./kyc.model');

module.exports = {
  routes,
  kycService,
  KycStatus,
  KycProvider
};
