import React from "react";
import { useCart } from "../../shared/context/CartContext";

function ProductCard(props) {
  const { product, onView } = props;
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    alert(`${product.title} added to cart!`);
  };

  return React.createElement(
    "article",
    {
      className: "card",
      style: {
        cursor: "pointer",
      },
    },

    /* Product Image */
    React.createElement("div", {
      className: "product-img",
      style: {
        height: "280px", // Increased from default/auto to make card taller
        backgroundImage: `url(${product.images?.[0] || "https://via.placeholder.com/300"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderTopLeftRadius: "12px",
        borderTopRightRadius: "12px"
      },
    }),

    /* Product Name */
    React.createElement(
      "div",
      { className: "product-name" },
      product.title
    ),

    /* Artisan */
    React.createElement(
      "div",
      { className: "product-meta" },
      product.artisan?.name || "Unknown Artisan"
    ),

    /* Price Row */
    React.createElement(
      "div",
      { className: "price-row", style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" } },
      React.createElement(
        "div",
        { className: "price" },
        `₹${product.price}`
      ),
      React.createElement(
        "div",
        { style: { display: "flex", gap: "8px" } },
        React.createElement(
          "button",
          {
            className: "add-btn",
            onClick: handleAddToCart,
            style: { fontSize: "13px", padding: "6px 10px" },
          },
          "Add"
        ),
        React.createElement(
          "button",
          {
            className: "add-btn",
            style: { background: "var(--secondary)", fontSize: "13px", padding: "6px 10px" },
            onClick: onView,
          },
          "View"
        )
      )
    )
  );
}

export default ProductCard;
