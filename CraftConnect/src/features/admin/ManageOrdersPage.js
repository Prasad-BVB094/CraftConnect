import React, { useState } from "react";
import Navbar from "../../shared/components/Navbar";

function ManageOrdersPage() {
  const [query, setQuery] = useState("");
  const [orders, setOrders] = useState([
    {
      id: "ORD-101",
      user: "Rohit Sharma",
      product: "Terracotta Planter",
      amount: 1200,
      date: "2025-06-12",
      status: "Pending",
    },
    {
      id: "ORD-102",
      user: "Priya Menon",
      product: "Handloom Scarf",
      amount: 950,
      date: "2025-06-11",
      status: "Shipped",
    },
    {
      id: "ORD-103",
      user: "Anil Kumar",
      product: "Wooden Spoon Set",
      amount: 420,
      date: "2025-06-10",
      status: "Delivered",
    },
    {
      id: "ORD-104",
      user: "Sita R",
      product: "Bamboo Basket",
      amount: 650,
      date: "2025-06-09",
      status: "Cancelled",
    },
  ]);

  const statusColors = {
    Pending: "#A68A64",
    Shipped: "#0077cc",
    Delivered: "green",
    Cancelled: "crimson",
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(query.toLowerCase()) ||
      o.user.toLowerCase().includes(query.toLowerCase())
  );

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus }
        : order
    ));
    alert(`Order ${orderId} status updated to ${newStatus}`);
  };

  const handleDelete = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      setOrders(orders.filter(order => order.id !== orderId));
      alert(`Order ${orderId} deleted`);
    }
  };

  const handleViewDetails = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      alert(`Order Details:
ID: ${order.id}
User: ${order.user}
Product: ${order.product}
Amount: ₹${order.amount}
Date: ${order.date}
Status: ${order.status}`);
    }
  };

  return React.createElement(
    "div",
    { className: "container" },

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
        },
      },
      "Manage Orders"
    ),

    /* SEARCH BOX */
    React.createElement("input", {
      type: "text",
      placeholder: "Search orders by ID or user...",
      value: query,
      onChange: (e) => setQuery(e.target.value),
      style: {
        width: "100%",
        padding: "12px",
        borderRadius: "12px",
        border: "1px solid rgba(62,44,32,0.1)",
        marginBottom: "20px",
        fontSize: "15px",
      },
    }),

    /* MAIN CARD */
    React.createElement(
      "div",
      {
        style: {
          background: "linear-gradient(180deg,#fff,rgba(248,244,239,0.9))",
          padding: "20px",
          borderRadius: "16px",
          border: "1px solid rgba(62,44,32,0.08)",
          boxShadow: "0 6px 20px rgba(62,44,32,0.05)",
        },
      },

      /* TABLE */
      React.createElement(
        "table",
        { style: { width: "100%", borderCollapse: "collapse" } },

        /* HEADER */
        React.createElement(
          "thead",
          null,
          React.createElement(
            "tr",
            null,
            th("Order ID"),
            th("User"),
            th("Product"),
            th("Amount"),
            th("Date"),
            th("Status"),
            th("Actions")
          )
        ),

        /* ROWS */
        React.createElement(
          "tbody",
          null,
          filteredOrders.map((order) =>
            React.createElement(
              "tr",
              {
                key: order.id,
                style: {
                  borderBottom: "1px solid rgba(62,44,32,0.08)",
                },
              },

              td(order.id),
              td(order.user),
              td(order.product),

              td(`₹${order.amount}`),
              td(order.date),

              /* STATUS BADGE */
              React.createElement(
                "td",
                null,
                React.createElement(
                  "span",
                  {
                    style: {
                      background: statusColors[order.status],
                      padding: "6px 10px",
                      color: "#fff",
                      borderRadius: "8px",
                      fontSize: "13px",
                    },
                  },
                  order.status
                )
              ),

              /* ACTIONS */
              React.createElement(
                "td",
                { style: { padding: "12px 0", display: "flex", gap: "8px" } },

                /* CHANGE STATUS */
                React.createElement(
                  "select",
                  {
                    style: {
                      padding: "6px 10px",
                      borderRadius: "8px",
                      border: "1px solid rgba(62,44,32,0.1)",
                      fontSize: "13px",
                    },
                    onChange: (e) => handleStatusChange(order.id, e.target.value),
                  },
                  ["Pending", "Shipped", "Delivered", "Cancelled"].map((s) =>
                    React.createElement("option", { key: s, value: s }, s)
                  )
                ),

                /* VIEW BUTTON */
                React.createElement(
                  "button",
                  {
                    className: "cta",
                    onClick: () => handleViewDetails(order.id),
                  },
                  "View"
                )
              )
            )
          )
        )
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

/* Helper functions */
function th(text) {
  return React.createElement(
    "th",
    {
      style: {
        textAlign: "left",
        paddingBottom: "10px",
        borderBottom: "2px solid rgba(62,44,32,0.1)",
        color: "var(--secondary)",
      },
    },
    text
  );
}

function td(text) {
  return React.createElement(
    "td",
    {
      style: {
        padding: "10px 0",
        fontSize: "14px",
        color: "var(--text)",
      },
    },
    text
  );
}

export default ManageOrdersPage;
