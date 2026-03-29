const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const seedsDir = path.join(__dirname, '../../../database/seeds');

async function runSeeds() {
  console.log('Running seeds...\n');

  const files = fs.readdirSync(seedsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    console.log(`Seeding: ${file}`);
    const sql = fs.readFileSync(path.join(seedsDir, file), 'utf8');

    try {
      await pool.query(sql);
      console.log(`✓ ${file} completed\n`);
    } catch (error) {
      console.error(`✗ ${file} failed:`, error.message);
      process.exit(1);
    }
  }

  console.log('All seeds completed!');
  await pool.end();
}

runSeeds();
