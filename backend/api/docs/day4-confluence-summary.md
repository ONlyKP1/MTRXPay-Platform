# Day 4: Merchant Onboarding Backend - Complete Summary

**Date:** March 18, 2026
**Branch:** `feature/backend-day4-merchant-onboarding`
**Commit:** `fbe908e` - feat: merchant onboarding backend (Day 4)
**Files Changed:** 48 files, +12,995 lines

---

## Overview

Day 4 focused on building the complete merchant onboarding backend infrastructure, including database models, services, API endpoints, authorization, progress tracking, submission validation, admin review lifecycle, API documentation, and comprehensive testing.

---

## What Was Built

### 1. Database Models & Migrations

#### New Tables Created

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `merchants` | Core merchant business profile | legal_business_name, business_type, status, industry_type |
| `merchant_addresses` | Business addresses | address_type, address_line1, city, postcode, country |
| `beneficial_owners` | Owners, directors, shareholders | first_name, last_name, role, ownership_percentage |
| `documents` | Document metadata and verification | document_type, file_name, status |
| `onboarding_progress` | Progress tracking per merchant | completed_steps, is_submitted |
| `kyc_submissions` | KYC/KYB submission records | status, reviewed_by, risk_level |
| `audit_logs` | Compliance audit trail | action, user_id, merchant_id, details |

#### Migration Files
- `005_onboarding_entities.sql` - Core onboarding tables
- `006_add_missing_indexes.sql` - Performance indexes
- `007_audit_logs.sql` - Audit logging infrastructure

---

### 2. Service Layer Architecture

The service layer implements all business logic, keeping controllers thin:

#### merchantService.js
```javascript
createMerchantProfile(data, userId)   // Create new merchant
getMerchantById(merchantId)           // Get by ID
getMerchantForUser(userId)            // Get user's merchant
updateMerchantProfile(merchantId, data) // Update profile
updateMerchantStatus(merchantId, status) // Change status
```

#### progressService.js
```javascript
calculateProgress(merchantId)  // Full progress calculation
getProgressSummary(merchantId) // Simplified summary

// Sections tracked:
// - account_created (10%)
// - merchant_profile (25%)
// - address (20%)
// - owners (20%)
// - documents (25%)
```

#### submissionService.js
```javascript
validateSubmissionRules(merchantId)     // Pre-submission check
processSubmission(merchantId, userId)   // Submit for review
checkRegistrationRequired(merchant)     // Country-specific rules

// Validates:
// - All required fields present
// - Country-specific requirements (UK company reg number)
// - Document requirements by business type
// - No rejected documents
```

#### reviewService.js
```javascript
markUnderReview(merchantId, adminUserId)  // Start review
markApproved(merchantId, adminUserId, options) // Approve
markRejected(merchantId, adminUserId, options) // Reject
requestMoreInfo(merchantId, adminUserId, options) // Request info
addReviewNote(merchantId, adminUserId, note) // Add internal note
getReviewHistory(merchantId)              // Full audit trail
getPendingReview(options)                 // Review queue
reviewDocument(documentId, adminUserId, status) // Document review
```

#### auditService.js
```javascript
log(event)  // Log audit event
getLogsForMerchant(merchantId) // Get merchant's audit history

// Events logged:
// - ONBOARDING_SUBMITTED
// - MERCHANT_APPROVED
// - MERCHANT_REJECTED
// - DOCUMENT_REVIEWED
// - STATUS_CHANGED
// - REVIEW_NOTE_ADDED
```

#### documentService.js
```javascript
createDocumentRecord(merchantId, data, userId)
getDocumentById(documentId)
listMerchantDocuments(merchantId, filters)
updateDocumentStatus(documentId, status)
deleteDocument(documentId)
```

#### onboardingService.js
```javascript
saveBusinessDetails(merchantId, data)
addBeneficialOwner(merchantId, data)
updateBeneficialOwner(ownerId, data)
deleteBeneficialOwner(ownerId, merchantId)
getBeneficialOwners(merchantId)
saveAddress(merchantId, data)
getAddresses(merchantId)
```

---

### 3. API Endpoints (20 Total)

#### Merchant Profile Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/merchants` | Create merchant profile |
| GET | `/api/merchants/me` | Get current user's merchant |
| PATCH | `/api/merchants/:merchantId` | Update merchant profile |
| GET | `/api/merchants/:merchantId` | Get merchant (public info) |

#### Onboarding Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/onboarding/:merchantId` | Get full onboarding data |
| PUT | `/api/onboarding/:merchantId/business-details` | Save business details |
| GET | `/api/onboarding/:merchantId/progress` | Get progress summary |
| GET | `/api/onboarding/:merchantId/validate` | Validate submission rules |
| POST | `/api/onboarding/:merchantId/submit` | Submit for review |

