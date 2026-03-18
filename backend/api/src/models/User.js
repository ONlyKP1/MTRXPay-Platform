const ROLES = {
  MERCHANT: 'merchant',
  ADMIN: 'admin'
};

const KYC_STATUS = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  PENDING_REVIEW: 'PENDING_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

const User = {
  tableName: 'users',

  fields: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    full_name: 'VARCHAR(255) NOT NULL',
    email: 'VARCHAR(255) UNIQUE NOT NULL',
    password_hash: 'VARCHAR(255)',
    role: "VARCHAR(50) NOT NULL DEFAULT 'merchant'",
    merchant_id: 'UUID REFERENCES merchants(id)',
    kyc_status: "VARCHAR(50) DEFAULT 'NOT_STARTED'",
    created_at: 'TIMESTAMP DEFAULT NOW()'
  },

  ROLES,
  KYC_STATUS
};

module.exports = User;
