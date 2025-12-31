import React from "react";
import Navbar from "../../shared/components/Navbar";

import { useAuth } from "../../shared/hooks/useAuth";
import Footer from "../../shared/components/Footer";

function ArtisanLogin() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // In a real app, strict role checking would happen here or in backend
      await login({ email, password });
      window.location.href = "/artisan/dashboard";
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return React.createElement(
    "div",
    null,
    React.createElement(Navbar),
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
