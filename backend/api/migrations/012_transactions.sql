-- Migration: 012_transactions.sql
-- Day 6: Transaction table structure for transaction gating
-- Created: 2026-03-19

-- Transaction status enum
-- PENDING: Transaction created, awaiting processing
-- PROCESSING: Transaction is being processed
-- COMPLETED: Transaction completed successfully
-- FAILED: Transaction failed (payment error, etc.)
-- BLOCKED: Transaction blocked by eligibility check (KYC, sanctions, etc.)

-- Transaction types enum
-- PAYMENT: Standard payment transaction
-- REFUND: Refund of a previous payment
-- PAYOUT: Payout to merchant
-- ESCROW_FUND: Funding an escrow
-- ESCROW_RELEASE: Releasing escrow funds
-- FEE: Platform fee

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User who initiated the transaction
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,

  -- Optional merchant association
  merchant_id UUID REFERENCES merchants(id) ON DELETE SET NULL,

  -- Transaction details
  amount DECIMAL(18, 8) NOT NULL CHECK (amount > 0),
  currency VARCHAR(10) NOT NULL DEFAULT 'USDC',

  -- Transaction status
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',

  -- Transaction type
  type VARCHAR(30) NOT NULL,

  -- Optional reference to related transaction (e.g., refund -> original payment)
  parent_transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,

  -- Optional external reference (from payment provider)
  external_reference VARCHAR(255),

  -- Failure/block reason if applicable
  failure_reason TEXT,
  block_reason VARCHAR(100),

  -- Metadata for extensibility
  metadata JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,

  -- Constraints
  CONSTRAINT valid_status CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'BLOCKED')),
  CONSTRAINT valid_type CHECK (type IN ('PAYMENT', 'REFUND', 'PAYOUT', 'ESCROW_FUND', 'ESCROW_RELEASE', 'FEE'))
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_merchant_id ON transactions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_user_status ON transactions(user_id, status);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_transactions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS transactions_updated_at ON transactions;
CREATE TRIGGER transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_transactions_updated_at();

-- Comment on table
COMMENT ON TABLE transactions IS 'Core transaction table for payment processing with KYC gating';
COMMENT ON COLUMN transactions.status IS 'PENDING, PROCESSING, COMPLETED, FAILED, BLOCKED';
COMMENT ON COLUMN transactions.type IS 'PAYMENT, REFUND, PAYOUT, ESCROW_FUND, ESCROW_RELEASE, FEE';
COMMENT ON COLUMN transactions.block_reason IS 'Reason if transaction was blocked (e.g., KYC_NOT_APPROVED)';
