import React, { useState } from "react";
import { useAuth } from "../../shared/hooks/useAuth";
import "../../shared/styles/auth.css";
import Navbar from "../../shared/components/Navbar";

function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login({ email, password });
      
      if (userData) {
        setShowSuccess(true);
        
        // Professional delay for animation
        setTimeout(() => {
          if (userData?.role === "admin") {
              window.location.href = "/admin/dashboard";
          } else if (userData?.role === "artisan") {
              window.location.href = "/artisan/dashboard";
          } else {
              window.location.href = "/";
          }
        }, 1500);
      }

    } catch (err) {
      console.error("Login failed:", err);
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
            background: "#4CAF50",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 30px rgba(76, 175, 80, 0.3)",
            marginBottom: "20px",
            animation: "pulseCheck 0.5s ease"
          }
        },
        React.createElement("svg", { width: "40", height: "40", viewBox: "0 0 24 24", fill: "none", stroke: "#fff", strokeWidth: "3" },
          React.createElement("polyline", { points: "20 6 9 17 4 12" })
        )
      ),
      React.createElement("h2", { style: { fontFamily: "'Playfair Display', serif", color: "var(--accent)", margin: "0 0 8px" } }, "Login Successful"),
      React.createElement("p", { style: { color: "var(--muted)", fontStyle: "italic" } }, "Welcome back to CraftConnect...")
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
      { className: "auth-container" },
      React.createElement(
        "div",
        { className: "auth-card" },
        React.createElement(
          "div",
          { className: "auth-header" },
          React.createElement(
            "h2",
            { className: "auth-title" },
            "Welcome Back"
          ),
          React.createElement(
            "p",
            { className: "auth-subtitle" },
            "Sign in to explore handcrafted goods & artisan stories."
          )
        ),
        React.createElement(
          "form",
          { className: "auth-form", onSubmit: handleSubmit },
          React.createElement(
            "div",
            { className: "auth-input-group" },
            React.createElement(
              "label",
              { className: "auth-label" },
              "Email Address"
            ),
            React.createElement("input", {
              className: "auth-input",
              type: "email",
              placeholder: "Enter your email",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              required: true,
            })
          ),
          React.createElement(
            "div",
            { className: "auth-input-group" },
            React.createElement(
              "label",
              { className: "auth-label" },
              "Password"
            ),
            React.createElement("input", {
              className: "auth-input",
              type: "password",
              placeholder: "Enter your password",
              value: password,
              onChange: (e) => setPassword(e.target.value),
              required: true,
            })
          ),
          error && React.createElement(
            "div",
            { style: { color: "crimson", fontSize: "14px", textAlign: "center" } },
            error
          ),
          React.createElement(
            "button",
            {
              className: "auth-button",
              type: "submit",
              disabled: loading,
            },
            loading ? "Signing In..." : "Sign In"
          )
        ),
        React.createElement(
          "div",
          { className: "auth-divider" },
          React.createElement("div", { className: "auth-divider-line" }),
          React.createElement("div", { className: "auth-divider-text" }, "OR"),
          React.createElement("div", { className: "auth-divider-line" })
        ),
        React.createElement(
          "div",
          {
            className: "auth-link",
            onClick: () => (window.location.href = "/register/user"),
          },
          "Create an Account"
        ),
        React.createElement(
          "div",
          {
            className: "auth-link",
            onClick: () => (window.location.href = "/register/artisan"),
          },
          "Become an Artisan"
        )
      )
    )
  );
}


export default UserLogin;
