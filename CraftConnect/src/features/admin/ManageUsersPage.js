import React, { useState, useEffect } from "react";
import Navbar from "../../shared/components/Navbar";
import Footer from "../../shared/components/Footer";
import apiService from "../../shared/services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/hooks/useAuth";

// SVG Icons
const Icons = {
  Users: () => React.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("path", { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }),
    React.createElement("circle", { cx: "9", cy: "7", r: "4" }),
    React.createElement("path", { d: "M23 21v-2a4 4 0 0 0-3-3.87" }),
    React.createElement("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" })
  ),
  Search: () => React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("circle", { cx: "11", cy: "11", r: "8" }),
    React.createElement("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
  ),
  ArrowLeft: () => React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("line", { x1: "19", y1: "12", x2: "5", y2: "12" }),
    React.createElement("polyline", { points: "12 19 5 12 12 5" })
  ),
  Mail: () => React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("path", { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" }),
    React.createElement("polyline", { points: "22,6 12,13 2,6" })
  ),
  Calendar: () => React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2", ry: "2" }),
    React.createElement("line", { x1: "16", y1: "2", x2: "16", y2: "6" }),
    React.createElement("line", { x1: "8", y1: "2", x2: "8", y2: "6" }),
    React.createElement("line", { x1: "3", y1: "10", x2: "21", y2: "10" })
  ),
  ShoppingBag: () => React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("path", { d: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" }),
    React.createElement("line", { x1: "3", y1: "6", x2: "21", y2: "6" }),
    React.createElement("path", { d: "M16 10a4 4 0 0 1-8 0" })
  )
};

function ManageUsersPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== "admin") {
      navigate("/login/admin", { replace: true });
      return;
    }
    fetchUsers();
  }, [user, authLoading]);

  const fetchUsers = async () => {
    try {
      const data = await apiService.getUsers();
      const userList = Array.isArray(data) ? data : (data.users || []);
      setUsers(userList.map(u => ({
        id: u._id || u.id,
        name: u.name || "Unknown",
        email: u.email,
        phone: u.phone || "",
        createdAt: u.createdAt,
        isVerified: u.isVerified,
        role: u.role
      })));
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
  );

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

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
        { style: { marginBottom: "30px" } },
        React.createElement(
          "button",
          {
            onClick: () => navigate("/admin/dashboard"),
            style: { background: "transparent", border: "none", color: "#A68A64", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", fontSize: "14px" }
          },
          React.createElement(Icons.ArrowLeft),
          "Back to Command Center"
        ),
        React.createElement("h1", {
          style: { fontFamily: "'Playfair Display', serif", fontSize: "32px", color: "#3E2723", margin: "0 0 8px" }
        }, "User Management"),
        React.createElement("p", {
          style: { color: "#8D6E63", margin: 0 }
        }, `${users.length} registered customers`)
      ),

      /* SEARCH */
      React.createElement(
        "div",
        { style: { position: "relative", marginBottom: "24px" } },
        React.createElement("div", {
          style: { position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#A68A64" }
        }, React.createElement(Icons.Search)),
        React.createElement("input", {
          type: "text",
          placeholder: "Search users by name or email...",
          value: query,
          onChange: (e) => setQuery(e.target.value),
          style: {
            width: "100%",
            padding: "14px 14px 14px 48px",
            borderRadius: "12px",
            border: "1px solid rgba(166,138,100,0.2)",
            fontSize: "15px",
            background: "#fff"
          }
        })
      ),

      /* USERS LIST */
      loading
        ? React.createElement("div", { style: { textAlign: "center", padding: "60px", color: "#8D6E63" } }, "Loading users...")
        : filtered.length === 0
        ? React.createElement(
            "div",
            { style: { textAlign: "center", padding: "80px", background: "#fff", borderRadius: "16px" } },
            React.createElement(Icons.Users),
            React.createElement("h3", { style: { color: "#3E2723", marginTop: "16px" } }, "No Users Found"),
            React.createElement("p", { style: { color: "#8D6E63" } }, query ? "No users match your search." : "No registered users yet.")
          )
        : React.createElement(
            "div",
            {
              style: {
                background: "#fff",
                borderRadius: "20px",
                padding: "24px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                border: "1px solid rgba(166,138,100,0.12)"
              }
            },
            React.createElement(
              "div",
              { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" } },
              filtered.map(u =>
                React.createElement(
                  "div",
                  {
                    key: u.id,
                    style: {
                      padding: "20px",
                      background: "#FDFBF7",
                      borderRadius: "16px",
                      border: "1px solid rgba(166,138,100,0.1)"
                    }
                  },
                  React.createElement(
                    "div",
                    { style: { display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" } },
                    /* Avatar */
                    React.createElement("div", {
                      style: {
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #A68A64, #8B6F47)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: "18px",
                        fontWeight: "600"
                      }
                    }, u.name.charAt(0).toUpperCase()),
                    React.createElement("div", { style: { flex: 1 } },
                      React.createElement("div", { style: { fontWeight: "600", color: "#3E2723", fontSize: "16px" } }, u.name),
                      React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "4px", color: "#8D6E63", fontSize: "13px" } },
                        React.createElement(Icons.Mail),
                        u.email
                      )
                    )
                  ),
                  React.createElement(
                    "div",
                    { style: { display: "flex", gap: "16px", fontSize: "13px", color: "#5D4037" } },
                    React.createElement("span", { style: { display: "flex", alignItems: "center", gap: "4px" } },
                      React.createElement(Icons.Calendar),
                      `Joined ${formatDate(u.createdAt)}`
                    ),
                    u.isVerified && React.createElement("span", {
                      style: { color: "#4CAF50", fontWeight: "500" }
                    }, "✓ Verified")
                  )
                )
              )
            )
          )
    ),

    React.createElement(Footer)
  );
}

export default ManageUsersPage;
