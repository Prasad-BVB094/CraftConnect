import React, { useState, useEffect } from "react";
import Navbar from "../../shared/components/Navbar";
import { useCart } from "../../shared/context/CartContext";
import { useAuth } from "../../shared/hooks/useAuth";
import apiService from "../../shared/services/api";
import Footer from "../../shared/components/Footer";

// Indian States and Union Territories
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry", "Chandigarh",
  "Andaman and Nicobar Islands", "Dadra and Nagar Haveli", "Daman and Diu", "Lakshadweep"
];

// Major Indian Cities
const INDIAN_CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata",
  "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal",
  "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara", "Ghaziabad", "Ludhiana",
  "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivli", "Vasai-Virar",
  "Varanasi", "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", "Navi Mumbai",
  "Allahabad", "Ranchi", "Howrah", "Coimbatore", "Jabalpur", "Gwalior", "Vijayawada",
  "Jodhpur", "Madurai", "Raipur", "Kota", "Guwahati", "Chandigarh", "Solapur",
  "Hubli-Dharwad", "Bareilly", "Moradabad", "Mysore", "Gurgaon", "Aligarh",
  "Jalandhar", "Tiruchirappalli", "Bhubaneswar", "Salem", "Warangal", "Guntur",
  "Bhiwandi", "Saharanpur", "Gorakhpur", "Bikaner", "Amravati", "Noida",
  "Jamshedpur", "Bhilai", "Cuttack", "Firozabad", "Kochi", "Nellore", "Bhavnagar",
  "Dehradun", "Durgapur", "Asansol", "Rourkela", "Nanded", "Kolhapur", "Ajmer",
  "Akola", "Gulbarga", "Jamnagar", "Ujjain", "Loni", "Siliguri", "Jhansi",
  "Ulhasnagar", "Jammu", "Sangli-Miraj", "Mangalore", "Erode", "Belgaum", "Ambattur",
  "Tirunelveli", "Malegaon", "Gaya", "Jalgaon", "Udaipur", "Maheshtala"
];

