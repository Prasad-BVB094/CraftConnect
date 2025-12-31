// Data Models for the E-commerce Application

// User Model
export class User {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.email = data.email || '';
    this.role = data.role || 'user'; // user, artisan, vendor, admin
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Artisan/Vendor Model
export class Vendor {
  constructor(data = {}) {
    this.id = data.id || null;
    this.businessName = data.businessName || '';
    this.ownerName = data.ownerName || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.address = data.address || '';
    this.city = data.city || '';
    this.state = data.state || '';
    this.pincode = data.pincode || '';
    this.businessType = data.businessType || 'artisan'; // artisan or vendor
    this.gstNumber = data.gstNumber || '';
    this.bankAccount = data.bankAccount || '';
    this.ifscCode = data.ifscCode || '';
    this.status = data.status || 'pending'; // pending, active, blocked
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Product Model
export class Product {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.description = data.description || '';
    this.price = data.price || 0;
    this.category = data.category || '';
    this.image = data.image || '';
    this.vendorId = data.vendorId || null;
    this.tags = data.tags || [];
    this.stock = data.stock || 0;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Cart Item Model
export class CartItem {
  constructor(data = {}) {
    this.id = data.id || null;
    this.productId = data.productId || null;
    this.quantity = data.quantity || 1;
    this.userId = data.userId || null;
    this.createdAt = data.createdAt || new Date().toISOString();
  }
}

// Order Model
export class Order {
  constructor(data = {}) {
    this.id = data.id || null;
    this.userId = data.userId || null;
    this.items = data.items || [];
    this.totalAmount = data.totalAmount || 0;
    this.status = data.status || 'pending'; // pending, confirmed, shipped, delivered, cancelled
    this.shippingAddress = data.shippingAddress || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Category Model
export class Category {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.description = data.description || '';
    this.slug = data.slug || '';
    this.icon = data.icon || '';
    this.createdAt = data.createdAt || new Date().toISOString();
  }
}
