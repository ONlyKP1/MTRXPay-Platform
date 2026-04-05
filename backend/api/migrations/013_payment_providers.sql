-- Migration 013: Payment Providers & Routing
-- Day 7: Payment route selection and orchestration

-- Payment providers (OnRamps)
CREATE TABLE IF NOT EXISTS payment_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Provider identity
    code VARCHAR(50) UNIQUE NOT NULL,           -- e.g., 'ONRAMP_A', 'ONRAMP_B'
    name VARCHAR(100) NOT NULL,                  -- Display name
    description TEXT,
    logo_url VARCHAR(500),

    -- Provider type
    provider_type VARCHAR(30) NOT NULL DEFAULT 'ONRAMP',  -- ONRAMP, OFFRAMP, BOTH

    -- Fee structure
    fee_percentage DECIMAL(5, 3) NOT NULL,       -- e.g., 3.100 for 3.1%
    fee_fixed DECIMAL(10, 2) DEFAULT 0,          -- Fixed fee component
    fee_currency VARCHAR(10) DEFAULT 'GBP',

    -- Performance metrics
    approval_rate VARCHAR(20) DEFAULT 'MEDIUM',  -- HIGH, MEDIUM_HIGH, MEDIUM, LOW
    approval_rate_value DECIMAL(5, 2),           -- Actual percentage if known
    settlement_hours_min INT DEFAULT 24,
    settlement_hours_max INT DEFAULT 48,

    -- Supported currencies
    supported_currencies JSONB DEFAULT '["GBP", "EUR", "USD"]',

    -- Supported countries
    supported_countries JSONB DEFAULT '["GB", "EU"]',

    -- Industry restrictions (which industries this provider WON'T serve)
    restricted_industries JSONB DEFAULT '[]',

    -- Preferred industries (which industries this provider specializes in)
    preferred_industries JSONB DEFAULT '[]',

    -- Volume limits
    min_transaction DECIMAL(18, 2) DEFAULT 10,
    max_transaction DECIMAL(18, 2) DEFAULT 100000,
    daily_limit DECIMAL(18, 2),
    monthly_limit DECIMAL(18, 2),

    -- Status
    is_active BOOLEAN DEFAULT true,
    is_recommended BOOLEAN DEFAULT false,        -- Default recommendation
    priority INT DEFAULT 100,                    -- Lower = higher priority

    -- Integration details (encrypted in production)
    api_endpoint VARCHAR(500),
    webhook_url VARCHAR(500),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Provider routing rules
CREATE TABLE IF NOT EXISTS routing_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Rule identity
    name VARCHAR(100) NOT NULL,
    description TEXT,

    -- Rule conditions (JSONB for flexibility)
    conditions JSONB NOT NULL,
    -- Example: {"industry": "gaming", "country": "GB", "amount_min": 100}

    -- Provider to route to
    provider_id UUID REFERENCES payment_providers(id),

    -- Rule priority (lower = evaluated first)
    priority INT DEFAULT 100,

    -- Boost or penalty to provider score
    score_modifier INT DEFAULT 0,  -- +10 boosts, -10 penalizes

    -- Rule status
    is_active BOOLEAN DEFAULT true,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Merchant provider preferences
CREATE TABLE IF NOT EXISTS merchant_provider_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    provider_id UUID NOT NULL REFERENCES payment_providers(id),

    -- Preference type
    preference_type VARCHAR(20) NOT NULL,  -- 'PREFERRED', 'BLOCKED', 'DEFAULT'

    -- Custom fee override (if negotiated)
    custom_fee_percentage DECIMAL(5, 3),

    -- Notes
    notes TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(merchant_id, provider_id)
);

-- Route selection history (audit trail)
CREATE TABLE IF NOT EXISTS route_selections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Transaction context
    transaction_id UUID REFERENCES transactions(id),
    merchant_id UUID REFERENCES merchants(id),
    user_id UUID REFERENCES users(id),

    -- Request details
    amount DECIMAL(18, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL,

    -- What we recommended
    recommended_provider_id UUID REFERENCES payment_providers(id),
    recommended_reason TEXT,

    -- All options presented
    options_presented JSONB NOT NULL,  -- Array of provider options with scores

    -- What user selected
    selected_provider_id UUID REFERENCES payment_providers(id),
    user_overrode_recommendation BOOLEAN DEFAULT false,

    -- Outcome
    selection_outcome VARCHAR(30),  -- 'ACCEPTED', 'CHANGED', 'CANCELLED'

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_providers_active ON payment_providers(is_active);
CREATE INDEX idx_providers_type ON payment_providers(provider_type);
CREATE INDEX idx_routing_rules_priority ON routing_rules(priority) WHERE is_active = true;
CREATE INDEX idx_merchant_prefs_merchant ON merchant_provider_preferences(merchant_id);
CREATE INDEX idx_route_selections_merchant ON route_selections(merchant_id);
CREATE INDEX idx_route_selections_created ON route_selections(created_at);

-- Seed initial providers
INSERT INTO payment_providers (code, name, description, fee_percentage, approval_rate, approval_rate_value, settlement_hours_min, settlement_hours_max, priority, is_recommended)
VALUES
    ('ONRAMP_A', 'OnRamp A', 'Premium provider with high approval rates', 3.100, 'HIGH', 94.5, 24, 48, 10, true),
    ('ONRAMP_B', 'OnRamp B', 'Cost-effective option with good approval', 2.400, 'MEDIUM_HIGH', 87.0, 48, 72, 20, false),
    ('ONRAMP_C', 'OnRamp C', 'Standard provider', 3.500, 'MEDIUM', 78.5, 48, 72, 30, false),
    ('ONRAMP_D', 'OnRamp D', 'Budget option with lower approval', 2.900, 'LOW', 65.0, 72, 96, 40, false)
ON CONFLICT (code) DO NOTHING;
