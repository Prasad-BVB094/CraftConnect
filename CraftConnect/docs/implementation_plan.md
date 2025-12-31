# Implementation Plan: Artisan-Only Seller Model

## Goal
Simplify the seller model by removing the "Vendor" concept and keeping only "Artisan" as the seller role. All seller functionality remains intact but uses artisan terminology.

---

## User Review Required

> [!IMPORTANT]
> **Breaking Changes:**
> - All `/vendor/*` routes will become `/artisan/*`
> - `vendor@hhw.com` demo login will change to `artisan@hhw.com`
> - Database `role` field: `vendor` → `artisan`
> - API endpoints: `/vendors/*` → `/artisans/*`

> [!NOTE]
> **No Functionality Lost:**
> - All seller features remain (dashboard, products, orders, profile)
> - Only terminology changes from "vendor" to "artisan"

---

## Proposed Changes

### 1. Routes & Navigation

#### [MODIFY] [AppRoutes.js](file:///c:/Users/Asus/Desktop/WT - Copy1/src/app/routes/AppRoutes.js)
**Changes:**
- `/vendor/dashboard` → `/artisan/dashboard`
- `/vendor/products` → `/artisan/products`
- `/vendor/add-product` → `/artisan/add-product`
- `/vendor/edit-product/:id` → `/artisan/edit-product/:id`
- `/vendor/orders` → `/artisan/orders`
- `/vendor/profile` → `/artisan/profile`
- `/login/vendor` → `/login/artisan`
- `/register/vendor` → (REMOVE - keep only `/register/artisan`)

---

### 2. API Service Layer

#### [MODIFY] [api.js](file:///c:/Users/Asus/Desktop/WT - Copy1/src/shared/services/api.js)
**Method Renames:**
- `getVendorProducts()` → `getArtisanProducts()`
- `getVendorOrders()` → `getArtisanOrders()`
- `getVendors()` → `getArtisans()`
- `getVendorById()` → `getArtisanById()`
- `submitVendorApplication()` → `submitArtisanApplication()`
- `getPendingVendors()` → `getPendingArtisans()`
- `approveVendor()` → `approveArtisan()`
- `rejectVendor()` → `rejectArtisan()`

**Endpoint Changes:**
- `/vendors/*` → `/artisans/*`
- Remove `vendor@hhw.com` demo login
- Update mock data references

---

### 3. Authentication

#### [MODIFY] [VendorLogin.js](file:///c:/Users/Asus/Desktop/WT - Copy1/src/features/auth/VendorLogin.js)
**Rename to:** `ArtisanLogin.js`
**Changes:**
- Title: "Seller Central" → "Artisan Login"
- Redirect: `/vendor/dashboard` → `/artisan/dashboard`
- Update all text references

#### [DELETE] [VendorRegister.js](file:///c:/Users/Asus/Desktop/WT - Copy1/src/features/auth/VendorRegister.js)
**Reason:** Already have `ArtisanRegister.js`

#### [MODIFY] [UserLogin.js](file:///c:/Users/Asus/Desktop/WT - Copy1/src/features/auth/UserLogin.js)
**Changes:**
- Role check: `'vendor'` → `'artisan'`
- Redirect: `/vendor/dashboard` → `/artisan/dashboard`

---

### 4. Navbar Component

#### [MODIFY] [Navbar.js](file:///c:/Users/Asus/Desktop/WT - Copy1/src/shared/components/Navbar.js)
**State Changes:**
- `vendorMode` → `artisanMode`
- Update role check: `user.role === 'vendor'` → `user.role === 'artisan'`

**Route Updates:**
- `/vendor/profile` → `/artisan/profile`
- `/vendor/orders` → `/artisan/orders`
- `/vendor/dashboard` → `/artisan/dashboard`
- `/login/vendor` → `/login/artisan`

**Text Changes:**
- "Seller Central" → "Artisan Portal"
- "Shop Profile" → "Artisan Profile"
- "Shop Orders" → "My Orders"
- "Seller Dashboard" → "Artisan Dashboard"

---

### 5. Artisan Features (Rename from vendors/)

#### [MODIFY] [VendorDashboardPage.js](file:///c:/Users/Asus/Desktop/WT - Copy1/src/features/vendors/VendorDashboardPage.js)
**Rename to:** `ArtisanDashboardPage.js`
**Changes:**
- Title: "Vendor Dashboard" → "Artisan Dashboard"
- Remove vendor-specific logic
- Keep artisan-specific features (Custom Requests, Impact Score)

