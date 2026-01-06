import React from "react";
import { createBrowserRouter } from "react-router-dom";

/* Import Pages */
import HomePage from "../../app/pages/HomePage";
import UserLogin from "../../features/auth/UserLogin";
import UserRegister from "../../features/auth/UserRegister";
import ArtisanLogin from "../../features/auth/ArtisanLogin";
import AdminLogin from "../../features/auth/AdminLogin";
import ArtisanRegister from "../../features/auth/ArtisanRegister";
import ProductDetailsPage from "../../features/products/ProductDetailsPage";
import ArtisanProfilePage from "../../features/users/ArtisanProfilePage";
import CategoryPage from "../../features/categories/CategoryPage";
import CategoriesPage from "../../features/categories/CategoriesPage";
import CartPage from "../../features/cart/CartPage";
import CheckoutPage from "../../features/checkout/CheckoutPage";
import UserProfilePage from "../../features/users/UserProfilePage";
import OrdersPage from "../../features/orders/OrdersPage";
import SearchPage from "../../features/search/SearchPage";

/* Artisan Pages */
import ArtisanDashboardPage from "../../features/artisans/ArtisanDashboardPage";
import AddProductPage from "../../features/artisans/AddProductPage";
import ArtisanManageProductsPage from "../../features/artisans/ManageProductsPage";
import ArtisanOrdersPage from "../../features/artisans/ArtisanOrdersPage";
import ArtisanProfileEditorPage from "../../features/artisans/ArtisanProfileEditorPage";

/* Admin Pages */
import AdminDashboardPage from "../../features/admin/AdminDashboardPage";
import ManageUsersPage from "../../features/admin/ManageUsersPage";
import ManageArtisansPage from "../../features/admin/ManageArtisansPage";
import AdminManageProductsPage from "../../features/admin/ManageProducts";
import ManageOrdersPage from "../../features/admin/ManageOrdersPage";
import CategoryManagerPage from "../../features/admin/CategoryManagerPage";
import SupportQueriesPage from "../../features/admin/SupportQueriesPage";
import AnalyticsPage from "../../features/admin/AnalyticsPage";






















/* Future expansion:
import ProductDetailsPage from "../pages/User/ProductDetailsPage";
import ArtisanProfilePage from "../pages/User/ArtisanProfilePage";
import VendorDashboard from "../pages/Vendor/VendorDashboard";
import AdminDashboard from "../pages/Admin/AdminDashboard";
*/

const router = createBrowserRouter([
  {
    path: "/",
    element: React.createElement(HomePage),
  },
  {
    path: "/login/user",
    element: React.createElement(UserLogin),
  },
  {
    path: "/login/artisan",
    element: React.createElement(ArtisanLogin),
  },
  {
    path: "/login/admin",
    element: React.createElement(AdminLogin),
  },
  {
    path: "/register/artisan",
    element: React.createElement(ArtisanRegister),
  },
  {
    path: "/register/user",
    element: React.createElement(UserRegister),
  },
  {
    path: "/cart",
    element: React.createElement(CartPage),
  },
  {
    path: "/checkout",
    element: React.createElement(CheckoutPage),
  },
  {
    path: "/categories",
    element: React.createElement(CategoriesPage),
  },
  {
    path: "/product/:id",
    element: React.createElement(ProductDetailsPage),
  },
  {
    path: "/artisan/:id",
    element: React.createElement(ArtisanProfilePage),
  },
  {
    path: "/category/:name",
    element: React.createElement(CategoryPage),
  },
  {
    path: "/artisan/dashboard",
    element: React.createElement(ArtisanDashboardPage),
  },
  {
    path: "/artisan/add-product",
    element: React.createElement(AddProductPage),
  },
  {
    path: "/artisan/edit-product/:id",
    element: React.createElement(AddProductPage),
  },
  {
    path: "/artisan/products",
    element: React.createElement(ArtisanManageProductsPage),
  },
  {
    path: "/artisan/orders",
    element: React.createElement(ArtisanOrdersPage),
  },
  {
    path: "/artisan/profile",
    element: React.createElement(ArtisanProfileEditorPage),
  },
  {
    path: "/admin/dashboard",
    element: React.createElement(AdminDashboardPage),
  },
  {
    path: "/admin/users",
    element: React.createElement(ManageUsersPage),
  },
  {
    path: "/admin/artisans",
    element: React.createElement(ManageArtisansPage),
  },
  {
    path: "/admin/products",
    element: React.createElement(AdminManageProductsPage),
  },
  {
    path: "/admin/orders",
    element: React.createElement(ManageOrdersPage),
  },
  {
    path: "/admin/categories",
    element: React.createElement(CategoryManagerPage),
  },
  {
    path: "/admin/support",
    element: React.createElement(SupportQueriesPage),
  },
  {
    path: "/admin/analytics",
    element: React.createElement(AnalyticsPage),
  },
  {
    path: "/profile",
    element: React.createElement(UserProfilePage),
  },
  {
    path: "/orders",
    element: React.createElement(OrdersPage),
  },
  {
    path: "/search",
    element: React.createElement(SearchPage),
  },
]);

export default router;
