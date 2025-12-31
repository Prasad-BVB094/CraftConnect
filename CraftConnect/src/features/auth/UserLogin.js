import React, { useState } from "react";
import { useAuth } from "../../shared/hooks/useAuth";
import "../../shared/styles/auth.css";
import Navbar from "../../shared/components/Navbar";

function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login({ email, password });
      
      // Role-based redirect
      if (userData?.role === "admin") {
          window.location.href = "/admin/dashboard";
      } else if (userData?.role === "artisan") {
          window.location.href = "/artisan/dashboard";
      } else {
          window.location.href = "/";
      }

    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return React.createElement(
    "div",
    null,
    React.createElement(Navbar),
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