#### Owner/Director Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/onboarding/:merchantId/owners` | Add owner/director |
| GET | `/api/onboarding/:merchantId/owners` | List all owners |
| PATCH | `/api/onboarding/:merchantId/owners/:ownerId` | Update owner |
| DELETE | `/api/onboarding/:merchantId/owners/:ownerId` | Remove owner |

#### Document Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/onboarding/:merchantId/documents` | Create document record |
| GET | `/api/onboarding/:merchantId/documents` | List documents (with filters) |

#### Admin Review Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/merchants` | List all merchants (paginated) |
| GET | `/api/admin/pending` | Get review queue |
| GET | `/api/admin/merchants/:merchantId` | Get merchant details |
| POST | `/api/admin/merchants/:merchantId/under-review` | Start review |
| POST | `/api/admin/merchants/:merchantId/approve` | Approve merchant |
| POST | `/api/admin/merchants/:merchantId/reject` | Reject merchant |
| POST | `/api/admin/merchants/:merchantId/notes` | Add review note |
| GET | `/api/admin/merchants/:merchantId/history` | Get review history |
| PATCH | `/api/admin/documents/:documentId/status` | Update document status |

---

### 4. Authorization Middleware

#### authorize.js
```javascript
requireMerchantOwner   // Ensures user owns the merchant
requireAdmin           // Ensures user has admin role
requireAdminOrMerchantOwner  // Either admin or owner
```

**Security Features:**
- All merchant operations verify ownership
- Admin endpoints require admin role
- Cross-user access blocked (verified in QA)
- All sensitive operations logged

---

### 5. Validation Layer

Field-based validation with structured error responses:

```javascript
// Example validation error response
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "legalBusinessName": "Required",
    "businessType": "Must be one of: sole_trader, limited_company, llp, partnership, plc"
  }
}
```

**Validators Created:**
- `validateMerchantProfile` - Merchant creation/update
- `validateBusinessDetails` - Business details update
- `validateBeneficialOwner` - Owner/director data
- `validateDocumentUpload` - Document metadata
- `validateAddress` - Address data

---

### 6. Merchant Status Lifecycle

```
draft → pending_submission → under_review → approved
                                        ↓
                                   rejected
                                        ↓
                              info_requested → submitted
```

| From | To | Triggered By |
|------|-----|--------------|
| draft | pending_submission | Merchant submits |
| pending_submission | under_review | Admin starts review |
| under_review | approved | Admin approves |
| under_review | rejected | Admin rejects |
| under_review | info_requested | Admin requests info |
| info_requested | pending_submission | Merchant resubmits |
| rejected | draft | Merchant edits (if allowed) |

---

### 7. Progress Calculation

| Section | Weight | Requirements |
|---------|--------|--------------|
| Account Created | 10% | User registered |
| Merchant Profile | 25% | Business details complete |
| Address | 20% | Registered address added |
| Owners | 20% | Required owners added (for companies) |
| Documents | 25% | Required documents uploaded |

**canSubmit Logic:**
```javascript
canSubmit = (
  profileComplete &&
  hasRegisteredAddress &&
  ownersComplete &&    // if required for business type
  documentsComplete &&
  noRejectedDocuments
);
```

---

### 8. Document Requirements

#### By Business Type
| Business Type | Required Documents |
|---------------|-------------------|
| Sole Trader | ID Proof |
| Limited Company | ID Proof, Business Registration |
| Partnership | ID Proof |
| LLP | ID Proof, Business Registration |
| PLC | ID Proof, Business Registration |

#### Document Statuses
- `uploaded` - File uploaded, pending review
- `pending_review` - Under admin review
- `approved` - Admin verified
- `rejected` - Admin rejected (blocks submission)

---

### 9. API Documentation

#### Swagger/OpenAPI
- **URL:** `http://localhost:3000/api-docs`
- **JSON Spec:** `http://localhost:3000/api-docs.json`
- **File:** `src/config/swagger.js`

#### Postman Collection
- **File:** `docs/postman-collection.json`
- **Features:**
  - All 20 endpoints organized by category
  - Example request/response bodies
  - Auto-extraction of auth token and merchantId
  - Environment variables for easy switching

---

## Testing

### Unit Tests (47 Tests - All Pass)

| Test File | Tests | Coverage |
|-----------|-------|----------|
| `merchantService.test.js` | 9 | 94.87% |
| `progressService.test.js` | 8 | 97.24% |
| `submissionService.test.js` | 9 | 83.90% |
| `reviewService.test.js` | 16 | 97.43% |
| `merchant.test.js` (integration) | 1 | - |

**Test Execution:**
```bash
npm test

Test Suites: 5 passed, 5 total
Tests:       47 passed, 47 total
Time:        0.866s
```

### Manual QA Checklist (17 Tests - All Pass)

