const { Pool } = require('pg');
const { DATABASE_URL } = require('./env');

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('Supabase database connected');
    client.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    return false;
  }
};

const query = (text, params) => pool.query(text, params);

/**
 * Get a client for transaction use
 * Remember to release the client when done!
 */
const getClient = () => pool.connect();

/**
 * Execute multiple operations in a transaction
 * @param {function} callback - Async function receiving client
 * @returns {any} Result of callback
 */
const withTransaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  connectDB,
  query,
  getClient,
  withTransaction
};
