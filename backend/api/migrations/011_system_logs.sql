-- Day 6: Create system logs table
-- Migration: 011_system_logs.sql
-- Purpose: Central place for meaningful backend actions

CREATE TABLE IF NOT EXISTS system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  source VARCHAR(100) NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_system_logs_user_id ON system_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_system_logs_action ON system_logs(action);
CREATE INDEX IF NOT EXISTS idx_system_logs_source ON system_logs(source);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at);

-- GIN index for JSONB metadata queries
CREATE INDEX IF NOT EXISTS idx_system_logs_metadata ON system_logs USING GIN(metadata);

-- Comments
COMMENT ON TABLE system_logs IS 'Central log for meaningful backend actions';
COMMENT ON COLUMN system_logs.user_id IS 'Reference to user (nullable for system events)';
COMMENT ON COLUMN system_logs.action IS 'Action type: KYC_STARTED, WEBHOOK_RECEIVED, KYC_APPROVED, etc.';
COMMENT ON COLUMN system_logs.source IS 'Source of the action: KYC_SERVICE, WEBHOOK_HANDLER, TRANSACTION_SERVICE';
COMMENT ON COLUMN system_logs.metadata IS 'Additional context as JSON';
COMMENT ON COLUMN system_logs.created_at IS 'Timestamp when the log was created';
