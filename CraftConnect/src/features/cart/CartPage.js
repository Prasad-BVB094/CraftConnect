import React from "react";
import Navbar from "../../shared/components/Navbar";
import { useCart } from "../../shared/context/CartContext";

function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

  const total = getCartTotal();

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Navbar),
    React.createElement(
      "div",
      { className: "container" },

    /* CART TITLE */
    React.createElement(
      "h2",
      {
        style: {
          fontFamily: "'Playfair Display', serif",
          color: "var(--accent)",
          marginTop: "30px",
          marginBottom: "20px",
        },
      },
      `Your Cart ${cartItems.length > 0 ? `(${cartItems.length} ${cartItems.length === 1 ? 'item' : 'items'})` : ''}`
    ),

    /* EMPTY CART MESSAGE */
    cartItems.length === 0 ? React.createElement(
      "div",
      {
        style: {
          textAlign: "center",
          padding: "60px 20px",
          background: "linear-gradient(180deg, #fff, rgba(248,244,239,0.9))",
          border: "1px solid rgba(62,44,32,0.08)",
          borderRadius: "16px",
          boxShadow: "0 6px 20px rgba(62,44,32,0.05)",
        },
      },
      React.createElement(
        "h3",
        { style: { color: "var(--muted)", marginBottom: "20px" } },
        "Your cart is empty"
      ),
      React.createElement(
        "button",
        {
          className: "add-btn",
          style: { padding: "12px 24px", fontSize: "16px" },
          onClick: () => window.location.href = "/",
        },
        "Continue Shopping"
      )
    ) : null,

    /* CART ITEMS */
    cartItems.length > 0 ? React.createElement(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        },
      },

      cartItems.map((item) =>
        React.createElement(
          "div",
          {
            key: item.id,
            style: {
              display: "flex",
              gap: "16px",
              background: "linear-gradient(180deg, #fff, rgba(248,244,239,0.9))",
              border: "1px solid rgba(62,44,32,0.08)",
              borderRadius: "16px",
              padding: "16px",
              alignItems: "center",
              boxShadow: "0 6px 20px rgba(62,44,32,0.05)",
            },
          },

          /* IMAGE */
          React.createElement("img", {
            src: item.image,
            style: {
              width: "120px",
              height: "120px",
              borderRadius: "12px",
              objectFit: "cover",
            },
          }),

          /* DETAILS */
          React.createElement(
            "div",
            { style: { flex: 1 } },

            React.createElement(
              "h3",
              {
                style: {
                  margin: 0,
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "var(--accent)",
                },
              },
              item.name
            ),

            React.createElement(
              "p",
              { style: { color: "var(--muted)", margin: "6px 0" } },
              item.artisan || item.artisanVillage || "Unknown Artisan"
            ),

            React.createElement(
              "p",
              { style: { color: "var(--secondary)", fontWeight: "bold" } },
              `₹${item.price}`
            )
          ),

          /* QUANTITY CONTROLS */
          React.createElement(
            "div",
            {
              style: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
              },
            },

            React.createElement(
              "div",
              {
                style: {
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                },
              },
              React.createElement(
                "button",
                {
                  style: {
                    padding: "4px 10px",
                    border: "1px solid var(--secondary)",
                    background: "transparent",
                    borderRadius: "8px",
                    cursor: "pointer",
                  },
                  onClick: () => updateQuantity(item.id, item.quantity - 1),
                },
                "-"
              ),
              React.createElement(
                "span",
                { style: { minWidth: "20px", textAlign: "center" } },
                item.quantity
              ),
              React.createElement(
                "button",
                {
                  style: {
                    padding: "4px 10px",
                    border: "1px solid var(--secondary)",
                    background: "transparent",
                    borderRadius: "8px",
                    cursor: "pointer",
                  },
                  onClick: () => updateQuantity(item.id, item.quantity + 1),
                },
                "+"
              )
            ),

            /* REMOVE BUTTON */
            React.createElement(
              "button",
              {
                style: {
                  marginTop: "6px",
                  color: "var(--muted)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "13px",
                },
                onClick: () => {
                  if (window.confirm("Remove this item from cart?")) {
                    removeFromCart(item.id);
                  }
                },
              },
              "Remove"
            )
          )
        )
      )
    ) : null,

    /* CART TOTAL + CHECKOUT */
    cartItems.length > 0 ? React.createElement(
      "div",
      {
        style: {
          marginTop: "30px",
          padding: "20px",
          background: "linear-gradient(180deg, #fff, rgba(248,244,239,0.9))",
          border: "1px solid rgba(62,44,32,0.08)",
          borderRadius: "16px",
          boxShadow: "0 6px 20px rgba(62,44,32,0.05)",
        },
      },

      React.createElement(
        "h3",
        {
          style: {
            color: "var(--secondary)",
            marginBottom: "10px",
          },
        },
        "Order Summary"
      ),

      React.createElement(
        "p",
        { style: { fontSize: "18px", fontWeight: "600", color: "var(--accent)" } },
        `Total: ₹${total}`
      ),

      React.createElement(
        "button",
        {
          className: "add-btn",
          style: { marginTop: "12px", padding: "12px 16px", fontSize: "16px" },
          onClick: () => (window.location.href = "/checkout"),
        },
        "Proceed to Checkout"
      )
    ) : null,

    /* FOOTER */
    React.createElement(
      "footer",
      { style: { marginTop: "40px" } },
      React.createElement("div", null, "© CraftConnect — handcrafted community"),
      React.createElement("div", null, "Made with ❤️ | Beige & brown theme")
    )
    )
  );
}

export default CartPage;
