/**
 * KYC Middleware
 * Day 5: Route protection based on KYC status
 */

const { KycStatus } = require('../modules/kyc/kyc.model');

/**
 * Require KYC approved status to access route
 * Use after auth middleware
 */
const requireKyc = (req, res, next) => {
  if (req.user.kyc_status !== KycStatus.APPROVED) {
    return res.status(403).json({
      success: false,
      message: 'KYC required to access this resource'
    });
  }
  next();
};

/**
 * Require KYC in progress or completed
 * Less strict - allows access during verification
 */
const requireKycStarted = (req, res, next) => {
  if (req.user.kyc_status === KycStatus.NOT_STARTED) {
    return res.status(403).json({
      success: false,
      message: 'Please start KYC verification to access this resource'
    });
  }
  next();
};

/**
 * Block if KYC is rejected
 */
const blockIfRejected = (req, res, next) => {
  if (req.user.kyc_status === KycStatus.REJECTED) {
    return res.status(403).json({
      success: false,
      message: 'KYC verification was rejected. Please contact support.'
    });
  }
  next();
};

module.exports = {
  requireKyc,
  requireKycStarted,
  blockIfRejected
};
