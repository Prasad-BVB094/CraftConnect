import React from "react";
import Navbar from "../../shared/components/Navbar";

function VendorDashboard() {
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
      "Artisan Dashboard"
    ),

    /* MAIN GRID */
    React.createElement(
      "div",
      {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "20px",
        },
      },

      /* CARD 1: Add Product */
      dashboardCard(
        "Add New Product",
        "Upload handmade items to your shop.",
        "➕",
        () => (window.location.href = "/vendor/add-product")
      ),

      /* CARD 2: Manage Products */
      dashboardCard(
        "Manage Products",
        "Edit or remove existing listings.",
        "📦",
        () => (window.location.href = "/vendor/products")
      ),

      /* CARD 3: Orders */
      dashboardCard(
        "Orders",
        "View orders placed for your items.",
        "🧾",
        () => (window.location.href = "/vendor/orders")
      ),

      /* CARD 4: Profile */
      dashboardCard(
        "Edit Profile",
        "Update your artisan details & story.",
        "👤",
        () => (window.location.href = "/vendor/profile")
      ),

      /* CARD 5: Earnings */
      dashboardCard(
        "Earnings",
        "Check your income from sales.",
        "💰",
        () => alert("Earnings page coming soon")
      )
    ),

    React.createElement(
      "footer",
      { style: { marginTop: "40px" } },
      React.createElement("div", null, "© CraftConnect — handcrafted community"),
      React.createElement("div", null, "Made with ❤️ | Beige & brown theme")
    )
  );
}

/* ---- Helper for Dashboard Cards ---- */
function dashboardCard(title, desc, icon, onClick) {
  return React.createElement(
    "div",
    {
      className: "dashboard-card",
      onClick,
      style: {
        background: "linear-gradient(180deg,#fff,rgba(248,244,239,0.9))",
        borderRadius: "16px",
        padding: "20px",
        border: "1px solid rgba(62,44,32,0.08)",
        boxShadow: "0 6px 20px rgba(62,44,32,0.05)",
        cursor: "pointer",
        transition: "0.2s",
      },
      onMouseEnter: (e) => (e.currentTarget.style.transform = "translateY(-4px)"),
      onMouseLeave: (e) => (e.currentTarget.style.transform = "translateY(0)"),
    },

    React.createElement(
      "div",
      {
        style: {
          fontSize: "30px",
          marginBottom: "10px",
          color: "var(--accent)",
        },
      },
      icon
    ),

    React.createElement(
      "h3",
      {
        style: {
          color: "var(--secondary)",
          marginBottom: "6px",
        },
      },
      title
    ),

    React.createElement(
      "p",
      { style: { color: "var(--muted)", fontSize: "14px" } },
      desc
    )
  );
}

export default VendorDashboard;
