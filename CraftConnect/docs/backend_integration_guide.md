# Backend Integration Guide - CraftConnect

## Overview
This guide provides complete API specifications for integrating the CraftConnect backend with the React frontend. The system uses an **artisan-only seller model** (no separate vendor role).

---

## Quick Start

### Environment Setup
Create a `.env` file in your backend project:

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=mongodb://localhost:27017/craftconnect
# OR for PostgreSQL:
# DATABASE_URL=postgresql://user:password@localhost:5432/craftconnect

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d

# Email (for OTP)
EMAIL_SERVICE=sendgrid
# OR aws-ses, gmail, etc.
EMAIL_API_KEY=your-email-service-api-key
EMAIL_FROM=noreply@craftconnect.com

# File Upload
UPLOAD_SERVICE=cloudinary
# OR aws-s3, local
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

---

## API Base URL

**Development:** `http://localhost:3001/api`  
**Production:** `https://your-domain.com/api`

---

## Authentication Endpoints

### 1. User Registration
**POST** `/auth/register`

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+91 98765 43210",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123",
  "role": "user"
}
```

**Backend Logic:**
1. Validate input (email format, password strength, phone format)
2. Check if email already exists
3. Hash password using bcrypt
4. Generate 4-digit OTP
5. Store user with `status: "pending_verification"`
6. Send OTP to email
7. Store OTP in database with 5-minute expiry

**Response (200):**
```json
{
  "success": true,
  "message": "OTP sent to your email",
  "email": "john@example.com"
}
```

**Error Responses:**
- `400`: Email already exists
- `400`: Invalid input data
- `500`: Email service error

---

### 2. Verify OTP
**POST** `/auth/verify-otp`

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "1234"
}
```

**Backend Logic:**
1. Find OTP record by email
2. Check if OTP matches
3. Check if OTP not expired (5 min)
4. Update user status to "active"
5. Delete OTP record
6. Generate JWT token

**Response (200):**
```json
{
  "user": {
    "id": 123,
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400`: Invalid or expired OTP
- `404`: Email not found

---

### 3. User Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Backend Logic:**
1. Find user by email
2. Verify password using bcrypt
3. Check user status is "active"
4. Generate JWT token
5. Return user data + token

