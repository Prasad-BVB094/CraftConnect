import React, { useState, useEffect } from "react";
import Navbar from "../../shared/components/Navbar";
import Footer from "../../shared/components/Footer";
import apiService from "../../shared/services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/hooks/useAuth";

// SVG Icons
const Icons = {
  TrendingUp: () => React.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("polyline", { points: "23 6 13.5 15.5 8.5 10.5 1 18" }),
    React.createElement("polyline", { points: "17 6 23 6 23 12" })
  ),
  Users: () => React.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("path", { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }),
    React.createElement("circle", { cx: "9", cy: "7", r: "4" })
  ),
  Package: () => React.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("path", { d: "M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" })
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
  ArrowLeft: () => React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("line", { x1: "19", y1: "12", x2: "5", y2: "12" }),
    React.createElement("polyline", { points: "12 19 5 12 12 5" })
  ),
  RefreshCw: () => React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("polyline", { points: "23 4 23 10 17 10" }),
    React.createElement("path", { d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" })
  )
};

function AnalyticsPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalUsers: 0, totalArtisans: 0, pendingArtisans: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== "admin") { navigate("/login/admin", { replace: true }); return; }
    fetchAnalytics();
  }, [user, authLoading]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [summary, orders] = await Promise.all([
        apiService.getAdminDashboardSummary(),
        apiService.getAllOrders().catch(() => [])
      ]);
      setStats({
        totalUsers: summary.userCount || 0, totalArtisans: summary.artisanCount || 0,
        pendingArtisans: summary.pendingArtisanCount || 0, totalProducts: summary.productCount || 0,
        totalOrders: summary.orderCount || 0, totalRevenue: summary.totalRevenue || 0
      });
      setRecentOrders(Array.isArray(orders) ? orders : (orders.orders || []));
      setLastUpdated(new Date());
    } catch (err) { console.error("Analytics error:", err); }
    finally { setLoading(false); }
  };

  const formatCurrency = (a) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(a || 0);
  const formatDate = (d) => new Date(d).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" });

  // LINE CHART COMPONENT
  const LineChart = ({ data, title, color = "#A68A64", height = 150 }) => {
    const maxVal = Math.max(...data.map(d => d.value), 1);
    const minVal = Math.min(...data.map(d => d.value), 0);
    const range = maxVal - minVal || 1;
    const width = 100;
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1 || 1)) * width;
      const y = height - 20 - ((d.value - minVal) / range) * (height - 40);
      return `${x},${y}`;
    }).join(" ");
    const areaPoints = `0,${height - 20} ${points} ${width},${height - 20}`;
    
    return React.createElement("div", null,
      React.createElement("h4", { style: { color: "#3E2723", marginBottom: "16px", fontWeight: "600" } }, title),
      React.createElement("svg", { viewBox: `0 0 ${width} ${height}`, style: { width: "100%", height: `${height}px` } },
        React.createElement("defs", null,
          React.createElement("linearGradient", { id: `grad-${title.replace(/\s/g, '')}`, x1: "0%", y1: "0%", x2: "0%", y2: "100%" },
            React.createElement("stop", { offset: "0%", style: { stopColor: color, stopOpacity: 0.4 } }),
            React.createElement("stop", { offset: "100%", style: { stopColor: color, stopOpacity: 0.05 } })
          )
        ),
        React.createElement("polygon", { points: areaPoints, fill: `url(#grad-${title.replace(/\s/g, '')})` }),
        React.createElement("polyline", { points: points, fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }),
        data.map((d, i) => {
          const x = (i / (data.length - 1 || 1)) * width;
          const y = height - 20 - ((d.value - minVal) / range) * (height - 40);
          return React.createElement("circle", { key: i, cx: x, cy: y, r: "3", fill: color });
        })
      ),
      React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "11px", color: "#8D6E63" } },
        data.map((d, i) => React.createElement("span", { key: i }, d.label))
      )
    );
  };

  // HORIZONTAL BAR CHART
  const HorizontalBarChart = ({ data, title }) => {
    const maxVal = Math.max(...data.map(d => d.value), 1);
    return React.createElement("div", null,
      React.createElement("h4", { style: { color: "#3E2723", marginBottom: "16px", fontWeight: "600" } }, title),
      React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "12px" } },
        data.map((item, i) =>
          React.createElement("div", { key: i },
            React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: "4px" } },
              React.createElement("span", { style: { fontSize: "13px", color: "#5D4037" } }, item.label),
              React.createElement("span", { style: { fontSize: "13px", fontWeight: "600", color: "#3E2723" } }, item.value)
            ),
            React.createElement("div", { style: { height: "10px", background: "#F0EBE5", borderRadius: "5px", overflow: "hidden" } },
              React.createElement("div", { style: { height: "100%", width: `${(item.value / maxVal) * 100}%`, background: item.color || "#A68A64", borderRadius: "5px", transition: "width 0.5s" } })
            )
          )
        )
      )
    );
  };

  // RADIAL GAUGE CHART
  const GaugeChart = ({ value, max, title, color = "#A68A64" }) => {
    const pct = Math.min((value / max) * 100, 100);
    const circumference = 251.2;
    const offset = circumference - (pct / 100) * circumference;
    return React.createElement("div", { style: { textAlign: "center" } },
      React.createElement("div", { style: { position: "relative", width: "120px", height: "120px", margin: "0 auto" } },
        React.createElement("svg", { width: "120", height: "120", viewBox: "0 0 100 100" },
          React.createElement("circle", { cx: "50", cy: "50", r: "40", fill: "none", stroke: "#F0EBE5", strokeWidth: "10" }),
          React.createElement("circle", { cx: "50", cy: "50", r: "40", fill: "none", stroke: color, strokeWidth: "10", strokeDasharray: circumference, strokeDashoffset: offset, strokeLinecap: "round", transform: "rotate(-90 50 50)", style: { transition: "stroke-dashoffset 0.5s" } })
        ),
        React.createElement("div", { style: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" } },
          React.createElement("div", { style: { fontSize: "22px", fontWeight: "700", color: "#3E2723" } }, `${pct.toFixed(0)}%`),
          React.createElement("div", { style: { fontSize: "10px", color: "#8D6E63" } }, `${value}/${max}`)
        )
      ),
      React.createElement("div", { style: { marginTop: "12px", fontSize: "13px", fontWeight: "600", color: "#5D4037" } }, title)
    );
  };

  // DONUT CHART
  const DonutChart = ({ data, title, size = 160 }) => {
    const total = data.reduce((s, d) => s + d.value, 0) || 1;
    let cumPct = 0;
    const colors = ["#4CAF50", "#2196F3", "#FF9800", "#9C27B0", "#F44336"];
    return React.createElement("div", null,
      React.createElement("h4", { style: { color: "#3E2723", marginBottom: "16px", fontWeight: "600" } }, title),
      React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" } },
        React.createElement("div", { style: { position: "relative", width: size, height: size } },
          React.createElement("svg", { width: size, height: size, viewBox: `0 0 ${size} ${size}` },
            data.map((item, i) => {
              const pct = (item.value / total) * 100;
              const start = cumPct * 3.6;
              cumPct += pct;
              const end = cumPct * 3.6;
              const sRad = (start - 90) * Math.PI / 180, eRad = (end - 90) * Math.PI / 180;
              const r = size / 2 - 10, cx = size / 2, cy = size / 2;
              if (pct === 0) return null;
              return React.createElement("path", { key: i, d: `M ${cx} ${cy} L ${cx + r * Math.cos(sRad)} ${cy + r * Math.sin(sRad)} A ${r} ${r} 0 ${pct > 50 ? 1 : 0} 1 ${cx + r * Math.cos(eRad)} ${cy + r * Math.sin(eRad)} Z`, fill: colors[i % colors.length] });
            }),
            React.createElement("circle", { cx: size/2, cy: size/2, r: size/4, fill: "#fff" })
          ),
          React.createElement("div", { style: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" } },
            React.createElement("div", { style: { fontSize: "20px", fontWeight: "700", color: "#3E2723" } }, total),
            React.createElement("div", { style: { fontSize: "11px", color: "#8D6E63" } }, "Total")
          )
        ),
        React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "6px" } },
          data.map((item, i) => React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: "8px" } },
            React.createElement("div", { style: { width: "12px", height: "12px", borderRadius: "3px", background: colors[i % colors.length] } }),
            React.createElement("span", { style: { fontSize: "12px", color: "#5D4037" } }, `${item.label}: ${item.value}`)
          ))
        )
      )
    );
  };

  // Derived data
  const orderStatusData = [
    { label: "Pending", value: recentOrders.filter(o => (o.status || "").toLowerCase() === "pending").length },
    { label: "Confirmed", value: recentOrders.filter(o => (o.status || "").toLowerCase() === "confirmed").length },
    { label: "Shipped", value: recentOrders.filter(o => (o.status || "").toLowerCase() === "shipped").length },
    { label: "Delivered", value: recentOrders.filter(o => (o.status || "").toLowerCase() === "delivered").length },
    { label: "Cancelled", value: recentOrders.filter(o => (o.status || "").toLowerCase() === "cancelled").length }
  ];

  // Group by last 7 days for revenue trend
  const dailyGroups = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toDateString();
  }).reverse();

  const revenueTrend = dailyGroups.map(dayStr => {
    const dayTotal = recentOrders
      .filter(o => {
        if (!o.createdAt) return false;
        return new Date(o.createdAt).toDateString() === dayStr && (o.status?.toLowerCase() !== 'cancelled');
      })
      .reduce((s, o) => s + (o.totalAmount || 0), 0);
    return { label: dayStr.split(' ').slice(0, 3).join(' '), value: dayTotal };
  });

  const weeklyOrders = dailyGroups.map(dayStr => {
     const count = recentOrders.filter(o => {
       if (!o.createdAt) return false;
       return new Date(o.createdAt).toDateString() === dayStr;
     }).length;
     return { label: dayStr.split(' ').slice(0, 3).join(' '), value: count };
  });

  const statusColors = ["#FF9800", "#2196F3", "#9C27B0", "#4CAF50", "#F44336"];
  const horizData = orderStatusData.map((d, i) => ({ ...d, color: statusColors[i] }));

  return React.createElement("div", { style: { minHeight: "100vh", background: "linear-gradient(180deg, #FDFBF7 0%, #F8F4EF 100%)" } },
    React.createElement(Navbar),
    React.createElement("div", { style: { maxWidth: "1400px", margin: "0 auto", padding: "30px 20px" } },
      /* HEADER */
      React.createElement("div", { style: { marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px" } },
        React.createElement("div", null,
          React.createElement("button", { onClick: () => navigate("/admin/dashboard"), style: { background: "transparent", border: "none", color: "#A68A64", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", fontSize: "14px" } },
            React.createElement(Icons.ArrowLeft), "Back to Command Center"),
          React.createElement("h1", { style: { fontFamily: "'Playfair Display', serif", fontSize: "32px", color: "#3E2723", margin: 0 } }, "Analytics & Insights"),
          React.createElement("p", { style: { color: "#8D6E63", marginTop: "8px" } }, lastUpdated ? `Last updated: ${formatDate(lastUpdated)}` : "Loading...")
        ),
        React.createElement("button", { onClick: fetchAnalytics, disabled: loading, style: { display: "flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: "linear-gradient(135deg, #A68A64, #8B6F47)", color: "#fff", border: "none", borderRadius: "10px", cursor: loading ? "not-allowed" : "pointer", fontWeight: "500", opacity: loading ? 0.7 : 1 } },
          React.createElement(Icons.RefreshCw), loading ? "Refreshing..." : "Refresh Data")
      ),

      loading ? React.createElement("div", { style: { textAlign: "center", padding: "60px", color: "#8D6E63" } }, "Loading analytics...") :
      React.createElement(React.Fragment, null,
        /* KEY METRICS */
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "28px" } },
          [
            { label: "Revenue", value: formatCurrency(stats.totalRevenue), icon: Icons.DollarSign, color: "#4CAF50", bg: "#E8F5E9" },
            { label: "Orders", value: stats.totalOrders, icon: Icons.ShoppingCart, color: "#2196F3", bg: "#E3F2FD" },
            { label: "Products", value: stats.totalProducts, icon: Icons.Package, color: "#FF9800", bg: "#FFF3E0" },
            { label: "Users", value: stats.totalUsers, icon: Icons.Users, color: "#9C27B0", bg: "#F3E5F5" },
            { label: "Artisans", value: stats.totalArtisans, icon: Icons.TrendingUp, color: "#A68A64", bg: "#FFF8E1" },
            { label: "Pending", value: stats.pendingArtisans, icon: Icons.Users, color: "#E65100", bg: "#FFF3E0" }
          ].map((m, i) => React.createElement("div", { key: i, style: { background: "#fff", borderRadius: "16px", padding: "18px", border: "1px solid rgba(166,138,100,0.15)", boxShadow: "0 4px 16px rgba(0,0,0,0.04)" } },
            React.createElement("div", { style: { width: "36px", height: "36px", borderRadius: "10px", background: m.bg, display: "flex", alignItems: "center", justifyContent: "center", color: m.color, marginBottom: "10px" } }, React.createElement(m.icon)),
            React.createElement("div", { style: { fontSize: "22px", fontWeight: "700", color: "#3E2723" } }, m.value),
            React.createElement("span", { style: { fontSize: "12px", color: "#8D6E63" } }, m.label)
          ))
        ),

        /* CHARTS ROW 1: Donut + Line */
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px", marginBottom: "24px" } },
          React.createElement("div", { style: { background: "#fff", borderRadius: "20px", padding: "24px", border: "1px solid rgba(166,138,100,0.15)", boxShadow: "0 4px 16px rgba(0,0,0,0.04)" } },
            React.createElement(DonutChart, { data: orderStatusData, title: "Order Status Distribution" })
          ),
          React.createElement("div", { style: { background: "#fff", borderRadius: "20px", padding: "24px", border: "1px solid rgba(166,138,100,0.15)", boxShadow: "0 4px 16px rgba(0,0,0,0.04)" } },
            React.createElement(LineChart, { data: revenueTrend.length > 1 ? revenueTrend : [{ label: "1", value: 0 }, { label: "2", value: 0 }], title: "Recent Order Values (₹)", color: "#4CAF50" })
          )
        ),

        /* CHARTS ROW 2: Horizontal Bar + Gauges */
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px", marginBottom: "24px" } },
          React.createElement("div", { style: { background: "#fff", borderRadius: "20px", padding: "24px", border: "1px solid rgba(166,138,100,0.15)", boxShadow: "0 4px 16px rgba(0,0,0,0.04)" } },
            React.createElement(HorizontalBarChart, { data: horizData, title: "Orders by Status" })
          ),
          React.createElement("div", { style: { background: "#fff", borderRadius: "20px", padding: "24px", border: "1px solid rgba(166,138,100,0.15)", boxShadow: "0 4px 16px rgba(0,0,0,0.04)" } },
            React.createElement("h4", { style: { color: "#3E2723", marginBottom: "20px", fontWeight: "600" } }, "Performance Gauges"),
            React.createElement("div", { style: { display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "16px" } },
              React.createElement(GaugeChart, { value: stats.totalArtisans - stats.pendingArtisans, max: Math.max(stats.totalArtisans, 1), title: "Approved Artisans", color: "#4CAF50" }),
              React.createElement(GaugeChart, { value: orderStatusData[3].value, max: Math.max(stats.totalOrders, 1), title: "Delivered Orders", color: "#2196F3" })
            )
          )
        ),

        /* CHARTS ROW 3: Line + Platform Health */
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px", marginBottom: "24px" } },
          React.createElement("div", { style: { background: "#fff", borderRadius: "20px", padding: "24px", border: "1px solid rgba(166,138,100,0.15)", boxShadow: "0 4px 16px rgba(0,0,0,0.04)" } },
            React.createElement(LineChart, { data: weeklyOrders, title: "Orders by Day (7 Days)", color: "#9C27B0" })
          ),
          React.createElement("div", { style: { background: "#fff", borderRadius: "20px", padding: "24px", border: "1px solid rgba(166,138,100,0.15)", boxShadow: "0 4px 16px rgba(0,0,0,0.04)" } },
            React.createElement("h4", { style: { color: "#3E2723", marginBottom: "16px", fontWeight: "600" } }, "Platform Metrics"),
            React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "12px" } },
              [
                { label: "Conversion Rate", value: `${stats.totalOrders > 0 ? ((stats.totalOrders / Math.max(stats.totalUsers, 1)) * 100).toFixed(1) : 0}%`, desc: "Orders/Users", color: "#4CAF50" },
                { label: "Avg Order Value", value: formatCurrency(stats.totalRevenue / Math.max(stats.totalOrders, 1)), desc: "Revenue/Order", color: "#2196F3" },
                { label: "Products/Artisan", value: (stats.totalProducts / Math.max(stats.totalArtisans, 1)).toFixed(1), desc: "Catalog size", color: "#FF9800" },
                { label: "Fulfillment Rate", value: `${stats.totalOrders > 0 ? ((orderStatusData[3].value / stats.totalOrders) * 100).toFixed(0) : 0}%`, desc: "Delivered/Total", color: "#9C27B0" }
              ].map((s, i) => React.createElement("div", { key: i, style: { padding: "12px 14px", background: "#FDFBF7", borderRadius: "10px", borderLeft: `4px solid ${s.color}`, display: "flex", justifyContent: "space-between", alignItems: "center" } },
                React.createElement("div", null,
                  React.createElement("div", { style: { fontWeight: "600", color: "#3E2723", fontSize: "13px" } }, s.label),
                  React.createElement("div", { style: { fontSize: "11px", color: "#8D6E63" } }, s.desc)
                ),
                React.createElement("span", { style: { fontSize: "16px", fontWeight: "700", color: s.color } }, s.value)
              ))
            )
          )
        ),

        /* RECENT ORDERS */
        React.createElement("div", { style: { background: "#fff", borderRadius: "20px", padding: "24px", border: "1px solid rgba(166,138,100,0.15)", boxShadow: "0 4px 16px rgba(0,0,0,0.04)" } },
          React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" } },
            React.createElement("h4", { style: { color: "#3E2723", margin: 0, fontWeight: "600" } }, "Recent Orders"),
            React.createElement("span", { style: { fontSize: "13px", color: "#8D6E63" } }, `${Math.min(recentOrders.length, 10)} of ${recentOrders.length}`)
          ),
          recentOrders.length === 0 ? React.createElement("p", { style: { color: "#8D6E63", textAlign: "center", padding: "40px" } }, "No orders") :
          React.createElement("div", { style: { overflowX: "auto" } },
            React.createElement("table", { style: { width: "100%", borderCollapse: "collapse" } },
              React.createElement("thead", null, React.createElement("tr", null,
                ["ID", "Customer", "Amount", "Status", "Date"].map(h => React.createElement("th", { key: h, style: { textAlign: "left", padding: "12px 8px", borderBottom: "2px solid rgba(166,138,100,0.1)", color: "#8D6E63", fontWeight: "500", fontSize: "12px" } }, h))
              )),
              React.createElement("tbody", null, recentOrders.slice(0, 10).map((o, i) =>
                React.createElement("tr", { key: i, style: { borderBottom: "1px solid rgba(166,138,100,0.08)" } },
                  React.createElement("td", { style: { padding: "12px 8px", fontFamily: "monospace", color: "#3E2723", fontWeight: "500" } }, `#${(o._id || "").slice(-6).toUpperCase()}`),
                  React.createElement("td", { style: { padding: "12px 8px", color: "#5D4037" } }, o.user?.name || "Guest"),
                  React.createElement("td", { style: { padding: "12px 8px", color: "#A68A64", fontWeight: "600" } }, formatCurrency(o.totalAmount)),
                  React.createElement("td", { style: { padding: "12px 8px" } },
                    React.createElement("span", { style: { padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "500", background: o.status === "delivered" ? "#E8F5E9" : o.status === "cancelled" ? "#FFEBEE" : "#FFF3E0", color: o.status === "delivered" ? "#2E7D32" : o.status === "cancelled" ? "#C62828" : "#E65100" } }, o.status)
                  ),
                  React.createElement("td", { style: { padding: "12px 8px", color: "#8D6E63", fontSize: "12px" } }, formatDate(o.createdAt))
                )
              ))
            )
          )
        )
      )
    ),
    React.createElement(Footer)
  );
}

export default AnalyticsPage;
