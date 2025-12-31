import React from "react";
import Navbar from "../../shared/components/Navbar";
import { useEffect, useState } from "react";
import apiService from "../../shared/services/api";
import { useAuth } from "../../shared/hooks/useAuth";


function MyProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
      const fetchProducts = async () => {
        try {
          const data = await apiService.getArtisanProducts(user?.id);
          setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error("Failed to fetch products", err);
          setProducts([]);
        } finally {
          setLoading(false);
        }
      };

      if (user?.id) fetchProducts();
    }, [user]);


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
      "My Products"
    ),

    /* ADD NEW PRODUCT BUTTON */
    React.createElement(
      "button",
      {
        className: "cta",
        style: {
          marginBottom: "20px",
          padding: "12px 18px",
          borderRadius: "12px",
        },
        onClick: () => (window.location.href = "/vendor/add-product"),
      },
      "+ Add New Product"
    ),

/* PRODUCT GRID */
React.createElement(
  "div",
  {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "18px",
    },
  },
  loading
    ? React.createElement(
        "p",
        { style: { color: "var(--muted)" } },
        "Loading products..."
      )
    : products.length === 0
    ? React.createElement(
        "p",
        { style: { color: "var(--muted)" } },
        "No products found."
      )
    : products.map((p) =>
        React.createElement(
          "div",
          {
            key: p._id,
            style: {
              background: "linear-gradient(180deg,#fff,rgba(248,244,239,0.96))",
              border: "1px solid rgba(62,44,32,0.08)",
              borderRadius: "16px",
              padding: "14px",
              boxShadow: "0 6px 20px rgba(62,44,32,0.05)",
            },
          },

          /* IMAGE */
          React.createElement("img", {
            src: p.images?.[0]
              ? p.images[0].startsWith("http")
                ? p.images[0]
                : `http://localhost:3001${p.images[0]}`
              : "https://via.placeholder.com/300x200",
            alt: p.title,
            style: {
              width: "100%",
              height: "160px",
              borderRadius: "12px",
              objectFit: "cover",
              marginBottom: "12px",
            },
          }),

          /* NAME */
          React.createElement(
            "div",
            {
              style: {
                fontWeight: "600",
                color: "var(--accent)",
                marginBottom: "6px",
              },
            },
            p.title
          ),

          /* META */
          React.createElement(
            "div",
            {
              style: {
                fontSize: "13px",
                color: "var(--muted)",
                marginBottom: "8px",
              },
            },
            p.category?.name || "Uncategorized",
            " • Stock: ",
            p.stock
          ),

          /* PRICE */
          React.createElement(
            "div",
            {
              style: {
                fontWeight: "bold",
                color: "var(--secondary)",
                marginBottom: "10px",
              },
            },
            "₹",
            p.price
          ),

          /* BUTTON ROW */
          React.createElement(
            "div",
            {
              style: {
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
              },
            },

            React.createElement(
              "button",
              {
                className: "cta secondary-cta",
                style: {
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  textAlign: "center",
                  border: "1px solid var(--secondary)",
                },
                onClick: () =>
                  (window.location.href = `/artisan/edit-product/${p._id}`),
              },
              "Edit"
            ),

            React.createElement(
              "button",
              {
                className: "add-btn",
                style: {
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                },
                onClick: () =>
                  alert("Delete requires confirmation & backend hook"),
              },
              "Delete"
            )
          )
        )
      )
),

    /* FOOTER */
    React.createElement(
      "footer",
      { style: { marginTop: "40px" } },
      React.createElement(
        "div",
        null,
        "© CraftConnect — handcrafted community"
      ),
      React.createElement("div", null, "Made with ❤️ | Beige & brown theme")
    )
  );
}

export default MyProductsPage;
