import React, { useState, useEffect } from "react";
import Navbar from "../../shared/components/Navbar";
import { useAuth } from "../../shared/hooks/useAuth";
import apiService from "../../shared/services/api";
import Footer from "../../shared/components/Footer";

function UserProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
      fullName: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      newPassword: "",
      confirmPassword: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
        // Pre-fill from auth state immediately so user sees their info
        setProfile(prev => ({
            ...prev,
            fullName: user.name || "",
            email: user.email || "",
            phone: user.phone || ""
        }));
        
        // Then fetch full profile for address etc.
        fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
      if (!user?.id) return;
      try {
          const data = await apiService.getUserProfile(user.id);
          // Only update if we get real data back.
          // Note: Backend might return { name, email, phone, address, ... }
          // We need to map it correctly.
          if (data) {
              setProfile(prev => ({
                  ...prev,
                  fullName: data.name || prev.fullName,
                  email: data.email || prev.email,
                  phone: data.phone || prev.phone,
                  address: data.address || prev.address
              }));
          }
      } catch (err) {
          console.error("Profile fetch error", err);
      } finally {
          setLoading(false);
      }
  };

  const handleChange = (field, value) => {
      setProfile({ ...profile, [field]: value });
  };

  const handleSave = async () => {
      try {
          await apiService.updateUserProfile(user.id, profile);
          alert("Profile updated successfully!");
      } catch (err) {
          alert("Failed to update profile");
      }
  };

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Navbar),
    React.createElement(
      "div",
      { className: "container" },

    /* PAGE TITLE */
    React.createElement(
      "h2",
      {
        style: {
          marginTop: "30px",
          marginBottom: "20px",
          fontFamily: "'Playfair Display', serif",
          color: "var(--accent)",
        },
      },
      "Your Profile"
    ),

    /* MAIN PROFILE CARD */
    React.createElement(
      "div",
      {
        style: {
          padding: "24px",
          borderRadius: "16px",
          background: "linear-gradient(180deg,#fff,rgba(248,244,239,0.92))",
          border: "1px solid rgba(62,44,32,0.08)",
          boxShadow: "0 6px 20px rgba(62,44,32,0.05)",
          maxWidth: "700px",
          margin: "0 auto",
        },
      },
      loading ? React.createElement("p", null, "Loading profile...") : React.createElement("div", null,

      /* USER DETAILS */
      label("Full Name"),
      React.createElement("input", { type: "text", value: profile.fullName, onChange: (e) => handleChange("fullName", e.target.value), style: inputStyle }),

      label("Email Address"),
      React.createElement("input", { type: "email", value: profile.email, disabled: true, style: { ...inputStyle, background: "#f5f5f5" } }),

      label("Mobile Number"),
      React.createElement("input", { type: "text", value: profile.phone, onChange: (e) => handleChange("phone", e.target.value), style: inputStyle }),

      /* DELIVERY ADDRESS */
      label("Delivery Address"),
      React.createElement("textarea", {
        placeholder: "House No, Street, Landmark, City, Pincode",
        value: profile.address,
        onChange: (e) => handleChange("address", e.target.value),
        style: textarea,
      }),

      /* PASSWORD UPDATE */
      React.createElement(
        "div",
        { style: { marginTop: "20px", marginBottom: "10px" } },
        React.createElement(
          "h3",
          {
            style: {
              color: "var(--secondary)",
              marginBottom: "10px",
              fontSize: "18px",
            },
          },
          "Update Password"
        )
      ),

      React.createElement("input", { type: "password", placeholder: "Current password", style: inputStyle }),
      React.createElement("input", { type: "password", placeholder: "New password", style: inputStyle }),
      React.createElement("input", { type: "password", placeholder: "Confirm new password", style: inputStyle }),

      /* SAVE BUTTON */
      React.createElement(
        "button",
        {
          className: "cta",
          style: {
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            fontSize: "16px",
            marginTop: "12px",
          },
          onClick: handleSave,
        },
        "Save Changes"
      )
      )
    ),

    /* FOOTER */
    React.createElement(
        "div", 
        { style: { marginTop: "40px" } },
        React.createElement(Footer) 
    )
    )
  );
}

/* --- Helper UI Components --- */

function label(text) {
  return React.createElement(
    "label",
    {
      style: {
        display: "block",
        marginBottom: "6px",
        color: "var(--secondary)",
        fontWeight: "600",
      },
    },
    text
  );
}

function input(type, placeholder) {
  return React.createElement("input", {
    type,
    placeholder,
    style: inputStyle,
  });
}

/* Shared Styling */
const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid rgba(62,44,32,0.1)",
  marginBottom: "14px",
  fontSize: "15px",
};

const textarea = {
  width: "100%",
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid rgba(62,44,32,0.1)",
  height: "110px",
  marginBottom: "14px",
  resize: "vertical",
  fontSize: "15px",
};

export default UserProfilePage;
