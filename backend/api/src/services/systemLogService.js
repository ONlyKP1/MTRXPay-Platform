/**
 * System Log Service
 * Day 6: Central logging for meaningful backend actions
 */

const { query } = require('../config/database');
const SystemLog = require('../models/SystemLog');

const { LOG_ACTION, LOG_SOURCE } = SystemLog;

/**
 * Create a system log entry
 * @param {object} params - Log parameters
 * @param {string} params.action - Action type (from LOG_ACTION)
 * @param {string} params.source - Source of action (from LOG_SOURCE)
 * @param {string|null} params.userId - User ID (optional)
 * @param {object} params.metadata - Additional context (optional)
 * @returns {object} Created log entry
 */
const log = async ({ action, source, userId = null, metadata = {} }) => {
  try {
    const result = await query(
      `INSERT INTO system_logs (user_id, action, source, metadata, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING *`,
      [userId, action, source, JSON.stringify(metadata)]
    );

    // Also log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('[SYSTEM LOG]', action, source, userId || 'system', metadata);
    }

    return result.rows[0];
  } catch (error) {
    console.error('[SYSTEM LOG ERROR]', error.message);
    return null;
  }
};

/**
 * Get logs by user ID
 */
const getLogsByUser = async (userId, options = {}) => {
  const { limit = 50, offset = 0 } = options;

  const result = await query(
    `SELECT * FROM system_logs WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  return result.rows;
};

/**
 * Get logs by action type
 */
const getLogsByAction = async (action, options = {}) => {
  const { limit = 50, offset = 0 } = options;

  const result = await query(
    `SELECT * FROM system_logs WHERE action = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
    [action, limit, offset]
  );

  return result.rows;
};

/**
 * Get logs by source
 */
const getLogsBySource = async (source, options = {}) => {
  const { limit = 50, offset = 0 } = options;

  const result = await query(
    `SELECT * FROM system_logs WHERE source = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
    [source, limit, offset]
  );

  return result.rows;
};

/**
 * Get recent logs
 */
const getRecentLogs = async (options = {}) => {
  const { limit = 100, offset = 0 } = options;

  const result = await query(
    `SELECT * FROM system_logs ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  return result.rows;
};

module.exports = {
  log,
  getLogsByUser,
  getLogsByAction,
  getLogsBySource,
  getRecentLogs,
  LOG_ACTION,
  LOG_SOURCE
};
