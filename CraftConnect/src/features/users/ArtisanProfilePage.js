import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../shared/components/Navbar";
import ProductGrid from "../../features/products/ProductGrid";
import { useCart } from "../../shared/context/CartContext";

function ArtisanProfilePage(props) {
  const { id } = useParams();
  const { addToCart } = useCart();

  // Later: fetch from backend using /artisan/:id
  const artisan = {
    id: parseInt(id) || 1,
    name: "Asha",
    role: "Potter",
    village: "Kera Village",
    years: 12,
    avatar: "A",
    story:
      "I work with locally sourced red clay, using traditional firing methods passed down through generations. My designs are inspired by river forms and the textures of our land. Growing up in Kera Village, I learned pottery from my grandmother, who herself learned from her mother. Each piece I create carries not just my skill, but the legacy of generations of women potters who found freedom and expression through their craft. The clay from the river near our village has unique properties that make it perfect for creating durable, beautiful pieces. I fire my pottery in a traditional wood-fired kiln that my family has maintained for over 60 years.",
    achievements: [
      "Featured in National Handicraft Exhibition 2022",
      "Winner of Best Potter Award, State Crafts Fair 2021",
      "Trained over 50 young artisans in traditional pottery"
    ],
    totalProducts: 24,
    totalOrders: 156,
  };

  const artisanProducts = [
    {
      id: 1,
      name: "Terracotta Planter",
      artisan: "Asha",
      price: 1200,
      image: "https://via.placeholder.com/300x200",
    },
    {
      id: 2,
      name: "Clay Tea Cups",
      artisan: "Asha",
      price: 350,
      image: "https://via.placeholder.com/300x200",
    },
    {
      id: 3,
      name: "Mini Terracotta Vases",
      artisan: "Asha",
      price: 180,
      image: "https://via.placeholder.com/300x200",
    }
  ];

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    alert(`${product.name} added to cart!`);
  };

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Navbar),
    React.createElement(
      "div",
      { className: "container" },

    /* -------- ARTISAN HEADER -------- */
    React.createElement(
      "section",
      {
        style: {
          display: "flex",
          gap: "20px",
          marginTop: "30px",
          padding: "24px",
          borderRadius: "16px",
          background: "linear-gradient(180deg, #fff, rgba(248,244,239,0.9))",
          border: "1px solid rgba(62,44,32,0.08)",
          boxShadow: "0 6px 20px rgba(62,44,32,0.05)",
        },
      },

      /* Avatar */
      React.createElement(
        "div",
        {
          style: {
            width: "90px",
            height: "90px",
            borderRadius: "14px",
            background: "linear-gradient(135deg,var(--secondary),var(--accent))",
            display: "grid",
            placeItems: "center",
            color: "#fff",
            fontFamily: "'Playfair Display', serif",
            fontSize: "26px",
            fontWeight: 700,
          },
        },
        artisan.avatar
      ),

      /* Info */
      React.createElement(
        "div",
        null,

        React.createElement(
          "h2",
          {
            style: {
              fontFamily: "'Playfair Display', serif",
              fontSize: "28px",
              color: "var(--accent)",
              marginBottom: "6px",
            },
          },
          `${artisan.name} — ${artisan.role}`
        ),

        React.createElement(
          "div",
          { style: { color: "var(--muted)", marginBottom: "10px" } },
          `${artisan.village} • ${artisan.years} yrs`
        ),

        React.createElement(
          "p",
          {
            style: {
              color: "var(--text)",
              fontSize: "15px",
              lineHeight: "1.6",
              maxWidth: "700px",
            },
          },
          artisan.story
        ),

        /* Stats */
        React.createElement(
          "div",
          {
            style: {
              display: "flex",
              gap: "20px",
              marginTop: "16px",
            },
          },
          React.createElement(
            "div",
            {
              style: {
                padding: "10px 16px",
                background: "rgba(166,138,100,0.12)",
                borderRadius: "10px",
              },
            },
            React.createElement(
              "div",
              { style: { fontSize: "20px", fontWeight: "bold", color: "var(--secondary)" } },
              artisan.totalProducts
            ),
            React.createElement(
              "div",
              { style: { fontSize: "12px", color: "var(--muted)" } },
              "Products"
            )
          ),
          React.createElement(
            "div",
            {
              style: {
                padding: "10px 16px",
                background: "rgba(166,138,100,0.12)",
                borderRadius: "10px",
              },
            },
            React.createElement(
              "div",
              { style: { fontSize: "20px", fontWeight: "bold", color: "var(--secondary)" } },
              artisan.totalOrders
            ),
            React.createElement(
              "div",
              { style: { fontSize: "12px", color: "var(--muted)" } },
              "Orders Completed"
            )
          ),
          React.createElement(
            "div",
            {
              style: {
                padding: "10px 16px",
                background: "rgba(166,138,100,0.12)",
                borderRadius: "10px",
              },
            },
            React.createElement(
              "div",
              { style: { fontSize: "20px", fontWeight: "bold", color: "var(--secondary)" } },
              artisan.years
            ),
            React.createElement(
              "div",
              { style: { fontSize: "12px", color: "var(--muted)" } },
              "Years Experience"
            )
          )
        )
      )
    ),

    /* -------- ACHIEVEMENTS SECTION -------- */
    React.createElement(
      "section",
      {
        style: {
          marginTop: "30px",
          padding: "24px",
          borderRadius: "16px",
          background: "linear-gradient(180deg, #fff, rgba(248,244,239,0.9))",
          border: "1px solid rgba(62,44,32,0.08)",
          boxShadow: "0 6px 20px rgba(62,44,32,0.05)",
        },
      },
      React.createElement(
        "h3",
        {
          style: {
            fontFamily: "'Playfair Display', serif",
            fontSize: "22px",
            color: "var(--accent)",
            marginBottom: "14px",
          },
        },
        "Achievements & Recognition"
      ),
      React.createElement(
        "ul",
        { style: { paddingLeft: "20px", color: "var(--text)" } },
        artisan.achievements.map((achievement, i) =>
          React.createElement(
            "li",
            {
              key: i,
              style: {
                marginBottom: "8px",
                lineHeight: "1.6",
                fontSize: "15px",
              },
            },
            achievement
          )
        )
      )
    ),

    /* -------- PRODUCTS BY ARTISAN -------- */
    React.createElement(
      "section",
      { style: { marginTop: "40px" } },

      React.createElement(
        "div",
        { className: "section-title" },
        React.createElement(
          "h3",
          null,
          `Products by ${artisan.name}`
        ),
        React.createElement("a", { href: "#" }, "View all")
      ),

      React.createElement(ProductGrid, { products: artisanProducts })
    ),

    /* -------- FOOTER -------- */
    React.createElement(
      "footer",
      { style: { marginTop: "50px" } },
      React.createElement(
        "div",
        null,
        "© CraftConnect — handcrafted community"
      ),
      React.createElement(
        "div",
        null,
        "Made with ❤️ | Beige & brown theme"
      )
    )
    )
  );
}

export default ArtisanProfilePage;
