import React, { useState } from "react";
import Navbar from "../../shared/components/Navbar";
import apiService from "../../shared/services/api";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      // Backend Login
      const response = await apiService.login({ email, password });
      
      // Expected response: { user: { role: 'admin', ... }, token: '...' }
      const { user, token } = response;

      if (!user || user.role !== 'admin') {
          alert("Access denied: Not an administrator account.");
          setLoading(false);
          return;
      }

      // Store Auth Data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      // Animation and Redirect
      setShowSuccess(true);
      setTimeout(() => {
        window.location.href = "/admin/dashboard";
      }, 1500);

    } catch (err) {
      console.error("Admin Login Failed:", err);
      alert(err.message || "Invalid credentials. Please try again.");
      setLoading(false);
    }
  };

  return React.createElement(
    "div",
    null,
    React.createElement(Navbar),

    /* Success Overlay */
    showSuccess && React.createElement(
      "div",
      {
        style: {
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(255, 255, 255, 0.95)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          animation: "fadeIn 0.4s ease"
        }
      },
      React.createElement(
        "div",
        {
          style: {
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "#2C3E50", // Admin theme color
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 30px rgba(44, 62, 80, 0.3)",
            marginBottom: "20px",
            animation: "pulseCheck 0.5s ease"
          }
        },
        React.createElement("svg", { width: "40", height: "40", viewBox: "0 0 24 24", fill: "none", stroke: "#fff", strokeWidth: "3" },
          React.createElement("polyline", { points: "20 6 9 17 4 12" })
        )
      ),
      React.createElement("h2", { style: { fontFamily: "'Playfair Display', serif", color: "#2C3E50", margin: "0 0 8px" } }, "Admin Authentication Successful"),
      React.createElement("p", { style: { color: "var(--muted)", fontStyle: "italic" } }, "Loading secure workspace...")
    ),

    /* CSS for Animation */
    React.createElement("style", null, `
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes pulseCheck { 
        0% { transform: scale(0.5); opacity: 0; }
        70% { transform: scale(1.1); }
        100% { transform: scale(1); opacity: 1; }
      }
    `),


    React.createElement(
      "div",
      { className: "container" },
      React.createElement(
        "div",
        { className: "login-wrapper" },
        React.createElement("h2", null, "Admin Access"),
        React.createElement(
          "p",
          null,
          "Restricted access — authorized admins only."
        ),
        React.createElement(
          "form",
          { onSubmit: handleSubmit },
          React.createElement(
            "div",
            { className: "login-row" },
            React.createElement("input", {
              className: "login-input",
              type: "text",
              placeholder: "Admin Email / ID",
              value: email,
              onChange: (e) => setEmail(e.target.value),
            })
          ),
          React.createElement(
            "div",
            { className: "login-row" },
            React.createElement("input", {
              className: "login-input",
              type: "password",
              placeholder: "Password",
              value: password,
              onChange: (e) => setPassword(e.target.value),
            })
          ),
          React.createElement(
            "button",
            { 
              className: "login-btn",
              type: "submit",
              disabled: loading,
              style: { opacity: loading ? 0.7 : 1 }
            },
            loading ? "Authenticating..." : "Enter Admin Panel"
          )
        ),
        React.createElement(
          "div",
          { className: "login-link" },
          "Forgot password?"
        )
      )
    )
  );
}


export default AdminLogin;
