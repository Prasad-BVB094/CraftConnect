# 🧠 CRAFTCONNECT — BACKEND MASTER DOCUMENTATION
### FINAL · FROZEN · AUTHORITATIVE

> 📌 This document is the **single source of truth** for CraftConnect backend  
> 📦 Backend is **COMPLETE and FROZEN**  
> 🛑 No backend changes are permitted after this document  
> 🤝 Remaining work belongs entirely to frontend

---

# TABLE OF CONTENTS

1. Purpose of This Document  
2. Core Design Philosophy  
3. System Architecture Overview  
4. Authentication & Authorization (PHASE 1)  
5. Category System (PHASE 2)  
6. Product System (PHASE 3)  
7. Order System (PHASE 4)  
8. Review & Rating System (PHASE 5)  
9. Payment System (Razorpay Test Mode)  
10. Admin System (God Mode)  
11. Security & Trust Model  
12. Explicit Backend Assumptions  
13. Explicit Frontend Responsibilities  
14. What Is Frozen and Why  
15. Final Handover Declaration  

---

## 1️⃣ PURPOSE OF THIS DOCUMENT

This document exists to:

- Explain **what the backend does**
- Explain **why it does it that way**
- Explain **what it intentionally does NOT do**
- Explain **what frontend must implement**
- Eliminate **all ambiguity**
- Prevent **future backend edits**
- Act as a **handover contract**

If a frontend developer reads **only this document**, they must be able to:
- integrate correctly
- build UI safely
- avoid breaking backend guarantees
- understand every API decision

---

## 2️⃣ CORE DESIGN PHILOSOPHY (ABSOLUTE RULES)

### 2.1 Frontend Is the Ultimate Truth (UI/UX)

- Backend does NOT question UI structure
- Backend supports all fields UI displays
- Backend enforces **data integrity**, not UI flow

If frontend displays a field:
➡ backend supports it  
➡ backend does not redesign it  

---

### 2.2 Backend Is Law, Not Opinion

Backend is responsible for:
- security
- authorization
- ownership
- payment verification
- irreversible operations

Backend is NOT responsible for:
- styling
- form validation beyond safety
- UX flow correctness

---

### 2.3 Defensive Programming Scope

Backend is **selectively defensive**:

| Case | Backend Behavior |
|----|----|
| Authentication | Strict |
| Authorization | Strict |
| Payments | Strict |
| Admin actions | Strict |
| UI-driven IDs | Trusted |
| Product existence on review | Trusted |
| Category selection | Trusted |

This is intentional and documented.

---

## 3️⃣ SYSTEM ARCHITECTURE OVERVIEW

### 3.1 Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Razorpay (Test Mode)

---

### 3.2 High-Level Data Flow

User → Frontend → Backend API → Database  
Admin → Frontend → Backend API → Database  
Payment → Razorpay → Backend Verification → Database

---

### 3.3 Folder Structure (Conceptual)

```
models/
controllers/
routes/
middleware/
```

Each feature follows:
- Model → Controller → Routes → Middleware

---

## 4️⃣ AUTHENTICATION & AUTHORIZATION (PHASE 1 — LOCKED)

### 4.1 Roles

| Role | Description |
|----|----|
| user | Customer |
| artisan | Seller |
| admin | System controller |

---

### 4.2 Authentication Flow

1. User logs in
2. Backend issues JWT
3. Frontend stores token
4. Token sent via Authorization header
5. Middleware validates token
6. `req.user` attached

---

### 4.3 Authorization Enforcement

- `auth.middleware.js`  
  → verifies token  
  → attaches user  

- `requireRole(role)`  
  → blocks unauthorized access  

---

### 4.4 Artisan Approval Logic

- Artisan exists but cannot act until approved
- Approval controlled **only by admin**
- Rejection permanently deletes artisan

This prevents fake sellers.

---

### 4.5 Files (FROZEN)

```
models/User.js
controllers/auth.controller.js
middleware/auth.middleware.js
middleware/role.middleware.js
routes/auth.routes.js
```

🚫 **DO NOT EDIT**

---

## 5️⃣ CATEGORY SYSTEM (PHASE 2 — PERMANENTLY LOCKED)

### 5.1 Authority Rule

> Category data belongs **exclusively to backend**

Frontend MUST NOT:
- hardcode category name
- hardcode category description
- hardcode category slug

---

### 5.2 Category Schema (Intent Explained)

```js
name        → human readable title
slug        → URL-safe identifier
description → marketing + UX text
icon        → optional UI support
isActive    → soft delete mechanism
```

---

### 5.3 Slug Generation

- Auto-generated from name
- Lowercase
- Hyphen-separated
- Stable once created

Slug exists so frontend URLs never break.

---

### 5.4 Category Lifecycle

- Created by admin
- Updated by admin
- Deleted = disabled (`isActive = false`)
- Never physically removed

---

### 5.5 Category APIs

| Endpoint | Purpose |
|-------|--------|
| GET /categories | Show active categories |
| GET /categories/:slug | Category page |
| POST /categories | Admin create |
| PUT /categories/:id | Admin edit |
| DELETE /categories/:id | Admin disable |

