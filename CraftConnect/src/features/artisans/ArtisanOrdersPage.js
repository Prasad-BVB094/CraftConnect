import React, { useState, useEffect } from "react";
import Navbar from "../../shared/components/Navbar";
import Footer from "../../shared/components/Footer";
import apiService from "../../shared/services/api";
import { useAuth } from "../../shared/hooks/useAuth";

function VendorOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await apiService.getArtisanOrders();
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await apiService.updateOrderStatus(orderId, newStatus);
      await fetchOrders(); // Refresh
      alert(`Order status updated to ${newStatus}`);
    } catch (err) {
      alert("Failed to update status");
    }
    setUpdating(null);
  };

  const statusColors = {
    pending: { bg: "#FFF3E0", text: "#E65100" },
    confirmed: { bg: "#E3F2FD", text: "#1565C0" },
    shipped: { bg: "#F3E5F5", text: "#7B1FA2" },
    delivered: { bg: "#E8F5E9", text: "#2E7D32" },
    cancelled: { bg: "#FFEBEE", text: "#C62828" }
  };

  const statusOptions = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

  // SVG Icons
  const PackageIcon = React.createElement('svg', { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
    React.createElement('path', { d: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' })
  );

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Navbar),
    React.createElement(
      "div",
      {
        style: {
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "30px 20px 60px"
        }
      },

      /* Header */
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px"
          }
        },
        React.createElement("h1", {
          style: {
            fontFamily: "'Playfair Display', serif",
            fontSize: "32px",
            color: "var(--accent)"
          }
        }, "Orders Received"),
        React.createElement("div", {
          style: {
            padding: "10px 20px",
            background: "linear-gradient(135deg, var(--accent), #8B6F47)",
            borderRadius: "10px",
            color: "#fff",
            fontWeight: "bold"
          }
        }, `${orders.length} Total Orders`)
      ),

      /* Stats Cards */
      React.createElement(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
            marginBottom: "30px"
          }
        },
        [
          { label: "Pending", count: orders.filter(o => o.status === "pending").length, color: "#E65100" },
          { label: "Confirmed", count: orders.filter(o => o.status === "confirmed").length, color: "#1565C0" },
          { label: "Shipped", count: orders.filter(o => o.status === "shipped").length, color: "#7B1FA2" },
          { label: "Delivered", count: orders.filter(o => o.status === "delivered").length, color: "#2E7D32" }
        ].map(stat =>
          React.createElement("div", {
            key: stat.label,
            style: {
              background: "#fff",
              padding: "20px",
              borderRadius: "12px",
              borderLeft: `4px solid ${stat.color}`,
              boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
            }
          },
            React.createElement("div", { style: { fontSize: "28px", fontWeight: "bold", color: stat.color } }, stat.count),
            React.createElement("div", { style: { fontSize: "14px", color: "var(--muted)" } }, stat.label)
          )
        )
      ),

      /* Loading State */
      loading && React.createElement("div", {
        style: { textAlign: "center", padding: "60px" }
      },
        React.createElement("div", {
          style: {
            width: "40px",
            height: "40px",
            border: "4px solid #ddd",
            borderTopColor: "var(--accent)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px"
          }
        }),
        React.createElement("p", { style: { color: "var(--muted)" } }, "Loading orders..."),
        React.createElement("style", null, "@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }")
      ),

      /* Empty State */
      !loading && orders.length === 0 && React.createElement("div", {
        style: {
          textAlign: "center",
          padding: "80px 40px",
          background: "#fff",
          borderRadius: "16px",
          border: "1px dashed rgba(166,138,100,0.3)"
        }
      },
        React.createElement("div", { style: { fontSize: "48px", marginBottom: "16px" } }, "📦"),
        React.createElement("h3", { style: { color: "var(--accent)", marginBottom: "8px" } }, "No orders yet"),
        React.createElement("p", { style: { color: "var(--muted)" } }, "Orders for your products will appear here.")
      ),

      /* Orders List */
      !loading && orders.length > 0 && React.createElement(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "16px" } },
        orders.map(order =>
          React.createElement("div", {
            key: order._id || order.id,
            style: {
              background: "#fff",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              border: "1px solid rgba(166,138,100,0.1)"
            }
          },
            /* Order Header */
            React.createElement("div", {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
                paddingBottom: "16px",
                borderBottom: "1px solid rgba(166,138,100,0.1)"
              }
            },
              React.createElement("div", null,
                React.createElement("span", { style: { fontSize: "12px", color: "var(--muted)" } }, "Order ID"),
                React.createElement("div", { style: { fontWeight: "bold", color: "var(--accent)" } }, 
                  `#${(order._id || order.id).slice(-8).toUpperCase()}`
                )
              ),
              React.createElement("div", {
                style: {
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "600",
                  background: statusColors[order.status]?.bg || "#f0f0f0",
                  color: statusColors[order.status]?.text || "#333"
                }
              }, order.status?.charAt(0).toUpperCase() + order.status?.slice(1))
            ),

            /* Order Items */
            order.items?.map((item, idx) =>
              React.createElement("div", {
                key: idx,
                style: {
                  display: "flex",
                  gap: "16px",
                  padding: "12px 0",
                  borderBottom: idx < order.items.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none"
                }
              },
                React.createElement("div", {
                  style: {
                    width: "60px",
                    height: "60px",
                    borderRadius: "8px",
                    background: "rgba(166,138,100,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }
                }, PackageIcon),
                React.createElement("div", { style: { flex: 1 } },
                  React.createElement("div", { style: { fontWeight: "600" } }, item.product?.name || "Product"),
                  React.createElement("div", { style: { fontSize: "13px", color: "var(--muted)" } }, 
                    `Qty: ${item.quantity} × ₹${item.price}`
                  )
                ),
                React.createElement("div", { style: { fontWeight: "bold", color: "var(--accent)" } }, 
                  `₹${item.quantity * item.price}`
                )
              )
            ),

            /* Customer Info & Actions */
            React.createElement("div", {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "16px",
                paddingTop: "16px",
                borderTop: "1px solid rgba(166,138,100,0.1)"
              }
            },
              React.createElement("div", null,
                React.createElement("div", { style: { fontSize: "13px", color: "var(--muted)" } }, "Customer"),
                React.createElement("div", { style: { fontWeight: "500" } }, order.user?.name || "Customer"),
                React.createElement("div", { style: { fontSize: "12px", color: "var(--muted)" } }, 
                  order.user?.email || ""
                ),
                order.customerPhone && React.createElement("div", { style: { fontSize: "12px", color: "var(--text)", marginTop: "4px" } }, 
                  `📞 ${order.customerPhone}`
                )
              ),
              React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "12px" } },
                /* Payment Badge */
                React.createElement("div", {
                  style: {
                    padding: "6px 12px",
                    borderRadius: "8px",
                    background: order.isPaid ? "#E8F5E9" : "#FFF3E0",
                    color: order.isPaid ? "#2E7D32" : "#E65100",
                    fontSize: "12px",
                    fontWeight: "600"
                  }
                }, order.isPaid ? "✓ PAID" : (order.paymentMethod === "cod" ? "COD" : "UNPAID")),
                React.createElement("div", { style: { textAlign: "right" } },
                  React.createElement("div", { style: { fontSize: "12px", color: "var(--muted)" } }, "Total"),
                  React.createElement("div", { style: { fontSize: "20px", fontWeight: "bold", color: "var(--accent)" } }, 
                    `₹${order.totalAmount}`
                  )
                ),
                React.createElement("select", {
                  value: order.status,
                  onChange: (e) => handleStatusUpdate(order._id || order.id, e.target.value),
                  disabled: updating === (order._id || order.id),
                  style: {
                    padding: "10px 16px",
                    borderRadius: "8px",
                    border: "1px solid rgba(166,138,100,0.2)",
                    background: "#fff",
                    cursor: "pointer",
                    fontWeight: "500"
                  }
                },
                  statusOptions.map(s =>
                    React.createElement("option", { key: s, value: s }, 
                      s.charAt(0).toUpperCase() + s.slice(1)
                    )
                  )
                )
              )
            ),

            /* Shipping Address Details */
            React.createElement("div", {
              style: {
                marginTop: "16px",
                padding: "12px 16px",
                background: "rgba(62,44,32,0.03)",
                borderRadius: "8px",
                fontSize: "13px"
              }
            },
              React.createElement("div", { style: { fontWeight: "600", marginBottom: "6px", color: "var(--accent)" } }, "📍 Shipping Address"),
              React.createElement("div", { style: { color: "var(--text)" } }, 
                `${order.shippingAddress?.address || ""}`
              ),
              order.shippingAddress?.landmark && React.createElement("div", { style: { color: "var(--muted)" } }, 
                `Near: ${order.shippingAddress.landmark}`
              ),
              React.createElement("div", { style: { color: "var(--muted)" } }, 
                `${order.shippingAddress?.city}, ${order.shippingAddress?.state} - ${order.shippingAddress?.pincode}`
              ),
              /* Delivery Type */
              order.deliveryType && React.createElement("div", { style: { marginTop: "8px", color: "var(--accent)" } }, 
                `🚚 ${order.deliveryType === "express" ? "Express Delivery" : "Standard Delivery"}`
              ),
              /* Delivery Instructions */
              order.deliveryInstructions && React.createElement("div", { style: { marginTop: "6px", fontStyle: "italic", color: "var(--muted)" } }, 
                `📝 ${order.deliveryInstructions}`
              )
            ),

            /* Customization Request if exists */
            order.customizationRequest && React.createElement("div", {
              style: {
                marginTop: "12px",
                padding: "12px 16px",
                background: "rgba(166,138,100,0.08)",
                borderRadius: "8px",
                borderLeft: "3px solid var(--accent)"
              }
            },
              React.createElement("div", { style: { fontWeight: "600", fontSize: "13px", marginBottom: "4px" } }, 
                "✨ Customization Request"
              ),
              React.createElement("p", { style: { fontSize: "14px", color: "var(--text)", margin: 0 } }, 
                order.customizationRequest
              )
            ),

            /* Gift Message if exists */
            order.isGift && order.giftMessage && React.createElement("div", {
              style: {
                marginTop: "12px",
                padding: "12px 16px",
                background: "rgba(255,192,203,0.15)",
                borderRadius: "8px",
                borderLeft: "3px solid #E91E63"
              }
            },
              React.createElement("div", { style: { fontWeight: "600", fontSize: "13px", marginBottom: "4px", color: "#E91E63" } }, 
                "🎁 Gift Message"
              ),
              React.createElement("p", { style: { fontSize: "14px", color: "var(--text)", margin: 0, fontStyle: "italic" } }, 
                order.giftMessage
              )
            )
          )
        )
      )
    ),

    React.createElement(Footer)
  );
}

export default VendorOrdersPage;
