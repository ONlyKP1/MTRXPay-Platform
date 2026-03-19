const BeneficialOwner = {
  tableName: 'beneficial_owners',

  fields: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    merchant_id: 'UUID REFERENCES merchants(id) ON DELETE CASCADE NOT NULL',
    first_name: 'VARCHAR(100) NOT NULL',
    last_name: 'VARCHAR(100) NOT NULL',
    dob: 'DATE',
    nationality: 'VARCHAR(100)',
    ownership_percentage: 'DECIMAL(5, 2)',
    role: 'VARCHAR(100)',
    email: 'VARCHAR(255)',
    phone: 'VARCHAR(50)',
    is_primary_contact: 'BOOLEAN DEFAULT false',
    created_at: 'TIMESTAMP DEFAULT NOW()',
    updated_at: 'TIMESTAMP DEFAULT NOW()'
  },

  ROLES: {
    DIRECTOR: 'director',
    SHAREHOLDER: 'shareholder',
    BENEFICIAL_OWNER: 'beneficial_owner',
    AUTHORISED_SIGNATORY: 'authorised_signatory'
  }
};

module.exports = BeneficialOwner;
