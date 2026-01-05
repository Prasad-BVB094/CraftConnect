import React, { useState, useEffect } from "react";
import Navbar from "../../shared/components/Navbar";
import { useAuth } from "../../shared/hooks/useAuth";
import apiService from "../../shared/services/api";
import Footer from "../../shared/components/Footer";

function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState({});

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

  const toggleDetails = (id) => {
    setExpandedOrders(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (loading) {
    return React.createElement("div", { className: "container", style: { padding: "100px 50px", textAlign: "center" } }, 
      React.createElement("div", { className: "loading-spinner" }),
      React.createElement("p", { style: { marginTop: "20px", color: "var(--muted)" } }, "Loading your orders...")
    );
  }

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Navbar),
    React.createElement(
      "div",
      { className: "container", style: { maxWidth: "1000px", minHeight: "70vh" } },

      /* PAGE HEADER */
      React.createElement(
        "div",
        { style: { marginTop: "40px", marginBottom: "40px", textAlign: "center" } },
        React.createElement("h1", {
          style: {
            fontFamily: "'Playfair Display', serif",
            fontSize: "36px",
            color: "var(--accent)",
            marginBottom: "10px"
          }
        }, "Your Orders"),
        React.createElement("p", { style: { color: "var(--muted)" } }, "Track and manage your handcrafted treasures")
      ),

      /* EMPTY STATE */
      orders.length === 0 && React.createElement("div", {
        style: {
          textAlign: "center",
          padding: "60px",
          background: "#fff",
          borderRadius: "20px",
          border: "1px dashed var(--accent)"
        }
      },
        React.createElement("div", { style: { fontSize: "40px", marginBottom: "20px" } }, "📦"),
        React.createElement("h3", { style: { color: "var(--accent)" } }, "No orders found"),
        React.createElement("p", null, "You haven't placed any orders yet."),
        React.createElement("button", { 
          className: "cta", 
          style: { marginTop: "20px", padding: "12px 24px" },
          onClick: () => window.location.href = "/products"
        }, "Start Shopping")
      ),

      /* ORDERS LIST */
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            marginBottom: "60px"
          },
        },

        orders.map((order) => {
          const id = order._id || order.id;
          const isExpanded = expandedOrders[id];
          
          return React.createElement(
            "div",
            {
              key: id,
              style: {
                borderRadius: "20px",
                background: "#fff",
                border: "1px solid rgba(62,44,32,0.1)",
                boxShadow: "0 10px 30px rgba(62,44,32,0.06)",
                overflow: "hidden",
                transition: "all 0.3s ease"
              },
            },

            /* Main Card Header */
            React.createElement("div", {
              style: {
                padding: "24px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "20px",
                alignItems: "center"
              }
            },
              React.createElement("div", null,
                React.createElement("div", { style: labelStyle }, "ORDER ID"),
                React.createElement("div", { style: { fontWeight: "bold", color: "var(--accent)" } }, 
                  "#" + id.slice(-8).toUpperCase()
                )
              ),
              React.createElement("div", null,
                React.createElement("div", { style: labelStyle }, "DATE"),
                React.createElement("div", { style: { fontWeight: "500" } }, 
                  new Date(order.createdAt || order.date).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric"
                  })
                )
              ),
              React.createElement("div", null,
                React.createElement("div", { style: labelStyle }, "TOTAL AMOUNT"),
                React.createElement("div", { style: { fontWeight: "bold", fontSize: "18px" } }, 
                  "₹" + (order.totalAmount || order.total).toLocaleString()
                )
              ),
              React.createElement("div", null,
                React.createElement("div", { style: labelStyle }, "STATUS"),
                React.createElement("div", {
                  style: {
                    padding: "4px 12px",
                    borderRadius: "20px",
                    display: "inline-block",
                    fontSize: "12px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    background: order.status === "delivered" ? "#E8F5E9" : 
                               order.status === "cancelled" ? "#FFEBEE" : "#FFF3E0",
                    color: order.status === "delivered" ? "#2E7D32" : 
                           order.status === "cancelled" ? "#C62828" : "#E65100"
                  }
                }, order.status)
              ),
              React.createElement("div", { style: { textAlign: "right" } },
                React.createElement("button", {
                  className: "cta-outline",
                  style: { padding: "8px 16px", borderRadius: "10px", fontSize: "13px" },
                  onClick: () => toggleDetails(id)
                }, isExpanded ? "Hide Details" : "View Details")
              )
            ),

            /* Expanded Details Section */
            isExpanded && React.createElement("div", {
              style: {
                padding: "24px",
                background: "rgba(244,241,236,0.3)",
                borderTop: "1px solid rgba(62,44,32,0.06)"
              }
            },
              React.createElement("div", {
                style: {
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "30px"
                }
              },
                /* Left: Items */
                React.createElement("div", null,
                  React.createElement("h4", { style: sectionTitleStyle }, "Ordered Items"),
                  order.items.map((item, idx) =>
                    React.createElement("div", {
                      key: idx,
                      style: {
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 0",
                        borderBottom: idx < order.items.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none"
                      }
                    },
                      React.createElement("div", null,
                        React.createElement("div", { style: { fontWeight: "500" } }, item.product?.name || item.product?.title || "Product"),
                        React.createElement("div", { style: { fontSize: "12px", color: "var(--muted)" } }, `Quantity: ${item.quantity} × ₹${item.price}`)
                      ),
                      React.createElement("div", { style: { fontWeight: "bold" } }, "₹" + (item.price * item.quantity).toLocaleString())
                    )
                  )
                ),

                /* Right: Delivery & Payment */
                React.createElement("div", null,
                  React.createElement("h4", { style: sectionTitleStyle }, "Delivery Details"),
                  React.createElement("div", { style: { fontSize: "14px", color: "var(--text)", marginBottom: "15px" } },
                    React.createElement("div", { style: { fontWeight: "600" } }, "Shipping Address:"),
                    React.createElement("div", null, order.shippingAddress?.address),
                    order.shippingAddress?.landmark && React.createElement("div", null, "Landmark: " + order.shippingAddress.landmark),
                    React.createElement("div", null, `${order.shippingAddress?.city}, ${order.shippingAddress?.state} - ${order.shippingAddress?.pincode}`),
                    React.createElement("div", null, order.shippingAddress?.country)
                  ),
                  
                  React.createElement("h4", { style: sectionTitleStyle }, "Payment Info"),
                  React.createElement("div", { style: { fontSize: "14px" } },
                    React.createElement("div", null, 
                      React.createElement("strong", null, "Method: "), 
                      order.paymentMethod === "razorpay" ? "Online (Razorpay)" : "Cash on Delivery"
                    ),
                    React.createElement("div", null, 
                      React.createElement("strong", null, "Status: "),
                      order.isPaid ? 
                        React.createElement("span", { style: { color: "green" } }, "✓ Payment Success") : 
                        React.createElement("span", { style: { color: "#C62828" } }, "Pending")
                    )
                  ),

                  order.deliveryInstructions && React.createElement("div", { style: { marginTop: "15px" } },
                    React.createElement("h4", { style: sectionTitleStyle }, "Delivery Instructions"),
                    React.createElement("p", { style: { fontSize: "13px", fontStyle: "italic", margin: 0 } }, order.deliveryInstructions)
                  ),

                  order.isGift && React.createElement("div", { style: { marginTop: "15px", background: "rgba(233,30,99,0.05)", padding: "10px", borderRadius: "8px" } },
                    React.createElement("h4", { style: { ...sectionTitleStyle, color: "#E91E63" } }, "🎁 Gift Message"),
                    React.createElement("p", { style: { fontSize: "13px", fontStyle: "italic", margin: 0 } }, order.giftMessage || "Enjoy your gift!")
                  )
                )
              )
            )
          );
        })
      )
    ),

    /* FOOTER */
    React.createElement(Footer)
  );
}

const labelStyle = {
  fontSize: "11px",
  color: "var(--muted)",
  marginBottom: "4px",
  letterSpacing: "1px",
  fontWeight: "bold"
};

const sectionTitleStyle = {
  fontSize: "14px",
  color: "var(--accent)",
  marginBottom: "12px",
  paddingBottom: "8px",
  borderBottom: "2px solid var(--accent)",
  display: "inline-block"
};

export default OrdersPage;

const muted = {
  color: "var(--muted)",
  fontSize: "14px",
  marginBottom: "4px",
};
