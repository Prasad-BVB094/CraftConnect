# Getting Started with CraftConnect

## 🚀 Quick Start Guide

### Prerequisites
- ✅ **Node.js** (version 14 or higher) - [Download here](https://nodejs.org/)
- ✅ **VS Code** (recommended) - [Download here](https://code.visualstudio.com/)
- ✅ **Git Bash or PowerShell** (for running commands)

---

## 📂 Step 1: Open Project in VS Code

### Method 1: From VS Code
1. Open **VS Code**
2. Click **File** → **Open Folder**
3. Navigate to the extracted `CraftConnect` folder
4. Click **Select Folder**

### Method 2: From File Explorer
1. Navigate to the `CraftConnect` folder
2. Right-click in the folder
3. Select **"Open with Code"** (if available)

---

## 📦 Step 2: Install Dependencies

Once the folder is open in VS Code:

1. **Open Terminal** in VS Code:
   - Press `` Ctrl + ` `` (backtick key)
   - OR: Menu → **Terminal** → **New Terminal**

2. **Install packages** (run this command):
   ```bash
   npm install
   ```
   
   This will install all required packages (React, React Router, etc.)
   
   ⏱️ Takes about 1-2 minutes

---

## ▶️ Step 3: Start Development Server

In the same terminal, run:

```bash
npm start
```

**What happens:**
- ✅ Development server starts
- ✅ Browser opens automatically at `http://localhost:3000`
- ✅ You'll see the CraftConnect homepage

⏱️ First start takes 30-60 seconds

---

## 🌐 Step 4: View the Website

The browser should open automatically. If not:

1. Open your browser
2. Go to: `http://localhost:3000`

**You should see:**
- CraftConnect homepage
- Navigation bar with logo
- Featured products
- Categories

---

## 🛠️ Step 5: Making Changes

### Live Reload
Any changes you make to the code will **automatically refresh** the browser!

**Try it:**
1. Open `src/app/pages/HomePage.js`
2. Change some text
3. Save the file (`Ctrl + S`)
4. Watch the browser update automatically!

---

## 🧪 Testing Features

### Test Artisan Login
1. Click **"Account"** in navbar → **"Seller Central"**
2. Use demo credentials:
   - Email: `artisan@hhw.com`
   - Password: `demo`
3. Click **"Sign In"**
4. You'll be redirected to **Artisan Dashboard** at `/artisan/dashboard`

### Test User Registration
1. Click **"Account"** → **"Create Account"**
2. Fill in the form with any details
3. Click **"Continue"**
4. Enter OTP: `1234` (for testing)
5. Account created!

### Test Product Browsing
1. Click any category (e.g., "Pottery")
2. Click on a product
3. Try the **"View in Your Room (AR)"** button
4. Allow camera access to see AR feature

### Test Shopping Cart
1. On a product page, click **"Add to Cart"**
2. Click the cart icon in navbar
3. View your cart items
4. Proceed to checkout

### Test Admin Panel
1. Navigate to: `http://localhost:3000/login/admin`
2. Login with admin credentials (if configured)
3. Access admin dashboard

---

## 📁 Project Structure (Quick Reference)

```
CraftConnect/
├── docs/                    ← 📚 Documentation (start here!)
│   ├── PROJECT_DOCUMENTATION.md      # Complete system overview
│   ├── backend_integration_guide.md  # API specifications
│   ├── final_project_audit.md        # Quality assessment
│   └── walkthrough.md                # Change history
│
├── src/                     ← 💻 Source code
│   ├── app/                 ← Pages & routing
│   ├── features/            ← Feature modules
│   │   ├── auth/            ← Login/Register
│   │   ├── products/        ← Product pages
│   │   ├── cart/            ← Shopping cart
│   │   ├── artisans/        ← Artisan dashboard & features
│   │   └── admin/           ← Admin panel
│   └── shared/              ← Shared code
│       ├── components/      ← Navbar, Footer
│       ├── services/        ← API service (api.js)
│       └── hooks/           ← useAuth hook
│
├── public/                  ← Static files
│   └── data/                ← Mock JSON data
│
├── package.json             ← Dependencies
└── .env                     ← Environment config (create this)
```

---

## 🔧 Common Commands

| Command | What it does |
|---------|-------------|
| `npm install` | Install dependencies (run once) |
| `npm start` | Start development server |
| `npm run build` | Create production build |
| `Ctrl + C` | Stop development server |

---

## 🐛 Troubleshooting

### Problem: "npm is not recognized"
**Solution:** Install Node.js from [nodejs.org](https://nodejs.org/)

### Problem: Port 3000 already in use
**Solution:** 
1. Stop other apps using port 3000
2. OR change port in terminal:
   ```bash
   set PORT=3001 && npm start
   ```

### Problem: Changes not showing
**Solution:** Hard refresh browser (`Ctrl + Shift + R`)

### Problem: Dependencies error
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Problem: Font 404 warnings in console
**Solution:** These are harmless - the site uses fallback fonts (Poppins). You can ignore these warnings.

---

## 📖 Next Steps

### For Frontend Development
1. Read `docs/PROJECT_DOCUMENTATION.md` for complete system overview
2. Explore `src/features/` folder to understand features
3. Make changes and test with live reload
4. Check `src/shared/services/api.js` for API integration points

### For Backend Development
1. **Read:** `docs/backend_integration_guide.md` (complete API spec)
2. **Set up:** Backend server (Node.js/Express or Python/Django)
3. **Create:** `.env` file with backend URL:
   ```env
   REACT_APP_API_URL=http://localhost:3001/api
   ```
4. **Implement:** API endpoints as documented
5. **Update:** Remove mock data from `src/shared/services/api.js`
6. **Test:** End-to-end with frontend

---

## 🎯 Demo Credentials

### Artisan Login (Seller)
- **URL:** `http://localhost:3000/login/artisan`
- **Email:** `artisan@hhw.com`
- **Password:** `demo`
- **Redirects to:** `/artisan/dashboard`

### User Registration
- Use any email address
- **OTP for testing:** `1234`

### Admin Login
- **URL:** `http://localhost:3000/login/admin`
- Configure admin credentials in backend

---

## 🌟 Key Features to Explore

1. **Artisan Dashboard** - Product & order management for sellers
2. **AR Product View** - View products in your room using camera
3. **OTP Verification** - Secure email-based registration
4. **Shopping Cart** - Full e-commerce cart functionality
5. **Admin Panel** - Complete platform management
6. **Impact Tracking** - Artisan social/environmental impact scores

---

## 🆘 Need Help?

### Documentation
1. **System Overview:** `docs/PROJECT_DOCUMENTATION.md`
2. **API Integration:** `docs/backend_integration_guide.md`
3. **Quality Report:** `docs/final_project_audit.md`

### Code Structure
- **API Service:** `src/shared/services/api.js` - All backend calls
- **Auth Hook:** `src/shared/hooks/useAuth.js` - Authentication logic
- **Routes:** `src/app/routes/AppRoutes.js` - All route definitions

### Common Questions

**Q: Where is the backend?**  
A: This is frontend-only. Backend needs to be built using the API guide.

**Q: Why mock data?**  
A: For development without backend. Remove after backend is ready.

**Q: How to deploy?**  
A: Run `npm run build` then deploy `/build` folder to Vercel/Netlify.

**Q: Where are artisan features?**  
A: In `src/features/artisans/` folder (previously called vendors).

---

## ✅ You're All Set!

**Current Status:**
- ✅ Project opened in VS Code
- ✅ Dependencies installed (`npm install`)
- ✅ Development server running (`npm start`)
- ✅ Website accessible at `http://localhost:3000`

**Next:**
- Explore the features
- Test artisan login and dashboard
- Read documentation for backend integration
- Start building!

**Happy coding! 🚀**

---

## 📝 Important Notes

- **Artisan-Only Model:** This project uses artisans as the only seller type (no separate vendor role)
- **Backend-Ready:** All API endpoints documented and ready for integration
- **Production-Ready:** Code follows industry standards and best practices
- **Fully Documented:** Complete guides for both frontend and backend developers

**The project is ready for development and deployment!** 🎉
