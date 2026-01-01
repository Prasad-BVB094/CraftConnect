// API Service Layer for Backend Integration
// Handles all HTTP requests to the backend at http://localhost:3001

class APIService {
  constructor() {
    this.baseURL = 'http://localhost:3001/api';
  }

  // Generic request method with Auto-Auth header
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    const headers = {
      ...options.headers,
    };

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }


    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // ==========================================
  // AUTHENTICATION
  // ==========================================

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async verifyOTP(email, otp) {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  // ==========================================
  // PRODUCTS
  // ==========================================

  async getProducts() {
    const res = await this.request('/products');
    const products = Array.isArray(res) ? res : res.products;

    return products.map(p => ({
      ...p,
      category: p.category?._id
        ? { id: p.category._id, name: p.category.name, slug: p.category.slug }
        : p.category
    }));
  }
  

  async getProductById(id) {
    const response = await this.request(`/products/${id}`);
    return response.product || response;
  }

  // Get products for the logged-in artisan
  async getArtisanProducts() {
    // Backend endpoint: GET /api/products/my/list
    const response = await this.request('/products/my/list');
    return response.products || response;
  }

  //async addProduct(productData) {
    // Note: If sending images as FormData, content-type should not be set manually
    // But frontend seems to send JSON. If backend requires FormData, this needs adjustment.
    // Based on "API calls.txt" PHASE 3, it says "Form-data". 
    // However, existing frontend sends JSON with image URLs.
    // I will assume JSON for now as changing to FormData requires UI changes.
    // If stricly FormData is required, user needs to know.
    // EDIT: "API calls.txt" says:
    // Header: Authorization: Bearer ARTISAN TOKEN
    // Form-data: title=... images=<file>
    
    // Since I cannot change backend, I must adapt frontend.
    // But for this step I will send JSON and if it fails, I'll update the component to send FormData.
    // Actually, let's keep it generic request for now.
 async addProduct(formData) {
  return this.request('/products', {
    method: 'POST',
    body: formData
  });
}

 // }

  async updateProduct(id, formData) {
  return this.request(`/products/${id}`, {
    method: 'PUT',
    body: formData
  });
}


  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
        method: 'DELETE'
    });
  }

  // ==========================================
  // CATEGORIES
  // ==========================================

  async getCategories() {
    return this.request('/categories');
  }

  // ==========================================
  // CART
  // ==========================================

  async getCart() {
    const response = await this.request('/cart');
    return response.cart || response;
  }

  async addToCart(productId, quantity) {
    return this.request('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async updateCartItem(productId, quantity) {
    return this.request('/cart/update', {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async removeFromCart(productId) {
    return this.request(`/cart/remove/${productId}`, {
      method: 'DELETE',
    });
  }

  // ==========================================
  // ORDERS
  // ==========================================

  async createOrder(orderData) {
    // Backend expects: { address: { ... } }
    // Frontend passes: { shippingAddress: ... } -> needs mapping in component
    return this.request('/orders/place', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrders() {
    // User orders
    return this.request('/orders/my');
  }

  async getArtisanOrders() {
    // Artisan specific orders
    return this.request('/orders/artisan');
  }

  async getAllOrders() {
    // Admin only
    return this.request('/orders');
  }

  async updateOrderStatus(orderId, status) {
    return this.request(`/orders/${orderId}/status`, {
          method: 'PUT',
          body: JSON.stringify({ status })
      });
  }

  // ==========================================
  // ADMIN / USERS
  // ==========================================

  // ==========================================
// ADMIN
// ==========================================

// Dashboard summary
async getAdminDashboard() {
  return this.request('/admin/dashboard');
}

// Users
async getUsers() {
  return this.request('/admin/users');
}

// Artisans
async getArtisans() {
  return this.request('/admin/artisans');
}

async getPendingArtisans() {
  return this.request('/admin/artisans/pending');
}

async approveArtisan(artisanId) {
  return this.request(`/admin/artisans/${artisanId}/approve`, {
    method: 'POST',
  });
}

async rejectArtisan(artisanId) {
  return this.request(`/admin/artisans/${artisanId}/reject`, {
    method: 'POST',
  });
}

// Products (admin view)
async getAdminProducts() {
  return this.request('/admin/products');
}

// ==========================
// ADMIN — PRODUCT ACTIONS
// ==========================

async adminUpdateProduct(id, data) {
  return this.request(`/admin/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}


async deleteAdminProduct(id) {
  return this.request(`/admin/products/${id}`, {
    method: "DELETE",
  });
}

// ==========================
// ADMIN — CATEGORY ACTIONS
// ==========================

async createCategory(data) {
  return this.request("/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

async updateCategory(id, data) {
  return this.request(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

async deleteCategory(id) {
  return this.request(`/categories/${id}`, {
    method: "DELETE",
  });
}


// Orders (admin view)
async getAdminOrders() {
  return this.request('/admin/orders');
}


  // ==========================================
  // USER PROFILE
  // ==========================================
  
  async getUserProfile(userId) {
      return this.request(`/auth/profile/${userId}`);
  }

  async updateUserProfile(userId, data) {
      return this.request(`/auth/profile/${userId}`, {
          method: 'PUT',
          body: JSON.stringify(data)
      });
  }
}



// Create a singleton instance
const apiService = new APIService();

export default apiService;
