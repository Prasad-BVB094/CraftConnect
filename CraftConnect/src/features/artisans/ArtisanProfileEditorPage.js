import React, { useState, useEffect } from "react";
import Navbar from "../../shared/components/Navbar";
import Footer from "../../shared/components/Footer";
import { useAuth } from "../../shared/hooks/useAuth";
import apiService from "../../shared/services/api";

function VendorProfilePage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
      name: "",
      address: "",
      craft: "",
      story: ""
  });
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
      fetchCategories();
    }
  }, [user]);


  const fetchProfile = async () => {
      try {
          // If backend was real, we'd fetch profile here
          // const data = await apiService.getVendorById(user.id);
          // For now, init with mock/user data
          setFormData({
              name: user?.name || "",
              address: user?.address || "",
              craft: "", // Mock default
              story: ""
          });
      } catch (err) {
          console.error(err);
      }
  };
  const fetchCategories = async () => {
    try {
      const data = await apiService.getCategories();
      setCategories(data || []);
    } catch (err) {
      console.error("Failed to fetch categories");
      setCategories([]);
    }
  };

  function handleImage(e) {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  }

  const handleSave = async () => {
      try {
          await apiService.updateUserProfile(user.id, formData);
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
      "Your Artisan Profile"
    ),

    /* TWO COLUMN LAYOUT */
    React.createElement(
      "div",
      {
        style: {
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "30px",
        },
      },

      /* LEFT: PHOTO CARD */
      React.createElement(
        "div",
        profileCardStyle,
        React.createElement(
          "h3",
          { style: subTitleStyle },
          "Profile Photo"
        ),

        preview
          ? React.createElement("img", {
              src: preview,
              style: profileImgStyle,
            })
          : React.createElement("div", {
              style: {
                ...profileImgStyle,
                display: "grid",
                placeItems: "center",
                color: "var(--muted)",
                fontSize: "14px",
              },
              children: "No image uploaded",
            }),

        React.createElement("input", {
          type: "file",
          accept: "image/*",
          onChange: handleImage,
          style: { marginTop: "10px" },
        })
      ),

      /* RIGHT: DETAILS FORM */
      React.createElement(
        "div",
        profileCardStyle,

        React.createElement(
          "h3",
          { style: subTitleStyle },
          "Artisan Details"
        ),

        inputField("Artisan / Studio Name", "text", formData.name, (v) => setFormData({...formData, name: v})),
        inputField("Village / Town", "text", formData.address, (v) => setFormData({...formData, address: v})),

        /* CATEGORY SELECT */
      React.createElement(
        "select",
        {
          style: selectStyle,
          value: formData.craft,
          onChange: (e) =>
            setFormData({ ...formData, craft: e.target.value }),
        },
        React.createElement(
          "option",
          { value: "" },
          "Select Craft Category"
        ),
        categories.map((cat) =>
          React.createElement(
            "option",
            { key: cat._id, value: cat._id },
            cat.name
          )
        )
      ),

        /* STORY SECTION */
        React.createElement("textarea", {
          placeholder:
            "Share your generational story…\nAbout your craft, inspiration, materials, or heritage.",
          style: textareaStyle,
          value: formData.story,
          onChange: (e) => setFormData({...formData, story: e.target.value})
        }),

        /* SAVE BUTTON */
        React.createElement(
          "button",
          {
            className: "add-btn",
            style: {
              width: "100%",
              padding: "14px",
              fontSize: "16px",
              marginTop: "10px",
            },
            onClick: handleSave,
          },
          "Save Profile"
        )
      )
    ),

    /* FOOTER */
    React.createElement(Footer)
    )
  );
}

/* ---- Shared Styles ---- */

const profileCardStyle = {
  padding: "20px",
  borderRadius: "16px",
  background: "linear-gradient(180deg,#fff,rgba(248,244,239,0.9))",
  border: "1px solid rgba(62,44,32,0.08)",
  boxShadow: "0 6px 20px rgba(62,44,32,0.05)",
};

const subTitleStyle = {
  color: "var(--secondary)",
  marginBottom: "12px",
  fontSize: "18px",
};

const profileImgStyle = {
  width: "100%",
  height: "260px",
  objectFit: "cover",
  borderRadius: "14px",
  border: "1px solid rgba(62,44,32,0.1)",
};

const textareaStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid rgba(62,44,32,0.1)",
  height: "140px",
  resize: "vertical",
  marginBottom: "14px",
};

const selectStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid rgba(62,44,32,0.1)",
  marginBottom: "14px",
  fontSize: "15px",
};

function inputField(placeholder, type, value, onChange) {
  return React.createElement("input", {
    type,
    placeholder,
    value: value || "",
    onChange: (e) => onChange(e.target.value),
    style: {
      padding: "12px",
      width: "100%",
      borderRadius: "10px",
      border: "1px solid rgba(62,44,32,0.1)",
      marginBottom: "14px",
      fontSize: "15px",
    },
  });
}

export default VendorProfilePage;
