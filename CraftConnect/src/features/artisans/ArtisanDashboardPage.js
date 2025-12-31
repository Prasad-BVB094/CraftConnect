import React, { useEffect, useState } from "react";
import Navbar from "../../shared/components/Navbar";
import Footer from "../../shared/components/Footer";
import apiService from "../../shared/services/api"; // Import API Service
import { useAuth } from "../../shared/hooks/useAuth";

function VendorDashboardPage() {
  const { user } = useAuth();
  const title = user?.role === 'artisan' ? 'Artisan Dashboard' : (user?.role === 'vendor' ? 'Vendor Dashboard' : 'Seller Dashboard');
  
  // State for Realtime Data
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
      totalProducts: 0,
      totalOrders: 0,
      outOfStock: 0,
      revenue: 0,
      pendingOrders: 0,
      completedOrders: 0
  });
  const [recentOrderList, setRecentOrderList] = useState([]);

  useEffect(() => {
      const fetchData = async () => {
          try {
              setLoading(true);
              // 1. Fetch Products
              const products = await apiService.getArtisanProducts();
              
              // 2. Fetch Orders
              let orders = [];
              try {
                  orders = await apiService.getArtisanOrders();
              } catch (err) {
                  console.warn("Failed to fetch orders (might be empty):", err);
              }

              // 3. Calculate Stats
              const totalProducts = products?.length || 0;
              const outOfStock = products?.filter(p => p.stock <= 0).length || 0;
              
              const totalOrders = orders?.length || 0;
              const revenue = orders?.reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0;
              const pendingOrders = orders?.filter(o => o.status === 'Pending').length || 0;
              const completedOrders = orders?.filter(o => o.status === 'Delivered' || o.status === 'Shipped').length || 0;

              setDashboardStats({
                  totalProducts,
                  totalOrders,
                  outOfStock,
                  revenue,
                  pendingOrders,
                  completedOrders
              });

              // 4. Set Recent Orders (Top 5)
              setRecentOrderList(orders?.slice(0, 5) || []);

          } catch (error) {
              console.error("Dashboard Data Error:", error);
          } finally {
              setLoading(false);
          }
      };

      if (user) {
          fetchData();
      }
  }, [user]);

  /* SVG Icons Helper */
  const Icons = {
    Package: React.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("path", { d: "M16.5 9.4 7.55 4.24" }), React.createElement("path", { d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" }), React.createElement("polyline", { points: "3.29 7 12 12 20.71 7" }), React.createElement("line", { x1: "12", y1: "22", x2: "12", y2: "12" })),
    Clipboard: React.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("path", { d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" }), React.createElement("rect", { result: "rect", x: "8", y: "2", width: "8", height: "4", rx: "1" })),
    Alert: React.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("path", { d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" }), React.createElement("line", { x1: "12", y1: "9", x2: "12", y2: "13" }), React.createElement("line", { x1: "12", y1: "17", x2: "12.01", y2: "17" })),
    Dollar: React.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("line", { x1: "12", y1: "1", x2: "12", y2: "23" }), React.createElement("path", { d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" })),
    Clock: React.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("circle", { cx: "12", cy: "12", r: "10" }), React.createElement("polyline", { points: "12 6 12 12 16 14" })),
    Check: React.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }), React.createElement("polyline", { points: "22 4 12 14.01 9 11.01" })),
    Plus: React.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("line", { x1: "12", y1: "5", x2: "12", y2: "19" }), React.createElement("line", { x1: "5", y1: "12", x2: "19", y2: "12" })),
    User: React.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }), React.createElement("circle", { cx: "12", cy: "7", r: "4" })),
  };

  const stats = [
    { label: "My Products", value: dashboardStats.totalProducts, icon: Icons.Package, color: "#A68A64" },
    { label: "Orders Received", value: dashboardStats.totalOrders, icon: Icons.Clipboard, color: "#5C4033" },
    { label: "Out of Stock", value: dashboardStats.outOfStock, icon: Icons.Alert, color: "#D9534F" },
    { label: "Total Revenue", value: `₹ ${dashboardStats.revenue.toLocaleString()}`, icon: Icons.Dollar, color: "#2E7D32" },
    { label: "Pending Orders", value: dashboardStats.pendingOrders, icon: Icons.Clock, color: "#E0A800" },
    { label: "Completed Orders", value: dashboardStats.completedOrders, icon: Icons.Check, color: "#5C4033" },
  ];

  // ARTISAN SPECIFIC WIDGETS
  if (user?.role === 'artisan') {
      stats.unshift(
          { label: "Custom Requests", value: 0, icon: React.createElement("span", { style: { fontSize: "24px" } }, "✨"), color: "#6A0DAD" }, 
          { label: "Impact Score", value: "98/100", icon: React.createElement("span", { style: { fontSize: "24px" } }, "🌱"), color: "#2E7D32" }
      );
  }

  const quickLinks = [
    { label: "Add New Product", path: "/artisan/add-product", icon: Icons.Plus },
    { label: "View My Products", path: "/artisan/products", icon: Icons.Package },
    { label: "Orders Received", path: "/artisan/orders", icon: Icons.Clipboard },
    { label: "Edit Profile", path: "/artisan/profile", icon: Icons.User },
  ];

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Navbar),
    React.createElement(
      "div",
      { className: "container" },

    /* Page Title */
    React.createElement(
      "h2",
      {
        style: {
          marginTop: "30px",
          marginBottom: "10px",
          fontFamily: "'Playfair Display', serif",
          color: "var(--accent)",
        },
      },
      title
    ),

    React.createElement(
      "p",
      {
        style: {
          marginBottom: "20px",
          color: "var(--muted)",
          fontSize: "15px",
          fontFamily: "'Poppins', sans-serif"
        },
      },
      "Welcome back! Here's an overview of your shop's performance."
    ),

    /* Analytics Cards */
    loading ? React.createElement("div", { style: { padding: "40px", textAlign: "center", fontStyle: "italic", color: "#888" } }, "Loading dashboard data...") :
    React.createElement(
      "div",
      {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        },
      },
      stats.map((s, i) =>
        React.createElement(
          "div",
          {
            key: i,
            style: {
              background: "linear-gradient(180deg,#fff,rgba(248,244,239,0.9))",
              padding: "20px",
              borderRadius: "18px",
              border: "1px solid rgba(62,44,32,0.08)",
              boxShadow: "0 6px 20px rgba(62,44,32,0.05)",
              textAlign: "center",
            },
          },
          React.createElement(
            "div",
            {
              style: {
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: `${s.color}15`, // Light opacity background
                color: s.color,
                marginBottom: "12px",
              },
            },
            s.icon
          ),
          React.createElement(
            "div",
            {
              style: {
                fontSize: "15px",
                color: "var(--muted)",
                marginBottom: "6px",
                fontWeight: "500",
              },
            },
            s.label
          ),
          React.createElement(
            "div",
            {
              style: {
                fontSize: "26px",
                fontWeight: "700",
                color: "var(--secondary)",
                fontFamily: "'Playfair Display', serif",
              },
            },
            s.value
          )
        )
      )
    ),

    /* Quick Actions */
    React.createElement(
      "div",
      {
        style: {
          background: "linear-gradient(180deg,#fff,rgba(248,244,239,0.95))",
          padding: "20px",
          borderRadius: "18px",
          border: "1px solid rgba(62,44,32,0.08)",
          boxShadow: "0 6px 20px rgba(62,44,32,0.05)",
          marginBottom: "30px",
        },
      },
      React.createElement(
        "h3",
        {
          style: {
            fontFamily: "'Playfair Display', serif",
            color: "var(--accent)",
            marginBottom: "12px",
          },
        },
        "Quick Actions"
      ),
      
      React.createElement(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "12px",
          },
        },
        quickLinks.map((q, index) =>
          React.createElement(
            "button",
            {
              key: index,
              className: "cta",
              style: {
                padding: "16px",
                borderRadius: "12px",
                textAlign: "center",
                fontWeight: "600",
                fontFamily: "'Poppins', sans-serif",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              },
              onClick: () => (window.location.href = q.path),
            },
            React.createElement("span", { style: {display: "flex", alignItems: "center"} }, q.icon),
            q.label
          )
        )
      )
    ),

    /* Recent Orders Card */
    React.createElement(
      "div",
      {
        style: {
          background: "linear-gradient(180deg,#fff,rgba(248,244,239,0.95))",
          padding: "20px",
          borderRadius: "18px",
          border: "1px solid rgba(62,44,32,0.08)",
          boxShadow: "0 6px 20px rgba(62,44,32,0.05)",
        },
      },
      React.createElement(
        "h3",
        {
          style: {
            fontFamily: "'Playfair Display', serif",
            color: "var(--accent)",
            marginBottom: "12px",
          },
        },
        "Recent Orders"
      ),

      React.createElement(
        "ul",
        { style: { paddingLeft: "20px" } },
        recentOrderList.length === 0 ? 
            React.createElement("li", { style: { color: "#999", fontStyle: "italic" } }, "No recent orders found.") 
            :
            recentOrderList.map((item, index) =>
            React.createElement(
                "li",
                {
                key: index,
                style: {
                    marginBottom: "8px",
                    color: "var(--muted)",
                    fontSize: "14px",
                },
                },
                `Order #${item.id || item._id} — ₹${item.totalAmount} — ${item.status}`
            )
            )
      )
    ),

    /* FOOTER */
    React.createElement(Footer)
    )
  );
}

export default VendorDashboardPage;
