import React from "react";
import Navbar from "../../shared/components/Navbar";

function AdminDashboard() {
  return React.createElement(
    "div",
    { className: "container" },

    React.createElement(Navbar),

    /* PAGE TITLE */
    React.createElement(
      "h2",
      {
        style: {
          marginTop: "30px",
          marginBottom: "20px",
          fontFamily: "'Playfair Display', serif",
          color: "var(--accent)",
        },
      },
      "Admin Dashboard"
    ),

    /* MAIN DASHBOARD GRID */
    React.createElement(
      "div",
      {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "20px",
        },
      },

      adminCard(
        "Manage Users",
        "View, edit or disable customer accounts.",
        "👥",
        () => (window.location.href = "/admin/users")
      ),

      adminCard(
        "Manage Vendors",
        "Verify artisans and approve/reject vendors.",
        "🛠️",
        () => (window.location.href = "/admin/vendors")
      ),

      adminCard(
        "Manage Products",
        "View all uploaded items, remove fake listings.",
        "📦",
        () => (window.location.href = "/admin/products")
      ),

      adminCard(
        "Manage Orders",
        "View all orders across the marketplace.",
        "🧾",
        () => (window.location.href = "/admin/orders")
      ),

      adminCard(
        "Categories",
        "Add or edit craft categories.",
        "📚",
        () => (window.location.href = "/admin/categories")
      )
    ),

    /* FOOTER */
    React.createElement(
      "footer",
      { style: { marginTop: "40px" } },
      React.createElement("div", null, "© CraftConnect — handcrafted community"),
      React.createElement("div", null, "Made with ❤️ | Beige & brown theme")
    )
  );
}

/* ---- Helper for Admin Cards ---- */
function adminCard(title, desc, icon, onClick) {
  return React.createElement(
    "div",
    {
      style: {
        background: "linear-gradient(180deg,#fff,rgba(248,244,239,0.9))",
        borderRadius: "16px",
        padding: "20px",
        border: "1px solid rgba(62,44,32,0.08)",
        boxShadow: "0 6px 20px rgba(62,44,32,0.05)",
        cursor: "pointer",
        transition: "0.2s",
      },
      onClick,
      onMouseEnter: (e) => (e.currentTarget.style.transform = "translateY(-4px)"),
      onMouseLeave: (e) => (e.currentTarget.style.transform = "translateY(0)"),
    },

    React.createElement(
      "div",
      { style: { fontSize: "32px", color: "var(--accent)", marginBottom: "10px" } },
      icon
    ),

    React.createElement(
      "h3",
      { style: { color: "var(--secondary)", marginBottom: "8px" } },
      title
    ),

    React.createElement(
      "p",
      { style: { color: "var(--muted)", fontSize: "14px" } },
      desc
    )
  );
}

export default AdminDashboard;