#### [MODIFY] [VendorProfilePage.js](file:///c:/Users/Asus/Desktop/WT - Copy1/src/features/vendors/VendorProfilePage.js)
**Rename to:** `ArtisanProfilePage.js` (seller profile editor)
**Changes:**
- API calls: `getVendorById()` → `getArtisanById()`
- Update all text references

#### [MODIFY] [VendorOrdersPage.js](file:///c:/Users/Asus/Desktop/WT - Copy1/src/features/vendors/VendorOrdersPage.js)
**Rename to:** `ArtisanOrdersPage.js`
**Changes:**
- API calls: `getVendorOrders()` → `getArtisanOrders()`

#### [MODIFY] [ManageProductsPage.js](file:///c:/Users/Asus/Desktop/WT - Copy1/src/features/vendors/ManageProductsPage.js)
**Changes:**
- Function name: `VendorManageProductsPage` → `ArtisanManageProductsPage`
- API calls: `getVendorProducts()` → `getArtisanProducts()`
- Routes: `/vendor/*` → `/artisan/*`

#### [MODIFY] [AddProductPage.js](file:///c:/Users/Asus/Desktop/WT - Copy1/src/features/vendors/AddProductPage.js)
**Changes:**
- Field: `vendorId` → `artisanId`
- Routes: `/vendor/*` → `/artisan/*`

---

### 6. Data Models

#### [MODIFY] [index.js](file:///c:/Users/Asus/Desktop/WT - Copy1/src/shared/models/index.js)
**Changes:**
- `class Vendor` → `class Artisan`
- Remove `businessType` field (no longer needed)
- Update comments

---

### 7. Admin Panel

#### [MODIFY] Admin Pages
- `ManageVendorsPage.js` → Update to "Manage Artisans"
- API calls: `getPendingVendors()` → `getPendingArtisans()`
- Text: "Vendors" → "Artisans"

---

### 8. Folder Structure

**Rename:**
```
src/features/vendors/ → src/features/artisans/
```

**Files in folder:**
- VendorDashboardPage.js → ArtisanDashboardPage.js
- VendorProfilePage.js → ArtisanProfilePage.js (seller editor)
- VendorOrdersPage.js → ArtisanOrdersPage.js
- ManageProductsPage.js → (keep name, update content)
- AddProductPage.js → (keep name, update content)

---

## Verification Plan

### 1. Automated Testing
- [ ] All routes accessible
- [ ] Login redirects correctly
- [ ] API methods renamed correctly
- [ ] No broken imports

### 2. Manual Testing
- [ ] Artisan registration works
- [ ] Artisan login redirects to `/artisan/dashboard`
- [ ] Dashboard displays correctly
- [ ] Product management works
- [ ] Order management works
- [ ] Profile editing works
- [ ] Navbar dropdown shows correct options
- [ ] No "vendor" text visible in UI

### 3. Documentation Updates
- [ ] Update `PROJECT_DOCUMENTATION.md`
- [ ] Update `backend_integration_guide.md`
- [ ] Update `final_project_audit.md`
- [ ] Update `GETTING_STARTED.md`
- [ ] Update `docs/README.md`

---

## Implementation Order

1. **API Service** - Rename methods first (foundation)
2. **Routes** - Update all route paths
3. **Authentication** - Update login/register flows
4. **Features** - Rename files and update content
5. **Navbar** - Update navigation logic
6. **Models** - Update data models
7. **Admin** - Update admin panel
8. **Documentation** - Update all docs
9. **Testing** - Verify everything works

---

## Database Migration (Backend)

**For backend developer:**

```sql
-- Update existing vendor roles to artisan
UPDATE users SET role = 'artisan' WHERE role = 'vendor';

-- Update product references
ALTER TABLE products RENAME COLUMN vendorId TO artisanId;

-- Update orders references if any
-- (Check your schema)
```

---

## Rollback Plan

If issues arise:
1. Git revert to previous commit
2. Restore from backup
3. Keep both models temporarily (not recommended)

---

## Estimated Time

- Code changes: 2-3 hours
- Testing: 1 hour
- Documentation: 1 hour
- **Total: 4-5 hours**

---

## Success Criteria

✅ No "vendor" references in UI
✅ All routes use `/artisan/*`
✅ API methods use `artisan` terminology
✅ Authentication works correctly
✅ All features functional
✅ Documentation updated
✅ Backend integration guide updated
