/**
 * Transaction Routes
 * Day 6: Protected transaction endpoints with KYC gating
 */

const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { requireKycApproved } = require('../../middleware/kyc.middleware');
const { success, validationError, serverError } = require('../../utils/response');
const transactionService = require('../../services/transactionService');
const { TRANSACTION_TYPE, CURRENCY } = require('../../models/Transaction');

/**
 * Validate transaction creation request
 */
const validateCreateTransaction = (req, res, next) => {
  const { amount, type, currency } = req.body;
  const errors = {};

  // Amount validation
  if (amount === undefined || amount === null) {
    errors.amount = 'Amount is required';
  } else if (typeof amount !== 'number' || isNaN(amount)) {
    errors.amount = 'Amount must be a number';
  } else if (amount <= 0) {
    errors.amount = 'Amount must be greater than 0';
  }

  // Type validation
  if (!type) {
    errors.type = 'Transaction type is required';
  } else if (!Object.values(TRANSACTION_TYPE).includes(type)) {
    errors.type = `Invalid transaction type. Must be one of: ${Object.values(TRANSACTION_TYPE).join(', ')}`;
  }

  // Currency validation (optional, defaults to USDC)
  if (currency && !Object.values(CURRENCY).includes(currency)) {
    errors.currency = `Invalid currency. Must be one of: ${Object.values(CURRENCY).join(', ')}`;
  }

  if (Object.keys(errors).length > 0) {
    return validationError(res, 'Invalid transaction data', errors);
  }

  next();
};

/**
 * @swagger
 * /api/transactions/create:
 *   post:
 *     summary: Create a new transaction
 *     description: Creates a transaction record. Requires KYC approval.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - type
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Transaction amount (must be > 0)
 *                 example: 100.50
 *               type:
 *                 type: string
 *                 enum: [PAYMENT, REFUND, PAYOUT, ESCROW_FUND, ESCROW_RELEASE, FEE]
 *                 description: Transaction type
 *                 example: "PAYMENT"
 *               currency:
 *                 type: string
 *                 enum: [USDC, USDT, USD]
 *                 default: "USDC"
 *                 description: Currency
 *               metadata:
 *                 type: object
 *                 description: Optional metadata
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Transaction created"
 *               data:
 *                 id: "uuid-here"
 *                 user_id: "user-uuid"
 *                 amount: "100.50"
 *                 currency: "USDC"
 *                 type: "PAYMENT"
 *                 status: "PENDING"
 *                 created_at: "2026-03-19T12:00:00.000Z"
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: KYC approval required
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error:
 *                 code: "KYC_NOT_APPROVED"
 *                 message: "KYC verification required to access this resource"
 *               canTransact: false
 */
router.post(
  '/api/transactions/create',
  auth,
  requireKycApproved,
  validateCreateTransaction,
  async (req, res) => {
    try {
      const { amount, type, currency, metadata } = req.body;

      const transaction = await transactionService.createTransaction({
        userId: req.user.id,
        amount,
        type,
        currency: currency || CURRENCY.USDC,
        merchantId: req.user.merchant_id || null,
        metadata: metadata || {}
      });

      return success(res, transaction, 'Transaction created', 201);
    } catch (error) {
      console.error('[CREATE TRANSACTION ERROR]', error);
      return serverError(res, 'Failed to create transaction', error);
    }
  }
);

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: List user transactions
 *     description: Returns transactions for the authenticated user
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, PROCESSING, COMPLETED, FAILED, BLOCKED]
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [PAYMENT, REFUND, PAYOUT, ESCROW_FUND, ESCROW_RELEASE, FEE]
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: List of transactions
 *       401:
 *         description: Authentication required
 */
router.get('/api/transactions', auth, async (req, res) => {
  try {
    const { status, type, limit, offset } = req.query;

    const transactions = await transactionService.getUserTransactions(
      req.user.id,
      {
        status,
        type,
        limit: parseInt(limit) || 50,
        offset: parseInt(offset) || 0
      }
    );

    return success(res, transactions);
  } catch (error) {
    console.error('[LIST TRANSACTIONS ERROR]', error);
    return serverError(res, 'Failed to list transactions', error);
  }
});

/**
 * @swagger
 * /api/transactions/{transactionId}:
 *   get:
 *     summary: Get transaction by ID
 *     description: Returns a specific transaction (must belong to user)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Transaction details
 *       404:
 *         description: Transaction not found
 */
router.get('/api/transactions/:transactionId', auth, async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await transactionService.getTransactionById(transactionId);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Transaction not found'
        }
      });
    }

    // Ensure user owns this transaction
    if (transaction.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: 'Not authorized to view this transaction'
        }
      });
    }

    return success(res, transaction);
  } catch (error) {
    console.error('[GET TRANSACTION ERROR]', error);
    return serverError(res, 'Failed to get transaction', error);
  }
});

module.exports = router;
