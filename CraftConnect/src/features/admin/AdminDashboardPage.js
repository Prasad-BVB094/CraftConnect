import React, { useEffect, useState } from "react";
import Navbar from "../../shared/components/Navbar";
import apiService from "../../shared/services/api";
import { useAuth } from "../../shared/hooks/useAuth";
import { useNavigate } from "react-router-dom";
const navigate = useNavigate();


// Professional SVG icons for admin dashboard
const AdminIcons = {
  Users: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#A68A64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#A68A64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#A68A64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 3.13C17.8604 3.3503 18.623 3.8507 19.1676 4.55231C19.7122 5.25392 20.0078 6.11683 20.0078 7.005C20.0078 7.89317 19.7122 8.75608 19.1676 9.45769C18.623 10.1593 17.8604 10.6597 17 10.88" stroke="#A68A64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Vendors: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#A68A64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 22V12H15V22" stroke="#A68A64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Products: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4H9L11 9L9 11L4 4Z" stroke="#A68A64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 4L11 9" stroke="#A68A64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 2L22 22" stroke="#A68A64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 8H12L14 14L12 16L8 8Z" stroke="#A68A64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 8L14 14" stroke="#A68A64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 16H20L22 22L20 22L16 16Z" stroke="#A68A64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 16L22 22" stroke="#A68A64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Orders: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 10H20C20.5304 10 21.0391 10.2107 21.4142 10.5858C21.7893 10.9609 22 11.4696 22 12V20C22 20.5304 21.7893 21.0391 21.4142 21.4142C21.0391 21.7893 20.5304 22 20 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H12" stroke="#A68A64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 10V4H7V10" stroke="#A68A64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 10L22 5" stroke="#A68A64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 4L22 10" stroke="#A68A64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Categories: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4H20C20.5304 4 21.0391 4.21071 21.4142 4.58579C21.7893 4.96086 22 5.46957 22 6V18C22 18.5304 21.7893 19.0391 21.4142 19.4142C21.0391 19.7893 20.5304 20 20 20H4C3.46957 20 2.96086 19.7893 2.58579 19.4142C2.21071 19.0391 2 18.5304 2 18V6C2 5.46957 2.21071 4.96086 2.58579 4.58579C2.96086 4.21071 3.46957 4 4 4Z" stroke="#A68A64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 10H16" stroke="#A68A64" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 14H16" stroke="#A68A64" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Revenue: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#A68A64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="#A68A64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 8V16" stroke="#A68A64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 12H8" stroke="#A68A64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
};

function AdminDashboardPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    users: 0,
    artisans: 0,
    products: 0,
    orders: 0,
    revenue: 0
  });

const { user, loading: authLoading } = useAuth();

