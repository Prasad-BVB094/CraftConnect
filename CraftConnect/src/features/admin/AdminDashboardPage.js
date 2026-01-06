import React, { useEffect, useState } from "react";
import Navbar from "../../shared/components/Navbar";
import Footer from "../../shared/components/Footer";
import apiService from "../../shared/services/api";
import { useAuth } from "../../shared/hooks/useAuth";
import { useNavigate } from "react-router-dom";

// SVG Icons
const Icons = {
  Users: () => React.createElement("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("path", { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }),
    React.createElement("circle", { cx: "9", cy: "7", r: "4" }),
    React.createElement("path", { d: "M23 21v-2a4 4 0 0 0-3-3.87" }),
    React.createElement("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" })
  ),
  Palette: () => React.createElement("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("circle", { cx: "13.5", cy: "6.5", r: ".5" }),
    React.createElement("circle", { cx: "17.5", cy: "10.5", r: ".5" }),
    React.createElement("circle", { cx: "8.5", cy: "7.5", r: ".5" }),
    React.createElement("circle", { cx: "6.5", cy: "12.5", r: ".5" }),
    React.createElement("path", { d: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" })
  ),
  ShoppingCart: () => React.createElement("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("circle", { cx: "9", cy: "21", r: "1" }),
    React.createElement("circle", { cx: "20", cy: "21", r: "1" }),
    React.createElement("path", { d: "M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" })
  ),
  DollarSign: () => React.createElement("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("line", { x1: "12", y1: "1", x2: "12", y2: "23" }),
    React.createElement("path", { d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" })
  ),
  Clock: () => React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("circle", { cx: "12", cy: "12", r: "10" }),
    React.createElement("polyline", { points: "12 6 12 12 16 14" })
  ),
  MessageSquare: () => React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" })
  ),
  BarChart: () => React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("line", { x1: "12", y1: "20", x2: "12", y2: "10" }),
    React.createElement("line", { x1: "18", y1: "20", x2: "18", y2: "4" }),
    React.createElement("line", { x1: "6", y1: "20", x2: "6", y2: "16" })
  ),
  Settings: () => React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("circle", { cx: "12", cy: "12", r: "3" }),
    React.createElement("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" })
  ),
  Folder: () => React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("path", { d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" })
  ),
  Check: () => React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3" },
    React.createElement("polyline", { points: "20 6 9 17 4 12" })
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

function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    users: 0,
    artisans: 0,
    products: 0,
    orders: 0,
    pendingArtisans: 0,
    pendingSupport: 0,
    revenue: 0
  });
  const [pendingArtisans, setPendingArtisans] = useState([]);
  const [recentQueries, setRecentQueries] = useState([]);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== "admin") {
      navigate("/login/admin", { replace: true });
      return;
    }
    setIsAdmin(true);
    fetchDashboardData();
  }, [user, authLoading]);

  const fetchDashboardData = async () => {
    try {
      const [dashboard, artisans, queries] = await Promise.all([
        apiService.getAdminDashboard(),
        apiService.getPendingArtisans().catch(() => []),
        apiService.getSupportQueries({ status: "pending" }).catch(() => [])
      ]);

      setStatsData({
        users: dashboard.totalUsers || 0,
        artisans: dashboard.totalArtisans || 0,
        products: dashboard.totalProducts || 0,
        orders: dashboard.totalOrders || 0,
        pendingArtisans: dashboard.pendingArtisans || 0,
        pendingSupport: Array.isArray(queries) ? queries.length : 0,
        revenue: dashboard.totalRevenue || 0
      });

      setPendingArtisans(Array.isArray(artisans) ? artisans.slice(0, 5) : []);
      setRecentQueries(Array.isArray(queries) ? queries.slice(0, 5) : []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveArtisan = async (id) => {
    try {
      await apiService.approveArtisan(id);
      fetchDashboardData();
    } catch (err) {
      alert("Failed to approve artisan");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
  };

  if (!isAdmin) return null;

  // Stats cards configuration with SVG icons
  const stats = [
    { label: "Total Users", value: statsData.users, Icon: Icons.Users, color: "#4CAF50", bg: "#E8F5E9" },
    { label: "Artisans", value: statsData.artisans, Icon: Icons.Palette, color: "#FF9800", bg: "#FFF3E0" },
    { label: "Total Orders", value: statsData.orders, Icon: Icons.ShoppingCart, color: "#2196F3", bg: "#E3F2FD" },
    { label: "Revenue", value: formatCurrency(statsData.revenue), Icon: Icons.DollarSign, color: "#9C27B0", bg: "#F3E5F5" },
  ];

  // Quick actions with SVG icons - NO PRODUCTS SEPARATE
  const quickActions = [
    { label: "Manage Users", path: "/admin/users", Icon: Icons.Users, desc: "View all customers" },
    { label: "Artisans & Products", path: "/admin/artisans", Icon: Icons.Palette, desc: "Sellers & their products" },
    { label: "Orders", path: "/admin/orders", Icon: Icons.ShoppingCart, desc: "Order management" },
    { label: "Categories", path: "/admin/categories", Icon: Icons.Folder, desc: "Product categories" },
    { label: "Support Queries", path: "/admin/support", Icon: Icons.MessageSquare, desc: "Customer support" },
    { label: "Analytics", path: "/admin/analytics", Icon: Icons.BarChart, desc: "Reports & insights" },
  ];

  return React.createElement(
    "div",
    { style: { minHeight: "100vh", background: "linear-gradient(180deg, #FDFBF7 0%, #F8F4EF 100%)" } },
    React.createElement(Navbar),

    React.createElement(
      "div",
      { style: { maxWidth: "1400px", margin: "0 auto", padding: "30px 20px" } },

      /* HEADER */
      React.createElement(
        "div",
        { style: { marginBottom: "32px" } },
        React.createElement("h1", {
          style: { fontFamily: "'Playfair Display', serif", fontSize: "36px", color: "#3E2723", margin: "0 0 8px" }
        }, "Command Center"),
        React.createElement("p", {
          style: { color: "#8D6E63", margin: 0 }
        }, "Welcome back! Here's your CraftConnect overview.")
      ),

      /* LOADING STATE */
      loading
        ? React.createElement("div", { style: { textAlign: "center", padding: "60px", color: "#8D6E63" } }, "Loading dashboard...")
        : React.createElement(
            React.Fragment,
            null,

            /* NOTIFICATION ALERTS */
            (statsData.pendingArtisans > 0 || statsData.pendingSupport > 0) && React.createElement(
              "div",
              { style: { display: "flex", gap: "16px", marginBottom: "28px", flexWrap: "wrap" } },
              statsData.pendingArtisans > 0 && React.createElement(
                "div",
                {
                  onClick: () => navigate("/admin/artisans"),
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "14px 20px",
                    background: "linear-gradient(135deg, #FFF3E0, #FFE0B2)",
                    borderRadius: "14px",
                    border: "1px solid #FFB74D",
                    cursor: "pointer"
                  }
                },
                React.createElement("div", { style: { color: "#E65100" } }, React.createElement(Icons.Clock)),
                React.createElement("span", { style: { color: "#E65100", fontWeight: "600" } }, 
                  `${statsData.pendingArtisans} Artisan${statsData.pendingArtisans > 1 ? 's' : ''} Pending Approval`
                ),
                React.createElement("div", { style: { color: "#E65100" } }, React.createElement(Icons.ArrowRight))
              ),
              statsData.pendingSupport > 0 && React.createElement(
                "div",
                {
                  onClick: () => navigate("/admin/support"),
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "14px 20px",
                    background: "linear-gradient(135deg, #E3F2FD, #BBDEFB)",
                    borderRadius: "14px",
                    border: "1px solid #64B5F6",
                    cursor: "pointer"
                  }
                },
                React.createElement("div", { style: { color: "#1565C0" } }, React.createElement(Icons.MessageSquare)),
                React.createElement("span", { style: { color: "#1565C0", fontWeight: "600" } }, 
                  `${statsData.pendingSupport} Support Quer${statsData.pendingSupport > 1 ? 'ies' : 'y'} Pending`
                ),
                React.createElement("div", { style: { color: "#1565C0" } }, React.createElement(Icons.ArrowRight))
              )
            ),

            /* STATS CARDS */
            React.createElement(
              "div",
              { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "32px" } },
              stats.map((stat, i) =>
                React.createElement(
                  "div",
                  {
                    key: i,
                    style: {
                      background: "#fff",
                      borderRadius: "20px",
                      padding: "28px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                      border: "1px solid rgba(166,138,100,0.12)",
                      transition: "all 0.3s ease"
                    }
                  },
                  React.createElement(
                    "div",
                    { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" } },
                    React.createElement("div", {
                      style: {
                        width: "56px",
                        height: "56px",
                        borderRadius: "16px",
                        background: stat.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: stat.color
                      }
                    }, React.createElement(stat.Icon)),
                    React.createElement("span", {
                      style: { fontSize: "32px", fontWeight: "700", color: "#3E2723" }
                    }, stat.value)
                  ),
                  React.createElement("span", { style: { color: "#8D6E63", fontSize: "14px", fontWeight: "500" } }, stat.label)
                )
              )
            ),

            /* PENDING ARTISANS */
            pendingArtisans.length > 0 && React.createElement(
              "div",
              {
                style: {
                  background: "#fff",
                  borderRadius: "20px",
                  padding: "28px",
                  marginBottom: "24px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                  border: "1px solid rgba(166,138,100,0.12)"
                }
              },
              React.createElement(
                "div",
                { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" } },
                React.createElement("h3", { style: { margin: 0, color: "#3E2723", fontFamily: "'Playfair Display', serif" } }, 
                  "Pending Artisan Approvals"
                ),
                React.createElement("button", {
                  onClick: () => navigate("/admin/artisans"),
                  style: {
                    background: "transparent",
                    border: "1px solid #A68A64",
                    color: "#A68A64",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "500"
                  }
                }, "View All")
              ),
              React.createElement(
                "div",
                { style: { display: "flex", flexDirection: "column", gap: "12px" } },
                pendingArtisans.map((artisan, i) =>
                  React.createElement(
                    "div",
                    {
                      key: i,
                      style: {
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px",
                        background: "#FDFBF7",
                        borderRadius: "12px",
                        border: "1px solid rgba(166,138,100,0.1)"
                      }
                    },
                    React.createElement(
                      "div",
                      { style: { display: "flex", alignItems: "center", gap: "12px" } },
                      React.createElement("div", {
                        style: {
                          width: "42px",
                          height: "42px",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #FFB74D, #FFA726)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontWeight: "600"
                        }
                      }, (artisan.name || "A").charAt(0).toUpperCase()),
                      React.createElement("div", null,
                        React.createElement("div", { style: { fontWeight: "600", color: "#3E2723" } }, artisan.name),
                        React.createElement("div", { style: { fontSize: "13px", color: "#8D6E63" } }, artisan.email)
                      )
                    ),
                    React.createElement(
                      "div",
                      { style: { display: "flex", gap: "8px" } },
                      React.createElement("button", {
                        onClick: () => handleApproveArtisan(artisan._id || artisan.id),
                        style: {
                          background: "#4CAF50",
                          color: "#fff",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontWeight: "500",
                          fontSize: "13px"
                        }
                      }, React.createElement(Icons.Check), "Approve"),
                      React.createElement("button", {
                        onClick: () => navigate("/admin/artisans"),
                        style: {
                          background: "#fff",
                          color: "#A68A64",
                          border: "1px solid #A68A64",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontWeight: "500",
                          fontSize: "13px"
                        }
                      }, React.createElement(Icons.Eye), "View")
                    )
                  )
                )
              )
            ),

            /* RECENT SUPPORT QUERIES */
            recentQueries.length > 0 && React.createElement(
              "div",
              {
                style: {
                  background: "#fff",
                  borderRadius: "20px",
                  padding: "28px",
                  marginBottom: "24px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                  border: "1px solid rgba(166,138,100,0.12)"
                }
              },
              React.createElement(
                "div",
                { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" } },
                React.createElement("h3", { style: { margin: 0, color: "#3E2723", fontFamily: "'Playfair Display', serif" } }, 
                  "Recent Support Queries"
                ),
                React.createElement("button", {
                  onClick: () => navigate("/admin/support"),
                  style: {
                    background: "transparent",
                    border: "1px solid #A68A64",
                    color: "#A68A64",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "500"
                  }
                }, "View All")
              ),
              recentQueries.map((query, i) =>
                React.createElement(
                  "div",
                  {
                    key: i,
                    style: {
                      padding: "16px",
                      background: "#FDFBF7",
                      borderRadius: "12px",
                      marginBottom: "12px",
                      border: "1px solid rgba(166,138,100,0.1)"
                    }
                  },
                  React.createElement(
                    "div",
                    { style: { display: "flex", justifyContent: "space-between", marginBottom: "8px" } },
                    React.createElement("span", { style: { fontWeight: "600", color: "#3E2723" } }, query.subject || "No Subject"),
                    React.createElement("span", {
                      style: {
                        background: query.status === "pending" ? "#FFF3E0" : "#E8F5E9",
                        color: query.status === "pending" ? "#E65100" : "#2E7D32",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: "600",
                        textTransform: "uppercase"
                      }
                    }, query.status)
                  ),
                  React.createElement("p", { style: { color: "#5D4037", margin: 0, fontSize: "14px" } }, 
                    query.message?.substring(0, 100) + (query.message?.length > 100 ? "..." : "")
                  )
                )
              )
            ),

            /* QUICK ACTIONS */
            React.createElement(
              "div",
              {
                style: {
                  background: "#fff",
                  borderRadius: "20px",
                  padding: "28px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                  border: "1px solid rgba(166,138,100,0.12)"
                }
              },
              React.createElement("h3", {
                style: { margin: "0 0 24px", color: "#3E2723", fontFamily: "'Playfair Display', serif" }
              }, "Quick Actions"),
              React.createElement(
                "div",
                { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" } },
                quickActions.map((action, i) =>
                  React.createElement(
                    "button",
                    {
                      key: i,
                      onClick: () => navigate(action.path),
                      style: {
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "12px",
                        background: "linear-gradient(135deg, #FDFBF7, #F8F4EF)",
                        border: "1px solid rgba(166,138,100,0.2)",
                        borderRadius: "16px",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.2s ease"
                      },
                      onMouseEnter: (e) => {
                        e.currentTarget.style.background = "linear-gradient(135deg, #A68A64, #8B6F47)";
                        e.currentTarget.style.borderColor = "#A68A64";
                        e.currentTarget.querySelectorAll("*").forEach(el => { if (el.style) el.style.color = "#fff"; });
                      },
                      onMouseLeave: (e) => {
                        e.currentTarget.style.background = "linear-gradient(135deg, #FDFBF7, #F8F4EF)";
                        e.currentTarget.style.borderColor = "rgba(166,138,100,0.2)";
                        const label = e.currentTarget.querySelector(".action-label");
                        const desc = e.currentTarget.querySelector(".action-desc");
                        if (label) label.style.color = "#3E2723";
                        if (desc) desc.style.color = "#8D6E63";
                      }
                    },
                    React.createElement("div", { style: { color: "#A68A64" } }, React.createElement(action.Icon)),
                    React.createElement("div", null,
                      React.createElement("div", { className: "action-label", style: { fontWeight: "600", color: "#3E2723", fontSize: "15px" } }, action.label),
                      React.createElement("div", { className: "action-desc", style: { fontSize: "12px", color: "#8D6E63", marginTop: "4px" } }, action.desc)
                    )
                  )
                )
              )
            )
          )
    ),

    React.createElement(Footer)
  );
}

export default AdminDashboardPage;
