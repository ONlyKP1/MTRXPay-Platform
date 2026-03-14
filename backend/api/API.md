# MTRX Pay API Documentation

## Base URL

```
Development: http://localhost:3000
```

## Auth Header Format

All protected endpoints require:
```
Authorization: Bearer <token>
```

## Sample User Credentials (Seeded)

| Email | Password | Role |
|-------|----------|------|
| user@testcompany.com | password123 | merchant |
| admin@mtrxpay.com | password123 | admin |

---

## Endpoints

### Health Check

#### `GET /health`
Check if API is running.

**Response:**
```json
{
  "status": "ok",
  "database": "connected"
}
```

---

### Authentication

#### `POST /api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "full_name": "string (required)",
  "email": "string (required, valid email)",
  "password": "string (required, min 6 chars)"
}
```

**Success Response (201):**
```json
{
  "token": "eyJhbG...",
  "user": {
    "id": "uuid",
    "full_name": "Test User",
    "email": "test@example.com",
    "role": "merchant"
  }
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "error": {
    "type": "VALIDATION_ERROR",
    "message": "Email is required",
    "errors": ["Email is required", "Password is required"]
  }
}
```

---

#### `POST /api/auth/login`
Login with credentials.

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbG...",
  "user": {
    "id": "uuid",
    "full_name": "Test User",
    "email": "user@testcompany.com",
    "role": "merchant",
    "merchant_id": "uuid or null"
  }
}
```

**Invalid Credentials (401):**
```json
{
  "error": "Invalid credentials"
}
```

---

#### `GET /api/me`
Get current authenticated user.

**Auth Required:** Yes

**Success Response (200):**
```json
{
  "id": "uuid",
  "full_name": "Test User",
  "email": "user@testcompany.com",
  "role": "merchant",
  "merchant_id": "uuid or null"
}
```

---

### Onboarding

#### `GET /api/onboarding`
Get onboarding status for current user.

**Auth Required:** Yes

**Success Response (200) - Has Onboarding:**
```json
{
  "id": "uuid",
  "merchant_id": "uuid",
  "status": "draft | submitted | approved | rejected",
  "submitted_at": "timestamp or null",
  "reviewed_at": "timestamp or null",
  "notes": "string or null",
  "updated_at": "timestamp"
}
```

**Success Response (200) - No Onboarding:**
```json
{
  "status": "not_started",
  "data": null
}
```

---

#### `POST /api/onboarding`
Create onboarding (and merchant if needed).

**Auth Required:** Yes

**Request Body:**
```json
{
  "business_name": "string (required, max 255)",
  "trading_name": "string (optional, max 255)",
  "notes": "string (optional)"
}
```

**Success Response (201):**
```json
{
  "onboarding": {
    "id": "uuid",
    "merchant_id": "uuid",
    "status": "draft",
    "notes": "string or null"
  },
  "merchant_id": "uuid"
}
```

---

#### `PUT /api/onboarding`
Update onboarding.

**Auth Required:** Yes (must have merchant_id)

**Request Body:**
```json
{
  "business_name": "string (optional)",
  "trading_name": "string (optional)",
  "notes": "string (optional)",
  "status": "submitted (optional, only if current status is draft)"
}
```

**Success Response (200):**
```json
{
  "id": "uuid",
  "merchant_id": "uuid",
  "status": "draft | submitted",
  "submitted_at": "timestamp or null",
  "notes": "string or null",
  "updated_at": "timestamp"
}
```

---

## Error Response Shapes

### Validation Error (400)
```json
{
  "success": false,
  "error": {
    "type": "VALIDATION_ERROR",
    "message": "Human readable message",
    "errors": ["Array of all validation errors"]
  }
}
```

### Auth Error (401)
```json
{
  "success": false,
  "error": {
    "type": "AUTH_ERROR",
    "message": "No token provided | Invalid token | User not found"
  }
}
```

### Forbidden Error (403)
```json
{
  "success": false,
  "error": {
    "type": "FORBIDDEN_ERROR",
    "message": "Admin access required | Merchant access required"
  }
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "error": {
    "type": "NOT_FOUND_ERROR",
    "message": "Resource not found"
  }
}
```

### Server Error (500)
```json
{
  "success": false,
  "error": {
    "type": "SERVER_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

---

## Quick Start for Frontend

```javascript
const API_URL = 'http://localhost:3000';

// Login
const login = async (email, password) => {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
};

// Authenticated request
const fetchMe = async () => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/api/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
};
```

---

## Setup Commands

```bash
cd backend/api
npm install
npm run migrate    # Run database migrations
npm run seed       # Add test data
npm run dev        # Start with hot reload
npm start          # Start server
```
