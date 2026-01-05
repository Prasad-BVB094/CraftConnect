import React from "react";
import Navbar from "../../shared/components/Navbar";

import { useAuth } from "../../shared/hooks/useAuth";
import Footer from "../../shared/components/Footer";

function ArtisanLogin() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showSuccess, setShowSuccess] = React.useState(false);
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // In a real app, strict role checking would happen here or in backend
      const userData = await login({ email, password });
      if (userData) {
        setShowSuccess(true);
        setTimeout(() => {
          window.location.href = "/artisan/dashboard";
        }, 1500);
      }
    } catch (err) {
      console.error("Login failed", err);
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
            background: "#5C4033", // Artisan theme color
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 30px rgba(92, 64, 51, 0.3)",
            marginBottom: "20px",
            animation: "pulseCheck 0.5s ease"
          }
        },
        React.createElement("svg", { width: "40", height: "40", viewBox: "0 0 24 24", fill: "none", stroke: "#fff", strokeWidth: "3" },
          React.createElement("polyline", { points: "20 6 9 17 4 12" })
        )
      ),
      React.createElement("h2", { style: { fontFamily: "'Playfair Display', serif", color: "#5C4033", margin: "0 0 8px" } }, "Seller Central Login Successful"),
      React.createElement("p", { style: { color: "var(--muted)", fontStyle: "italic" } }, "Preparing your artisan dashboard...")
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
      { className: "container", style: { minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center" } },
      React.createElement(
        "div",
        { className: "login-wrapper" },
        React.createElement("h2", null, "Seller Central"),
        React.createElement(
          "p",
          null,
          "Log in to manage your products, orders, and artisan profile."
        ),
        React.createElement(
          "form",
          { onSubmit: handleSubmit },
          React.createElement(
            "div",
            { className: "login-row" },
            React.createElement("label", { className: "login-label" }, "Email Address"),
            React.createElement("input", {
              className: "login-input",
              type: "email",
              placeholder: "Enter your email",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              required: true
            })
          ),
          React.createElement(
            "div",
            { className: "login-row" },
            React.createElement("label", { className: "login-label" }, "Password"),
            React.createElement("input", {
              className: "login-input",
              type: "password",
              placeholder: "Enter your password",
              value: password,
              onChange: (e) => setPassword(e.target.value),
              required: true
            })
          ),
          error && React.createElement("div", { style: { color: "crimson", textAlign: "center", marginBottom: "10px" } }, error),
          React.createElement(
            "button",
            { className: "login-btn", type: "submit", disabled: loading },
            loading ? "Logging in..." : "Access Dashboard"
          )
        ),
        React.createElement(
          "div",
          { style: { marginTop: "24px", paddingTop: "20px", borderTop: "1px dashed rgba(166,138,100,0.2)" } },
          React.createElement("p", { style: { fontSize: "14px", marginBottom: "10px" } }, "New to CraftConnect?"),
          React.createElement(
            "div",
            { style: { display: "flex", gap: "12px", justifyContent: "center" } },
            React.createElement(
                "a", 
                { href: "/register/artisan", style: { fontSize: "14px", color: "var(--accent)", fontWeight: "600", textDecoration: "none" } }, 
                "Register as Artisan"
            )
          )
        )
      )
    ),
    React.createElement(Footer)
  );
}


export default ArtisanLogin;
