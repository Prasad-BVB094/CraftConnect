import React, { useState } from "react";
import Navbar from "../../shared/components/Navbar";
import apiService from "../../shared/services/api";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
      
      // Alert and Redirect
      alert("Admin Login successful!");
      window.location.href = "/admin/dashboard";

    } catch (err) {
      console.error("Admin Login Failed:", err);
      // Fallback for dev/demo if backend is empty (Optional, but removed for strict realtime request)
      alert(err.message || "Invalid credentials. Please try again.");
      setLoading(false);
    }
  };

  return React.createElement(
    "div",
    null,
    React.createElement(Navbar),
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
