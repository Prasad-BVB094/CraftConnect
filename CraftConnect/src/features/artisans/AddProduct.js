import React, { useState } from "react";
import Navbar from "../../shared/components/Navbar";

function AddProductPage() {
  const [preview, setPreview] = useState(null);

  function handleImage(e) {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  }

  return React.createElement(
    "div",
    { className: "container" },

    React.createElement(Navbar),

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
      "Add New Product"
    ),

    /* MAIN FORM CARD */
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

      /* PRODUCT NAME */
      label("Product Name"),
      input("text"),

      /* DESCRIPTION */
      label("Product Description"),
      React.createElement("textarea", { placeholder: "Product description", style: textareaStyle }),

      /* CATEGORY SELECT */
      label("Category"),
      React.createElement(
        "select",
        { style: selectStyle },
        React.createElement("option", null, "Select Category"),
        React.createElement("option", null, "Pottery"),
        React.createElement("option", null, "Handloom"),
        React.createElement("option", null, "Woodcraft"),
        React.createElement("option", null, "Bamboo"),
        React.createElement("option", null, "Jewelry")
      ),

      /* PRICE */
      label("Price (₹)"),
      input("number"),

      /* STOCK */
      label("Available Stock"),
      input("number"),

      /* IMAGE UPLOAD */
      label("Upload Product Image"),
      React.createElement("input", {
        type: "file",
        accept: "image/*",
        onChange: handleImage,
        style: { marginBottom: "16px" },
      }),

      preview &&
        React.createElement("img", {
          src: preview,
          alt: "Preview",
          style: {
            width: "100%",
            height: "220px",
            objectFit: "cover",
            borderRadius: "14px",
            marginBottom: "20px",
            border: "1px solid rgba(62,44,32,0.1)",
          },
        }),

      /* ARTISAN STORY */
      label("Artisan Story Behind This Product"),
      React.createElement("textarea", {
        placeholder: "Share a short story behind your craft...",
        style: textareaStyle,
      }),

      /* SUBMIT BUTTON */
      React.createElement(
        "button",
        {
          className: "cta",
          style: {
            width: "100%",
            padding: "14px",
            fontSize: "16px",
            marginTop: "12px",
            borderRadius: "12px",
          },
          onClick: () => alert("Product added successfully! (Backend pending)"),
        },
        "Add Product"
      )
    ),

    /* FOOTER */
    React.createElement(
      "footer",
      { style: { marginTop: "40px" } },
      React.createElement("div", null, "© CraftConnect — handcrafted community"),
      React.createElement("div", null, "Made with ❤️ | Beige & brown theme")
    )
  );
}

/* ---------- Helper UI ---------- */

function label(text) {
  return React.createElement(
    "label",
    {
      style: {
        display: "block",
        marginBottom: "6px",
        color: "var(--secondary)",
        fontWeight: "600",
        fontSize: "14px",
      },
    },
    text
  );
}

function input(type) {
  return React.createElement("input", {
    type,
    placeholder: type === "number" ? "" : "Enter value",
    style: inputStyle,
  });
}

const inputStyle = {
  padding: "12px",
  width: "100%",
  borderRadius: "10px",
  border: "1px solid rgba(62,44,32,0.1)",
  marginBottom: "14px",
  fontSize: "15px",
};

const textareaStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid rgba(62,44,32,0.1)",
  height: "100px",
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

export default AddProductPage;
