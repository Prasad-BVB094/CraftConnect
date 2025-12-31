import React from "react";
import Navbar from "../../shared/components/Navbar";
import Footer from "../../shared/components/Footer";

function VendorOrdersPage() {
  const vendorOrders = [
    {
      id: 101,
      customer: "Rohit Sharma",
      product: "Terracotta Planter",
      qty: 1,
      amount: 1200,
      status: "Pending",
    },
    {
      id: 102,
      customer: "Meera Rao",
      product: "Handloom Scarf",
      qty: 2,
      amount: 1900,
      status: "Packed",
    },
    {
      id: 103,
      customer: "Anil Kumar",
      product: "Wooden Spoon Set",
      qty: 1,
      amount: 420,
      status: "Shipped",
    },
  ];

  const statusColors = {
    Pending: "#A68A64",
    Packed: "#6B4F3B",
    Shipped: "#3E2C20",
    Delivered: "green",
  };

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Navbar),
    React.createElement(
      "div",
      { className: "container" },

    /* PAGE TITLE */
    React.createElement(
      "h2",
      {
        style: {
          fontFamily: "'Playfair Display', serif",
          color: "var(--accent)",
          marginTop: "30px",
          marginBottom: "20px",
        },
      },
      "Orders Received"
    ),

    /* ORDERS TABLE WRAPPER */
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
        {
          style: {
            width: "100%",
            borderCollapse: "collapse",
          },
        },
        /* HEAD */
        React.createElement(
          "thead",
          null,
          React.createElement(
            "tr",
            null,
            tableHeader("Order ID"),
            tableHeader("Customer"),
            tableHeader("Product"),
            tableHeader("Qty"),
            tableHeader("Total (₹)"),
            tableHeader("Status"),
            tableHeader("Action")
          )
        ),

        /* BODY */
        React.createElement(
          "tbody",
          null,
          vendorOrders.map((order) =>
            React.createElement(
              "tr",
              { key: order.id, style: rowStyle },

              tableCell(order.id),
              tableCell(order.customer),
              tableCell(order.product),
              tableCell(order.qty),
              tableCell(order.amount),

              /* STATUS BADGE */
              React.createElement(
                "td",
                null,
                React.createElement(
                  "span",
                  {
                    style: {
                      padding: "6px 10px",
                      borderRadius: "8px",
                      color: "#fff",
                      background: statusColors[order.status],
                      fontSize: "13px",
                    },
                  },
                  order.status
                )
              ),

              /* UPDATE BUTTON */
              React.createElement(
                "td",
                null,
                React.createElement(
                  "button",
                  {
                    className: "cta",
                    style: {
                      padding: "8px 12px",
                      fontSize: "13px",
                    },
                    onClick: () =>
                      alert(`Update status for Order ${order.id} (Backend later)`),
                  },
                  "Update"
                )
              )
            )
          )
        )
      )
    ),

    /* FOOTER */
    React.createElement(Footer)
    )
  );
}

/* ---- Helper Functions ---- */

function tableHeader(text) {
  return React.createElement(
    "th",
    {
      style: {
        textAlign: "left",
        paddingBottom: "10px",
        borderBottom: "2px solid rgba(62,44,32,0.1)",
        color: "var(--secondary)",
        fontWeight: "600",
        paddingRight: "10px",
      },
    },
    text
  );
}

function tableCell(value) {
  return React.createElement(
    "td",
    {
      style: {
        padding: "10px 0",
        borderBottom: "1px solid rgba(62,44,32,0.06)",
        color: "var(--text)",
        fontSize: "14px",
      },
    },
    value
  );
}

const rowStyle = {
  verticalAlign: "top",
};

export default VendorOrdersPage;
