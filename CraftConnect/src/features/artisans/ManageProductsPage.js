import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../shared/components/Navbar";
import apiService from "../../shared/services/api";
import { useAuth } from "../../shared/hooks/useAuth";
import Footer from "../../shared/components/Footer";

function VendorManageProductsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    try {
      // In real app, we'd pass user.id to get specific products
      const data = await apiService.getArtisanProducts(user?.id);
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await apiService.deleteProduct(id);
        // Optimistic update
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        alert("Failed to delete product");
      }
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
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "30px",
        },
      },
      React.createElement(
        "h2",
        {
          style: {
            fontFamily: "'Playfair Display', serif",
            color: "var(--accent)",
          },
        },
        "Manage Products"
      ),
      React.createElement(
        "button",
        {
          className: "cta",
          onClick: () => (window.location.href = "/artisan/add-product"),
        },
        "Add New Product"
      )
    ),

    /* PRODUCT LIST GRID */
    React.createElement(
      "div",
      {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", // auto-fill keeps them compact
          gap: "24px",
          marginTop: "20px",
        },
      },

      products.map((product) => {
        // Fix Image URL: Handle relative paths from backend
        let imageUrl = product.image || (product.images && product.images[0]) || "https://via.placeholder.com/300?text=No+Image";
        if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
            imageUrl = `http://localhost:3001${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
        }

        return React.createElement(
          "div",
          {
            key: product.id || product._id,
            style: {
              background: "#fff",
              borderRadius: "16px",
              padding: "16px",
              border: "1px solid rgba(166, 138, 100, 0.2)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              maxWidth: "320px", // Prevent stretching
              display: "flex",
              flexDirection: "column",
              height: "100%"
            },
          },

          /* PRODUCT IMAGE */
          React.createElement("div", {
              style: {
                  width: "100%",
                  height: "200px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  marginBottom: "12px",
                  backgroundColor: "#f5f5f5"
              }
          },
            React.createElement("img", {
                src: imageUrl,
                alt: product.name,
                style: {
                width: "100%",
                height: "100%",
                objectFit: "cover",
                },
                onError: (e) => { e.target.src = "https://via.placeholder.com/300?text=Image+Error"; } // Fallback
            })
          ),

          /* PRODUCT NAME */
          React.createElement(
            "h3",
            { style: { color: "#3E2723", marginBottom: "8px", fontSize: "18px", fontWeight: "600" } }, // Dark Coffee Text
            product.title || "Untitled Product"
          ),

          /* PRICE & STOCK */
          React.createElement(
            "div",
            { style: { display: "flex", justifyContent: "space-between", marginBottom: "16px" } },
            React.createElement("span", { style: { color: "#A68A64", fontWeight: "bold" } }, `₹${product.price || 0}`),
            React.createElement("span", { style: { color: "#8D6E63", fontSize: "14px" } }, `Stock: ${product.stock || 0}`)
          ),

          /* ACTION BUTTONS */
          React.createElement(
            "div",
            { style: { display: "flex", gap: "10px", marginTop: "auto" } },

            React.createElement(
              "button",
              {
                className: "cta",
                style: { flex: 1, fontSize: "14px", padding: "10px" },
                onClick: () => navigate(`/artisan/edit-product/${product.id || product._id}`),
              },
              "Edit"
            ),

            React.createElement(
              "button",
              {
                className: "cta secondary-cta",
                style: { flex: 1, fontSize: "14px", padding: "10px" },
                onClick: () => handleDelete(product.id || product._id),
              },
              "Delete"
            )
          )
        );
      })
    ),

    /* FOOTER */
    React.createElement(Footer)
    )
  );
}

export default VendorManageProductsPage;
