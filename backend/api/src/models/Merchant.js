const { MERCHANT_STATUS } = require('../shared/constants');

const Merchant = {
  tableName: 'merchants',

  fields: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    business_name: 'VARCHAR(255) NOT NULL',
    trading_name: 'VARCHAR(255)',
    status: "VARCHAR(50) NOT NULL DEFAULT 'draft'",
    created_at: 'TIMESTAMP DEFAULT NOW()',
    updated_at: 'TIMESTAMP DEFAULT NOW()',
    // Day 4 additions
    owner_user_id: 'UUID REFERENCES users(id)',
    legal_business_name: 'VARCHAR(255)',
    business_type: 'VARCHAR(100)',
    registration_number: 'VARCHAR(100)',
    country_of_incorporation: 'VARCHAR(100)',
    tax_number: 'VARCHAR(100)',
    website_url: 'VARCHAR(500)',
    industry_type: 'VARCHAR(100)',
    business_description: 'TEXT'
  },

  STATUS: MERCHANT_STATUS
};

module.exports = Merchant;
