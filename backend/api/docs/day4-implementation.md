# Day 4 Implementation: Merchant Onboarding Backend

## Overview

Day 4 focuses on building the complete merchant onboarding backend infrastructure, including database models, services, endpoints, authorization, progress tracking, submission validation, and admin review lifecycle.

## What Was Built

### 1. Database Models & Migrations

#### New Tables Created

| Table | Purpose |
|-------|---------|
| `merchants` | Core merchant business profile data |
| `merchant_addresses` | Business addresses (registered, trading, etc.) |
| `merchant_owners` | Business owners, directors, shareholders |
| `merchant_documents` | Document metadata and verification status |
| `onboarding_progress` | Progress tracking per merchant |
| `audit_logs` | Compliance audit trail |

#### Key Migration Files

- `005_onboarding_tables.sql` - Core onboarding tables
- `006_document_tables.sql` - Document management
- `007_audit_logs.sql` - Audit logging infrastructure

### 2. Service Layer

The service layer implements business logic, keeping controllers thin:

#### merchantService.js
```javascript
// Core merchant operations
createMerchantProfile(data, userId)
getMerchantById(merchantId)
getMerchantForUser(userId)
updateMerchantProfile(merchantId, data)
updateMerchantStatus(merchantId, status)
```

#### progressService.js
```javascript
// Progress calculation
calculateProgress(merchantId)
getProgressSummary(merchantId)
updateCompletedSteps(merchantId, steps)

// Sections tracked:
// - account_created
// - merchant_profile
// - address
// - owners
// - documents
// - submitted
```

#### submissionService.js
```javascript
// Submission validation
validateSubmissionRules(merchantId)
processSubmission(merchantId, userId)
checkRegistrationRequired(merchant)

// Validates:
// - Required fields present
// - Country-specific requirements
// - Document requirements by business type
// - No rejected documents
```

#### reviewService.js
```javascript
// Admin review lifecycle
markUnderReview(merchantId, adminUserId)
markApproved(merchantId, adminUserId, options)
markRejected(merchantId, adminUserId, options)
requestMoreInfo(merchantId, adminUserId, options)
addReviewNote(merchantId, adminUserId, note, noteType)
getReviewHistory(merchantId)
```

#### auditService.js
```javascript
// Compliance logging
log(event) // { action, userId, merchantId, details }

// Events logged:
// - ONBOARDING_SUBMITTED
// - MERCHANT_APPROVED
// - MERCHANT_REJECTED
// - DOCUMENT_UPLOADED
// - STATUS_CHANGED
```

### 3. API Endpoints

#### Merchant Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/merchant/profile` | Create merchant profile |
| GET | `/api/merchant/profile` | Get current user's merchant |
| PUT | `/api/merchant/profile` | Update merchant details |
| GET | `/api/merchant/:id` | Get merchant by ID (admin/owner) |

#### Onboarding
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/onboarding/progress` | Get progress summary |
| POST | `/api/onboarding/submit` | Submit for review |
| POST | `/api/onboarding/addresses` | Add business address |
| GET | `/api/onboarding/addresses` | List addresses |
| PUT | `/api/onboarding/addresses/:id` | Update address |
| DELETE | `/api/onboarding/addresses/:id` | Remove address |

#### Owners
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/onboarding/owners` | Add owner/director |
| GET | `/api/onboarding/owners` | List owners |
| PUT | `/api/onboarding/owners/:id` | Update owner |
| DELETE | `/api/onboarding/owners/:id` | Remove owner |

#### Documents
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/documents` | Upload document metadata |
| GET | `/api/documents` | List merchant documents |
| GET | `/api/documents/:id` | Get document details |
| DELETE | `/api/documents/:id` | Remove document |

#### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/merchants` | List all merchants |
| GET | `/api/admin/merchants/:id` | Get merchant details |
| POST | `/api/admin/merchants/:id/review` | Start review |
| POST | `/api/admin/merchants/:id/approve` | Approve merchant |
| POST | `/api/admin/merchants/:id/reject` | Reject merchant |
| POST | `/api/admin/merchants/:id/request-info` | Request more info |

### 4. Authorization Middleware

#### authorize.js
```javascript
// Middleware functions
requireMerchantOwner   // Ensures user owns the merchant
requireAdmin           // Ensures user has admin role
requireAdminOrMerchantOwner  // Either admin or owner
```

