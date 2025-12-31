import React, { useState, useEffect } from "react";
import Navbar from "../../shared/components/Navbar";
import { useAuth } from "../../shared/hooks/useAuth";
import apiService from "../../shared/services/api";
import Footer from "../../shared/components/Footer";

function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      if (user?.id) {
          fetchOrders();
      }
  }, [user]);

  const fetchOrders = async () => {
      try {
          const data = await apiService.getOrders(user.id);
          setOrders(data);
      } catch (err) {
          console.error(err);
      } finally {
          setLoading(false);
      }
  };

  if (loading) {
      return React.createElement("div", { className: "container", style: { padding: "50px", textAlign: "center" } }, "Loading orders...");
  }

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
          marginTop: "30px",
          marginBottom: "20px",
          fontFamily: "'Playfair Display', serif",
          color: "var(--accent)",
        },
      },
      "Your Orders"
    ),

    /* ORDERS GRID */
    React.createElement(
      "div",
      {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
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
              background: "linear-gradient(180deg,#fff,rgba(248,244,239,0.92))",
              border: "1px solid rgba(62,44,32,0.08)",
              boxShadow: "0 6px 20px rgba(62,44,32,0.05)",
            },
          },

          React.createElement(
            "h3",
            { style: { color: "var(--secondary)", marginBottom: "10px" } },
            order.id
          ),

          React.createElement(
            "p",
            { style: muted },
            "Date: ",
            order.date
          ),
          React.createElement(
            "p",
            { style: muted },
            "Total: ₹",
            order.total
          ),
          React.createElement(
            "p",
            {
              style: {
                ...muted,
                color:
                  order.status === "Delivered"
                    ? "green"
                    : order.status === "Cancelled"
                    ? "red"
                    : "var(--accent)",
                fontWeight: 600,
              },
            },
            "Status: ",
            order.status
          ),

          React.createElement("div", { style: { marginTop: "10px" } },
            React.createElement(
              "strong",
              { style: { color: "var(--accent)" } },
              "Items:"
            )
          ),

          React.createElement(
            "ul",
            null,
            order.items.map((item, idx) =>
              React.createElement(
                "li",
                { key: idx, style: muted },
                "• ",
                item
              )
            )
          ),

          React.createElement(
            "button",
            {
              className: "cta",
              style: {
                width: "100%",
                marginTop: "14px",
                padding: "12px",
                borderRadius: "12px",
                fontSize: "15px",
              },
              onClick: () => alert("Order details (backend pending)"),
            },
            "View Details"
          )
        )
      )
    ),

    /* FOOTER */
    React.createElement(Footer)
    )
  );
}

const muted = {
  color: "var(--muted)",
  fontSize: "14px",
  marginBottom: "4px",
};

export default OrdersPage;