useEffect(() => {
  if (authLoading) return; // wait for hydration

  if (!user || user.role !== "admin") {
    navigate("/login/admin", { replace: true });
    return;
  }

  setIsAdmin(true);

  const fetchDashboard = async () => {
    try {
      const response = await apiService.getAdminDashboard();
      setStatsData({
        users: response.totalUsers || 0,
        artisans: response.totalArtisans || 0,
        products: response.totalProducts || 0,
        orders: response.totalOrders || 0,
        revenue: 0,
      });
    } catch (err) {
      console.error("Failed to load admin dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchDashboard();
}, [user, authLoading]);




  if (!isAdmin) return null;

  
  const stats = [
    { label: "Total Users", value: loading ? "..." : statsData.users, icon: "Users", link: "/admin/users" },
    { label: "Total Artisans", value: loading ? "..." : statsData.artisans, icon: "Vendors", link: "/admin/artisans" },
    { label: "Products Listed", value: loading ? "..." : statsData.products, icon: "Products", link: "/admin/products" },
    { label: "Total Orders", value: loading ? "..." : statsData.orders, icon: "Orders", link: "/admin/orders" },
  ];

  // ... rest of UI ...
  const quickActions = [
    { label: "Manage Users", path: "/admin/users", icon: "Users" },
    { label: "Manage Artisans", path: "/admin/artisans", icon: "Vendors" },
    { label: "Manage Products", path: "/admin/products", icon: "Products" },
    { label: "Manage Orders", path: "/admin/orders", icon: "Orders" },
    { label: "Manage Categories", path: "/admin/categories", icon: "Categories" },
  ];

  return React.createElement(
    "div",
    { className: "container" },

    /* NAVBAR */
    React.createElement(Navbar),

    /* TITLE */
    React.createElement(
      "h2",
      {
        style: {
          marginTop: "30px",
          marginBottom: "20px",
          fontFamily: "'Playfair Display', serif",
          color: "var(--accent)",
          fontSize: "32px",
        },
      },
      "Admin Dashboard"
    ),

    /* TOP GRID: STATS CARDS */
    React.createElement(
      "div",
      {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        },
      },
      stats.map((s, i) =>
        React.createElement(
          "div",
          {
            key: i,
            onClick: () => window.location.href = s.link,
            style: {
              background: "linear-gradient(180deg,#fff,rgba(248,244,239,0.95))",
              padding: "24px 20px",
              borderRadius: "18px",
              border: "1px solid rgba(166,138,100,0.2)",
              boxShadow: "0 8px 24px rgba(166,138,100,0.1)",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.3s ease",
            },
            onMouseEnter: (e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow = "0 14px 32px rgba(166,138,100,0.15)";
              e.currentTarget.style.border = "1px solid rgba(166,138,100,0.4)";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(166,138,100,0.1)";
              e.currentTarget.style.border = "1px solid rgba(166,138,100,0.2)";
            },
          },
          React.createElement(
            "div",
            { 
              style: { 
                marginBottom: "16px",
                display: "flex",
                justifyContent: "center",
              } 
            },
            AdminIcons[s.icon]
          ),
          React.createElement(
            "div",
            {
              style: {
                fontSize: "15px",
                color: "var(--text)",
                marginBottom: "8px",
                fontWeight: "500",
              },
            },
            s.label
          ),
          React.createElement(
            "div",
            {
              style: {
                fontSize: "28px",
                fontWeight: "700",
                color: "var(--accent)",
                fontFamily: "'Playfair Display', serif",
              },
            },
            s.value
          )
        )
      )
    ),

    /* QUICK ACTIONS */
    React.createElement(
      "div",
      {
        style: {
          background: "linear-gradient(180deg,#fff,rgba(248,244,239,0.95))",
          padding: "24px",
          borderRadius: "18px",
          border: "1px solid rgba(166,138,100,0.2)",
          boxShadow: "0 8px 24px rgba(166,138,100,0.1)",
          marginBottom: "30px",
        },
      },
      React.createElement(
        "h3",
        {
          style: {
            marginBottom: "20px",
            fontFamily: "'Playfair Display', serif",
            color: "var(--accent)",
            fontSize: "24px",
          },
        },
        "Quick Actions"
      ),
      React.createElement(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
          },
        },
        quickActions.map((action, i) =>
          React.createElement(
            "button",
            {
              key: i,
              className: "cta",
              onClick: () => window.location.href = action.path,
              style: {
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                justifyContent: "center",
                fontSize: "15px",
                fontWeight: "500",
                background: "rgba(166,138,100,0.1)",
                border: "1px solid rgba(166,138,100,0.2)",
                borderRadius: "12px",
                color: "var(--accent)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              },
              onMouseEnter: (e) => {
                e.currentTarget.style.background = "rgba(166,138,100,0.2)";
                e.currentTarget.style.borderColor = "rgba(166,138,100,0.4)";
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.background = "rgba(166,138,100,0.1)";
                e.currentTarget.style.borderColor = "rgba(166,138,100,0.2)";
              },
            },
            React.createElement(
              "div",
              { style: { display: "flex", alignItems: "center" } },
              AdminIcons[action.icon]
            ),
            action.label
          )
        )
      )
    ),

    /* REVENUE CARD */
    React.createElement(
      "div",
      {
        style: {
          background: "linear-gradient(180deg,#fff,rgba(248,244,239,0.95))",
          padding: "24px",
          borderRadius: "18px",
          border: "1px solid rgba(166,138,100,0.2)",
          boxShadow: "0 8px 24px rgba(166,138,100,0.1)",
          marginBottom: "30px",
        },
      },
      React.createElement(
        "h3",
        {
          style: {
            marginBottom: "16px",
            fontFamily: "'Playfair Display', serif",
            color: "var(--accent)",
            fontSize: "24px",
          },
        },
        "Revenue Summary"
      ),

      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px",
          },
        },
        React.createElement(
          "div",
          { 
            style: { 
              marginRight: "16px",
              display: "flex",
              alignItems: "center",
            } 
          },
          AdminIcons.Revenue
        ),
        React.createElement(
          "div",
          null,
          React.createElement(
            "p",
            {
              style: {
                color: "var(--muted)",
                marginBottom: "4px",
                fontSize: "14px",
              },
            },
            "Total Revenue:"
          ),
          React.createElement(
            "div",
            {
              style: {
                fontSize: "28px",
                fontWeight: "700",
                color: "var(--accent)",
                fontFamily: "'Playfair Display', serif",
              },
            },
            loading ? "..." : `₹ ${statsData.revenue.toLocaleString()}`
          )
        )
      )
    ),

    /* FOOTER */
    React.createElement(
      "footer",
      { style: { marginTop: "40px", textAlign: "center" } },
      React.createElement("div", null, "© CraftConnect — handcrafted community"),
      React.createElement("div", null, "Made with ❤️ | Beige & brown theme")
    )
  );
}

export default AdminDashboardPage;
