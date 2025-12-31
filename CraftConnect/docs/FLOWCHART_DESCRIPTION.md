# CraftConnect System Flowchart Description

## 📊 Complete System Flow Diagram

This document provides a detailed description for creating flowcharts/block diagrams showing how CraftConnect works from frontend to backend.

---

## 🎯 Main System Architecture Flow

### **High-Level Overview**

```
┌─────────────┐
│   Browser   │ (User Interface)
│  (Frontend) │
└──────┬──────┘
       │
       │ HTTP Requests
       │ (API Calls)
       │
       ▼
┌─────────────┐
│   Backend   │ (Server)
│  API Server │
└──────┬──────┘
       │
       │ Database Queries
       │
       ▼
┌─────────────┐
│  Database   │ (Data Storage)
│ MongoDB/SQL │
└─────────────┘
```

---

## 🔄 Complete User Journey Flows

### **Flow 1: User Registration & Login**

**Start → User Registration → OTP Verification → Login → Dashboard**

```
FLOWCHART DESCRIPTION:

1. START: User opens website
   ↓
2. User clicks "Create Account" button
   ↓
3. FRONTEND: Display registration form
   - Input fields: Name, Email, Phone, Password
   ↓
4. User fills form and clicks "Continue"
   ↓
5. FRONTEND: Validate form data
   - Check: Passwords match?
   - Check: Email format valid?
   ↓
6. FRONTEND → BACKEND: Send POST request to /auth/register
   - Data: {name, email, phone, password}
   ↓
7. BACKEND: Process registration
   - Check: Email already exists?
     → YES: Return error "Email already registered"
     → NO: Continue
   - Hash password with bcrypt
   - Generate 4-digit OTP (random number)
   - Save user to database (status: "pending")
   - Send OTP to email via email service
   ↓
8. BACKEND → FRONTEND: Return success response
   - Data: {message: "OTP sent to email"}
   ↓
9. FRONTEND: Show OTP verification screen
   - Display 4 input boxes for OTP
   ↓
10. User enters OTP and clicks "Verify"
    ↓
11. FRONTEND → BACKEND: Send POST request to /auth/verify-otp
    - Data: {email, otp}
    ↓
12. BACKEND: Verify OTP
    - Check: OTP matches?
    - Check: OTP not expired? (5 min limit)
      → INVALID: Return error
      → VALID: Continue
    - Update user status to "active"
    - Generate JWT token
    ↓
13. BACKEND → FRONTEND: Return success
    - Data: {user: {...}, token: "jwt_token"}
    ↓
14. FRONTEND: Store JWT token in localStorage
    ↓
15. FRONTEND: Redirect to login page
    ↓
16. User enters email/password and clicks "Sign In"
    ↓
17. FRONTEND → BACKEND: Send POST request to /auth/login
    - Data: {email, password}
    ↓
18. BACKEND: Authenticate user
    - Find user by email
    - Compare password hash
      → INVALID: Return error
      → VALID: Generate JWT token
    ↓
19. BACKEND → FRONTEND: Return user data + token
    ↓
20. FRONTEND: Store token, update UI
    ↓
21. END: User logged in, redirect to homepage
```

---

### **Flow 2: Product Browsing & Purchase**

**Start → Browse Products → Add to Cart → Checkout → Order Placed**

```
FLOWCHART DESCRIPTION:

1. START: User on homepage
   ↓
2. FRONTEND: Page loads
   ↓
3. FRONTEND → BACKEND: GET request to /products
   ↓
4. BACKEND: Query database for all products
   ↓
5. BACKEND → FRONTEND: Return product list
   - Data: [{id, name, price, image, artisanId}, ...]
   ↓
6. FRONTEND: Display products in grid
   ↓
7. User clicks on a product card
   ↓
8. FRONTEND: Navigate to /product/:id
   ↓
9. FRONTEND → BACKEND: GET request to /products/:id
   ↓
10. BACKEND: Query database for product details
    ↓
11. BACKEND → FRONTEND: Return full product data
    - Data: {id, name, description, price, images, stock, artisan{...}}
    ↓
12. FRONTEND: Display product details page
    - Show images, price, description, stock
    - Show "Add to Cart" button
    ↓
13. User selects quantity and clicks "Add to Cart"
    ↓
14. FRONTEND: Check if user logged in?
    → NO: Redirect to login
    → YES: Continue
    ↓
15. FRONTEND → BACKEND: POST request to /cart/add
    - Data: {userId, productId, quantity}
    ↓
16. BACKEND: Add item to user's cart in database
    - Check: Product in stock?
      → NO: Return error
      → YES: Add to cart table
    ↓
17. BACKEND → FRONTEND: Return success
    ↓
18. FRONTEND: Update cart icon count
    - Show notification "Added to cart!"
    ↓
19. User clicks cart icon
    ↓
20. FRONTEND: Navigate to /cart
    ↓
21. FRONTEND → BACKEND: GET request to /cart/:userId
    ↓
22. BACKEND: Query cart items from database
    ↓
23. BACKEND → FRONTEND: Return cart items
    - Data: [{productId, name, quantity, price}, ...]
    ↓
24. FRONTEND: Display cart page
    - Show all items with quantities
    - Show total price
    - Show "Proceed to Checkout" button
    ↓
25. User clicks "Proceed to Checkout"
    ↓
26. FRONTEND: Navigate to /checkout
    ↓
27. FRONTEND: Display checkout form
    - Shipping address fields
    - Payment method selection
    - Order summary
    ↓
28. User fills address and clicks "Place Order"
    ↓
29. FRONTEND → BACKEND: POST request to /orders
    - Data: {userId, items, total, shippingAddress, paymentMethod}
    ↓
30. BACKEND: Process order
    - Validate cart items still in stock
    - Create order in database (status: "Pending")
    - Reduce product stock quantities
    - Clear user's cart
    - Generate order ID (e.g., "ORD-12345")
    - Send confirmation email to customer
    - Send notification to artisan
    ↓
31. BACKEND → FRONTEND: Return order confirmation
    - Data: {orderId, total, status}
    ↓
32. FRONTEND: Clear cart from UI
    ↓
33. FRONTEND: Show success message
    - Display order ID
    - Show "View Order Details" button
    ↓
34. END: Order placed successfully
```

