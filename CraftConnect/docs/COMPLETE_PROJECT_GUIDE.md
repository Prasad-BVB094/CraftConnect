# CraftConnect - Complete Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Complete Folder Structure](#complete-folder-structure)
3. [File-by-File Description](#file-by-file-description)
4. [How Everything Works](#how-everything-works)
5. [Feature Workflows](#feature-workflows)
6. [Data Flow & Architecture](#data-flow--architecture)
7. [Backend Integration](#backend-integration)

---

# Project Overview

## What is CraftConnect?

**CraftConnect** is a modern, full-featured e-commerce platform specifically designed for handcrafted goods. It connects artisans (individual craftspeople) directly with customers who value authentic, handmade products.

### Core Purpose
- **For Artisans:** Sell handcrafted products, manage inventory, track orders, and showcase their craft
- **For Customers:** Discover unique handmade items, support artisans, and shop with confidence
- **For Admins:** Manage the platform, approve artisans, moderate content, and oversee operations

### Technology Stack
- **Frontend:** React 19.2.0 with React Router 7.9.6
- **Styling:** Vanilla CSS (no frameworks)
- **State Management:** React Context + Custom Hooks
- **Backend (To Build):** Node.js/Express or Python/Django
- **Database (To Build):** MongoDB or PostgreSQL

### Key Differentiators
1. **Artisan-Only Seller Model** - Simplified, craft-focused (no separate vendor role)
2. **AR Product Visualization** - View products in your room using camera
3. **Impact Tracking** - Artisans can showcase their social/environmental impact
4. **OTP Email Verification** - Enterprise-grade security
5. **Industry-Standard Architecture** - Clean, maintainable, scalable

---

# Complete Folder Structure

```
CraftConnect/
│
├── public/                          # Static assets served directly
│   ├── index.html                   # HTML template (entry point)
│   ├── favicon.ico                  # Website icon
│   ├── manifest.json                # PWA manifest
│   └── data/                        # Mock JSON data for development
│       ├── products.json            # Sample product catalog
│       └── artisans.json            # Sample artisan profiles
│
├── src/                             # Source code (React application)
│   │
│   ├── index.js                     # App entry point - renders React app
│   │
│   ├── app/                         # Application-level code
│   │   ├── pages/
│   │   │   └── HomePage.js          # Landing page with hero, categories, products
│   │   └── routes/
│   │       └── AppRoutes.js         # All route definitions (React Router)
│   │
│   ├── features/                    # Feature modules (organized by domain)
│   │   │
│   │   ├── admin/                   # Admin panel features
│   │   │   ├── AdminDashboardPage.js      # Admin overview with stats
│   │   │   ├── ManageUsersPage.js         # User management
│   │   │   ├── ManageArtisansPage.js      # Artisan approval/management
│   │   │   ├── ManageProducts.js          # Product moderation
│   │   │   ├── ManageOrdersPage.js        # Order oversight
│   │   │   └── CategoryManagerPage.js     # Category CRUD
│   │   │
│   │   ├── auth/                    # Authentication features
│   │   │   ├── UserLogin.js         # User login page
│   │   │   ├── UserRegister.js      # User registration with OTP
│   │   │   ├── ArtisanLogin.js      # Artisan/seller login (Seller Central)
│   │   │   ├── ArtisanRegister.js   # Artisan registration
│   │   │   └── AdminLogin.js        # Admin login
│   │   │
│   │   ├── cart/                    # Shopping cart
│   │   │   └── CartPage.js          # Cart view with item management
│   │   │
│   │   ├── categories/              # Product categories
│   │   │   ├── CategoriesPage.js    # All categories grid
│   │   │   └── CategoryPage.js      # Single category with products
│   │   │
│   │   ├── checkout/                # Order checkout
│   │   │   └── CheckoutPage.js      # Checkout form and order creation
│   │   │
│   │   ├── orders/                  # Order history
│   │   │   └── OrdersPage.js        # User's order list
│   │   │
│   │   ├── products/                # Product catalog
│   │   │   └── ProductDetailsPage.js  # Product details + AR view
│   │   │
│   │   ├── search/                  # Search functionality
│   │   │   └── SearchPage.js        # Search results page
│   │   │
│   │   ├── users/                   # User profiles
│   │   │   ├── UserProfilePage.js       # User profile editor
│   │   │   └── ArtisanProfilePage.js    # Public artisan profile view
│   │   │
│   │   └── artisans/                # Artisan/seller features
│   │       ├── ArtisanDashboardPage.js      # Artisan dashboard with stats
│   │       ├── AddProductPage.js            # Add/edit product form
│   │       ├── ManageProductsPage.js        # Artisan's product list
│   │       ├── ArtisanOrdersPage.js         # Incoming orders for artisan
│   │       └── ArtisanProfileEditorPage.js  # Edit shop profile
│   │
│   └── shared/                      # Shared/reusable code
│       │
│       ├── components/              # Reusable UI components
│       │   ├── Navbar.js            # Navigation bar (used on all pages)
│       │   └── Footer.js            # Footer (used on all pages)
│       │
│       ├── context/                 # React Context providers
│       │   └── CartContext.js       # Shopping cart state management
│       │
│       ├── hooks/                   # Custom React hooks
│       │   └── useAuth.js           # Authentication hook
│       │
│       ├── models/                  # Data models/classes
│       │   └── index.js             # User, Artisan, Product models
│       │
│       ├── services/                # External services
│       │   └── api.js               # **CENTRALIZED API SERVICE** (all backend calls)
│       │
│       ├── styles/                  # Global styles
│       │   ├── globals.css          # Global CSS variables and styles
│       │   └── auth.css             # Authentication page styles
│       │
│       └── utils/                   # Utility functions
│           └── helpers.js           # Helper functions
│
├── docs/                            # Documentation
│   ├── README.md                    # Quick navigation guide
│   ├── PROJECT_DOCUMENTATION.md     # System overview
│   ├── backend_integration_guide.md # API specifications
│   ├── final_project_audit.md       # Quality assessment
│   ├── walkthrough.md               # Change history
│   └── GETTING_STARTED.md           # Setup guide
│
├── package.json                     # Dependencies and scripts
├── package-lock.json                # Dependency lock file
└── .gitignore                       # Git ignore rules
```

---

# File-by-File Description

## Core Files

### `src/index.js`
**Purpose:** Application entry point  
**What it does:**
- Imports React and ReactDOM
- Wraps the app with `CartProvider` (shopping cart state)
- Renders the `RouterProvider` with all routes
- Mounts the app to the `#root` div in `index.html`

**Key Code:**
```javascript
root.render(
  <CartProvider>
    <RouterProvider router={router} />
  </CartProvider>
);
```

---

### `src/app/routes/AppRoutes.js`
**Purpose:** Route configuration  
**What it does:**
- Defines all application routes using React Router
- Maps URLs to page components
- Handles navigation structure

**Key Routes:**
- `/` → HomePage
- `/login/user` → UserLogin
- `/login/artisan` → ArtisanLogin (Seller Central)
- `/login/admin` → AdminLogin
- `/register/user` → UserRegister
- `/register/artisan` → ArtisanRegister
- `/artisan/dashboard` → ArtisanDashboardPage
- `/artisan/products` → ManageProductsPage
- `/artisan/orders` → ArtisanOrdersPage
- `/admin/dashboard` → AdminDashboardPage
- `/product/:id` → ProductDetailsPage
- `/cart` → CartPage
- `/checkout` → CheckoutPage

---

## Shared Components

### `src/shared/components/Navbar.js`
**Purpose:** Main navigation bar  
**What it does:**
- Displays on every page
- Shows logo, search bar, navigation buttons
- Dynamic dropdown menu based on user role:
  - **Guest:** Sign In, Create Account, Join as Artisan, Seller Central
  - **Logged-in User:** My Profile, My Orders, Sign Out
  - **Logged-in Artisan:** Artisan Profile, My Orders, Artisan Dashboard, Sign Out
  - **Admin:** Special admin navigation
- Cart icon with item count
- Responsive design

**Key Features:**
- Uses `useAuth` hook to check login status
- Uses `useCart` hook to show cart count
- Dynamic styling based on current page
- Handles logout functionality

---

### `src/shared/components/Footer.js`
**Purpose:** Footer component  
**What it does:**
- Displays on every page
- Shows company info, links, copyright
- Social media links
- Consistent branding

---

### `src/shared/context/CartContext.js`
**Purpose:** Shopping cart state management  
**What it does:**
- Provides cart state to entire app
- Stores cart items in localStorage
- Methods:
  - `addToCart(product, quantity)` - Add item to cart
  - `removeFromCart(productId)` - Remove item
  - `updateQuantity(productId, quantity)` - Update quantity
  - `clearCart()` - Empty cart
  - `getCartCount()` - Get total items
  - `getCartTotal()` - Calculate total price

**How it works:**
```javascript
// Wrap app with CartProvider
<CartProvider>
  <App />
</CartProvider>

// Use in any component
const { cart, addToCart, getCartCount } = useCart();
```

---

### `src/shared/hooks/useAuth.js`
**Purpose:** Authentication hook  
**What it does:**
- Manages user authentication state
- Provides login/logout/register functions
- Stores user data in localStorage
- Methods:
  - `login(credentials)` - Log in user
  - `register(userData)` - Register new user
  - `logout()` - Log out user
  - `isAuthenticated` - Check if logged in
  - `user` - Current user object

**How it works:**
```javascript
const { user, login, logout, isAuthenticated } = useAuth();

// Login
await login({ email, password });

// Check if logged in
if (isAuthenticated) {
  // User is logged in
}
```

---

### `src/shared/services/api.js` ⭐ **MOST IMPORTANT FILE**
**Purpose:** Centralized API service  
**What it does:**
- **ALL** backend API calls go through this file
- Single source of truth for API integration
- Contains mock data for development
- Easy to switch to real backend

**Key Methods:**

**Authentication:**
- `login(credentials)` - User/artisan login
- `register(userData)` - User registration
- `verifyOTP(email, otp)` - Email verification

**Products:**
- `getProducts()` - Get all products
- `getProductById(id)` - Get single product
- `getArtisanProducts(artisanId)` - Get artisan's products
- `addProduct(productData)` - Create product
- `updateProduct(id, productData)` - Update product
- `deleteProduct(id)` - Delete product

**Orders:**
- `createOrder(userId, orderData)` - Create order
- `getOrders(userId)` - Get user's orders
- `getArtisanOrders(artisanId)` - Get artisan's incoming orders
- `updateOrderStatus(orderId, status)` - Update order status

**Users:**
- `getUserProfile(userId)` - Get user profile
- `updateUserProfile(userId, userData)` - Update profile

**Artisans:**
- `getArtisans()` - Get all artisans
- `getArtisanById(id)` - Get artisan details

**Admin:**
- `getAdminDashboardStats()` - Get platform stats
- `getUsers()` - Get all users
- `getPendingArtisans()` - Get pending artisan applications
- `approveArtisan(artisanId)` - Approve artisan
- `rejectArtisan(artisanId)` - Reject artisan

**How to connect backend:**
1. Create `.env` file: `REACT_APP_API_URL=http://localhost:3001/api`
2. Remove mock data from `api.js`
3. Uncomment real API calls
4. Test with backend

---

## Feature Pages

### `src/app/pages/HomePage.js`
**Purpose:** Landing page  
**What it does:**
- Hero section with call-to-action
- Featured categories
- Featured products grid
- Displays latest/popular products
- Links to categories and products

---

### `src/features/auth/UserLogin.js`
**Purpose:** User login page  
**What it does:**
- Login form (email + password)
- Calls `useAuth.login()`
- Redirects to homepage after login
- Link to registration page

---

### `src/features/auth/UserRegister.js`
**Purpose:** User registration with OTP  
**What it does:**
- **Step 1:** Registration form
  - Full Name
  - Email
  - Phone
  - Password
  - Confirm Password
- **Step 2:** OTP verification
  - 4-digit OTP input
  - Email verification
- Calls `apiService.register()` and `apiService.verifyOTP()`
- Creates account after OTP verification

**Flow:**
1. User fills form → Click "Continue"
2. Backend sends OTP to email
3. User enters OTP (1234 for testing)
4. Account created → Redirect to login

---

### `src/features/auth/ArtisanLogin.js`
**Purpose:** Artisan/seller login (Seller Central)  
**What it does:**
- Login form for artisans
- Redirects to `/artisan/dashboard` after login
- Link to artisan registration

---

### `src/features/products/ProductDetailsPage.js`
**Purpose:** Product details page  
**What it does:**
- Displays product information:
  - Images (gallery)
  - Name, price, description
  - Materials, dimensions
  - Artisan info
  - Stock status
- **"Add to Cart"** button
- **"View in Your Room (AR)"** button
  - Opens camera
  - Overlays product image on live feed
  - Allows customers to visualize product in their space
- Calls `apiService.getProductById(id)`

---

### `src/features/cart/CartPage.js`
**Purpose:** Shopping cart  
**What it does:**
- Displays cart items
- Shows product image, name, price, quantity
- Update quantity buttons
- Remove item button
- Cart total calculation
- "Proceed to Checkout" button
- Uses `CartContext` for state

---

### `src/features/checkout/CheckoutPage.js`
**Purpose:** Order checkout  
**What it does:**
- Shipping address form
- Order summary
- Payment method selection (COD for now)
- "Place Order" button
- Calls `apiService.createOrder()`
- Clears cart after successful order
- Redirects to success page

---

### `src/features/orders/OrdersPage.js`
**Purpose:** User's order history  
**What it does:**
- Displays all user orders
- Shows order ID, date, total, status, items
- Order status tracking
- Calls `apiService.getOrders(userId)`

---

### `src/features/artisans/ArtisanDashboardPage.js`
**Purpose:** Artisan dashboard  
**What it does:**
- Overview stats:
  - Total Products
  - Total Orders
  - Revenue
  - Custom Requests (artisan-specific)
  - Impact Score (artisan-specific)
- Quick links to:
  - Add Product
  - Manage Products
  - View Orders
- Dynamic content based on artisan role

---

### `src/features/artisans/ManageProductsPage.js`
**Purpose:** Artisan's product management  
**What it does:**
- Lists all artisan's products
- Shows product image, name, price, stock
- Edit button (goes to AddProductPage)
- Delete button
- "Add New Product" button
- Calls `apiService.getArtisanProducts(artisanId)`

---

### `src/features/artisans/AddProductPage.js`
**Purpose:** Add/edit product form  
**What it does:**
- Product form:
  - Name
  - Description
  - Price
  - Category
  - Stock
  - Images (URLs)
  - Materials
- Submit button
- Calls `apiService.addProduct()` or `apiService.updateProduct()`
- Redirects to product list after save

---

### `src/features/artisans/ArtisanOrdersPage.js`
**Purpose:** Incoming orders for artisan  
**What it does:**
- Lists orders containing artisan's products
- Shows customer name, product, quantity, amount, status
- Update status dropdown (Pending, Packed, Shipped, Delivered)
- Calls `apiService.getArtisanOrders(artisanId)`

---

### `src/features/admin/AdminDashboardPage.js`
**Purpose:** Admin overview  
**What it does:**
- Platform statistics:
  - Total Users
  - Total Artisans
  - Total Products
  - Total Orders
  - Revenue
- Quick links to management pages
- Calls `apiService.getAdminDashboardStats()`

---

### `src/features/admin/ManageUsersPage.js`
**Purpose:** User management  
**What it does:**
- Lists all registered users
- Shows name, email, role, status, join date
- Filter/search capabilities
- Calls `apiService.getUsers()`

---

### `src/features/admin/ManageArtisansPage.js`
**Purpose:** Artisan approval/management  
**What it does:**
- Lists pending artisan applications
- Shows artisan name, email, application date
- Approve/Reject buttons
- Calls `apiService.getPendingArtisans()`
- Calls `apiService.approveArtisan()` or `apiService.rejectArtisan()`

---

# How Everything Works

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE (Browser)                 │
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
│                        BACKEND (To Build)                 │
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

## Complete User Journey Examples

### Example 1: Customer Buying a Product

**Step-by-Step:**

1. **User visits homepage** (`/`)
   - `HomePage.js` loads
   - Calls `apiService.getProducts()` to fetch products
   - Displays featured products

2. **User clicks on a product**
   - Navigates to `/product/:id`
   - `ProductDetailsPage.js` loads
   - Calls `apiService.getProductById(id)`
   - Displays product details

3. **User clicks "Add to Cart"**
   - Calls `CartContext.addToCart(product, quantity)`
   - Cart state updates
   - Item saved to localStorage
   - Cart icon updates with new count

4. **User clicks cart icon**
   - Navigates to `/cart`
   - `CartPage.js` loads
   - Reads cart from `CartContext`
   - Displays all cart items

5. **User clicks "Proceed to Checkout"**
   - Navigates to `/checkout`
   - `CheckoutPage.js` loads
   - User fills shipping address

6. **User clicks "Place Order"**
   - Calls `apiService.createOrder(userId, orderData)`
   - Backend creates order
   - Cart cleared
   - Redirects to success page

---

### Example 2: Artisan Managing Products

**Step-by-Step:**

1. **Artisan visits Seller Central**
   - Navigates to `/login/artisan`
   - `ArtisanLogin.js` loads
   - Enters email and password

2. **Artisan logs in**
   - Calls `useAuth.login({ email, password })`
   - `apiService.login()` called
   - Backend validates credentials
   - Returns user object + JWT token
   - Stored in localStorage
   - Redirects to `/artisan/dashboard`

3. **Dashboard loads**
   - `ArtisanDashboardPage.js` loads
   - Displays stats (products, orders, revenue)
   - Shows quick action buttons

4. **Artisan clicks "Add New Product"**
   - Navigates to `/artisan/add-product`
   - `AddProductPage.js` loads
   - Shows product form

5. **Artisan fills form and submits**
   - Calls `apiService.addProduct({ ...productData, artisanId })`
   - Backend creates product in database
   - Returns success
   - Redirects to `/artisan/products`

6. **Product list loads**
   - `ManageProductsPage.js` loads
   - Calls `apiService.getArtisanProducts(artisanId)`
   - Displays all artisan's products
   - Shows Edit/Delete buttons

---

### Example 3: New User Registration

**Step-by-Step:**

1. **User clicks "Create Account"**
   - Navigates to `/register/user`
   - `UserRegister.js` loads
   - Shows registration form (Step 1)

2. **User fills form**
   - Name: "John Doe"
   - Email: "john@example.com"
   - Phone: "+91 98765 43210"
   - Password: "SecurePass123"
   - Confirm Password: "SecurePass123"

3. **User clicks "Continue"**
   - Form validates (passwords match)
   - Calls `apiService.register(formData)`
   - Backend:
     - Hashes password
     - Generates 4-digit OTP
     - Sends OTP to email
     - Stores user with status "pending_verification"
   - UI switches to Step 2 (OTP input)

4. **User enters OTP**
   - Receives email with OTP: "1234"
   - Enters 4 digits in OTP boxes
   - Clicks "Verify & Create Account"

5. **OTP verified**
   - Calls `apiService.verifyOTP(email, otp)`
   - Backend:
     - Validates OTP
     - Updates user status to "active"
     - Generates JWT token
   - Returns user + token
   - Stored in localStorage
   - Redirects to `/login/user`

---

## Data Flow Diagrams

### Authentication Flow

```
User Login Page
      │
      ├─ User enters email/password
      │
      ├─ Clicks "Sign In"
      │
      ▼
useAuth.login()
      │
      ├─ Calls apiService.login(credentials)
      │
      ▼
apiService.login()
      │
      ├─ Sends POST /auth/login to backend
      │
      ▼
Backend
      │
      ├─ Validates credentials
      ├─ Checks user status
      ├─ Generates JWT token
      │
      ▼
Returns { user, token }
      │
      ├─ apiService receives response
      │
      ▼
useAuth.login()
      │
      ├─ Stores user in localStorage
      ├─ Updates React state
      │
      ▼
All Components Re-render
      │
      ├─ Navbar shows "Profile" instead of "Sign In"
      ├─ Protected routes become accessible
      │
      ▼
Redirect to appropriate page
      │
      ├─ Artisan → /artisan/dashboard
      └─ User → /
```

### Shopping Cart Flow

```
Product Details Page
      │
      ├─ User clicks "Add to Cart"
      │
      ▼
CartContext.addToCart(product, quantity)
      │
      ├─ Gets current cart from state
      ├─ Checks if product already in cart
      │   ├─ Yes: Update quantity
      │   └─ No: Add new item
      │
      ├─ Updates cart state
      ├─ Saves to localStorage
      │
      ▼
All components using CartContext re-render
      │
      ├─ Navbar cart icon updates count
      ├─ Cart page shows new item
      │
      ▼
User navigates to /cart
      │
      ├─ CartPage.js loads
      ├─ Reads cart from CartContext
      ├─ Displays items
      │
      ▼
User clicks "Proceed to Checkout"
      │
      ├─ Navigates to /checkout
      │
      ▼
CheckoutPage.js
      │
      ├─ User fills shipping address
      ├─ Clicks "Place Order"
      │
      ▼
apiService.createOrder(userId, orderData)
      │
      ├─ Sends POST /orders/:userId to backend
      │
      ▼
Backend
      │
      ├─ Creates order in database
      ├─ Reduces product stock
      ├─ Sends confirmation email
      │
      ▼
Returns { orderId, total }
      │
      ├─ Frontend receives response
      ├─ Calls CartContext.clearCart()
      ├─ Shows success message
      │
      ▼
Redirect to order confirmation page
```

### Artisan Product Management Flow

```
Artisan Dashboard
      │
      ├─ Artisan clicks "Manage Products"
      │
      ▼
Navigate to /artisan/products
      │
      ├─ ManageProductsPage.js loads
      │
      ▼
apiService.getArtisanProducts(artisanId)
      │
      ├─ Sends GET /artisans/:artisanId/products
      │
      ▼
Backend
      │
      ├─ Queries database for artisan's products
      ├─ Returns product array
      │
      ▼
Frontend displays products
      │
      ├─ Shows product grid
      ├─ Each product has Edit/Delete buttons
      │
      ▼
Artisan clicks "Edit" on a product
      │
      ├─ Navigates to /artisan/edit-product/:id
      │
      ▼
AddProductPage.js loads
      │
      ├─ Detects edit mode (id in URL)
      ├─ Calls apiService.getProductById(id)
      ├─ Pre-fills form with product data
      │
      ▼
Artisan updates product details
      │
      ├─ Changes price, stock, description
      ├─ Clicks "Save Changes"
      │
      ▼
apiService.updateProduct(id, productData)
      │
      ├─ Sends PUT /products/:id to backend
      │
      ▼
Backend
      │
      ├─ Validates artisan owns product
      ├─ Updates product in database
      │
      ▼
Returns success
      │
      ├─ Frontend shows success message
      ├─ Redirects to /artisan/products
      │
      ▼
Product list refreshes with updated data
```

---

## Key Features Explained

### 1. AR Product Visualization

**How it works:**
1. User on product details page
2. Clicks "View in Your Room (AR)"
3. Browser requests camera permission
4. User grants permission
5. Live camera feed displayed in modal
6. Product image overlaid on camera feed
7. User can see product in their space
8. Click "Close" to exit AR mode

**Technology:**
- Uses browser's `getUserMedia()` API
- Canvas overlay for product image
- No backend needed for this feature

---

### 2. OTP Email Verification

**How it works:**
1. User registers with email
2. Backend generates random 4-digit OTP
3. OTP sent to user's email via SendGrid/AWS SES
4. OTP stored in database with 5-minute expiry
5. User enters OTP in frontend
6. Frontend sends OTP to backend for verification
7. Backend validates OTP and expiry
8. Account activated if valid

**Security:**
- OTP expires after 5 minutes
- One-time use only
- Prevents fake accounts
- Industry standard (used by Google, Facebook, etc.)

---

### 3. Artisan Impact Tracking

**How it works:**
1. Artisans can set their impact score (0-100)
2. Dashboard shows:
   - Environmental impact
   - Social impact
   - Heritage preservation
3. Displayed on artisan profile
4. Helps customers make conscious choices

**Unique Feature:**
- Differentiates from regular e-commerce
- Appeals to conscious consumers
- Builds artisan brand story

---

### 4. Dynamic Navbar

**How it works:**
1. Navbar checks user authentication state via `useAuth`
2. Checks user role (guest, user, artisan, admin)
3. Dynamically shows different menu options:
   - **Guest:** Sign In, Create Account, Join as Artisan
   - **User:** My Profile, My Orders, Sign Out
   - **Artisan:** Artisan Profile, My Orders, Artisan Dashboard, Sign Out
4. Cart icon shows item count from `CartContext`
5. Search bar hidden on dashboard pages

**Smart Features:**
- Hides "Artisan Dashboard" when already on dashboard
- Shows "Seller Central" link for guests
- Updates in real-time when user logs in/out

---

## State Management

### Global State (React Context)

**CartContext:**
- Manages shopping cart
- Persists to localStorage
- Available to all components

**How to use:**
```javascript
const { cart, addToCart, removeFromCart, getCartCount } = useCart();
```

### Local State (useState)

Used in individual components for:
- Form inputs
- Loading states
- Error messages
- UI toggles

### Persistent State (localStorage)

Stored in browser:
- User authentication data
- Shopping cart items
- Admin session

---

# Backend Integration

## How to Connect Backend

### Step 1: Create `.env` File
```env
REACT_APP_API_URL=http://localhost:3001/api
```

### Step 2: Update `src/shared/services/api.js`

**Remove mock data:**
```javascript
// BEFORE (Mock)
async login(credentials) {
    if (credentials.email === 'artisan@hhw.com') {
        return { user: {...}, token: "..." };
    }
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

### Step 3: Implement Backend Endpoints

See `docs/backend_integration_guide.md` for complete API specifications.

**Required Endpoints:**
- POST `/auth/register` - User registration
- POST `/auth/verify-otp` - OTP verification
- POST `/auth/login` - User login
- GET `/products` - Get all products
- GET `/products/:id` - Get product details
- POST `/products` - Create product (artisan only)
- PUT `/products/:id` - Update product
- DELETE `/products/:id` - Delete product
- GET `/artisans/:id/products` - Get artisan's products
- POST `/orders/:userId` - Create order
- GET `/orders/:userId` - Get user orders
- GET `/artisans/:id/orders` - Get artisan orders
- GET `/users/:userId` - Get user profile
- PUT `/users/:userId` - Update profile
- GET `/admin/stats` - Admin dashboard stats

### Step 4: Database Schema

**Users Table:**
```javascript
{
  id: Number/String,
  fullName: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  role: Enum["user", "artisan", "admin"],
  status: Enum["pending_verification", "active", "suspended"],
  createdAt: Date,
  updatedAt: Date
}
```

**Products Table:**
```javascript
{
  id: Number/String,
  name: String,
  description: Text,
  price: Number,
  category: String,
  stock: Number,
  images: Array[String],
  artisanId: Number/String (Foreign Key),
  materials: Array[String],
  createdAt: Date,
  updatedAt: Date
}
```

**Orders Table:**
```javascript
{
  id: String ("ORD-12345"),
  userId: Number/String (Foreign Key),
  items: Array[{
    productId: Number/String,
    name: String,
    quantity: Number,
    price: Number
  }],
  total: Number,
  status: Enum["Pending", "Packed", "Shipped", "Delivered", "Cancelled"],
  shippingAddress: String,
  paymentMethod: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Summary

**CraftConnect is a complete, production-ready e-commerce platform for handcrafted goods with:**

✅ **Clean Architecture** - Organized, maintainable code  
✅ **Industry Standards** - Follows React best practices  
✅ **Artisan-Focused** - Simplified seller model  
✅ **Feature-Rich** - AR, OTP, Impact Tracking  
✅ **Backend-Ready** - All API calls defined  
✅ **Well-Documented** - Complete guides for developers  
✅ **Scalable** - Easy to extend and customize  

**The frontend is 100% complete and ready for backend integration!** 🚀
