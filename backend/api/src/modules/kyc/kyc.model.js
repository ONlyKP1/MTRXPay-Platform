/**
 * KYC Verification Model
 * Day 5: SumSub-ready architecture
 */

// KYC Status enum
const KycStatus = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  PENDING_REVIEW: 'PENDING_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

// KYC Provider enum
const KycProvider = {
  SUMSUB: 'SUMSUB',
  MOCK: 'MOCK'
};

/**
 * KycRecord structure:
 * {
 *   id: string (UUID),
 *   userId: string (UUID),
 *   status: KycStatus,
 *   provider: KycProvider,
 *   providerRef: string | null (external provider reference ID),
 *   createdAt: Date,
 *   updatedAt: Date
 * }
 */

module.exports = {
  KycStatus,
  KycProvider
};
