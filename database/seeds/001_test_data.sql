-- Seed data for local development
-- Run after migrations

-- 1. Create test merchant
INSERT INTO merchants (id, business_name, trading_name, status)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Test Company Ltd',
  'Test Co',
  'active'
) ON CONFLICT (id) DO NOTHING;

-- 2. Create admin user
INSERT INTO users (id, full_name, email, password_hash, role)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'Admin User',
  'admin@mtrxpay.com',
  '$2b$10$test_hash_replace_in_production',
  'admin'
) ON CONFLICT (id) DO NOTHING;

-- 3. Create merchant user
INSERT INTO users (id, full_name, email, password_hash, role, merchant_id)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  'Merchant User',
  'merchant@testcompany.com',
  '$2b$10$test_hash_replace_in_production',
  'merchant',
  '11111111-1111-1111-1111-111111111111'
) ON CONFLICT (id) DO NOTHING;

-- 4. Create onboarding record
INSERT INTO onboardings (id, merchant_id, status, submitted_at)
VALUES (
  '44444444-4444-4444-4444-444444444444',
  '11111111-1111-1111-1111-111111111111',
  'approved',
  NOW()
) ON CONFLICT (id) DO NOTHING;