---

### **Flow 3: Artisan Product Management**

**Start → Login as Artisan → Add Product → Product Listed**

```
FLOWCHART DESCRIPTION:

1. START: Artisan visits /login/artisan
   ↓
2. FRONTEND: Display artisan login form
   ↓
3. Artisan enters email/password, clicks "Sign In"
   ↓
4. FRONTEND → BACKEND: POST request to /auth/login
   - Data: {email, password, role: "artisan"}
   ↓
5. BACKEND: Authenticate artisan
   - Verify credentials
   - Check role is "artisan"
   - Generate JWT token
   ↓
6. BACKEND → FRONTEND: Return artisan data + token
   ↓
7. FRONTEND: Store token, redirect to /artisan/dashboard
   ↓
8. FRONTEND → BACKEND: GET request to /artisans/:id/stats
   ↓
9. BACKEND: Query database for artisan statistics
   - Total products count
   - Total orders count
   - Total revenue
   ↓
10. BACKEND → FRONTEND: Return stats
    ↓
11. FRONTEND: Display artisan dashboard
    - Show stats cards
    - Show "Add Product" button
    - Show recent orders
    ↓
12. Artisan clicks "Add New Product"
    ↓
13. FRONTEND: Navigate to /artisan/add-product
    ↓
14. FRONTEND: Display product form
    - Fields: Name, Description, Price, Category, Stock, Images, Materials
    ↓
15. Artisan fills form and clicks "Add Product"
    ↓
16. FRONTEND: Validate form data
    - Check: All required fields filled?
    - Check: Price is number?
    - Check: Stock is positive?
    ↓
17. FRONTEND → BACKEND: POST request to /products
    - Data: {name, description, price, category, stock, images, artisanId, materials}
    ↓
18. BACKEND: Create product
    - Validate artisan is logged in
    - Generate product ID
    - Save to database
    - Set status to "active"
    ↓
19. BACKEND → FRONTEND: Return success
    - Data: {productId, message: "Product created"}
    ↓
20. FRONTEND: Show success notification
    ↓
21. FRONTEND: Redirect to /artisan/products
    ↓
22. FRONTEND → BACKEND: GET request to /artisans/:id/products
    ↓
23. BACKEND: Query artisan's products from database
    ↓
24. BACKEND → FRONTEND: Return product list
    ↓
25. FRONTEND: Display products with Edit/Delete buttons
    ↓
26. END: Product successfully added and listed
```

---

### **Flow 4: Admin Artisan Approval**

**Start → Admin Login → View Pending Artisans → Approve/Reject**

