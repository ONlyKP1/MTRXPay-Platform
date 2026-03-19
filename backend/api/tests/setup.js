/**
 * Jest test setup
 */

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';

// Mock database for unit tests
jest.mock('../src/config/database', () => ({
  query: jest.fn(),
  pool: {
    query: jest.fn(),
    connect: jest.fn()
  }
}));

// Clear all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Global test helpers
global.mockUser = (overrides = {}) => ({
  id: 'user-123',
  email: 'test@example.com',
  full_name: 'Test User',
  role: 'merchant',
  merchant_id: 'merchant-123',
  ...overrides
});

global.mockMerchant = (overrides = {}) => ({
  id: 'merchant-123',
  owner_user_id: 'user-123',
  legal_business_name: 'Test Company Ltd',
  business_name: 'Test Company Ltd',
  trading_name: 'Test Co',
  business_type: 'limited_company',
  country_of_incorporation: 'United Kingdom',
  registration_number: 'ABC12345',
  industry_type: 'technology',
  status: 'draft',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides
});

global.mockAddress = (overrides = {}) => ({
  id: 'address-123',
  merchant_id: 'merchant-123',
  address_line1: '123 Test Street',
  city: 'London',
  postcode: 'SW1A 1AA',
  country: 'United Kingdom',
  address_type: 'registered',
  ...overrides
});

global.mockOwner = (overrides = {}) => ({
  id: 'owner-123',
  merchant_id: 'merchant-123',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  role: 'director',
  ownership_percentage: 50,
  ...overrides
});

global.mockDocument = (overrides = {}) => ({
  id: 'doc-123',
  merchant_id: 'merchant-123',
  document_type: 'id_proof',
  file_name: 'passport.pdf',
  status: 'uploaded',
  ...overrides
});

// KYC mock helpers
global.mockKycUser = (overrides = {}) => ({
  id: 'user-kyc-123',
  email: 'kyc@example.com',
  full_name: 'KYC Test User',
  role: 'merchant',
  kyc_status: 'not_started',
  user_state: 'REGISTERED',
  kyc_provider: null,
  kyc_provider_applicant_id: null,
  ...overrides
});

global.mockApprovedUser = () => mockKycUser({
  kyc_status: 'approved',
  user_state: 'KYC_APPROVED',
  kyc_provider: 'SUMSUB',
  kyc_provider_applicant_id: 'sumsub-123'
});

global.mockPendingUser = () => mockKycUser({
  kyc_status: 'pending',
  user_state: 'KYC_PENDING',
  kyc_provider: 'SUMSUB',
  kyc_provider_applicant_id: 'sumsub-123'
});

global.mockRejectedUser = () => mockKycUser({
  kyc_status: 'rejected',
  user_state: 'KYC_REJECTED',
  kyc_rejection_reason: 'Document fraud detected',
  kyc_provider: 'SUMSUB',
  kyc_provider_applicant_id: 'sumsub-123'
});

global.mockSumSubWebhook = (overrides = {}) => ({
  type: 'applicantReviewed',
  applicantId: 'sumsub-123',
  externalUserId: 'user-kyc-123',
  reviewStatus: 'completed',
  reviewResult: {
    reviewAnswer: 'GREEN'
  },
  createdAt: new Date().toISOString(),
  ...overrides
});
