# CraftConnect - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Folder Structure](#folder-structure)
4. [Architecture & Data Flow](#architecture--data-flow)
5. [Feature Workflows](#feature-workflows)
6. [Backend Integration Guide](#backend-integration-guide)
7. [Setup & Development](#setup--development)

---

## Project Overview

**CraftConnect** is a full-featured e-commerce platform for handcrafted goods, connecting artisans and vendors with customers. It features a modern React frontend with a clean, maintainable architecture ready for backend integration.

### Key Features
- 🔐 Multi-role authentication (User, Artisan, Admin)
- 📧 OTP-based email verification
- 🛍️ Product browsing with categories
- 🛒 Shopping cart & checkout
- 📦 Order management
- 🏪 Artisan dashboard with seller tools
- 📱 AR product visualization
- 🌱 Artisan impact tracking
- 👨‍💼 Admin panel

---

## Technology Stack

### Frontend
- **React 19.2.0** - UI library
- **React Router 7.9.6** - Client-side routing
- **React Scripts 5.0.1** - Build tooling (Create React App)
- **Vanilla CSS** - Styling (no frameworks)
- **localStorage** - Client-side data persistence

### Backend (To Be Built)
- **Recommended:** Node.js + Express or Python + Django
- **Database:** MongoDB or PostgreSQL
- **Authentication:** JWT tokens
- **File Storage:** AWS S3 or Cloudinary
- **Email:** SendGrid or AWS SES

---

## Folder Structure

```
WT - Copy/
├── public/                      # Static assets
│   ├── index.html              # HTML template
│   └── data/                   # Mock JSON data
│       ├── products.json       # Product catalog
│       └── artisans.json       # Artisan profiles
│
├── src/                        # Source code
│   ├── index.js                # App entry point
│   │
│   ├── app/                    # Application-level code
│   │   ├── pages/              
│   │   │   └── HomePage.js     # Landing page
│   │   └── routes/
│   │       └── AppRoutes.js    # Route definitions
│   │
│   ├── features/               # Feature modules (by domain)
│   │   ├── admin/              # Admin panel
│   │   │   ├── AdminDashboardPage.js
│   │   │   ├── ManageUsersPage.js
│   │   │   ├── ManageArtisansPage.js
│   │   │   ├── ManageProducts.js
│   │   │   ├── ManageOrdersPage.js
│   │   │   └── CategoryManagerPage.js
│   │   │
│   │   ├── auth/               # Authentication
│   │   │   ├── UserLogin.js    # User login
│   │   │   ├── UserRegister.js # User registration with OTP
│   │   │   ├── ArtisanLogin.js # Artisan/Seller login
│   │   │   ├── ArtisanRegister.js
│   │   │   └── AdminLogin.js
│   │   │
│   │   ├── cart/               # Shopping cart
│   │   │   └── CartPage.js
│   │   │
│   │   ├── categories/         # Product categories
│   │   │   ├── CategoriesPage.js  # All categories
│   │   │   └── CategoryPage.js    # Single category
│   │   │
│   │   ├── checkout/           # Order checkout
│   │   │   └── CheckoutPage.js
│   │   │
│   │   ├── orders/             # Order history
│   │   │   └── OrdersPage.js
│   │   │
│   │   ├── products/           # Product catalog
│   │   │   └── ProductDetailsPage.js  # Product details + AR
│   │   │
│   │   ├── search/             # Search functionality
│   │   │   └── SearchPage.js
│   │   │
│   │   ├── users/              # User profile
│   │   │   ├── UserProfilePage.js
│   │   │   └── ArtisanProfilePage.js  # Public artisan profile
│   │   │
│   │   └── artisans/           # Artisan/Seller features
│   │       ├── ArtisanDashboardPage.js      # Artisan dashboard
│   │       ├── AddProductPage.js            # Add/Edit products
│   │       ├── ManageProductsPage.js        # Product list
│   │       ├── ArtisanOrdersPage.js         # Incoming orders
│   │       └── ArtisanProfileEditorPage.js  # Shop profile editor
│   │
│   └── shared/                 # Shared/reusable code
│       ├── components/         # Reusable UI components
│       │   ├── Navbar.js       # Navigation bar
│       │   └── Footer.js       # Footer
│       │
│       ├── context/            # React Context providers
│       │   └── CartContext.js  # Shopping cart state
│       │
│       ├── hooks/              # Custom React hooks
│       │   └── useAuth.js      # Authentication hook
│       │
│       ├── services/           # API & external services
│       │   └── api.js          # **CENTRALIZED API SERVICE**
│       │
│       ├── styles/             # Global styles
│       │   ├── global.css      # Global CSS variables
│       │   └── auth.css        # Auth page styles
│       │
│       └── utils/              # Utility functions
│           └── helpers.js
│
├── package.json                # Dependencies
├── .env                        # Environment variables (create this)
└── README.md
```

---

## Architecture & Data Flow

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    React App                         │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │   │
│  │  │   Pages    │  │ Components │  │   Hooks    │    │   │
│  │  │ (Features) │  │  (Shared)  │  │  (useAuth) │    │   │
│  │  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘    │   │
│  │        │               │               │            │   │
│  │        └───────────────┴───────────────┘            │   │
│  │                        │                            │   │
│  │                ┌───────▼────────┐                   │   │
│  │                │  apiService.js │ ◄─── SINGLE API   │   │
│  │                │  (Centralized) │      LAYER        │   │
│  │                └───────┬────────┘                   │   │
│  └────────────────────────┼──────────────────────────┘   │
│                            │                              │
└────────────────────────────┼──────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   HTTP/HTTPS    │
                    │   (fetch API)   │
                    └────────┬────────┘
                             │
┌────────────────────────────▼──────────────────────────────┐
│                        BACKEND                            │
│  ┌──────────────────────────────────────────────────┐    │
│  │              REST API Server                     │    │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐ │    │
│  │  │  Auth  │  │Product │  │ Orders │  │  User  │ │    │
│  │  │Endpoint│  │Endpoint│  │Endpoint│  │Endpoint│ │    │
│  │  └───┬────┘  └───┬────┘  └───┬────┘  └───┬────┘ │    │
│  │      └───────────┴───────────┴───────────┘       │    │
│  │                      │                            │    │
│  │              ┌───────▼────────┐                   │    │
│  │              │    Database    │                   │    │
│  │              │ (MongoDB/SQL)  │                   │    │
│  │              └────────────────┘                   │    │
│  └──────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────┘
```

### Data Flow Example: User Login

```
1. User enters email/password in UserLogin.js
   │
2. Component calls useAuth hook → login(credentials)
   │
3. useAuth calls apiService.login(credentials)
   │
4. apiService sends POST /auth/login to backend
   │
5. Backend validates credentials, returns { user, token }
   │
6. apiService returns data to useAuth
   │
7. useAuth stores user in localStorage
   │
8. useAuth updates React state (user)
   │
9. All components re-render with new auth state
   │
10. Navbar shows "Profile" instead of "Sign In"
```

---

## Feature Workflows

### 1. User Registration Flow

**File:** `src/features/auth/UserRegister.js`

```
Step 1: User fills form (name, email, phone, password)
  ↓
Step 2: Click "Create Account"
  ↓
Step 3: Frontend calls apiService.register()
  ↓
Step 4: Backend sends OTP to email
  ↓
Step 5: UI switches to OTP verification screen
  ↓
Step 6: User enters 4-digit OTP
  ↓
Step 7: Frontend calls apiService.verifyOTP()
  ↓
Step 8: Backend verifies OTP
  ↓
Step 9: Account created, user logged in
  ↓
Step 10: Redirect to homepage
```

**Backend Endpoints Needed:**
- `POST /auth/register` - Create user, send OTP
- `POST /auth/verify-otp` - Verify OTP, activate account

---

### 2. Product Browsing Flow

**Files:** 
- `src/app/pages/HomePage.js` - Featured products
- `src/features/categories/CategoryPage.js` - Category products
- `src/features/products/ProductDetailsPage.js` - Single product

```
Homepage
  ↓
User clicks category (e.g., "Pottery")
  ↓
CategoryPage.js loads
  ↓
Calls apiService.getProductsByCategory("Pottery")
  ↓
Backend returns filtered products
  ↓
Display product grid
  ↓
User clicks product
  ↓
ProductDetailsPage.js loads
  ↓
Calls apiService.getProductById(id)
  ↓
Backend returns full product details
  ↓
Display product with images, description, AR button
```

**Backend Endpoints Needed:**
- `GET /products` - All products
- `GET /products?category=Pottery` - Filtered products
- `GET /products/:id` - Single product

---

### 3. Shopping Cart Flow

**Files:**
- `src/shared/context/CartContext.js` - Cart state management
- `src/features/cart/CartPage.js` - Cart UI
- `src/features/checkout/CheckoutPage.js` - Checkout

```
User clicks "Add to Cart" on ProductDetailsPage
  ↓
CartContext.addToCart(product, quantity)
  ↓
Cart stored in localStorage (client-side)
  ↓
Navbar cart icon updates (shows count)
  ↓
User clicks cart icon
  ↓
CartPage.js displays cart items
  ↓
User clicks "Checkout"
  ↓
CheckoutPage.js loads
  ↓
User fills shipping address
  ↓
Calls apiService.createOrder(userId, orderData)
  ↓
Backend creates order, returns orderId
  ↓
Cart cleared, redirect to success page
```

**Backend Endpoints Needed:**
- `POST /orders/:userId` - Create order
- `GET /orders/:userId` - Get user's orders

**Note:** Cart is currently client-side only. For persistent cart across devices, add:
- `POST /cart/:userId` - Save cart to backend
- `GET /cart/:userId` - Retrieve cart

---

### 4. Seller Dashboard Flow

**Files:**
- `src/features/vendors/VendorDashboardPage.js` - Dashboard
- `src/features/vendors/AddProductPage.js` - Add/Edit product
- `src/features/vendors/ManageProductsPage.js` - Product list
- `src/features/vendors/VendorOrdersPage.js` - Incoming orders

```
Artisan logs in via VendorLogin.js
  ↓
Redirect to /vendor/dashboard
  ↓
VendorDashboardPage.js loads
  ↓
Displays stats (products, orders, revenue)
  ↓
Artisan clicks "Add New Product"
  ↓
AddProductPage.js loads
  ↓
Artisan fills form (name, price, category, images)
  ↓
Calls apiService.addProduct(productData)
  ↓
Backend saves product, returns product ID
  ↓
Redirect to product list
  ↓
ManageProductsPage.js loads
  ↓
Calls apiService.getArtisanProducts(artisanId)
  ↓
Backend returns artisan's products
  ↓
Display product list with Edit/Delete buttons
```

**Backend Endpoints Needed:**
- `GET /artisans/:artisanId/products` - Artisan's products
- `POST /products` - Create product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product
- `GET /artisans/:artisanId/orders` - Incoming orders
- `PUT /orders/:orderId/status` - Update order status

---

### 5. AR Product Visualization

**File:** `src/features/products/ProductDetailsPage.js`

```
User on ProductDetailsPage
  ↓
Clicks "View in Your Room (AR)"
  ↓
Modal opens with camera feed
  ↓
Browser requests camera permission
  ↓
User grants permission
  ↓
Live camera feed displayed
  ↓
Product image overlaid on camera feed
  ↓
User can see product in their space
  ↓
Click "Close" to exit AR mode
```

**Technology:** Uses browser's `getUserMedia()` API for camera access. No backend needed for this feature.

---

## Backend Integration Guide

### Centralized API Service

**File:** `src/shared/services/api.js`

This is the **ONLY** file that makes HTTP requests. All components use this service.

**Key Methods:**

```javascript
// Authentication
apiService.login(credentials)
apiService.register(userData)
apiService.verifyOTP(email, otp)

// Products
apiService.getProducts()
apiService.getProductById(id)
apiService.addProduct(productData)
apiService.updateProduct(id, productData)
apiService.deleteProduct(id)

// Orders
apiService.createOrder(userId, orderData)
apiService.getOrders(userId)
apiService.getArtisanOrders(artisanId)
apiService.updateOrderStatus(orderId, status)

// User Profile
apiService.getUserProfile(userId)
apiService.updateUserProfile(userId, userData)
```

### How to Connect Backend

**Step 1: Create `.env` file**
```env
REACT_APP_API_URL=http://localhost:3001/api
```

**Step 2: Remove mock data from `api.js`**

Find and remove these sections:
- Lines 37-61: Mock login
- Lines 71-87: Mock register
- Lines 168-171: Mock createOrder
- Lines 180-186: Mock getOrders
- Lines 193-197: Mock getVendorOrders
- Lines 210-216: Mock getUserProfile

**Step 3: Uncomment real API calls**

The real API calls are already written, just commented out. Example:

```javascript
// BEFORE (Mock)
async login(credentials) {
    if (credentials.email === 'artisan@hhw.com') {
        return { user: {...}, token: "..." };
    }
    // Mock fallback
    return { user: {...}, token: "..." };
}

// AFTER (Real)
async login(credentials) {
    return this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
}
```

**Step 4: Test with backend**

Start your backend server on `http://localhost:3001`, then test each feature.

---

### Authentication Flow (Backend Perspective)

**POST /auth/register**
```javascript
// Request
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 98765 43210",
  "password": "securepass",
  "role": "user"
}

// Backend should:
1. Hash password (bcrypt)
2. Generate 4-digit OTP
3. Send OTP to email (SendGrid/AWS SES)
4. Store user with status: "pending_verification"
5. Return success message

// Response
{
  "success": true,
  "message": "OTP sent to email"
}
```

**POST /auth/verify-otp**
```javascript
// Request
{
  "email": "john@example.com",
  "otp": "1234"
}

// Backend should:
1. Verify OTP matches stored OTP
2. Check OTP not expired (5 min timeout)
3. Update user status: "active"
4. Generate JWT token
5. Return user + token

// Response
{
  "user": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**POST /auth/login**
```javascript
// Request
{
  "email": "john@example.com",
  "password": "securepass"
}

// Backend should:
1. Find user by email
2. Verify password (bcrypt.compare)
3. Check user is active
4. Generate JWT token
5. Return user + token

// Response (same as verify-otp)
```

---

### Database Schema Recommendations

**Users Collection/Table**
```javascript
{
  id: Number/String,
  name: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  role: Enum["user", "artisan", "vendor", "admin"],
  status: Enum["pending_verification", "active", "suspended"],
  createdAt: Date,
  updatedAt: Date
}
```

**Products Collection/Table**
```javascript
{
  id: Number/String,
  name: String,
  description: String,
  price: Number,
  category: String,
  stock: Number,
  images: [String], // URLs
  artisanId: Number/String (foreign key),
  materials: [String],
  createdAt: Date,
  updatedAt: Date
}
```

**Orders Collection/Table**
```javascript
{
  id: String, // "ORD-12345"
  userId: Number/String (foreign key),
  items: [
    {
      productId: Number/String,
      name: String,
      quantity: Number,
      price: Number
    }
  ],
  total: Number,
  status: Enum["Pending", "Packed", "Shipped", "Delivered", "Cancelled"],
  shippingAddress: String,
  paymentMethod: String,
  createdAt: Date,
  updatedAt: Date
}
```

**OTP Collection/Table** (temporary storage)
```javascript
{
  email: String,
  otp: String,
  expiresAt: Date, // 5 minutes from creation
  createdAt: Date
}
```

---

## Setup & Development

### Prerequisites
- Node.js 14+ installed
- npm or yarn package manager

### Installation

```bash
# 1. Navigate to project
cd "WT - Copy"

# 2. Install dependencies
npm install

# 3. Create .env file
echo REACT_APP_API_URL=http://localhost:3001/api > .env

# 4. Start development server
npm start
```

Frontend will run on `http://localhost:3000`

### Development Workflow

**For Frontend Developer:**
1. Make changes to components
2. Save file (auto-reload)
3. Test in browser
4. Commit changes

**For Backend Developer:**
1. Read `backend_integration_guide.md`
2. Set up backend server on port 3001
3. Implement API endpoints
4. Test with Postman
5. Update frontend `.env` to point to backend
6. Test end-to-end with frontend

### Building for Production

```bash
# Create optimized production build
npm run build

# Output will be in /build folder
# Deploy /build folder to:
# - Vercel (recommended)
# - Netlify
# - AWS S3 + CloudFront
```

---

## Component Relationships

### How Components Work Together

```
App (index.js)
  │
  ├─ AppRoutes (routing)
  │   │
  │   ├─ HomePage
  │   │   └─ Uses: Navbar, Footer, apiService
  │   │
  │   ├─ ProductDetailsPage
  │   │   └─ Uses: Navbar, Footer, apiService, CartContext
  │   │
  │   ├─ CartPage
  │   │   └─ Uses: Navbar, Footer, CartContext
  │   │
  │   ├─ CheckoutPage
  │   │   └─ Uses: Navbar, Footer, CartContext, apiService, useAuth
  │   │
  │   ├─ VendorDashboardPage
  │   │   └─ Uses: Navbar, Footer, useAuth
  │   │
  │   └─ ... (other pages)
  │
  ├─ CartContext (global cart state)
  │   └─ Wraps entire app
  │
  └─ useAuth (authentication hook)
      └─ Used by: All protected pages
```

### Shared Components

**Navbar.js**
- Used on: ALL pages
- Features: Logo, search, cart icon, user dropdown
- Dynamic: Shows different options based on login state

**Footer.js**
- Used on: ALL pages
- Features: Links, social media, copyright

**CartContext.js**
- Provides: Cart state to all components
- Methods: `addToCart()`, `removeFromCart()`, `getCartCount()`, `clearCart()`

**useAuth.js**
- Provides: User authentication state
- Methods: `login()`, `register()`, `logout()`, `isAuthenticated`
- Used by: Login pages, protected routes, Navbar

---

## Quick Reference for Backend Developer

### What You Need to Build

**1. Authentication API**
- [ ] POST /auth/register (with OTP email)
- [ ] POST /auth/verify-otp
- [ ] POST /auth/login
- [ ] JWT token generation & validation

**2. Product API**
- [ ] GET /products (all products)
- [ ] GET /products/:id (single product)
- [ ] GET /products?category=X (filtered)
- [ ] POST /products (create - requires auth)
- [ ] PUT /products/:id (update - requires auth)
- [ ] DELETE /products/:id (delete - requires auth)
- [ ] GET /artisans/:artisanId/products

**3. Order API**
- [ ] POST /orders/:userId (create order)
- [ ] GET /orders/:userId (user's orders)
- [ ] GET /artisans/:artisanId/orders (artisan's incoming orders)
- [ ] PUT /orders/:orderId/status (update status)

**4. User Profile API**
- [ ] GET /users/:userId (get profile)
- [ ] PUT /users/:userId (update profile)

**5. File Upload**
- [ ] POST /upload (for product images)
- [ ] Return image URL

**6. Email Service**
- [ ] Send OTP emails
- [ ] Send order confirmation emails

### Testing Checklist

- [ ] CORS configured for `http://localhost:3000`
- [ ] All endpoints return JSON
- [ ] Error responses include `{ message: "..." }`
- [ ] JWT tokens validated on protected routes
- [ ] File upload works for images
- [ ] OTP emails are sent
- [ ] Database connections stable

---

## Troubleshooting

### Frontend Issues

**Problem:** Changes not showing
- **Solution:** Hard refresh browser (Ctrl+Shift+R)

**Problem:** API calls failing
- **Solution:** Check `.env` file, verify backend is running

**Problem:** Cart not persisting
- **Solution:** Check browser localStorage, clear if corrupted

### Backend Integration Issues

**Problem:** CORS errors
- **Solution:** Add CORS middleware to backend
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

**Problem:** 404 on API calls
- **Solution:** Verify backend routes match frontend endpoints exactly

**Problem:** Authentication not working
- **Solution:** Check JWT token is being sent in headers

---

## Next Steps

1. **Backend Developer:** Read this document + `backend_integration_guide.md`
2. **Set up backend:** Choose Node.js/Express or Python/Django
3. **Create database:** MongoDB or PostgreSQL
4. **Implement APIs:** Start with authentication, then products
5. **Test:** Use Postman to test each endpoint
6. **Connect:** Update frontend `.env` and remove mocks
7. **Deploy:** Backend to Heroku/Railway, Frontend to Vercel

---

## Support & Resources

**Frontend Code Location:**
- API Service: `src/shared/services/api.js`
- Auth Hook: `src/shared/hooks/useAuth.js`
- Routes: `src/app/routes/AppRoutes.js`

**Documentation:**
- This file: Complete project overview
- `backend_integration_guide.md`: API specifications
- `final_project_audit.md`: Quality assessment

**Questions?** Check the inline comments in the code files!

---

**Project is 100% ready for backend integration. Happy coding! 🚀**
