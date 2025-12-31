import React from "react";
import Navbar from "../../shared/components/Navbar";

function OrdersReceivedPage() {
  const orders = [
    {
      id: 101,
      customer: "Riya Sharma",
      product: "Terracotta Planter",
      qty: 2,
      total: 2400,
      status: "Pending",
      date: "2025-01-21",
    },
    {
      id: 102,
      customer: "Manoj Verma",
      product: "Handloom Scarf",
      qty: 1,
      total: 950,
      status: "Shipped",
      date: "2025-01-20",
    },
    {
      id: 103,
      customer: "Sneha Patil",
      product: "Wooden Spoon Set",
      qty: 3,
      total: 1260,
      status: "Delivered",
      date: "2025-01-19",
    },
  ];

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
      "Orders Received"
    ),

    /* CARD WRAPPER */
    React.createElement(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        },
      },

      orders.map((order) =>
        React.createElement(
          "div",
          {
            key: order.id,
            style: {
              padding: "20px",
              borderRadius: "16px",
              background: "linear-gradient(180deg,#fff,rgba(248,244,239,0.95))",
              border: "1px solid rgba(62,44,32,0.08)",
              boxShadow: "0 6px 20px rgba(62,44,32,0.05)",
            },
          },

          /* TOP ROW */
          React.createElement(
            "div",
            {
              style: {
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              },
            },
            React.createElement(
              "div",
              { style: { fontWeight: "bold", color: "var(--accent)" } },
              "Order #",
              order.id
            ),
            React.createElement(
              "div",
              { style: { fontSize: "13px", color: "var(--muted)" } },
              order.date
            )
          ),

          /* CUSTOMER + PRODUCT DETAILS */
          React.createElement(
            "div",
            null,
            React.createElement(
              "p",
              { style: detailStyle },
              React.createElement("strong", null, "Customer: "),
              order.customer
            ),
            React.createElement(
              "p",
              { style: detailStyle },
              React.createElement("strong", null, "Product: "),
              order.product
            ),
            React.createElement(
              "p",
              { style: detailStyle },
              React.createElement("strong", null, "Quantity: "),
              order.qty
            ),
            React.createElement(
              "p",
              { style: detailStyle },
              React.createElement("strong", null, "Total: "),
              "₹",
              order.total
            )
          ),

          /* STATUS BADGE */
          React.createElement(
            "div",
            {
              style: {
                marginTop: "12px",
                fontSize: "14px",
                fontWeight: "600",
                color:
                  order.status === "Pending"
                    ? "#A67C00"
                    : order.status === "Shipped"
                    ? "#0057A6"
                    : "green",
              },
            },
            "Status: ",
            order.status
          ),

          /* ACTION BUTTONS */
          React.createElement(
            "div",
            {
              style: {
                marginTop: "14px",
                display: "flex",
                gap: "10px",
              },
            },

            React.createElement(
              "button",
              {
                className: "cta secondary-cta",
                style: buttonStyle,
                onClick: () =>
                  alert("Update status (Backend integration required)"),
              },
              "Update Status"
            ),

            React.createElement(
              "button",
              {
                className: "add-btn",
                style: buttonStyle,
                onClick: () =>
                  alert("View order details (Backend integration pending)"),
              },
              "View Details"
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

/* ---------- SHARED STYLES ---------- */

const detailStyle = {
  marginBottom: "6px",
  color: "var(--muted)",
};

const buttonStyle = {
  flex: 1,
  padding: "10px",
  borderRadius: "12px",
  fontSize: "14px",
};

export default OrdersReceivedPage;
