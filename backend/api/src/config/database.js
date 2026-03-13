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

module.exports = {
  pool,
  connectDB,
  query
};
