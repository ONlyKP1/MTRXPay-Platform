const { DOCUMENT_STATUS, DOCUMENT_TYPES } = require('../shared/constants');

const Document = {
  tableName: 'documents',

  fields: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    merchant_id: 'UUID REFERENCES merchants(id) ON DELETE CASCADE NOT NULL',
    submission_id: 'UUID REFERENCES kyc_submissions(id) ON DELETE SET NULL',
    document_type: 'VARCHAR(100) NOT NULL',
    file_name: 'VARCHAR(255) NOT NULL',
    mime_type: 'VARCHAR(100)',
    storage_path: 'VARCHAR(500)',
    file_key: 'VARCHAR(255)',
    file_size: 'INTEGER',
    status: "VARCHAR(50) NOT NULL DEFAULT 'pending'",
    uploaded_by: 'UUID REFERENCES users(id)',
    uploaded_at: 'TIMESTAMP DEFAULT NOW()',
    created_at: 'TIMESTAMP DEFAULT NOW()',
    updated_at: 'TIMESTAMP DEFAULT NOW()'
  },

  STATUS: DOCUMENT_STATUS,
  TYPES: DOCUMENT_TYPES
};

module.exports = Document;
