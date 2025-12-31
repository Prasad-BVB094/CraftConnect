import React from "react";
import { useNavigate } from "react-router-dom";

function ManageVendorsPage() {
  const navigate = useNavigate();

  const vendors = [
    { id: 1, name: "Artisan Crafts Co.", email: "artisan@email.com", specialty: "Pottery", joinDate: "2025-09-10", status: "Active", products: 24 },
    { id: 2, name: "Bamboo Works Ltd.", email: "bamboo@email.com", specialty: "Bamboo", joinDate: "2025-09-20", status: "Active", products: 18 },
    { id: 3, name: "Handloom Heritage", email: "handloom@email.com", specialty: "Handloom", joinDate: "2025-10-05", status: "Active", products: 32 },
    { id: 4, name: "Wood Artistry", email: "wood@email.com", specialty: "Woodcraft", joinDate: "2025-10-15", status: "Pending", products: 0 },
    { id: 5, name: "Jewelry Makers", email: "jewelry@email.com", specialty: "Jewelry", joinDate: "2025-11-01", status: "Suspended", products: 12 },
  ];

  return React.createElement(
    "div",
    { className: "container" },
    React.createElement(
      "button",
      {
        onClick: () => navigate("/admin/dashboard"),
        style: {
          background: "transparent",
          border: "1px solid var(--secondary)",
          padding: "8px 16px",
          borderRadius: "8px",
          cursor: "pointer",
          color: "var(--secondary)",
          marginBottom: "20px",
        },
      },
      "← Back to Dashboard"
    ),
    React.createElement(
      "h1",
      {
        style: {
          fontFamily: "'Playfair Display', serif",
          color: "var(--accent)",
          fontSize: "32px",
          marginBottom: "10px",
        },
      },
      "Manage Vendors"
    ),
    React.createElement(
      "p",
      {
        style: {
          color: "var(--muted)",
          marginBottom: "30px",
        },
      },
      "View and manage artisan vendors"
    ),
    React.createElement(
      "div",
      { style: { marginBottom: "20px", display: "flex", gap: "12px" } },
      React.createElement("input", {
        type: "text",
        placeholder: "Search vendors...",
        style: {
          flex: 1,
          padding: "10px 16px",
          borderRadius: "10px",
          border: "1px solid rgba(62,44,32,0.15)",
          fontSize: "14px",
        },
      }),
      React.createElement(
        "select",
        {
          style: {
            padding: "10px 16px",
            borderRadius: "10px",
            border: "1px solid rgba(62,44,32,0.15)",
            background: "white",
            cursor: "pointer",
          },
        },
        React.createElement("option", null, "All Vendors"),
        React.createElement("option", null, "Active"),
        React.createElement("option", null, "Pending"),
        React.createElement("option", null, "Suspended")
      )
    ),
    React.createElement(
      "div",
      {
        style: {
          background: "linear-gradient(180deg, #fff, rgba(248,244,239,0.9))",
          borderRadius: "14px",
          border: "1px solid rgba(62,44,32,0.08)",
          overflow: "hidden",
        },
      },
      React.createElement(
        "div",
        {
          style: {
            padding: "20px",
            background: "rgba(166,138,100,0.08)",
            display: "grid",
            gridTemplateColumns: "60px 1fr 200px 120px 120px 100px 120px 180px",
            gap: "20px",
            fontWeight: "600",
            fontSize: "14px",
            color: "var(--accent)",
          },
        },
        React.createElement("div", null, "ID"),
        React.createElement("div", null, "Vendor Name"),
        React.createElement("div", null, "Email"),
        React.createElement("div", null, "Specialty"),
        React.createElement("div", null, "Join Date"),
        React.createElement("div", null, "Products"),
        React.createElement("div", null, "Status"),
        React.createElement("div", { style: { textAlign: "center" } }, "Actions")
      ),
      vendors.map((vendor, i) =>
        React.createElement(
          "div",
          {
            key: vendor.id,
            style: {
              padding: "20px",
              borderBottom: i < vendors.length - 1 ? "1px solid rgba(62,44,32,0.06)" : "none",
              display: "grid",
              gridTemplateColumns: "60px 1fr 200px 120px 120px 100px 120px 180px",
              gap: "20px",
              alignItems: "center",
            },
          },
          React.createElement(
            "div",
            { style: { color: "var(--muted)" } },
            `#${vendor.id}`
          ),
          React.createElement(
            "div",
            { style: { fontWeight: "600" } },
            vendor.name
          ),
          React.createElement(
            "div",
            { style: { color: "var(--muted)", fontSize: "13px" } },
            vendor.email
          ),
          React.createElement(
            "div",
            { style: { fontSize: "13px" } },
            vendor.specialty
          ),
          React.createElement(
            "div",
            { style: { fontSize: "13px" } },
            vendor.joinDate
          ),
          React.createElement(
            "div",
            { style: { textAlign: "center", fontWeight: "600" } },
            vendor.products
          ),
          React.createElement(
            "div",
            {
              className: "badge",
              style: {
                background:
                  vendor.status === "Active" ? "rgba(76,175,80,0.1)" :
                  vendor.status === "Pending" ? "rgba(255,152,0,0.1)" :
                  "rgba(244,67,54,0.1)",
                color:
                  vendor.status === "Active" ? "#4CAF50" :
                  vendor.status === "Pending" ? "#FF9800" :
                  "#f44336",
              },
            },
            vendor.status
          ),
          React.createElement(
            "div",
            { style: { display: "flex", gap: "8px", justifyContent: "center" } },
            React.createElement(
              "button",
              {
                style: {
                  padding: "6px 12px",
                  borderRadius: "6px",
                  background: "var(--primary)",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "13px",
                },
              },
              "View"
            ),
            vendor.status === "Pending"
              ? React.createElement(
                  "button",
                  {
                    style: {
                      padding: "6px 12px",
                      borderRadius: "6px",
                      background: "rgba(76,175,80,0.1)",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "13px",
                      color: "#4CAF50",
                    },
                  },
                  "Approve"
                )
              : vendor.status === "Active"
              ? React.createElement(
                  "button",
                  {
                    style: {
                      padding: "6px 12px",
                      borderRadius: "6px",
                      background: "rgba(244,67,54,0.1)",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "13px",
                      color: "#f44336",
                    },
                  },
                  "Suspend"
                )
              : React.createElement(
                  "button",
                  {
                    style: {
                      padding: "6px 12px",
                      borderRadius: "6px",
                      background: "rgba(76,175,80,0.1)",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "13px",
                      color: "#4CAF50",
                    },
                  },
                  "Activate"
                )
          )
        )
      )
    )
  );
}

export default ManageVendorsPage;