**Response (200):**
```json
{
  "user": {
    "id": 123,
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `401`: Invalid credentials
- `403`: Account not verified

---

## Product Endpoints

### 4. Get All Products
**GET** `/products`

**Query Parameters:**
- `category` (optional): Filter by category
- `search` (optional): Search query
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response (200):**
```json
{
  "products": [
    {
      "id": 1,
      "name": "Handwoven Basket",
      "description": "Beautiful handwoven basket...",
      "price": 1200,
      "category": "Home Decor",
      "stock": 15,
      "images": ["https://cdn.example.com/basket1.jpg"],
      "artisanId": 999,
      "artisanName": "Rajesh Kumar",
      "materials": ["Bamboo", "Natural Fiber"],
      "createdAt": "2025-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 100
  }
}
```

---

### 5. Get Single Product
**GET** `/products/:id`

**Response (200):**
```json
{
  "id": 1,
  "name": "Handwoven Basket",
  "description": "Beautiful handwoven basket made from sustainable bamboo...",
  "price": 1200,
  "category": "Home Decor",
  "stock": 15,
  "images": [
    "https://cdn.example.com/basket1.jpg",
    "https://cdn.example.com/basket2.jpg"
  ],
  "artisanId": 999,
  "artisan": {
    "id": 999,
    "name": "Rajesh Kumar",
    "location": "Jaipur, Rajasthan",
    "bio": "Master craftsman with 20 years experience..."
  },
  "materials": ["Bamboo", "Natural Fiber"],
  "dimensions": "30cm x 25cm x 15cm",
  "weight": "500g",
  "createdAt": "2025-01-15T10:30:00Z"
}
```

---

### 6. Create Product (Artisan Only)
**POST** `/products`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "name": "Handwoven Basket",
  "description": "Beautiful handwoven basket...",
  "price": 1200,
  "category": "Home Decor",
  "stock": 15,
  "images": ["https://cdn.example.com/basket1.jpg"],
  "artisanId": 999,
  "materials": ["Bamboo", "Natural Fiber"]
}
```

**Backend Logic:**
1. Verify JWT token
2. Check user role is "artisan"
3. Validate artisanId matches authenticated user
4. Create product in database

**Response (201):**
```json
{
  "success": true,
  "productId": 1,
  "message": "Product created successfully"
}
```

---

### 7. Update Product
**PUT** `/products/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:** (Same as Create Product)

**Backend Logic:**
1. Verify JWT token
2. Check product belongs to authenticated artisan
3. Update product

**Response (200):**
```json
{
  "success": true,
  "message": "Product updated successfully"
}
```

---

### 8. Delete Product
**DELETE** `/products/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

### 9. Get Artisan's Products
**GET** `/artisans/:artisanId/products`

**Response (200):**
```json
{
  "products": [
    {
      "id": 1,
      "name": "Handwoven Basket",
      "price": 1200,
      "stock": 15,
      "images": ["https://cdn.example.com/basket1.jpg"]
    }
  ]
}
```

---

## Order Endpoints

### 10. Create Order
**POST** `/orders/:userId`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": 1,
      "name": "Handwoven Basket",
      "quantity": 2,
      "price": 1200
    }
  ],
  "total": 2400,
  "shippingAddress": "123 Main St, City, 123456",
  "paymentMethod": "COD"
}
```

**Backend Logic:**
1. Verify JWT token
2. Validate userId matches authenticated user
3. Check product stock availability
4. Create order with status "Pending"
5. Reduce product stock
6. Send confirmation email

**Response (201):**
```json
{
  "success": true,
  "orderId": "ORD-12345",
  "total": 2400,
  "message": "Order placed successfully"
}
```

---

### 11. Get User Orders
**GET** `/orders/:userId`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "orders": [
    {
      "id": "ORD-12345",
      "date": "2025-01-20T14:30:00Z",
      "total": 2400,
      "status": "Shipped",
      "items": [
        {
          "productId": 1,
          "name": "Handwoven Basket",
          "quantity": 2,
          "price": 1200
        }
      ]
    }
  ]
}
```

---

### 12. Get Artisan Orders (Incoming)
**GET** `/artisans/:artisanId/orders`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "orders": [
    {
      "id": 101,
      "orderId": "ORD-12345",
      "customer": "John Doe",
      "product": "Handwoven Basket",
      "quantity": 2,
      "amount": 2400,
      "status": "Pending",
      "date": "2025-01-20T14:30:00Z"
    }
  ]
}
```

---

### 13. Update Order Status
**PUT** `/orders/:orderId/status`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "status": "Shipped"
}
```

**Valid Statuses:**
- `Pending`
- `Packed`
- `Shipped`
- `Delivered`
- `Cancelled`

**Response (200):**
```json
{
  "success": true,
  "message": "Order status updated"
}
```

---

## User Profile Endpoints

### 14. Get User Profile
**GET** `/users/:userId`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "id": 123,
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+91 98765 43210",
  "address": "123 Main St, City, 123456",
  "role": "user"
}
```

---

### 15. Update User Profile
**PUT** `/users/:userId`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "fullName": "John Doe",
  "phone": "+91 98765 43210",
  "address": "123 Main St, City, 123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

---

## Artisan Endpoints

### 16. Get All Artisans
**GET** `/artisans`

**Response (200):**
```json
{
  "artisans": [
    {
      "id": 999,
      "name": "Rajesh Kumar",
      "location": "Jaipur, Rajasthan",
      "specialty": "Bamboo Crafts",
      "bio": "Master craftsman...",
      "profileImage": "https://cdn.example.com/artisan999.jpg"
    }
  ]
}
```

---

### 17. Get Artisan By ID
**GET** `/artisans/:id`

**Response (200):**
```json
{
  "id": 999,
  "name": "Rajesh Kumar",
  "location": "Jaipur, Rajasthan",
  "specialty": "Bamboo Crafts",
  "bio": "Master craftsman with 20 years experience...",
  "profileImage": "https://cdn.example.com/artisan999.jpg",
  "products": [
    {
      "id": 1,
      "name": "Handwoven Basket",
      "price": 1200,
      "image": "https://cdn.example.com/basket1.jpg"
    }
  ],
  "stats": {
    "totalProducts": 25,
    "totalSales": 1500,
    "rating": 4.8
  }
}
```

---

## Admin Endpoints

### 18. Get Dashboard Stats
**GET** `/admin/stats`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "totalUsers": 1250,
  "totalArtisans": 85,
  "totalProducts": 450,
  "totalOrders": 3200,
  "revenue": 1250000
}
```