Usage:
```javascript
router.put('/profile',
  authenticate,
  requireMerchantOwner,
  updateMerchant
);

router.post('/:id/approve',
  authenticate,
  requireAdmin,
  approveMerchant
);
```

### 5. Validation Layer

Field-based validation with structured error responses:

```javascript
// Request validation
const validateMerchantProfile = (req, res, next) => {
  const errors = {};

  if (!isNonEmptyString(legalBusinessName)) {
    errors.legalBusinessName = 'Required';
  }

  if (Object.keys(errors).length > 0) {
    return validationError(res, 'Validation failed', errors);
  }

  next();
};
```

### 6. Standardized API Responses

All responses follow a consistent format:

#### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "fieldName": "Field-specific error"
  }
}
```

#### Response Utilities
```javascript
success(res, data, message, status)
created(res, data, message)
validationError(res, message, errors)
notFoundError(res, message)
forbiddenError(res, message)
serverError(res, message, error)
```

## Merchant Status Lifecycle

```
draft → submitted → under_review → approved
                              ↓
                         rejected
                              ↓
                    info_requested → submitted
```

### Status Transitions

| From | To | Triggered By |
|------|-----|--------------|
| draft | submitted | Merchant submits |
| submitted | under_review | Admin starts review |
| under_review | approved | Admin approves |
| under_review | rejected | Admin rejects |
| under_review | info_requested | Admin requests info |
| info_requested | submitted | Merchant resubmits |
| rejected | draft | Merchant edits and resubmits |

## Progress Calculation

Progress is calculated based on section completion:

| Section | Weight | Requirements |
|---------|--------|--------------|
| Account Created | 10% | User registered |
| Merchant Profile | 25% | Business details complete |
| Address | 20% | Registered address added |
| Owners | 20% | Required owners added |
| Documents | 25% | Required documents uploaded |

### canSubmit Logic
```javascript
canSubmit = (
  profileComplete &&
  hasRegisteredAddress &&
  ownersComplete &&
  documentsComplete &&
  noRejectedDocuments
);
```

## Document Requirements

### By Business Type
| Business Type | Required Documents |
|---------------|-------------------|
| Sole Trader | ID Proof |
| Limited Company | ID Proof, Business Registration |
| Partnership | ID Proof, Partnership Agreement |
| LLP | ID Proof, Business Registration |

### Document Statuses
- `pending` - Awaiting upload
- `uploaded` - File uploaded
- `verified` - Admin verified
- `rejected` - Admin rejected

## Testing

### Unit Tests
```
tests/unit/services/
├── merchantService.test.js
├── progressService.test.js
├── submissionService.test.js
└── reviewService.test.js
```

### Integration Tests
```
tests/integration/
└── merchant.test.js
```

### Running Tests
```bash
npm test              # Run all tests
npm run test:unit     # Unit tests only
npm run test:int      # Integration tests only
npm run test:coverage # With coverage report
```

## File Structure

```
src/
├── modules/
│   ├── merchant/
│   │   ├── routes.js
│   │   └── controller.js
│   ├── onboarding/
│   │   ├── routes.js
│   │   └── controller.js
│   ├── documents/
│   │   ├── routes.js
│   │   └── controller.js
│   └── admin/
│       ├── routes.js
│       └── controller.js
├── services/
│   ├── merchantService.js
│   ├── onboardingService.js
│   ├── documentService.js
│   ├── progressService.js
│   ├── submissionService.js
│   ├── reviewService.js
│   └── auditService.js
├── middleware/
│   ├── authorize.js
│   └── validators/
│       ├── onboarding.js
│       ├── documents.js
│       └── owners.js
└── utils/
    └── response.js
```

## Security Considerations

1. **Authorization**: All merchant operations verify ownership
2. **Role-based Access**: Admin endpoints require admin role
3. **Input Validation**: All inputs validated before processing
4. **Audit Logging**: All sensitive operations logged
5. **SQL Injection**: Parameterized queries throughout

## Next Steps (Day 5)

1. File upload integration with cloud storage
2. Document verification workflow
3. Email notifications for status changes
4. Webhook integration for external systems
5. Rate limiting and abuse prevention
