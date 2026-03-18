/**
 * Audit Service
 * Logs important events for compliance and debugging
 */

const { query } = require('../config/database');

// Audit event types
const AUDIT_EVENTS = {
  // Auth events
  USER_REGISTERED: 'USER_REGISTERED',
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',
  PASSWORD_CHANGED: 'PASSWORD_CHANGED',

  // Merchant events
  MERCHANT_CREATED: 'MERCHANT_CREATED',
  MERCHANT_UPDATED: 'MERCHANT_UPDATED',
  MERCHANT_STATUS_CHANGED: 'MERCHANT_STATUS_CHANGED',

  // Onboarding events
  ONBOARDING_STARTED: 'ONBOARDING_STARTED',
  ONBOARDING_STEP_COMPLETED: 'ONBOARDING_STEP_COMPLETED',
  ONBOARDING_SUBMITTED: 'ONBOARDING_SUBMITTED',

  // Admin events
  MERCHANT_APPROVED: 'MERCHANT_APPROVED',
  MERCHANT_REJECTED: 'MERCHANT_REJECTED',
  DOCUMENT_REVIEWED: 'DOCUMENT_REVIEWED',

  // Document events
  DOCUMENT_UPLOADED: 'DOCUMENT_UPLOADED',
  DOCUMENT_DELETED: 'DOCUMENT_DELETED',

  // Owner events
  OWNER_ADDED: 'OWNER_ADDED',
  OWNER_UPDATED: 'OWNER_UPDATED',
  OWNER_DELETED: 'OWNER_DELETED'
};

/**
 * Log an audit event
 * @param {object} event - Event details
 */
const log = async (event) => {
  const {
    action,
    userId = null,
    merchantId = null,
    resourceType = null,
    resourceId = null,
    details = {},
    ipAddress = null,
    userAgent = null
  } = event;

  try {
    // For now, log to console and store in memory
    // In production, this would go to a dedicated audit_logs table
    const auditEntry = {
      timestamp: new Date().toISOString(),
      action,
      userId,
      merchantId,
      resourceType,
      resourceId,
      details,
      ipAddress,
      userAgent
    };

    // Log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('[AUDIT]', JSON.stringify(auditEntry));
    }

    // Store in database if audit_logs table exists
    await storeAuditLog(auditEntry);

    return auditEntry;
  } catch (error) {
    // Don't let audit failures break the main flow
    console.error('[AUDIT ERROR]', error.message);
    return null;
  }
};

/**
 * Store audit log in database
 */
const storeAuditLog = async (entry) => {
  try {
    // Check if audit_logs table exists, if not, skip
    const tableCheck = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'audit_logs'
      )
    `);

    if (!tableCheck.rows[0].exists) {
      // Table doesn't exist yet, just return
      return null;
    }

    const result = await query(
      `INSERT INTO audit_logs (
        action, user_id, merchant_id, resource_type, resource_id,
        details, ip_address, user_agent, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING *`,
      [
        entry.action,
        entry.userId,
        entry.merchantId,
        entry.resourceType,
        entry.resourceId,
        JSON.stringify(entry.details),
        entry.ipAddress,
        entry.userAgent
      ]
    );

    return result.rows[0];
  } catch (error) {
    // Silently fail if table doesn't exist
    if (!error.message.includes('audit_logs')) {
      console.error('[AUDIT STORE ERROR]', error.message);
    }
    return null;
  }
};

/**
 * Get audit logs for a merchant
 */
const getLogsForMerchant = async (merchantId, options = {}) => {
  const { limit = 50, offset = 0, action = null } = options;

  let sql = 'SELECT * FROM audit_logs WHERE merchant_id = $1';
  const values = [merchantId];
  let paramIndex = 2;

  if (action) {
    sql += ` AND action = $${paramIndex}`;
    values.push(action);
    paramIndex++;
  }

  sql += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  values.push(limit, offset);

  try {
    const result = await query(sql, values);
    return result.rows;
  } catch (_error) {
    return [];
  }
};

/**
 * Get audit logs for a user
 */
const getLogsForUser = async (userId, options = {}) => {
  const { limit = 50, offset = 0 } = options;

  try {
    const result = await query(
      `SELECT * FROM audit_logs WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return result.rows;
  } catch (_error) {
    return [];
  }
};

/**
 * Create audit log from request context
 */
const logFromRequest = async (req, action, details = {}) => {
  return log({
    action,
    userId: req.user?.id,
    merchantId: req.merchant?.id || req.params?.merchantId,
    details,
    ipAddress: req.ip || req.connection?.remoteAddress,
    userAgent: req.get('User-Agent')
  });
};

module.exports = {
  log,
  logFromRequest,
  getLogsForMerchant,
  getLogsForUser,
  AUDIT_EVENTS
};
