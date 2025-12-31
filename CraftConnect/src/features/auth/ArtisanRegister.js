import React, { useState } from "react";
import { useAuth } from "../../shared/hooks/useAuth";
import "../../shared/styles/auth.css";
import Navbar from "../../shared/components/Navbar";

function ArtisanRegister() {
  const [formData, setFormData] = useState({
    name: "",
    village: "",
    craft: "",
    years: "",
    story: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  
  const { register, loading, error } = useAuth();

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    if (!formData.name || !formData.village || !formData.craft || !formData.story || 
        !formData.email || !formData.phone || !formData.password) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await register({ 
        ...formData, 
        role: "artisan" 
      });
      alert(`Registration submitted successfully!

Your application will be reviewed by admin within 24-48 hours.

You will receive an email at ${formData.email} once approved.`);
      window.location.href = "/login/user";
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return React.createElement(
    "div",
    null,
    React.createElement(Navbar),
    React.createElement(
      "div",
      { className: "auth-container", style: { padding: "40px" } },
      React.createElement(
        "div",
        { className: "auth-card", style: { maxWidth: "900px" } },
        React.createElement(
          "div",
          { className: "auth-header" },
          React.createElement(
            "h2",
            { className: "auth-title" },
            "Become an Artisan"
          ),
          React.createElement(
            "p",
            { className: "auth-subtitle" },
            "Share your craft, your story, and start selling on CraftConnect. Join a community of skilled artisans and reach customers who value authentic handmade products."
          )
        ),
        React.createElement(
          "form",
          { 
              className: "auth-form", 
              onSubmit: handleSubmit,
              style: { 
                  display: "grid", 
                  gridTemplateColumns: "1fr 1fr", 
                  gap: "24px",
                  alignItems: "start"
              }
          },
          React.createElement(
            "div",
            { className: "auth-input-group" },
            React.createElement(
              "label",
              { className: "auth-label" },
              "Your Name / Studio Name *"
            ),
            React.createElement("input", {
              className: "auth-input",
              type: "text",
              placeholder: "Enter your name or studio name",
              value: formData.name,
              onChange: (e) => handleChange("name", e.target.value),
              required: true,
            })
          ),
          React.createElement(
            "div",
            { className: "auth-input-group" },
            React.createElement(
              "label",
              { className: "auth-label" },
              "Village / Town *"
            ),
            React.createElement("input", {
              className: "auth-input",
              type: "text",
              placeholder: "Enter your village or town",
              value: formData.village,
              onChange: (e) => handleChange("village", e.target.value),
              required: true,
            })
          ),
          React.createElement(
            "div",
            { className: "auth-input-group" },
            React.createElement(
              "label",
              { className: "auth-label" },
              "Craft Category *"
            ),
            React.createElement("input", {
              className: "auth-input",
              type: "text",
              placeholder: "e.g. Pottery, Handloom, Woodcraft",
              value: formData.craft,
              onChange: (e) => handleChange("craft", e.target.value),
              required: true,
            })
          ),
          React.createElement(
            "div",
            { className: "auth-input-group" },
            React.createElement(
              "label",
              { className: "auth-label" },
              "Years of Experience *"
            ),
            React.createElement("input", {
              className: "auth-input",
              type: "number",
              placeholder: "Enter years of experience",
              value: formData.years,
              onChange: (e) => handleChange("years", e.target.value),
              required: true,
            })
          ),
            React.createElement(
            "div",
            { className: "auth-input-group", style: { gridColumn: "1 / -1" } },
            React.createElement(
              "label",
              { className: "auth-label" },
              "Your Story *"
            ),
            React.createElement("textarea", {
              className: "auth-textarea",
              placeholder: "What you make, your journey, your inspiration...",
              value: formData.story,
              onChange: (e) => handleChange("story", e.target.value),
              required: true,
            })
          ),
          React.createElement(
            "div",
            { className: "auth-input-group" },
            React.createElement(
              "label",
              { className: "auth-label" },
              "Email Address *"
            ),
            React.createElement("input", {
              className: "auth-input",
              type: "email",
              placeholder: "Enter your email address",
              value: formData.email,
              onChange: (e) => handleChange("email", e.target.value),
              required: true,
            })
          ),
          React.createElement(
            "div",
            { className: "auth-input-group" },
            React.createElement(
              "label",
              { className: "auth-label" },
              "Phone Number *"
            ),
            React.createElement("input", {
              className: "auth-input",
              type: "tel",
              placeholder: "Enter your phone number",
              value: formData.phone,
              onChange: (e) => handleChange("phone", e.target.value),
              required: true,
            })
          ),
            React.createElement(
            "div",
            { className: "auth-row", style: { gridColumn: "1 / -1" } },
            React.createElement(
              "div",
              { className: "auth-input-group" },
              React.createElement(
                "label",
                { className: "auth-label" },
                "Password *"
              ),
              React.createElement("input", {
                className: "auth-input",
                type: "password",
                placeholder: "Create a password",
                value: formData.password,
                onChange: (e) => handleChange("password", e.target.value),
                required: true,
              })
            ),
            React.createElement(
              "div",
              { className: "auth-input-group" },
              React.createElement(
                "label",
                { className: "auth-label" },
                "Confirm Password *"
              ),
              React.createElement("input", {
                className: "auth-input",
                type: "password",
                placeholder: "Confirm your password",
                value: formData.confirmPassword,
                onChange: (e) => handleChange("confirmPassword", e.target.value),
                required: true,
              })
            )
          ),
          error && React.createElement(
            "div",
            { style: { color: "crimson", fontSize: "14px", textAlign: "center", gridColumn: "1 / -1" } },
            error
          ),
          React.createElement(
            "div",
            { style: { gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "16px" } },
            React.createElement(
                "button",
                {
                className: "auth-button",
                type: "submit",
                disabled: loading,
                },
                loading ? "Submitting..." : "Submit Application"
            ),
            React.createElement(
                "div",
                {
                className: "auth-link",
                onClick: () => (window.location.href = "/login/user"),
                },
                "Already have an account? Sign In"
            )
        )
    )
      )
    )
  );
}

export default ArtisanRegister;