---

### 19. Get All Users
**GET** `/admin/users`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "users": [
    {
      "id": 123,
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "status": "active",
      "createdAt": "2025-01-10T10:00:00Z"
    }
  ]
}
```

---

### 20. Get Pending Artisans
**GET** `/admin/artisans/pending`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "artisans": [
    {
      "id": 888,
      "name": "New Artisan",
      "email": "newartisan@example.com",
      "status": "pending_approval",
      "appliedAt": "2025-01-15T12:00:00Z"
    }
  ]
}
```

---

### 21. Approve Artisan
**POST** `/admin/artisans/:artisanId/approve`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Artisan approved successfully"
}
```

---

### 22. Reject Artisan
**POST** `/admin/artisans/:artisanId/reject`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Artisan application rejected"
}
```

---

## Database Schema

### Users Table/Collection
```javascript
{
  id: Number/String (Primary Key),
  fullName: String,
  email: String (Unique, Indexed),
  phone: String,
  password: String (Hashed with bcrypt),
  role: Enum["user", "artisan", "admin"],
  status: Enum["pending_verification", "active", "suspended"],
  address: String (Optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Products Table/Collection
```javascript
{
  id: Number/String (Primary Key),
  name: String,
  description: Text,
  price: Number,
  category: String,
  stock: Number,
  images: Array[String], // URLs
  artisanId: Number/String (Foreign Key → Users.id),
  materials: Array[String],
  dimensions: String (Optional),
  weight: String (Optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Table/Collection
```javascript
{
  id: String (Primary Key, e.g., "ORD-12345"),
  userId: Number/String (Foreign Key → Users.id),
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

### OTP Table/Collection (Temporary)
```javascript
{
  email: String (Indexed),
  otp: String,
  expiresAt: Date, // 5 minutes from creation
  createdAt: Date
}
```

---

## CORS Configuration

**Express.js Example:**
```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## JWT Authentication Middleware

**Example:**
```javascript
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}
```

---

## Testing Checklist

### Authentication
- [ ] User registration sends OTP email
- [ ] OTP verification activates account
- [ ] Login returns valid JWT token
- [ ] Invalid credentials return 401
- [ ] Expired OTP returns error

### Products
- [ ] Get all products works
- [ ] Get single product returns full details
- [ ] Artisan can create product
- [ ] Artisan can update own product
- [ ] Artisan cannot update other's product
- [ ] Delete product works

### Orders
- [ ] Create order reduces stock
- [ ] User can view own orders
- [ ] Artisan can view incoming orders
- [ ] Update order status works
- [ ] Order confirmation email sent

### Admin
- [ ] Admin can view all users
- [ ] Admin can approve/reject artisans
- [ ] Dashboard stats are accurate

### Security
- [ ] JWT tokens expire correctly
- [ ] Passwords are hashed
- [ ] CORS is configured
- [ ] SQL injection prevented
- [ ] XSS attacks prevented

---

## Error Handling

All errors should follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (only in development)"
}
```

**HTTP Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (not logged in)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

---

## Next Steps

1. Set up your backend framework (Express, Django, etc.)
2. Configure database connection
3. Implement authentication endpoints first
4. Test with Postman
5. Implement product endpoints
6. Implement order endpoints
7. Set up email service
8. Configure file upload
9. Deploy backend
10. Update frontend `.env` with production URL

---

**Backend is ready to integrate! 🚀**
