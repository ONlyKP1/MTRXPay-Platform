const { ADDRESS_TYPES } = require('../shared/constants');

const MerchantAddress = {
  tableName: 'merchant_addresses',

  fields: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    merchant_id: 'UUID REFERENCES merchants(id) ON DELETE CASCADE NOT NULL',
    address_line1: 'VARCHAR(255) NOT NULL',
    address_line2: 'VARCHAR(255)',
    city: 'VARCHAR(100) NOT NULL',
    county_or_state: 'VARCHAR(100)',
    postcode: 'VARCHAR(20) NOT NULL',
    country: 'VARCHAR(100) NOT NULL',
    address_type: "VARCHAR(50) NOT NULL DEFAULT 'registered'",
    created_at: 'TIMESTAMP DEFAULT NOW()',
    updated_at: 'TIMESTAMP DEFAULT NOW()'
  },

  ADDRESS_TYPES
};

module.exports = MerchantAddress;