---

### 5.6 Files (LOCKED FOREVER)

```
models/Category.js
controllers/category.controller.js
routes/category.routes.js
```

🧊 **Categories are DONE FOREVER**

---

## 6️⃣ PRODUCT SYSTEM (PHASE 3 — LOCKED)

### 6.1 Product Ownership

- Product belongs to ONE artisan
- Admin can override
- User cannot modify products

---

### 6.2 Product Schema (Intent)

```js
title       → display name
description → marketing text
price       → numeric, >= 0
stock       → inventory count
images      → array of URLs
category    → backend category reference
artisan     → owner
sku         → immutable identifier
isActive    → visibility control
```

---

### 6.3 SKU Philosophy

- Auto-generated
- Never editable
- Never meaningful to frontend logic
- Display-only

---

### 6.4 Product APIs (Artisan)

- Create
- Edit own product
- Delete own product
- View own products

---

### 6.5 Product APIs (Admin)

Admin can:
- edit any product
- disable any product
- delete any product

Admin edits are limited to:
- title
- price
- stock
- isActive

---

### 6.6 Files

```
models/Product.js
controllers/product.controller.js
routes/product.routes.js
controllers/admin.controller.js
```

---

## 7️⃣ ORDER SYSTEM (PHASE 4 — LOCKED)

### 7.1 Order Philosophy

- Orders are immutable after payment
- Payment controls finality
- Backend enforces ownership

---

### 7.2 Order Schema

```js
user
items[]
totalAmount
paymentStatus
timestamps
```

---

### 7.3 Order APIs

| Role | Capability |
|----|-----------|
| User | Place order, view own |
| Artisan | View related orders |
| Admin | View all |

---

### 7.4 Files

```
models/Order.js
controllers/order.controller.js
routes/order.routes.js
```

---

## 8️⃣ REVIEW & RATING SYSTEM (PHASE 5 — LOCKED)

### 8.1 Review Philosophy

- One review per user per product
- Backend enforces uniqueness
- Backend trusts frontend product ID

---

### 8.2 Review Schema

```js
product
user
rating (1–5)
comment
timestamps
```

---

### 8.3 Important Design Decision

Backend does NOT:
- verify product existence
- verify product active status

Reason:
- frontend controls review UI
- backend avoids redundant queries

This is **intentional and documented**.

---

### 8.4 Review APIs

| Endpoint | Purpose |
|-------|--------|
| GET /reviews/:productId | Public |
| POST /reviews | User |
| DELETE /admin/reviews/:id | Admin |

---

### 8.5 Files

```
models/Review.js
controllers/review.controller.js
routes/review.routes.js
```

---

## 9️⃣ PAYMENT SYSTEM — RAZORPAY (TEST MODE)

### 9.1 Payment Philosophy

- Backend is sole authority
- Frontend cannot fake payment
- Signature verification mandatory

---

### 9.2 Payment Lifecycle

1. Order placed
2. Payment order created
3. Razorpay checkout
4. Payment verified
5. Order marked PAID

---

### 9.3 Payment Schema

```js
orderId
razorpayOrderId
razorpayPaymentId
razorpaySignature
amount
currency
status
user
```

---

### 9.4 Payment APIs

| Endpoint | Purpose |
|-------|--------|
| POST /payments/create | Create Razorpay order |
| POST /payments/verify | Verify payment |

---

### 9.5 Razorpay Notes

- Test keys used
- No KYC required
- Fully real signature verification
- Frontend must integrate checkout UI

---

### 9.6 Files

```
models/Payment.js
controllers/payment.controller.js
routes/payment.routes.js
```

---

## 🔟 ADMIN SYSTEM (PHASE 6 — GOD MODE)

Admin can:
- approve artisans
- delete artisans
- manage products
- manage categories
- moderate reviews
- view all orders
- view dashboard stats

Admin is **never restricted** except by authentication.

---

## 1️⃣1️⃣ SECURITY MODEL

- JWT auth
- Role-based access
- Ownership enforcement
- Payment signature verification
- No trust in client for payments

---

## 1️⃣2️⃣ EXPLICIT BACKEND ASSUMPTIONS

- Frontend sends valid IDs
- Frontend controls UX flow
- Frontend does not bypass payment
- Admin UI is trusted

---

## 1️⃣3️⃣ FRONTEND RESPONSIBILITIES (MANDATORY)

Frontend MUST:
- Fetch category data dynamically
- Render reviews correctly
- Prevent duplicate review submissions
- Integrate Razorpay UI
- Handle payment success/failure
- Respect isActive flags

---

## 1️⃣4️⃣ BACKEND FREEZE DECLARATION

✔ Backend complete  
✔ Backend tested  
✔ Backend documented  
✔ Backend frozen  

🚫 No backend edits allowed after this

---

## 1️⃣5️⃣ FINAL HANDOVER STATEMENT

> Backend team hereby hands over CraftConnect backend.  
> All remaining work belongs exclusively to frontend.

---

**END OF DOCUMENT**
