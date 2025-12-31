# Storage Strategy - localStorage vs Backend Database

## 📦 What Gets Stored Where?

This document clarifies what data is stored in localStorage (browser) vs backend database after integration.

---

## 🎯 **Quick Reference**

### ✅ **Backend Database (Persistent Storage)**
**Use for:** All business-critical data that needs to persist and be accessible across devices

- ✅ User accounts (name, email, password hash, phone)
- ✅ User profiles (address, preferences, settings)
- ✅ Shopping cart items (after backend integration)
- ✅ Order history
- ✅ Product catalog
- ✅ Artisan profiles and shop data
- ✅ Product reviews and ratings
- ✅ Wishlist items
- ✅ Payment information (encrypted)
- ✅ Order tracking data
- ✅ Admin settings
- ✅ Platform analytics

### 📱 **localStorage (Temporary/Session Storage)**
**Use for:** Temporary data, session management, and UI preferences

- ✅ JWT authentication token (for maintaining login session)
- ✅ User session data (current login state)
- ✅ UI preferences (theme, language, layout)
- ✅ Recently viewed products (optional)
- ✅ Search history (optional)
- ✅ Form draft data (auto-save)
- ❌ ~~Shopping cart~~ (moves to backend after integration)
- ❌ ~~User profile data~~ (stored in backend)

---

## 🔄 **Current vs Future State**

### **Current Implementation (Development)**

```javascript
// Shopping Cart - Currently in localStorage
CartContext.js:
- Stores cart in React state
- Saves to localStorage for persistence
- Loads from localStorage on page refresh

// Authentication - Currently in localStorage  
useAuth.js:
- Stores user object in localStorage
- Stores JWT token in localStorage
```

### **After Backend Integration**

```javascript
// Shopping Cart - Will use Backend
CartContext.js:
- Stores cart in React state (for UI reactivity)
- Syncs with backend database on every change
- Loads from backend on page load
- API calls:
  - POST /cart/add - Add item
  - PUT /cart/update - Update quantity
  - DELETE /cart/remove - Remove item
  - GET /cart/:userId - Fetch cart

// Authentication - Hybrid approach
useAuth.js:
- JWT token in localStorage (session only)
- User profile data fetched from backend
- API calls:
  - POST /auth/login - Get token
  - GET /users/:userId - Get profile data
```

---

## 📊 **Detailed Breakdown**

### **1. Shopping Cart**

**Current (Development):**
```javascript
// Stored in localStorage
{
  cart: [
    { productId: 1, name: "Basket", quantity: 2, price: 1200 },
    { productId: 5, name: "Pot", quantity: 1, price: 800 }
  ]
}
```

**After Backend Integration:**
```javascript
// Stored in Database (MongoDB example)
{
  _id: "cart_123",
  userId: 123,
  items: [
    { 
      productId: 1, 
      name: "Basket", 
      quantity: 2, 
      price: 1200,
      addedAt: "2025-01-15T10:30:00Z"
    },
    { 
      productId: 5, 
      name: "Pot", 
      quantity: 1, 
      price: 800,
      addedAt: "2025-01-15T11:00:00Z"
    }
  ],
  updatedAt: "2025-01-15T11:00:00Z"
}

// localStorage only stores:
{
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Benefits of Backend Storage:**
- ✅ Cart accessible from any device (phone, laptop, tablet)
- ✅ Cart persists even if browser cache cleared
- ✅ Better analytics (abandoned cart tracking)
- ✅ Can send reminder emails for abandoned carts
- ✅ Prevents cart loss

---

### **2. User Authentication**

**Current (Development):**
```javascript
// localStorage stores everything
{
  user: {
    id: 123,
    name: "John Doe",
    email: "john@example.com",
    role: "user"
  },
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**After Backend Integration:**
```javascript
// localStorage stores ONLY token
{
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

// User data fetched from backend when needed
// Database stores:
{
  _id: 123,
  fullName: "John Doe",
  email: "john@example.com",
  phone: "+91 98765 43210",
  passwordHash: "$2b$10$...",
  role: "user",
  status: "active",
  address: "123 Main St, Mumbai",
  createdAt: "2025-01-10T10:00:00Z",
  updatedAt: "2025-01-15T14:30:00Z"
}
```

**Why This Approach:**
- ✅ More secure (sensitive data not in browser)
- ✅ Always up-to-date (fetched from backend)
- ✅ Smaller localStorage footprint
- ✅ Token can be invalidated server-side

---

### **3. Order Data**

**Always in Backend Database:**
```javascript
// Orders Collection/Table
{
  _id: "ORD-12345",
  userId: 123,
  items: [...],
  total: 3200,
  status: "Pending",
  shippingAddress: "123 Main St, Mumbai",
  paymentMethod: "COD",
  createdAt: "2025-01-15T15:00:00Z",
  updatedAt: "2025-01-15T15:00:00Z"
}
```

**Never in localStorage** - Orders are permanent business records

---

### **4. Product Data**

**Always in Backend Database:**
```javascript
// Products Collection/Table
{
  _id: 1,
  name: "Handwoven Basket",
  description: "Beautiful...",
  price: 1200,
  stock: 10,
  artisanId: 999,
  category: "Home Decor",
  images: ["url1.jpg", "url2.jpg"],
  createdAt: "2025-01-01T10:00:00Z"
}
```

**localStorage usage:** Only for caching (optional)
```javascript
// Optional: Cache recently viewed products
{
  recentlyViewed: [1, 5, 12, 8]  // Just product IDs
}
```

---

## 🔧 **Migration Strategy**

### **Step 1: Keep Current Implementation**
- Continue using localStorage for development
- Easy testing without backend

### **Step 2: Backend Ready**
- Backend developer implements database
- Creates API endpoints for cart, user data, etc.

### **Step 3: Update Frontend**
- Modify `CartContext.js` to call backend APIs
- Update `useAuth.js` to fetch user data from backend
- Keep JWT token in localStorage
- Remove user object from localStorage

### **Step 4: Testing**
- Test cart sync across devices
- Verify data persistence
- Check performance

---

## 📝 **Code Changes Needed**

### **CartContext.js - Before**
```javascript
// Current: localStorage
const addToCart = (product, quantity) => {
  const newCart = [...cart, { ...product, quantity }];
  setCart(newCart);
  localStorage.setItem('cart', JSON.stringify(newCart));
};
```

### **CartContext.js - After Backend Integration**
```javascript
// Future: Backend API
const addToCart = async (product, quantity) => {
  // Update backend first
  await apiService.addToCart(userId, product, quantity);
  
  // Then update local state (for UI reactivity)
  const newCart = [...cart, { ...product, quantity }];
  setCart(newCart);
  
  // No localStorage needed!
};
```

---

## ✅ **Summary**

### **Use Backend Database For:**
- User accounts and profiles
- Shopping carts (after integration)
- Orders
- Products
- Any data that needs to persist
- Any data needed across devices
- Business-critical information

### **Use localStorage For:**
- JWT authentication token
- Session management
- UI preferences (theme, language)
- Temporary caching
- Form auto-save drafts

### **Never Use localStorage For:**
- Sensitive data (passwords, payment info)
- Large datasets
- Data that needs to be shared across devices
- Permanent business records

---

**The current code uses localStorage for convenience during development. After backend integration, most data will move to the database, with only session tokens remaining in localStorage.** 🚀
