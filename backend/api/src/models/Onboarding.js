const STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

const Onboarding = {
  tableName: 'onboardings',

  fields: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    merchant_id: 'UUID REFERENCES merchants(id) NOT NULL',
    status: "VARCHAR(50) NOT NULL DEFAULT 'draft'",
    submitted_at: 'TIMESTAMP',
    reviewed_at: 'TIMESTAMP',
    notes: 'TEXT'
  },

  STATUS
};

module.exports = Onboarding;
