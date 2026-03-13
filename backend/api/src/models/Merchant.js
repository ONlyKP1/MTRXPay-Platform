const STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  SUSPENDED: 'suspended'
};

const Merchant = {
  tableName: 'merchants',

  fields: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    business_name: 'VARCHAR(255) NOT NULL',
    trading_name: 'VARCHAR(255)',
    status: "VARCHAR(50) NOT NULL DEFAULT 'draft'",
    created_at: 'TIMESTAMP DEFAULT NOW()'
  },

  STATUS
};

module.exports = Merchant;