```
FLOWCHART DESCRIPTION:

1. START: Admin visits /login/admin
   ↓
2. FRONTEND: Display admin login form
   ↓
3. Admin enters credentials, clicks "Sign In"
   ↓
4. FRONTEND → BACKEND: POST request to /auth/login
   - Data: {email, password, role: "admin"}
   ↓
5. BACKEND: Authenticate admin
   - Verify credentials
   - Check role is "admin"
   ↓
6. BACKEND → FRONTEND: Return admin data + token
   ↓
7. FRONTEND: Redirect to /admin/dashboard
   ↓
8. FRONTEND → BACKEND: GET request to /admin/stats
   ↓
9. BACKEND: Query platform statistics
   - Total users, artisans, products, orders, revenue
   ↓
10. BACKEND → FRONTEND: Return stats
    ↓
11. FRONTEND: Display admin dashboard
    ↓
12. Admin clicks "Manage Artisans"
    ↓
13. FRONTEND: Navigate to /admin/artisans
    ↓
14. FRONTEND → BACKEND: GET request to /admin/artisans/pending
    ↓
15. BACKEND: Query pending artisan applications
    - Filter: status = "pending_approval"
    ↓
16. BACKEND → FRONTEND: Return pending artisans list
    - Data: [{id, name, email, appliedAt, documents}, ...]
    ↓
17. FRONTEND: Display pending artisans table
    - Show artisan details
    - Show "Approve" and "Reject" buttons
    ↓
18. Admin reviews application and clicks "Approve"
    ↓
19. FRONTEND → BACKEND: POST request to /admin/artisans/:id/approve
    ↓
20. BACKEND: Approve artisan
    - Update status to "approved"
    - Grant seller permissions
    - Send welcome email to artisan
    ↓
21. BACKEND → FRONTEND: Return success
    ↓
22. FRONTEND: Remove from pending list
    - Show success notification
    ↓
23. END: Artisan approved, can now sell products
```

---

## 🔑 Key Decision Points (Diamond Shapes in Flowchart)

### **Decision Points to Include:**

1. **User Authentication Check**
   - Is user logged in?
     → YES: Continue to protected page
     → NO: Redirect to login

2. **Form Validation**
   - Is form data valid?
     → YES: Submit to backend
     → NO: Show error messages

3. **Email Existence Check**
   - Does email already exist?
     → YES: Return error
     → NO: Create account

4. **OTP Validation**
   - Is OTP correct and not expired?
     → YES: Activate account
     → NO: Show error

5. **Stock Availability**
   - Is product in stock?
     → YES: Add to cart
     → NO: Show "Out of stock"

6. **Role Check**
   - Is user an artisan?
     → YES: Show artisan dashboard
     → NO: Show user dashboard

7. **Admin Permission**
   - Is user an admin?
     → YES: Allow access
     → NO: Deny access

---

## 📦 Component Interaction Flow

### **Frontend Components:**

```
Navbar Component
  ↓ (displays on all pages)
  ├─ Shows cart count from CartContext
  ├─ Shows user status from useAuth
  └─ Provides navigation links

Page Component (e.g., ProductDetailsPage)
  ↓ (loads when route matches)
  ├─ Calls apiService methods
  ├─ Updates local state
  └─ Renders UI

apiService.js (Centralized API Layer)
  ↓ (all backend calls go through here)
  ├─ Sends HTTP requests to backend
  ├─ Handles responses
  └─ Returns data to components

CartContext (Global State)
  ↓ (manages cart across app)
  ├─ Stores cart items
  ├─ Provides cart methods
  └─ Syncs with backend

useAuth Hook (Authentication State)
  ↓ (manages user session)
  ├─ Stores JWT token
  ├─ Provides login/logout methods
  └─ Checks authentication status
```

---

## 🎨 Flowchart Symbols Guide

**Use these shapes when creating the diagram:**

- **Rectangle** = Process/Action (e.g., "Display form", "Save to database")
- **Diamond** = Decision/Condition (e.g., "Is user logged in?")
- **Parallelogram** = Input/Output (e.g., "User enters email")
- **Rounded Rectangle** = Start/End points
- **Cylinder** = Database operation
- **Arrow** = Flow direction
- **Dashed Arrow** = Async operation/API call
- **Cloud** = External service (e.g., Email service)

---

## 📊 Recommended Flowchart Sections

**Create separate diagrams for:**

1. **System Architecture** - High-level overview (Frontend → Backend → Database)
2. **User Registration Flow** - Complete signup process with OTP
3. **Shopping Flow** - Browse → Cart → Checkout → Order
4. **Artisan Flow** - Login → Dashboard → Product Management
5. **Admin Flow** - Login → Dashboard → Artisan Approval
6. **Data Flow** - How data moves through the system

---

## 🎯 Summary for Flowchart Creation

**Main Flows to Diagram:**

1. **Authentication**: Registration → OTP → Login → Session
2. **Shopping**: Browse → Add to Cart → Checkout → Order
3. **Artisan**: Login → Dashboard → Add Product → Manage
4. **Admin**: Login → Dashboard → Approve Artisans → Manage Platform

**Key Elements to Show:**

- User actions (clicks, form submissions)
- Frontend processing (validation, state updates)
- API calls (HTTP requests with endpoints)
- Backend processing (database queries, business logic)
- Database operations (CRUD operations)
- Responses and redirects
- Decision points (if/else conditions)
- Error handling paths

**This description provides everything needed to create comprehensive flowcharts showing both frontend and backend interactions!** 🚀
