const { STEP_STATUS, ONBOARDING_STEPS } = require('../shared/constants');

const OnboardingProgress = {
  tableName: 'onboarding_progress',

  fields: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    merchant_id: 'UUID REFERENCES merchants(id) ON DELETE CASCADE UNIQUE NOT NULL',
    current_step: "VARCHAR(100) NOT NULL DEFAULT 'business_details'",
    completed_steps: "JSONB DEFAULT '[]'",
    completion_percent: 'INTEGER DEFAULT 0',
    last_saved_at: 'TIMESTAMP DEFAULT NOW()',
    is_submitted: 'BOOLEAN DEFAULT false',
    created_at: 'TIMESTAMP DEFAULT NOW()',
    updated_at: 'TIMESTAMP DEFAULT NOW()'
  },

  STEP_STATUS,
  STEPS: ONBOARDING_STEPS
};

module.exports = OnboardingProgress;
