/**
 * Payment Provider Model
 * Day 7: Provider abstraction layer
 */

const PROVIDER_TYPE = {
  ONRAMP: 'ONRAMP',
  OFFRAMP: 'OFFRAMP',
  BOTH: 'BOTH'
};

const APPROVAL_RATE = {
  HIGH: 'HIGH',
  MEDIUM_HIGH: 'MEDIUM_HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW'
};

const PREFERENCE_TYPE = {
  PREFERRED: 'PREFERRED',
  BLOCKED: 'BLOCKED',
  DEFAULT: 'DEFAULT'
};

const SELECTION_OUTCOME = {
  ACCEPTED: 'ACCEPTED',
  CHANGED: 'CHANGED',
  CANCELLED: 'CANCELLED'
};

/**
 * Map approval rate to display text
 */
const getApprovalRateDisplay = (rate) => {
  const displayMap = {
    [APPROVAL_RATE.HIGH]: 'High',
    [APPROVAL_RATE.MEDIUM_HIGH]: 'Medium–High',
    [APPROVAL_RATE.MEDIUM]: 'Medium',
    [APPROVAL_RATE.LOW]: 'Low'
  };
  return displayMap[rate] || rate;
};

/**
 * Map approval rate to numeric score (for sorting)
 */
const getApprovalRateScore = (rate) => {
  const scoreMap = {
    [APPROVAL_RATE.HIGH]: 100,
    [APPROVAL_RATE.MEDIUM_HIGH]: 75,
    [APPROVAL_RATE.MEDIUM]: 50,
    [APPROVAL_RATE.LOW]: 25
  };
  return scoreMap[rate] || 0;
};

/**
 * Format settlement time for display
 */
const formatSettlementTime = (minHours, maxHours) => {
  if (minHours === maxHours) {
    return `${minHours}h`;
  }
  return `${minHours}–${maxHours}h`;
};

/**
 * Calculate fee for a given amount
 */
const calculateFee = (provider, amount) => {
  const percentageFee = (amount * provider.fee_percentage) / 100;
  const fixedFee = provider.fee_fixed || 0;
  return Math.round((percentageFee + fixedFee) * 100) / 100;
};

/**
 * Calculate amount received after fees
 */
const calculateNetAmount = (provider, amount) => {
  const fee = calculateFee(provider, amount);
  return Math.round((amount - fee) * 100) / 100;
};

module.exports = {
  PROVIDER_TYPE,
  APPROVAL_RATE,
  PREFERENCE_TYPE,
  SELECTION_OUTCOME,
  getApprovalRateDisplay,
  getApprovalRateScore,
  formatSettlementTime,
  calculateFee,
  calculateNetAmount
};
