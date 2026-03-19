/**
 * Transaction Service
 * Day 6: Core transaction operations with KYC gating
 */

const { query } = require('../config/database');
const { TRANSACTION_STATUS, TRANSACTION_TYPE, CURRENCY } = require('../models/Transaction');
const systemLogService = require('./systemLogService');
const { LOG_ACTION, LOG_SOURCE } = require('../models/SystemLog');

/**
 * Create a new transaction
 * @param {object} params - Transaction parameters
 * @param {string} params.userId - User ID creating the transaction
 * @param {number} params.amount - Transaction amount
 * @param {string} params.currency - Currency (default: USDC)
 * @param {string} params.type - Transaction type
 * @param {string} params.merchantId - Optional merchant ID
 * @param {object} params.metadata - Optional metadata
 * @returns {object} Created transaction
 */
const createTransaction = async ({
  userId,
  amount,
  currency = CURRENCY.USDC,
  type,
  merchantId = null,
  metadata = {}
}) => {
  const result = await query(
    `INSERT INTO transactions (
      user_id,
      merchant_id,
      amount,
      currency,
      type,
      status,
      metadata,
      created_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
    RETURNING *`,
    [
      userId,
      merchantId,
      amount,
      currency,
      type,
      TRANSACTION_STATUS.PENDING,
      JSON.stringify(metadata)
    ]
  );

  const transaction = result.rows[0];

  // Log successful transaction creation
  await systemLogService.log({
    action: LOG_ACTION.TRANSACTION_CREATED,
    source: LOG_SOURCE.TRANSACTION_SERVICE,
    userId,
    metadata: {
      transactionId: transaction.id,
      amount,
      currency,
      type,
      status: TRANSACTION_STATUS.PENDING
    }
  });

  return transaction;
};

/**
 * Get transaction by ID
 * @param {string} transactionId - Transaction ID
 * @returns {object|null} Transaction or null
 */
const getTransactionById = async (transactionId) => {
  const result = await query(
    'SELECT * FROM transactions WHERE id = $1',
    [transactionId]
  );

  return result.rows[0] || null;
};

/**
 * Get transactions for a user
 * @param {string} userId - User ID
 * @param {object} options - Query options
 * @returns {array} List of transactions
 */
const getUserTransactions = async (userId, options = {}) => {
  const { status, type, limit = 50, offset = 0 } = options;

  let sql = 'SELECT * FROM transactions WHERE user_id = $1';
  const values = [userId];
  let paramIndex = 2;

  if (status) {
    sql += ` AND status = $${paramIndex}`;
    values.push(status);
    paramIndex++;
  }

  if (type) {
    sql += ` AND type = $${paramIndex}`;
    values.push(type);
    paramIndex++;
  }

  sql += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  values.push(limit, offset);

  const result = await query(sql, values);
  return result.rows;
};

/**
 * Update transaction status
 * @param {string} transactionId - Transaction ID
 * @param {string} status - New status
 * @param {object} options - Additional fields to update
 * @returns {object} Updated transaction
 */
const updateTransactionStatus = async (transactionId, status, options = {}) => {
  const { failureReason, blockReason } = options;

  let sql = 'UPDATE transactions SET status = $1, updated_at = NOW()';
  const values = [status];
  let paramIndex = 2;

  if (status === TRANSACTION_STATUS.COMPLETED) {
    sql += ', completed_at = NOW()';
  }

  if (failureReason) {
    sql += `, failure_reason = $${paramIndex}`;
    values.push(failureReason);
    paramIndex++;
  }

  if (blockReason) {
    sql += `, block_reason = $${paramIndex}`;
    values.push(blockReason);
    paramIndex++;
  }

  sql += ` WHERE id = $${paramIndex} RETURNING *`;
  values.push(transactionId);

  const result = await query(sql, values);
  return result.rows[0];
};

/**
 * Block a transaction (used when KYC check fails mid-process)
 * @param {string} transactionId - Transaction ID
 * @param {string} reason - Block reason code
 * @returns {object} Updated transaction
 */
const blockTransaction = async (transactionId, reason) => {
  return updateTransactionStatus(transactionId, TRANSACTION_STATUS.BLOCKED, {
    blockReason: reason
  });
};

module.exports = {
  createTransaction,
  getTransactionById,
  getUserTransactions,
  updateTransactionStatus,
  blockTransaction,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
  CURRENCY
};
