const ROLES = {
  ADMIN: 'admin',
  MERCHANT: 'merchant'
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
    created_at: 'TIMESTAMP DEFAULT NOW()'
  },

  ROLES
};

module.exports = User;
