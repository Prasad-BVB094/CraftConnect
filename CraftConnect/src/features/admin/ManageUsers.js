import React from "react";
import { useNavigate } from "react-router-dom";

function ManageUsersPage() {
  const navigate = useNavigate();

  const users = [
    { id: 1, name: "John Doe", email: "john@email.com", joinDate: "2025-10-15", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@email.com", joinDate: "2025-10-20", status: "Active" },
    { id: 3, name: "Mike Johnson", email: "mike@email.com", joinDate: "2025-11-01", status: "Active" },
    { id: 4, name: "Sarah Williams", email: "sarah@email.com", joinDate: "2025-11-05", status: "Suspended" },
    { id: 5, name: "Tom Brown", email: "tom@email.com", joinDate: "2025-11-10", status: "Active" },
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
      "Manage Users"
    ),
    React.createElement(
      "p",
      {
        style: {
          color: "var(--muted)",
          marginBottom: "30px",
        },
      },
      "View and manage platform users"
    ),
    React.createElement(
      "div",
      { style: { marginBottom: "20px", display: "flex", gap: "12px" } },
      React.createElement("input", {
        type: "text",
        placeholder: "Search users...",
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
        React.createElement("option", null, "All Users"),
        React.createElement("option", null, "Active"),
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
            gridTemplateColumns: "60px 1fr 250px 150px 120px 180px",
            gap: "20px",
            fontWeight: "600",
            fontSize: "14px",
            color: "var(--accent)",
          },
        },
        React.createElement("div", null, "ID"),
        React.createElement("div", null, "Name"),
        React.createElement("div", null, "Email"),
        React.createElement("div", null, "Join Date"),
        React.createElement("div", null, "Status"),
        React.createElement("div", { style: { textAlign: "center" } }, "Actions")
      ),
      users.map((user, i) =>
        React.createElement(
          "div",
          {
            key: user.id,
            style: {
              padding: "20px",
              borderBottom: i < users.length - 1 ? "1px solid rgba(62,44,32,0.06)" : "none",
              display: "grid",
              gridTemplateColumns: "60px 1fr 250px 150px 120px 180px",
              gap: "20px",
              alignItems: "center",
            },
          },
          React.createElement(
            "div",
            { style: { color: "var(--muted)" } },
            `#${user.id}`
          ),
          React.createElement(
            "div",
            { style: { fontWeight: "600" } },
            user.name
          ),
          React.createElement(
            "div",
            { style: { color: "var(--muted)" } },
            user.email
          ),
          React.createElement(
            "div",
            { style: { fontSize: "13px" } },
            user.joinDate
          ),
          React.createElement(
            "div",
            {
              className: "badge",
              style: {
                background: user.status === "Active" ? "rgba(76,175,80,0.1)" : "rgba(244,67,54,0.1)",
                color: user.status === "Active" ? "#4CAF50" : "#f44336",
              },
            },
            user.status
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
            user.status === "Active"
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

export default ManageUsersPage;
