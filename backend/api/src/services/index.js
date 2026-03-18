/**
 * Services index
 * Export all services from one place
 */

const merchantService = require('./merchantService');
const onboardingService = require('./onboardingService');
const documentService = require('./documentService');
const progressService = require('./progressService');
const submissionService = require('./submissionService');
const auditService = require('./auditService');
const reviewService = require('./reviewService');

module.exports = {
  merchantService,
  onboardingService,
  documentService,
  progressService,
  submissionService,
  auditService,
  reviewService
};