| # | Test | Status |
|---|------|--------|
| 1 | User registration | ✅ PASS |
| 2 | User login - token received | ✅ PASS |
| 3 | Create merchant as logged-in user | ✅ PASS |
| 4 | Retrieve own merchant profile | ✅ PASS |
| 5 | Update business details | ✅ PASS |
| 6 | Add first owner/director | ✅ PASS |
| 7 | Add second owner/director | ✅ PASS |
| 8 | Multiple owners listed correctly | ✅ PASS |
| 9 | Create ID proof document | ✅ PASS |
| 10 | Create business registration document | ✅ PASS |
| 11 | Progress endpoint returns completion percent | ✅ PASS |
| 12 | Progress includes section details | ✅ PASS |
| 13 | Incomplete onboarding cannot submit | ✅ PASS |
| 14 | Submit endpoint responds correctly | ✅ PASS |
| 15 | Other user cannot access merchant data | ✅ PASS |
| 16 | Other user cannot update merchant data | ✅ PASS |
| 17 | Merchant has status field | ✅ PASS |

**QA Script:**
```bash
BASE_URL=http://localhost:3000 ./scripts/qa-checklist.sh
```

---

## Standardized API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "fieldName": "Field-specific error message"
  }
}
```

### Response Utilities
```javascript
success(res, data, message, status)  // Success response
created(res, data, message)          // 201 Created
validationError(res, message, errors) // 400 with field errors
notFoundError(res, message)          // 404 Not Found
forbiddenError(res, message)         // 403 Forbidden
serverError(res, message, error)     // 500 Internal Error
```

---

## File Structure

```
backend/api/
├── src/
│   ├── app.js                    # Express app (for testing)
│   ├── config/
│   │   └── swagger.js            # OpenAPI configuration
│   ├── middleware/
│   │   ├── authorize.js          # Authorization middleware
│   │   └── validators/
│   │       ├── index.js
│   │       └── onboarding.js     # Field-based validators
│   ├── models/
│   │   ├── BeneficialOwner.js
│   │   ├── Document.js
│   │   ├── KycSubmission.js
│   │   ├── Merchant.js
│   │   ├── MerchantAddress.js
│   │   └── OnboardingProgress.js
│   ├── modules/
│   │   ├── admin/
│   │   │   └── routes.js         # Admin review endpoints
│   │   ├── merchant/
│   │   │   └── routes.js         # Merchant CRUD endpoints
│   │   └── onboarding/
│   │       └── routes.js         # Onboarding flow endpoints
│   ├── services/
│   │   ├── auditService.js       # Compliance logging
│   │   ├── documentService.js    # Document management
│   │   ├── merchantService.js    # Merchant operations
│   │   ├── onboardingService.js  # Onboarding data
│   │   ├── progressService.js    # Progress calculation
│   │   ├── reviewService.js      # Admin review lifecycle
│   │   └── submissionService.js  # Submission validation
│   ├── shared/
│   │   └── constants.js          # Enums and constants
│   └── utils/
│       └── response.js           # Standardized responses
├── tests/
│   ├── setup.js                  # Jest setup with mocks
│   ├── integration/
│   │   └── merchant.test.js
│   └── unit/services/
│       ├── merchantService.test.js
│       ├── progressService.test.js
│       ├── reviewService.test.js
│       └── submissionService.test.js
├── docs/
│   ├── day4-implementation.md
│   └── postman-collection.json
├── scripts/
│   └── qa-checklist.sh           # Manual QA test script
└── jest.config.js
```

---

## Dependencies Added

```json
{
  "dependencies": {
    "swagger-jsdoc": "^6.x",
    "swagger-ui-express": "^5.x"
  },
  "devDependencies": {
    "jest": "^29.x",
    "supertest": "^7.x"
  }
}
```

---

## Key Decisions & Notes

### Architecture Decisions
1. **Service Layer Pattern** - Controllers stay thin, all business logic in services
2. **Field-based Validation Errors** - Frontend-friendly error format with field mapping
3. **Audit Logging** - All sensitive operations logged for compliance
4. **Modular Routes** - Each domain has its own module folder

### Security Considerations
1. All merchant operations verify ownership via `requireMerchantOwner`
2. Admin endpoints protected by `requireAdmin` middleware
3. Cross-user access blocked and verified in QA tests
4. Audit logging for compliance and debugging

### API Design
1. Snake_case field names in API (matches database)
2. Consistent response format across all endpoints
3. Field-level validation errors for form handling
4. Pagination for list endpoints

---

## Next Steps (Day 5)

1. File upload integration with cloud storage (S3/GCS)
2. Document verification workflow
3. Email notifications for status changes
4. Webhook integration for external systems
5. Rate limiting and abuse prevention

---

## Summary

| Metric | Value |
|--------|-------|
| Files Changed | 48 |
| Lines Added | 12,995 |
| Lines Removed | 1,108 |
| New Services | 7 |
| New Models | 6 |
| API Endpoints | 20 |
| Unit Tests | 47 (100% pass) |
| QA Tests | 17 (100% pass) |
| Service Coverage | 83-97% |
