/**
 * Environment Configuration
 * Day 6: Added SumSub variables and startup validation
 */

require('dotenv').config();

// Required environment variables - app will fail at startup if missing
const REQUIRED_ENV_VARS = [
  'DATABASE_URL',
  'JWT_SECRET'
];

// Required in production only
const REQUIRED_IN_PRODUCTION = [
  'SUMSUB_APP_TOKEN',
  'SUMSUB_SECRET_KEY'
];

/**
 * Validate required environment variables
 * Fails fast at startup if critical config is missing
 */
const validateEnv = () => {
  const missing = [];
  const isProduction = process.env.NODE_ENV === 'production';

  // Check always-required vars
  for (const envVar of REQUIRED_ENV_VARS) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  // Check production-required vars
  if (isProduction) {
    for (const envVar of REQUIRED_IN_PRODUCTION) {
      if (!process.env[envVar]) {
        missing.push(envVar);
      }
    }
  }

  if (missing.length > 0) {
    console.error('\n❌ FATAL: Missing required environment variables:');
    missing.forEach(v => console.error(`   - ${v}`));
    console.error('\nPlease set these variables in your .env file or environment.\n');
    process.exit(1);
  }

  // Warn about missing optional vars in development
  if (!isProduction) {
    const warnings = [];
    for (const envVar of REQUIRED_IN_PRODUCTION) {
      if (!process.env[envVar]) {
        warnings.push(envVar);
      }
    }
    if (warnings.length > 0) {
      console.warn('\n⚠️  Warning: Missing SumSub config (required for production):');
      warnings.forEach(v => console.warn(`   - ${v}`));
      console.warn('   Using mock KYC provider in development.\n');
    }
  }
};

// Run validation on module load
validateEnv();

// Export config values
module.exports = {
  // Server
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database
  DATABASE_URL: process.env.DATABASE_URL,

  // Auth
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // SumSub KYC Provider
  SUMSUB_APP_TOKEN: process.env.SUMSUB_APP_TOKEN || '',
  SUMSUB_SECRET_KEY: process.env.SUMSUB_SECRET_KEY || '',
  SUMSUB_BASE_URL: process.env.SUMSUB_BASE_URL || 'https://api.sumsub.com',

  // Helper to check if SumSub is configured
  isSumSubConfigured: () => {
    return !!(process.env.SUMSUB_APP_TOKEN && process.env.SUMSUB_SECRET_KEY);
  }
};