function CheckoutPage() {
  const { user } = useAuth();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: "",
    email: "",
    phone: "",
    altPhone: "",
    // Shipping Address
    address1: "",
    address2: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    // Additional
    deliveryInstructions: "",
    giftMessage: "",
    isGift: false,
    deliveryType: "standard",
    paymentMethod: "razorpay",
  });

  const total = getCartTotal();
  const shipping = total > 999 ? 0 : 99;
  const grandTotal = total + shipping;

  // Auto-fill user info on mount
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || "",
        email: user.email || "",
        phone: user.phone || ""
      }));
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user types
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: false });
    }
  };

  // Razorpay payment handler
  const handleRazorpayPayment = async (orderIdVal) => {
    try {
      const paymentData = await apiService.createPaymentOrder(orderIdVal);
      
      const options = {
        key: paymentData.key,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: "CraftConnect",
        description: "Order Payment",
        image: "https://craftconnect.in/logo.png",
        order_id: paymentData.razorpayOrderId,
        handler: async function (response) {
          try {
            await apiService.verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
            // Show success modal with animation
            setOrderId(orderIdVal);
            setShowSuccessModal(true);
            clearCart();
            // Redirect after animation
            setTimeout(() => {
              window.location.href = "/orders";
            }, 3500);
          } catch (err) {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#A68A64"
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      alert("Failed to initiate payment. Please try again.");
      setIsProcessing(false);
    }
  };

  const handlePlaceOrder = async () => {
    // Validate required fields
    const requiredFields = ['fullName', 'email', 'phone', 'address1', 'city', 'state', 'pincode'];
    const errors = {};
    let hasError = false;
    
    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].trim() === '') {
        errors[field] = true;
        hasError = true;
      }
    });
    
    if (hasError) {
      setFormErrors(errors);
      // Scroll to first error
      window.scrollTo({ top: 200, behavior: 'smooth' });
      return;
    }
    
    setFormErrors({});

    setIsProcessing(true);
    
    try {
      // Format order data to match backend schema
      const orderData = {
        shippingAddress: {
          address: formData.address1 + (formData.address2 ? ", " + formData.address2 : ""),
          landmark: formData.landmark,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country || "India"
        },
        customerPhone: formData.phone,
        customerAltPhone: formData.altPhone,
        deliveryType: formData.deliveryType,
        deliveryInstructions: formData.deliveryInstructions,
        paymentMethod: formData.paymentMethod,
        isGift: formData.isGift,
        giftMessage: formData.giftMessage,
        customizationRequest: localStorage.getItem('pending_customization') || ""
      };

      const order = await apiService.createOrder(orderData);
      
      if (formData.paymentMethod === "razorpay") {
        await handleRazorpayPayment(order._id || order.id || order.order?._id);
      } else {
        // COD - show success
        setOrderId(order._id || order.id || order.order?._id);
        setShowSuccessModal(true);
        clearCart();
        localStorage.removeItem('pending_customization');
        setTimeout(() => {
          window.location.href = "/orders";
        }, 3500);
      }
    } catch (err) {
      console.error("Order error:", err);
      alert("Failed to place order: " + (err.message || "Please try again."));
    }
    
    setIsProcessing(false);
  };

  // Helper function to create form section (NOT a component to avoid focus loss)
  const createFormSection = (title, icon, ...children) => React.createElement(
    "div",
    {
      style: {
        background: "#fff",
        borderRadius: "16px",
        padding: "24px",
        marginBottom: "24px",
        border: "1px solid rgba(166,138,100,0.1)",
        boxShadow: "0 4px 20px rgba(62,44,32,0.04)"
      }
    },
    React.createElement(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
          paddingBottom: "16px",
          borderBottom: "1px solid rgba(166,138,100,0.1)"
        }
      },
      React.createElement("div", {
        style: {
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, var(--accent), #8B6F47)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "16px"
        }
      }, icon),
      React.createElement("h3", {
        style: { color: "var(--accent)", fontFamily: "'Playfair Display', serif", fontSize: "20px", margin: 0 }
      }, title)
    ),
    ...children
  );

  // Helper function for field rows
  const createFieldRow = (...children) => React.createElement(
    "div",
    { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", marginBottom: "16px" } },
    ...children
  );

  // Helper function for input fields (NOT a component)
  const createFormField = (label, type, field, value, required, placeholder) => {
    const hasError = formErrors[field];
    return React.createElement(
      "div",
      { style: { marginBottom: "16px" } },
      React.createElement("label", {
        style: { display: "block", fontSize: "13px", color: hasError ? "#e74c3c" : "var(--muted)", marginBottom: "6px", fontWeight: "500" }
      }, label, required && React.createElement("span", { style: { color: "#e74c3c" } }, " *")),
      React.createElement("input", {
        type,
        value: value || "",
        placeholder: placeholder || "",
        onChange: (e) => handleInputChange(field, e.target.value),
        style: {
          width: "100%",
          padding: "14px 16px",
          borderRadius: "10px",
          border: hasError ? "2px solid #e74c3c" : "1px solid rgba(166,138,100,0.2)",
          fontSize: "15px",
          transition: "border 0.2s ease",
          outline: "none",
          background: hasError ? "rgba(231,76,60,0.05)" : "#fff"
        }
      }),
      hasError && React.createElement("span", {
        style: { fontSize: "12px", color: "#e74c3c", marginTop: "4px", display: "block" }
      }, "This field is required")
    );
  };

  // Helper function for autocomplete fields (City/State)
  const createAutoCompleteField = (label, field, value, options, required) => {
    const hasError = formErrors[field];
    const listId = `${field}-list`;
    return React.createElement(
      "div",
      { style: { marginBottom: "16px" } },
      React.createElement("label", {
        style: { display: "block", fontSize: "13px", color: hasError ? "#e74c3c" : "var(--muted)", marginBottom: "6px", fontWeight: "500" }
      }, label, required && React.createElement("span", { style: { color: "#e74c3c" } }, " *")),
      React.createElement("input", {
        type: "text",
        list: listId,
        value: value || "",
        placeholder: `Start typing to search ${label}...`,
        onChange: (e) => handleInputChange(field, e.target.value),
        style: {
          width: "100%",
          padding: "14px 16px",
          borderRadius: "10px",
          border: hasError ? "2px solid #e74c3c" : "1px solid rgba(166,138,100,0.2)",
          fontSize: "15px",
          transition: "border 0.2s ease",
          outline: "none",
          background: hasError ? "rgba(231,76,60,0.05)" : "#fff"
        }
      }),
      React.createElement("datalist", { id: listId },
        options
          .filter(opt => opt.toLowerCase().includes((value || "").toLowerCase()))
          .slice(0, 10) // Limit suggestions
          .map(opt => React.createElement("option", { key: opt, value: opt }))
      ),
      hasError && React.createElement("span", {
        style: { fontSize: "12px", color: "#e74c3c", marginTop: "4px", display: "block" }
      }, "This field is required")
    );
  };

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

      /* Page Header */
      React.createElement(
        "div",
        { style: { textAlign: "center", marginBottom: "40px" } },
        React.createElement("h1", {
          style: {
            fontFamily: "'Playfair Display', serif",
            fontSize: "36px",
            color: "var(--accent)",
            marginBottom: "8px"
          }
        }, "Checkout"),
        React.createElement("p", {
          style: { color: "var(--muted)", fontSize: "16px" }
        }, "Complete your order in a few simple steps")
      ),

      /* Progress Steps */
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            justifyContent: "center",
            gap: "60px",
            marginBottom: "40px"
          }
        },
        ["Shipping", "Review", "Payment"].map((step, i) =>
          React.createElement(
            "div",
            {
              key: i,
              style: {
                display: "flex",
                alignItems: "center",
                gap: "10px",
                opacity: currentStep >= i + 1 ? 1 : 0.4
              }
            },
            React.createElement("div", {
              style: {
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: currentStep >= i + 1 ? "linear-gradient(135deg, var(--accent), #8B6F47)" : "#ddd",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "600",
                fontSize: "14px"
              }
            }, i + 1),
            React.createElement("span", {
              style: { fontWeight: currentStep === i + 1 ? "600" : "400", color: "var(--text)" }
            }, step)
          )
        )
      ),

      /* Main Layout */
      React.createElement(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns: "1fr 400px",
            gap: "40px"
          }
        },

        /* Left Column - Form Sections */
        React.createElement(
          "div",
          null,

          /* Personal Information */
          createFormSection("Personal Information", React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" }, React.createElement("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }), React.createElement("circle", { cx: "12", cy: "7", r: "4" })),
            createFieldRow(
              createFormField("Full Name", "text", "fullName", formData.fullName, true),
              createFormField("Email Address", "email", "email", formData.email, true)
            ),
            createFieldRow(
              createFormField("Phone Number", "tel", "phone", formData.phone, true),
              createFormField("Alternate Phone", "tel", "altPhone", formData.altPhone, false, "Optional")
            )
          ),

          /* Shipping Address */
          createFormSection("Shipping Address", "📍",
            createFormField("Address Line 1", "text", "address1", formData.address1, true, "House/Flat No., Building Name"),
            createFormField("Address Line 2", "text", "address2", formData.address2, false, "Street, Area (Optional)"),
            createFieldRow(
              createFormField("Landmark", "text", "landmark", formData.landmark, false, "Near..."),
              createAutoCompleteField("City", "city", formData.city, INDIAN_CITIES, true)
            ),
            createFieldRow(
              createAutoCompleteField("State", "state", formData.state, INDIAN_STATES, true),
              createFormField("Pincode", "text", "pincode", formData.pincode, true)
            ),
            createFormField("Country", "text", "country", formData.country)
          ),

          /* Delivery Options */
          createFormSection("Delivery Options", "🚚",
            React.createElement(
              "div",
              { style: { display: "flex", gap: "16px" } },
              [
                { id: "standard", label: "Standard Delivery", desc: "5-7 business days", price: "Free over ₹999" },
                { id: "express", label: "Express Delivery", desc: "2-3 business days", price: "+₹149" }
              ].map(option =>
                React.createElement(
                  "label",
                  {
                    key: option.id,
                    style: {
                      flex: 1,
                      padding: "16px",
                      borderRadius: "12px",
                      border: formData.deliveryType === option.id ? "2px solid var(--accent)" : "1px solid rgba(166,138,100,0.2)",
                      background: formData.deliveryType === option.id ? "rgba(166,138,100,0.05)" : "#fff",
                      cursor: "pointer"
                    }
                  },
                  React.createElement("input", {
                    type: "radio",
                    name: "deliveryType",
                    value: option.id,
                    checked: formData.deliveryType === option.id,
                    onChange: (e) => handleInputChange("deliveryType", e.target.value),
                    style: { display: "none" }
                  }),
                  React.createElement("div", { style: { fontWeight: "600", marginBottom: "4px" } }, option.label),
                  React.createElement("div", { style: { fontSize: "13px", color: "var(--muted)" } }, option.desc),
                  React.createElement("div", { style: { fontSize: "13px", color: "var(--accent)", marginTop: "4px" } }, option.price)
                )
              )
            ),
            React.createElement("textarea", {
              placeholder: "Delivery instructions (e.g., Leave at door, Call before delivery...)",
              value: formData.deliveryInstructions,
              onChange: (e) => handleInputChange("deliveryInstructions", e.target.value),
              style: {
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                border: "1px solid rgba(166,138,100,0.2)",
                marginTop: "16px",
                fontSize: "14px",
                resize: "vertical",
                minHeight: "80px"
              }
            })
          ),

          /* Gift Option */
          createFormSection("Gift Options", "🎁",
            React.createElement(
              "label",
              {
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  cursor: "pointer",
                  marginBottom: "16px"
                }
              },
              React.createElement("input", {
                type: "checkbox",
                checked: formData.isGift,
                onChange: (e) => handleInputChange("isGift", e.target.checked),
                style: { width: "18px", height: "18px", accentColor: "var(--accent)" }
              }),
              React.createElement("span", null, "This order is a gift")
            ),
            formData.isGift && React.createElement("textarea", {
              placeholder: "Add a personal message for the recipient...",
              value: formData.giftMessage,
              onChange: (e) => handleInputChange("giftMessage", e.target.value),
              style: {
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                border: "1px solid rgba(166,138,100,0.2)",
                fontSize: "14px",
                resize: "vertical",
                minHeight: "80px"
              }
            })
          )
        ),

        /* Right Column - Order Summary */
        React.createElement(
          "div",
          null,
          React.createElement(
            "div",
            {
              style: {
                background: "linear-gradient(180deg, #fff, rgba(248,244,239,0.95))",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid rgba(166,138,100,0.1)",
                boxShadow: "0 8px 30px rgba(62,44,32,0.08)",
                position: "sticky",
                top: "20px"
              }
            },

            React.createElement("h3", {
              style: { fontFamily: "'Playfair Display', serif", fontSize: "22px", color: "var(--accent)", marginBottom: "20px" }
            }, "Order Summary"),

            /* Cart Items */
            cartItems.map((item) =>
              React.createElement(
                "div",
                {
                  key: item.id,
                  style: {
                    display: "flex",
                    gap: "12px",
                    paddingBottom: "12px",
                    marginBottom: "12px",
                    borderBottom: "1px solid rgba(166,138,100,0.1)"
                  }
                },
                React.createElement("img", {
                  src: item.image,
                  alt: item.name,
                  style: { width: "60px", height: "60px", borderRadius: "8px", objectFit: "cover" }
                }),
                React.createElement(
                  "div",
                  { style: { flex: 1 } },
                  React.createElement("div", { style: { fontWeight: "500", fontSize: "14px" } }, item.name),
                  React.createElement("div", { style: { fontSize: "13px", color: "var(--muted)" } }, `Qty: ${item.quantity}`),
                  React.createElement("div", { style: { fontWeight: "600", color: "var(--accent)" } }, `₹${item.price * item.quantity}`)
                )
              )
            ),

            /* Price Breakdown */
            React.createElement(
              "div",
              { style: { marginTop: "20px" } },
              React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" } },
                React.createElement("span", { style: { color: "var(--muted)" } }, "Subtotal"),
                React.createElement("span", null, `₹${total}`)
              ),
              React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" } },
                React.createElement("span", { style: { color: "var(--muted)" } }, "Shipping"),
                React.createElement("span", { style: { color: shipping === 0 ? "#27ae60" : "inherit" } }, shipping === 0 ? "FREE" : `₹${shipping}`)
              ),
              formData.deliveryType === "express" && React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" } },
                React.createElement("span", { style: { color: "var(--muted)" } }, "Express Delivery"),
                React.createElement("span", null, "₹149")
              ),
              React.createElement("hr", { style: { border: "none", borderTop: "1px solid rgba(166,138,100,0.2)", margin: "16px 0" } }),
              React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "20px", fontWeight: "bold" } },
                React.createElement("span", null, "Total"),
                React.createElement("span", { style: { color: "var(--accent)" } }, `₹${grandTotal + (formData.deliveryType === "express" ? 149 : 0)}`)
              )
            ),

            /* Payment Method */
            React.createElement(
              "div",
              { style: { marginTop: "24px", padding: "16px", background: "rgba(166,138,100,0.05)", borderRadius: "12px" } },
              React.createElement("label", { style: { fontSize: "13px", fontWeight: "600", marginBottom: "12px", display: "block" } }, "Payment Method"),
              [
                { id: "razorpay", label: "Pay with Razorpay", desc: "Cards, UPI, NetBanking, Wallets" },
                { id: "cod", label: "Cash on Delivery", desc: "Pay when you receive" }
              ].map(method =>
                React.createElement(
                  "label",
                  {
                    key: method.id,
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px",
                      borderRadius: "8px",
                      marginBottom: "8px",
                      background: formData.paymentMethod === method.id ? "rgba(166,138,100,0.1)" : "transparent",
                      cursor: "pointer"
                    }
                  },
                  React.createElement("input", {
                    type: "radio",
                    name: "paymentMethod",
                    value: method.id,
                    checked: formData.paymentMethod === method.id,
                    onChange: (e) => handleInputChange("paymentMethod", e.target.value),
                    style: { accentColor: "var(--accent)" }
                  }),
                  React.createElement(
                    "div",
                    null,
                    React.createElement("div", { style: { fontWeight: "500", fontSize: "14px" } }, method.label),
                    React.createElement("div", { style: { fontSize: "12px", color: "var(--muted)" } }, method.desc)
                  )
                )
              )
            ),

            /* Place Order Button */
            React.createElement(
              "button",
              {
                onClick: handlePlaceOrder,
                disabled: isProcessing,
                style: {
                  width: "100%",
                  padding: "16px",
                  marginTop: "24px",
                  background: isProcessing ? "#ccc" : "linear-gradient(135deg, var(--accent), #8B6F47)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: isProcessing ? "not-allowed" : "pointer",
                  transition: "transform 0.2s ease"
                }
              },
              isProcessing ? "Processing..." : `Pay ₹${grandTotal + (formData.deliveryType === "express" ? 149 : 0)}`
            ),

            /* Security Note */
            React.createElement(
              "div",
              { style: { marginTop: "16px", textAlign: "center", fontSize: "12px", color: "var(--muted)" } },
              React.createElement('svg', { width: '14', height: '14', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', style: { verticalAlign: 'middle', marginRight: '6px' } },
                React.createElement('rect', { x: '3', y: '11', width: '18', height: '11', rx: '2', ry: '2' }),
                React.createElement('path', { d: 'M7 11V7a5 5 0 0 1 10 0v4' })
              ),
              "Secure checkout. Your data is protected."
            )
          )
        )
      )
    ),

    /* Payment Success Modal with Animation */
    showSuccessModal && React.createElement(
      "div",
      {
        style: {
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.8)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "fadeIn 0.5s ease"
        }
      },
      /* Confetti Animation CSS */
      React.createElement("style", null, `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0); } to { transform: scale(1); } }
        @keyframes checkmark { 0% { stroke-dashoffset: 100; } 100% { stroke-dashoffset: 0; } }
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(400px) rotate(720deg); opacity: 0; }
        }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
      `),
      /* Confetti Particles */
      ...Array(20).fill(null).map((_, i) => 
        React.createElement("div", {
          key: `confetti-${i}`,
          style: {
            position: "absolute",
            width: "10px",
            height: "10px",
            borderRadius: i % 2 === 0 ? "50%" : "0",
            background: ["#FFD700", "#A68A64", "#FF6B6B", "#4ECDC4", "#45B7D1"][i % 5],
            left: `${10 + (i * 4)}%`,
            top: "-20px",
            animation: `confetti ${2 + (i % 3)}s ease ${i * 0.1}s forwards`
          }
        })
      ),
      /* Success Card */
      React.createElement(
        "div",
        {
          style: {
            background: "linear-gradient(180deg, #fff, #F8F4EF)",
            borderRadius: "24px",
            padding: "50px 60px",
            textAlign: "center",
            animation: "scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.3)",
            maxWidth: "420px"
          }
        },
        /* Animated Checkmark Circle */
        React.createElement(
          "div",
          {
            style: {
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #4CAF50, #45a049)",
              margin: "0 auto 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "scaleIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.2s backwards, pulse 2s ease 1s infinite"
            }
          },
          React.createElement("svg", { width: "50", height: "50", viewBox: "0 0 24 24", fill: "none", stroke: "#fff", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round" },
            React.createElement("polyline", { 
              points: "20 6 9 17 4 12",
              style: { strokeDasharray: 100, animation: "checkmark 0.8s ease 0.5s forwards" }
            })
          )
        ),
        /* Success Text */
        React.createElement("h2", {
          style: {
            fontFamily: "'Playfair Display', serif",
            fontSize: "32px",
            color: "#4CAF50",
            marginBottom: "12px"
          }
        }, "Payment Successful!"),
        React.createElement("p", {
          style: {
            color: "var(--muted)",
            fontSize: "16px",
            marginBottom: "24px",
            lineHeight: "1.6"
          }
        }, "Your order has been confirmed and will be processed shortly."),
        /* Order ID */
        React.createElement("div", {
          style: {
            padding: "12px 20px",
            background: "rgba(166,138,100,0.1)",
            borderRadius: "10px",
            display: "inline-block"
          }
        },
          React.createElement("span", { style: { fontSize: "14px", color: "var(--muted)" } }, "Order ID: "),
          React.createElement("span", { style: { fontWeight: "bold", color: "var(--accent)" } }, orderId ? orderId.slice(-8).toUpperCase() : "")
        ),
        /* Redirect Message */
        React.createElement("p", {
          style: {
            marginTop: "24px",
            fontSize: "14px",
            color: "var(--muted)"
          }
        }, "Redirecting to your orders...")
      )
    ),

    React.createElement(Footer)
  );
}

export default CheckoutPage;
