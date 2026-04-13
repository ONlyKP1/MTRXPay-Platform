-- Migration: Add missing indexes for Day 4
-- Date: 2026-03-18

-- Additional indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_merchants_owner_user_id ON merchants(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_merchants_status ON merchants(status);
CREATE INDEX IF NOT EXISTS idx_merchants_business_type ON merchants(business_type);
