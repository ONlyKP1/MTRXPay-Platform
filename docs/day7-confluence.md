# Day 7: Payment Orchestration & Route Selection

**Date:** 2026-04-05
**Branch:** feat/day-7-payment-routing
**PR:** #9 (merged to develop)

---

## Overview

Built a complete payment orchestration system that recommends the best payment provider based on transaction parameters.

**Key Principle:** "We suggest, not force" - regulatory positioning. The system recommends the best provider but always gives the user choice.

---

## Architecture

### Frontend (apps/web)

| File | Purpose |
|------|---------|
| `src/types/orchestration.ts` | TypeScript interfaces |
| `src/data/providers.ts` | Provider data |
| `src/services/filterProviders.ts` | Filter by region, currency, category |
| `src/services/scoreProviders.ts` | Scoring algorithm |
| `src/services/orchestrate.ts` | Main orchestration logic |
| `src/routes/orchestrate.ts` | Express API route |
| `src/server.ts` | Express server (port 3001) |
| `src/components/RouteSelector.tsx` | UI component |
| `src/components/RouteSelector.css` | MIDAS brand styling |
| `src/pages/RouteSelectorDemo.tsx` | Demo page |

### Backend (backend/api)

| File | Purpose |
|------|---------|
| `migrations/013_payment_providers.sql` | Database schema |
| `src/models/PaymentProvider.js` | Provider model & constants |
| `src/services/routingEngine.js` | Routing logic |
| `src/routes/providers.routes.js` | API endpoints |

---

## Scoring Algorithm

```typescript
const feeScore = Math.max(0, 100 - provider.baseFee * 20);
const successScore = provider.successRate;
const speedScore = provider.speedScore;
const riskScorePenalty = provider.riskScore;

const total = feeScore * 0.3 + successScore * 0.4 + speedScore * 0.2 - riskScorePenalty * 0.1;
```

**Weights:**
- Success Rate: 40%
- Fee: 30%
- Speed: 20%
- Risk Penalty: 10%

---

## Providers Configured

| ID | Name | Type | Fee | Success Rate | Speed Score | Risk | Speed Label |
|----|------|------|-----|--------------|-------------|------|-------------|
| banxa | Banxa | onramp | 1.2% | 92% | 90 | 20 | Instant |
| transak | Transak | onramp | 1.5% | 89% | 80 | 25 | 5 mins |
| onramper | Onramper | onramp | 1.1% | 84% | 70 | 35 | 15 mins |
| dummyoff1 | Offramp One | offramp | 1.4% | 88% | 85 | 22 | 5 mins |

### Provider Regions & Categories

| Provider | Regions | Categories |
|----------|---------|------------|
| Banxa | UK, EU, UAE | ticketing, digital, wellness |
| Transak | UK, EU, USA | ticketing, digital |
| Onramper | UK, EU | digital, wellness |
| Offramp One | UK, EU | ticketing, digital, wellness |

---

## API

### POST /api/orchestrate

**Request:**
```json
{
  "amount": 250,
  "currency": "GBP",
  "country": "UK",
  "merchantCategory": "ticketing",
  "type": "onramp"
}
```

**Response:**
```json
{
  "recommended": {
    "providerId": "banxa",
    "reason": "Best combination of fee, approval likelihood and speed"
  },
  "options": [
    {
      "providerId": "banxa",
      "name": "Banxa",
      "fee": 1.2,
      "score": 76,
      "speedLabel": "Instant",
      "recommended": true
    },
    {
      "providerId": "transak",
      "name": "Transak",
      "fee": 1.5,
      "score": 70,
      "speedLabel": "5 mins",
      "recommended": false
    }
  ]
}
```

---

## Test Results

| Test | Scenario | Result |
|------|----------|--------|
| 1 | UK/GBP/Ticketing/Onramp | ✅ PASS - Banxa (76) recommended, Transak (70) |
| 2 | EU/EUR/Digital/Onramp | ✅ PASS - 3 providers: Banxa (76), Transak (70), Onramper (68) |
| 3 | UK/GBP/Wellness/Onramp | ✅ PASS - Banxa (76), Onramper (68) |
| 4 | UK/GBP/Ticketing/Offramp | ✅ PASS - Offramp One (72) |
| 5 | USA/USD/Wellness (no match) | ✅ PASS - Empty response |
| 6 | Missing fields (validation) | ✅ PASS - 400 error |
| 7 | Health check | ✅ PASS - {"ok": true} |

**All 7 tests passing.**

---

## How to Run

```bash
# Terminal 1: Start orchestration server
cd apps/web && npm run dev:server

# Terminal 2: Start frontend
cd apps/web && npm run dev

# Browser: Visit demo page
http://localhost:5173/demo/routes
```

---

## Database Schema

### payment_providers
- id, code, name, description, logo_url
- provider_type (ONRAMP, OFFRAMP, BOTH)
- fee_percentage, fee_fixed, fee_currency
- approval_rate, approval_rate_value
- settlement_hours_min, settlement_hours_max
- supported_currencies, supported_countries
- restricted_industries, preferred_industries
- min_transaction, max_transaction
- is_active, is_recommended, priority

### routing_rules
- id, name, description
- conditions (JSONB)
- provider_id, priority, score_modifier
- is_active

### merchant_provider_preferences
- id, merchant_id, provider_id
- preference_type (PREFERRED, BLOCKED, DEFAULT)
- custom_fee_percentage

### route_selections
- id, transaction_id, merchant_id, user_id
- amount, currency
- recommended_provider_id, recommended_reason
- options_presented, selected_provider_id
- user_overrode_recommendation, selection_outcome

---

## Key Files Changed

```
19 files changed, 3322 insertions(+)

apps/web/src/components/RouteSelector.css
apps/web/src/components/RouteSelector.tsx
apps/web/src/data/providers.ts
apps/web/src/pages/RouteSelectorDemo.tsx
apps/web/src/routes/orchestrate.ts
apps/web/src/server.ts
apps/web/src/services/filterProviders.ts
apps/web/src/services/orchestrate.ts
apps/web/src/services/scoreProviders.ts
apps/web/src/types/orchestration.ts
backend/api/migrations/013_payment_providers.sql
backend/api/src/models/PaymentProvider.js
backend/api/src/routes/providers.routes.js
backend/api/src/services/routingEngine.js
```

---

## Next Steps (Day 8)

- Integrate RouteSelector into payment flow
- Add merchant preference management UI
- Implement route selection analytics dashboard
- Connect to real provider APIs
