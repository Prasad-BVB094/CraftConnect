# CraftConnect: Comprehensive Project Documentation (v1.0)

Welcome to the **CraftConnect** master documentation. This document provides a deep dive into every file, component, and technical flow within the application.

---

## 🏗️ Technical Stack
- **Frontend**: React.js 18 (Hooks, Context API, SVG-based design)
- **Backend**: Node.js, Express.js (RESTful API)
- **Database**: MongoDB with Mongoose ODM
- **Integrations**: SendGrid (Emailing), Razorpay (Payment placeholder), Lucide-React (Icons)

---

## 🖥️ Backend Architecture (`/Backend/src`)

### 📦 Controllers (`/controllers`)
These files contain the logic for handling incoming requests and returning responses.

1.  **`admin.controller.js`**: Core platform metrics and management. Handles global stats for the admin dashboard and bulk user/vendor/product operations.
2.  **`auth.controller.js`**: Security gateway. Manages user/artisan/admin registration, login, profile updates, and the multi-step OTP verification flow.
3.  **`cart.controller.js`**: Logic for managing the shopping cart (adding/removing items, updating quantities) persisted in MongoDB.
4.  **`category.controller.js`**: Manages the taxonomy of the marketplace (Pottery, Woodwork, etc.), allowing admins to create/edit/delete categories.
5.  **`order.controller.js`**: The transaction engine. Handles order placement, stock decrementing, and order tracking for users and artisans.
6.  **`payment.controller.js`**: Manages payment state and verification. Integrated with Razorpay scripts (logic currently handles success/failure verification).
7.  **`product.controller.js`**: Core marketplace logic. Handles CRUD for products, artisan-specific product listings, and visibility toggling.
8.  **`review.controller.js`**: Manages customer feedback and ratings, ensuring reviews are linked to both products and their respective artisans.
9.  **`support.controller.js`**: Handles customer support tickets, priority assignments, and admin replies.

### 🗄️ Models (`/models`)
Mongoose schemas defining the structure of data in MongoDB.

- **`User.js`**: Schema for users/artisans/admins. Stores credentials, bio, address, `isVerified` status, and `otpHash`.
- **`Product.js`**: Stores product details, price, images, artisan ID, and sub-category references.
- **`Order.js`**: Complex schema for transactions, including shipping address, items list, total amount, and customization notes.
- **`Category.js`**: Simple schema for marketplace categories.
- **`Cart.js`**: Stores items per user for persistent session management.
- **`Review.js`**: Links ratings and comments to products and users.
- **`SupportQuery.js`**: Tracks support tickets, priority, and status.
- **`Payment.js`**: Records transaction IDs and payment statuses for auditing.

### 🛠️ Utilities (`/utils`)
- **`email.js`**: SendGrid wrapper. Functions for OTP delivery and Account Approval emails.
- **`otp.js`**: Logic for generating random codes and verifying them using cryptography.
- **`razorpay.js`**: Initialization for the Razorpay payment gateway.

---

## 🎨 Frontend Architecture (`/CraftConnect/src`)

### 🧩 Feature Modules (`/features`)
Organized by functional area and user role.

#### 👤 Artisan Features
- **`ArtisanDashboardPage.js`**: The primary workspace for vendors. Features local-date-matched revenue charts, stock alerts, and quick action cards.
- **`AddProductPage.js`**: Multi-input form for artisans to list new products, including description, price, and category selection.
- **`ArtisanOrdersPage.js`**: Comprehensive list of orders received, with options to update status (Shipped, Delivered) and view customization requests.
- **`ManageProductsPage.js`**: List view allowing artisans to edit or delete their current inventory.
- **`ArtisanProfileEditorPage.js`**: Form to update the artisan's bio, location, and story.

#### 👑 Admin Features
- **`AnalyticsPage.js`**: Deep insights into platform growth, global order volumes, and revenue trends.
- **`ManageArtisansPage.js`**: Specialized interface for approving or rejecting new artisan applications.
- **`SupportQueriesPage.js`**: Help desk for responding to user issues and assigning ticket priorities.
- **`CategoryManagerPage.js`**: Tool for defining the marketplace structure.
- **`ManageUsersPage.js` & `ManageProductsPage.js`**: Administrative control over all platform content.

#### 🛍️ Shopping Features
- **`ProductDetailsPage.js`**: Detailed view with 3D-like image previews, review lists, and the **Customization Request** modal.
- **`CheckoutPage.js`**: Multi-step checkout flow collecting shipping address and handling payment selection.
- **`LandingPage.js`**: The heritage-themed home page featuring hero sections, value propositions, and featured products.
- **`OrdersPage.js`**: Order history and tracking for the end customer.

### � Shared Logic & Components
- **`api.js`**: Axiom-like service that centralizes all Fetch API calls, manages base URLs, and automatically injects JWT headers.
- **`Navbar.js`**: Dynamic header that changes based on user role (Guest, User, Artisan, Admin) and includes cart count indicators.
- **`CustomerSupportWidget.js`**: Floating help widget available across the site for quick ticket creation.
- **`useAuth.js`**: Custom React hook managing the global authentication state via Context.

---

## � Key Technical Flows

### 1. Secure OTP Sign-Up
- **Client**: Triggers `apiService.register()`.
- **Server**: Creates unverified account -> Generates OTP -> Hashes OTP -> Sends Email via SendGrid -> Logs OTP to terminal (Dev mode).
- **Verify**: Client sends 6-digit code. Server compares hashes. If match, `isVerified = true`.

### 2. Artisan Split-Revenue Tracking
- The **Artisan Dashboard** does not just count total orders. It loops through `order.items` and matches the items to the logged-in artisan's ID. 
- It aggregates `(item.price * item.quantity)` for those specific items to give the artisan their exact share of the revenue.

### 3. Real-Time Analytics
- Data is grouped using `toDateString()` on the client side.
- This ensures that UTC/Database time is normalized to the user's local day, preventing "today's" data from appearing on "yesterday's" graph point in the line chart.

---
*Documentation last updated: January 2026*
