/**
 * Transaction Model
 * Day 6: Core transaction structure with status and type enums
 */

// Transaction status values
const TRANSACTION_STATUS = {
  PENDING: 'PENDING',       // Transaction created, awaiting processing
  PROCESSING: 'PROCESSING', // Transaction is being processed
  COMPLETED: 'COMPLETED',   // Transaction completed successfully
  FAILED: 'FAILED',         // Transaction failed (payment error, etc.)
  BLOCKED: 'BLOCKED'        // Transaction blocked by eligibility check
};

// Transaction type values
const TRANSACTION_TYPE = {
  PAYMENT: 'PAYMENT',             // Standard payment transaction
  REFUND: 'REFUND',               // Refund of a previous payment
  PAYOUT: 'PAYOUT',               // Payout to merchant
  ESCROW_FUND: 'ESCROW_FUND',     // Funding an escrow
  ESCROW_RELEASE: 'ESCROW_RELEASE', // Releasing escrow funds
  FEE: 'FEE'                      // Platform fee
};

// Supported currencies
const CURRENCY = {
  USDC: 'USDC',
  USDT: 'USDT',
  USD: 'USD'
};

const Transaction = {
  tableName: 'transactions',

  fields: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    user_id: 'UUID NOT NULL REFERENCES users(id)',
    merchant_id: 'UUID REFERENCES merchants(id)',
    amount: 'DECIMAL(18, 8) NOT NULL',
    currency: 'VARCHAR(10) NOT NULL DEFAULT \'USDC\'',
    status: 'VARCHAR(20) NOT NULL DEFAULT \'PENDING\'',
    type: 'VARCHAR(30) NOT NULL',
    parent_transaction_id: 'UUID REFERENCES transactions(id)',
    external_reference: 'VARCHAR(255)',
    failure_reason: 'TEXT',
    block_reason: 'VARCHAR(100)',
    metadata: 'JSONB DEFAULT \'{}\'',
    created_at: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
    updated_at: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
    completed_at: 'TIMESTAMP WITH TIME ZONE'
  },

  // Enums
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
  CURRENCY,

  /**
   * Check if status is terminal (no further changes expected)
   */
  isTerminalStatus: (status) => {
    return [
      TRANSACTION_STATUS.COMPLETED,
      TRANSACTION_STATUS.FAILED,
      TRANSACTION_STATUS.BLOCKED
    ].includes(status);
  },

  /**
   * Check if status allows cancellation
   */
  isCancellable: (status) => {
    return status === TRANSACTION_STATUS.PENDING;
  },

  /**
   * Valid status transitions
   */
  validTransitions: {
    [TRANSACTION_STATUS.PENDING]: [
      TRANSACTION_STATUS.PROCESSING,
      TRANSACTION_STATUS.BLOCKED,
      TRANSACTION_STATUS.FAILED
    ],
    [TRANSACTION_STATUS.PROCESSING]: [
      TRANSACTION_STATUS.COMPLETED,
      TRANSACTION_STATUS.FAILED
    ],
    [TRANSACTION_STATUS.COMPLETED]: [],
    [TRANSACTION_STATUS.FAILED]: [],
    [TRANSACTION_STATUS.BLOCKED]: []
  },

  /**
   * Check if a status transition is valid
   */
  canTransition: (fromStatus, toStatus) => {
    const allowed = Transaction.validTransitions[fromStatus] || [];
    return allowed.includes(toStatus);
  }
};

module.exports = Transaction;
module.exports.TRANSACTION_STATUS = TRANSACTION_STATUS;
module.exports.TRANSACTION_TYPE = TRANSACTION_TYPE;
module.exports.CURRENCY = CURRENCY;
