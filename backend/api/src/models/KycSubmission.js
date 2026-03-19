const { KYC_STATUS, SUBMISSION_TYPES, RISK_LEVELS } = require('../shared/constants');

const KycSubmission = {
  tableName: 'kyc_submissions',

  fields: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    merchant_id: 'UUID REFERENCES merchants(id) ON DELETE CASCADE NOT NULL',
    submission_type: "VARCHAR(50) NOT NULL DEFAULT 'combined'",
    status: "VARCHAR(50) NOT NULL DEFAULT 'pending'",
    submitted_at: 'TIMESTAMP',
    reviewed_at: 'TIMESTAMP',
    reviewed_by: 'UUID REFERENCES users(id)',
    risk_level: 'VARCHAR(50)',
    notes: 'TEXT',
    created_at: 'TIMESTAMP DEFAULT NOW()',
    updated_at: 'TIMESTAMP DEFAULT NOW()'
  },

  STATUS: KYC_STATUS,
  SUBMISSION_TYPES,
  RISK_LEVELS
};

module.exports = KycSubmission;
