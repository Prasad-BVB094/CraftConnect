import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../shared/components/Navbar";
import Footer from "../../shared/components/Footer";
import apiService from "../../shared/services/api";
import { useAuth } from "../../shared/hooks/useAuth";

// SVG Icons
const Icons = {
  Package: () => React.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("path", { d: "M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" }),
    React.createElement("polyline", { points: "3.27 6.96 12 12.01 20.73 6.96" }),
    React.createElement("line", { x1: "12", y1: "22.08", x2: "12", y2: "12" })
  ),
  ShoppingCart: () => React.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("circle", { cx: "9", cy: "21", r: "1" }),
    React.createElement("circle", { cx: "20", cy: "21", r: "1" }),
    React.createElement("path", { d: "M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" })
  ),
  DollarSign: () => React.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("line", { x1: "12", y1: "1", x2: "12", y2: "23" }),
    React.createElement("path", { d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" })
  ),
  Clock: () => React.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("circle", { cx: "12", cy: "12", r: "10" }),
    React.createElement("polyline", { points: "12 6 12 12 16 14" })
  ),
  CheckCircle: () => React.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }),
    React.createElement("polyline", { points: "22 4 12 14.01 9 11.01" })
  ),
  AlertTriangle: () => React.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("path", { d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" }),
    React.createElement("line", { x1: "12", y1: "9", x2: "12", y2: "13" }),
    React.createElement("line", { x1: "12", y1: "17", x2: "12.01", y2: "17" })
  ),
  Sparkles: () => React.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("path", { d: "m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" }),
    React.createElement("path", { d: "M5 3v4" }),
    React.createElement("path", { d: "M19 17v4" }),
    React.createElement("path", { d: "M3 5h4" }),
    React.createElement("path", { d: "M17 19h4" })
  ),
  TrendingUp: () => React.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("polyline", { points: "23 6 13.5 15.5 8.5 10.5 1 18" }),
    React.createElement("polyline", { points: "17 6 23 6 23 12" })
  ),
  Plus: () => React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("line", { x1: "12", y1: "5", x2: "12", y2: "19" }),
    React.createElement("line", { x1: "5", y1: "12", x2: "19", y2: "12" })
  ),
  User: () => React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }),
    React.createElement("circle", { cx: "12", cy: "7", r: "4" })
  ),
  BarChart: () => React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("line", { x1: "12", y1: "20", x2: "12", y2: "10" }),
    React.createElement("line", { x1: "18", y1: "20", x2: "18", y2: "4" }),
    React.createElement("line", { x1: "6", y1: "20", x2: "6", y2: "16" })
  ),
  Eye: () => React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("path", { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }),
    React.createElement("circle", { cx: "12", cy: "12", r: "3" })
  ),
  ArrowRight: () => React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("line", { x1: "5", y1: "12", x2: "19", y2: "12" }),
    React.createElement("polyline", { points: "12 5 19 12 12 19" })
  )
};

function ArtisanDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0, totalOrders: 0, outOfStock: 0,
    revenue: 0, pendingOrders: 0, completedOrders: 0, customRequests: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [ordersByStatus, setOrdersByStatus] = useState([]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const userIdStr = user?.id?.toString() || user?._id?.toString();
      const products = await apiService.getArtisanProducts().catch(() => []);
      let orders = [];
      try { orders = await apiService.getArtisanOrders(); } catch (e) { console.warn("No orders"); }
      
      const totalProducts = products?.length || 0;
      const outOfStock = products?.filter(p => p.stock <= 0).length || 0;
      const totalOrders = orders?.length || 0;
      
      // Revenue only from delivered/paid orders, summing ONLY this artisan's items
      const revenue = orders?.filter(o => o.status?.toLowerCase() === 'delivered' || o.isPaid)
        .reduce((sum, o) => {
          const artisanTotal = o.items
            ?.filter(item => (item.artisan?.toString() === userIdStr || item.artisan === userIdStr))
            .reduce((s, i) => s + (i.price * i.quantity), 0) || 0;
          return sum + artisanTotal;
        }, 0) || 0;
      
      const pendingOrders = orders?.filter(o => o.status?.toLowerCase() === 'pending').length || 0;
      const completedOrders = orders?.filter(o => ['delivered', 'shipped'].includes(o.status?.toLowerCase())).length || 0;

      const customRequests = orders?.filter(o => o.customizationRequest && o.customizationRequest.trim() !== '').length || 0;

      setStats({ totalProducts, totalOrders, outOfStock, revenue, pendingOrders, completedOrders, customRequests });
      setRecentOrders((orders || []).slice(0, 5));
      
      // Order status distribution
      setOrdersByStatus([
        { label: "Pending", value: pendingOrders, color: "#FF9800" },
        { label: "Shipped", value: orders?.filter(o => o.status?.toLowerCase() === 'shipped').length || 0, color: "#2196F3" },
        { label: "Delivered", value: orders?.filter(o => o.status?.toLowerCase() === 'delivered').length || 0, color: "#4CAF50" },
        { label: "Cancelled", value: orders?.filter(o => o.status?.toLowerCase() === 'cancelled').length || 0, color: "#F44336" }
      ]);
      
      const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toDateString(); 
      }).reverse();
      
      const trendData = last7Days.map(dayStr => {
        const dayRevenue = orders
          ?.filter(o => {
            if (!o.createdAt) return false;
            return new Date(o.createdAt).toDateString() === dayStr && o.status?.toLowerCase() !== 'cancelled';
          })
          .reduce((sum, o) => {
            const artisanItemsTotal = o.items
              ?.filter(item => (item.artisan?.toString() === userIdStr || item.artisan === userIdStr))
              .reduce((s, i) => s + (i.price * i.quantity), 0) || 0;
            return sum + artisanItemsTotal;
          }, 0) || 0;
        
        return { 
          label: dayStr.split(' ').slice(0, 3).join(' '), 
          value: dayRevenue 
        };
      });
      setRevenueTrend(trendData);

    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const [revenueTrend, setRevenueTrend] = useState([]);

  // Advanced Line Chart
  const LineChart = ({ data, color = "#A68A64" }) => {
    const maxVal = Math.max(...data.map(d => d.value), 10);
    const height = 140;
    const width = 100;
    const paddingY = 25;
    const chartHeight = height - (paddingY * 2);
    
    // Synchronized Y formula
    const getY = (val) => height - paddingY - (val / maxVal) * chartHeight;
    
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1 || 1)) * width;
      const y = getY(d.value);
      return `${x},${y}`;
    }).join(" ");
    
    const areaPoints = `0,${height} ${points} ${width},${height}`;

    return React.createElement("div", { style: { marginTop: "15px" } },
      React.createElement("svg", { viewBox: `0 0 ${width} ${height}`, style: { width: "100%", height: "160px" }, preserveAspectRatio: "none" },
        React.createElement("defs", null,
           React.createElement("linearGradient", { id: "chartGrad", x1: "0", y1: "0", x2: "0", y2: "1" },
             React.createElement("stop", { offset: "0%", stopColor: color, stopOpacity: "0.2" }),
             React.createElement("stop", { offset: "100%", stopColor: color, stopOpacity: "0" })
           )
        ),
        React.createElement("polygon", { points: areaPoints, fill: "url(#chartGrad)" }),
        React.createElement("polyline", { points, fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }),
        data.map((d, i) => {
          const x = (i / (data.length - 1 || 1)) * width;
          const y = getY(d.value);
          return React.createElement("circle", { key: i, cx: x, cy: y, r: "1.8", fill: "#fff", stroke: color, strokeWidth: "1" });
        })
      ),
      React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginTop: "12px" } },
        data.map((d, i) => React.createElement("span", { key: i, style: { fontSize: "10px", color: "#8D6E63", fontWeight: "500" } }, d.label))
      )
    );
  };

  const formatCurrency = (a) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(a || 0);
  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "N/A";

  // Horizontal bar chart component
  const HorizontalBarChart = ({ data }) => {
    const max = Math.max(...data.map(d => d.value), 1);
    return React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "12px" } },
      data.map((item, i) => React.createElement("div", { key: i },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "13px" } },
          React.createElement("span", { style: { color: "#5D4037" } }, item.label),
          React.createElement("span", { style: { fontWeight: "600", color: "#3E2723" } }, item.value)
        ),
        React.createElement("div", { style: { height: "8px", background: "#F0EBE5", borderRadius: "4px", overflow: "hidden" } },
          React.createElement("div", { style: { height: "100%", width: `${(item.value / max) * 100}%`, background: item.color, borderRadius: "4px", transition: "width 0.5s" } })
        )
      ))
    );
  };

  const statsCards = [
    { label: "My Products", value: stats.totalProducts, Icon: Icons.Package, color: "#A68A64", bg: "#FFF8E1" },
    { label: "Total Orders", value: stats.totalOrders, Icon: Icons.ShoppingCart, color: "#2196F3", bg: "#E3F2FD" },
    { label: "Revenue", value: formatCurrency(stats.revenue), Icon: Icons.DollarSign, color: "#4CAF50", bg: "#E8F5E9" },
    { label: "Pending", value: stats.pendingOrders, Icon: Icons.Clock, color: "#FF9800", bg: "#FFF3E0" },
    { label: "Completed", value: stats.completedOrders, Icon: Icons.CheckCircle, color: "#9C27B0", bg: "#F3E5F5" },
    { label: "Out of Stock", value: stats.outOfStock, Icon: Icons.AlertTriangle, color: "#F44336", bg: "#FFEBEE" },
    { label: "Custom Requests", value: stats.customRequests, Icon: Icons.Sparkles, color: "#673AB7", bg: "#EDE7F6" }
  ];

  const quickActions = [
    { label: "Add Product", path: "/artisan/add-product", Icon: Icons.Plus, desc: "List a new product" },
    { label: "My Products", path: "/artisan/products", Icon: Icons.Package, desc: "Manage listings" },
    { label: "Orders", path: "/artisan/orders", Icon: Icons.ShoppingCart, desc: "View all orders" },
    { label: "Profile", path: "/artisan/profile", Icon: Icons.User, desc: "Edit your profile" }
  ];

  return React.createElement("div", { style: { minHeight: "100vh", background: "linear-gradient(180deg, #FDFBF7 0%, #F8F4EF 100%)" } },
    React.createElement(Navbar),
    React.createElement("div", { style: { maxWidth: "1400px", margin: "0 auto", padding: "30px 20px" } },

      /* HEADER */
      React.createElement("div", { style: { marginBottom: "28px" } },
        React.createElement("h1", { style: { fontFamily: "'Playfair Display', serif", fontSize: "32px", color: "#3E2723", margin: "0 0 8px" } }, "Artisan Dashboard"),
        React.createElement("p", { style: { color: "#8D6E63", margin: 0 } }, `Welcome back, ${user?.name || "Artisan"}! Here's your shop overview.`)
      ),

      loading ? React.createElement("div", { style: { textAlign: "center", padding: "60px", color: "#8D6E63" } }, "Loading dashboard...") :
      React.createElement(React.Fragment, null,

        /* QUICK ACTIONS (NOW TOP PRIORITY) */
        React.createElement("div", { style: { background: "#fff", borderRadius: "20px", padding: "24px", marginBottom: "28px", border: "1px solid rgba(166,138,100,0.12)", boxShadow: "0 4px 16px rgba(0,0,0,0.04)" } },
          React.createElement("h3", { style: { margin: "0 0 20px", color: "#3E2723", fontFamily: "'Playfair Display', serif", fontSize: "18px" } }, "Quick Actions"),
          React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" } },
            quickActions.map((a, i) => React.createElement("button", { key: i, onClick: () => navigate(a.path), style: { padding: "28px 24px", display: "flex", alignItems: "center", gap: "16px", background: "#FDFBF7", border: "1px solid rgba(166,138,100,0.15)", borderRadius: "16px", cursor: "pointer", textAlign: "left", transition: "all 0.2s", minHeight: "110px" } },
              React.createElement("div", { style: { color: "#A68A64", transform: "scale(1.2)" } }, React.createElement(a.Icon)),
              React.createElement("div", null,
                React.createElement("div", { style: { fontWeight: "700", color: "#3E2723", fontSize: "16px", marginBottom: "4px" } }, a.label),
                React.createElement("div", { style: { fontSize: "13px", color: "#8D6E63", lineHeight: "1.4" } }, a.desc)
              )
            ))
          )
        ),

        /* STATS CARDS */
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "28px" } },
          statsCards.map((s, i) => React.createElement("div", { key: i, style: { background: "#fff", borderRadius: "16px", padding: "20px", border: "1px solid rgba(166,138,100,0.12)", boxShadow: "0 4px 16px rgba(0,0,0,0.04)" } },
            React.createElement("div", { style: { width: "44px", height: "44px", borderRadius: "12px", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", color: s.color, marginBottom: "12px" } }, React.createElement(s.Icon)),
            React.createElement("div", { style: { fontSize: "24px", fontWeight: "700", color: "#3E2723" } }, s.value),
            React.createElement("span", { style: { fontSize: "13px", color: "#8D6E63" } }, s.label)
          ))
        ),

        /* ANALYTICS ROW */
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px", marginBottom: "28px" } },
          /* REVENUE TREND */
          React.createElement("div", { style: { background: "#fff", borderRadius: "20px", padding: "24px", border: "1px solid rgba(166,138,100,0.12)", boxShadow: "0 4px 16px rgba(0,0,0,0.04)" } },
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" } },
              React.createElement("div", { style: { color: "#4CAF50" } }, React.createElement(Icons.TrendingUp)),
              React.createElement("h3", { style: { margin: 0, color: "#3E2723", fontFamily: "'Playfair Display', serif", fontSize: "18px" } }, "Revenue Growth (7 Days)")
            ),
            React.createElement(LineChart, { data: revenueTrend })
          ),

          /* ANALYTICS CARD */
          React.createElement("div", { style: { background: "#fff", borderRadius: "20px", padding: "24px", border: "1px solid rgba(166,138,100,0.12)", boxShadow: "0 4px 16px rgba(0,0,0,0.04)" } },
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" } },
              React.createElement("div", { style: { color: "#A68A64" } }, React.createElement(Icons.BarChart)),
              React.createElement("h3", { style: { margin: 0, color: "#3E2723", fontFamily: "'Playfair Display', serif", fontSize: "18px" } }, "Order Distribution")
            ),
            React.createElement(HorizontalBarChart, { data: ordersByStatus })
          )
        ),

        /* RECENT ORDERS ROW (FULL WIDTH) */
        React.createElement("div", { style: { background: "#fff", borderRadius: "20px", padding: "24px", marginBottom: "28px", border: "1px solid rgba(166,138,100,0.12)", boxShadow: "0 4px 16px rgba(0,0,0,0.04)" } },
          React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" } },
            React.createElement("h3", { style: { margin: 0, color: "#3E2723", fontFamily: "'Playfair Display', serif", fontSize: "18px" } }, "Recent Orders"),
            React.createElement("button", { onClick: () => navigate("/artisan/orders"), style: { background: "transparent", border: "1px solid #A68A64", color: "#A68A64", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" } }, "View All", React.createElement(Icons.ArrowRight))
          ),
          recentOrders.length === 0 ? React.createElement("p", { style: { color: "#8D6E63", textAlign: "center", padding: "40px" } }, "No orders yet") :
          React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "12px" } },
            recentOrders.map((order, i) => React.createElement("div", { key: i, style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: "#FDFBF7", borderRadius: "12px", border: "1px solid rgba(166,138,100,0.08)" } },
              React.createElement("div", null,
                React.createElement("div", { style: { fontWeight: "600", color: "#3E2723", fontSize: "14px" } }, `Order #${(order._id || "").slice(-6).toUpperCase()}`),
                React.createElement("div", { style: { fontSize: "12px", color: "#8D6E63" } }, formatDate(order.createdAt))
              ),
              React.createElement("div", { style: { textAlign: "right" } },
                React.createElement("div", { style: { fontWeight: "600", color: "#A68A64" } }, formatCurrency(order.totalAmount)),
                React.createElement("span", { style: { padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "500", background: order.status === "delivered" ? "#E8F5E9" : order.status === "cancelled" ? "#FFEBEE" : "#FFF3E0", color: order.status === "delivered" ? "#2E7D32" : order.status === "cancelled" ? "#C62828" : "#E65100" } }, order.status)
              )
            ))
          )
        )
      )
    ),
    React.createElement(Footer)
  );
}

export default ArtisanDashboardPage;
