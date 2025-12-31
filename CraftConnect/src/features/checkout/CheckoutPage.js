import React from "react";
import Navbar from "../../shared/components/Navbar";
import { useCart } from "../../shared/context/CartContext";

import { useAuth } from "../../shared/hooks/useAuth";
import apiService from "../../shared/services/api";
import Footer from "../../shared/components/Footer";

function CheckoutPage() {
  const { user } = useAuth();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "Cash on Delivery",
  });

  const total = getCartTotal();

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handlePlaceOrder = async () => {
    // Validate form
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address1 || !formData.city || !formData.state || !formData.pincode) {
      alert("Please fill all required fields");
      return;
    }
    
    try {
        await apiService.createOrder(user?.id || 'guest', { ...formData, cartItems, total });
        alert(`Order placed successfully! Total: ₹${total}\nPayment: ${formData.paymentMethod}`);
        clearCart();
        window.location.href = "/orders";
    } catch (err) {
        alert("Failed to place order. Please try again.");
    }
  };

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Navbar),
    React.createElement(
      "div",
      { className: "container" },

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
      "Checkout"
    ),

    /* MAIN CHECKOUT GRID */
    React.createElement(
      "div",
      {
        style: {
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "30px",
        },
      },

      /* ---------------- SHIPPING DETAILS ---------------- */
      React.createElement(
        "div",
        {
          style: {
            padding: "20px",
            borderRadius: "16px",
            background: "linear-gradient(180deg,#fff,rgba(248,244,239,0.9))",
            border: "1px solid rgba(62,44,32,0.08)",
            boxShadow: "0 6px 20px rgba(62,44,32,0.05)",
          },
        },

        React.createElement(
          "h3",
          {
            style: {
              color: "var(--secondary)",
              marginBottom: "12px",
            },
          },
          "Shipping Details"
        ),

        createInput("Full Name", "text", "fullName", formData.fullName, handleInputChange),
        createInput("Email", "email", "email", formData.email, handleInputChange),
        createInput("Phone", "text", "phone", formData.phone, handleInputChange),
        createInput("Address Line 1", "text", "address1", formData.address1, handleInputChange),
        createInput("Address Line 2", "text", "address2", formData.address2, handleInputChange),
        createInput("City", "text", "city", formData.city, handleInputChange),
        createInput("State", "text", "state", formData.state, handleInputChange),
        createInput("Pincode", "text", "pincode", formData.pincode, handleInputChange),

        /* PAYMENT SECTION */
        React.createElement(
          "h3",
          {
            style: {
              color: "var(--secondary)",
              marginTop: "30px",
              marginBottom: "12px",
            },
          },
          "Payment Method"
        ),

        React.createElement(
          "select",
          {
            value: formData.paymentMethod,
            onChange: (e) => handleInputChange("paymentMethod", e.target.value),
            style: {
              padding: "12px",
              width: "100%",
              borderRadius: "10px",
              border: "1px solid rgba(62,44,32,0.1)",
              marginBottom: "10px",
            },
          },
          React.createElement("option", null, "Cash on Delivery"),
          React.createElement("option", null, "UPI Payment"),
          React.createElement("option", null, "Card Payment")
        )
      ),

      /* ---------------- ORDER SUMMARY ---------------- */
      React.createElement(
        "div",
        {
          style: {
            padding: "20px",
            borderRadius: "16px",
            background: "linear-gradient(180deg,#fff,rgba(248,244,239,0.9))",
            border: "1px solid rgba(62,44,32,0.08)",
            boxShadow: "0 6px 20px rgba(62,44,32,0.05)",
          },
        },

        React.createElement(
          "h3",
          {
            style: {
              color: "var(--secondary)",
              marginBottom: "12px",
            },
          },
          "Order Summary"
        ),

        cartItems.map((item) =>
          React.createElement(
            "div",
            {
              key: item.id,
              style: {
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                fontSize: "15px",
              },
            },
            React.createElement(
              "span",
              null,
              `${item.name} x${item.quantity}`
            ),
            React.createElement(
              "span",
              null,
              `₹${item.price * item.quantity}`
            )
          )
        ),

        React.createElement("hr", null),

        React.createElement(
          "p",
          {
            style: {
              fontSize: "18px",
              marginTop: "12px",
              fontWeight: "600",
              color: "var(--accent)",
            },
          },
          `Total: ₹${total}`
        ),

        React.createElement(
          "button",
          {
            className: "add-btn",
            style: { marginTop: "16px", width: "100%", padding: "12px", fontSize: "16px" },
            onClick: handlePlaceOrder,
          },
          "Place Order"
        )
      )
    ),

    React.createElement(Footer)
    )
  );
}

/* ---------- Helper function for form inputs ---------- */
function createInput(placeholder, type, field, value, onChange) {
  return React.createElement("input", {
    placeholder,
    type,
    value: value || "",
    onChange: (e) => onChange(field, e.target.value),
    style: {
      padding: "12px",
      width: "100%",
      borderRadius: "10px",
      border: "1px solid rgba(62,44,32,0.1)",
      marginBottom: "10px",
    },
  });
}

export default CheckoutPage;
