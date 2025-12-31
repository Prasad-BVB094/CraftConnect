import React from "react";
import Navbar from "../../shared/components/Navbar";
import CategoryIcon from "./CategoryIcon";
import apiService from "../../shared/services/api";


function CategoriesPage() {
  const [categories, setCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
  const fetchCategories = async () => {
    try {
      const data = await apiService.getCategories();
      setCategories(data.filter(cat => cat.isActive));
    } catch (err) {
      console.error("Failed to load categories", err);
    } finally {
      setLoading(false);
    }
  };

  fetchCategories();
}, []);

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Navbar),
    React.createElement(
      "div",
      { className: "container" },

    /* PAGE HEADER */
    React.createElement(
      "div",
      {
        style: {
          marginTop: "30px",
          marginBottom: "30px",
        },
      },
      React.createElement(
        "h2",
        {
          style: {
            fontFamily: "'Playfair Display', serif",
            color: "var(--accent)",
            fontSize: "32px",
            marginBottom: "10px",
          },
        },
        "Explore All Categories"
      ),
      React.createElement(
        "p",
        {
          style: {
            color: "var(--muted)",
            fontSize: "16px",
          },
        },
        "Browse our collection of handcrafted products organized by craft category"
      )
    ),

    /* CATEGORIES GRID */
    loading
  ? React.createElement(
      "p",
      { style: { textAlign: "center", padding: "40px" } },
      "Loading categories..."
    )
  : React.createElement(
      "div",
      {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
          marginBottom: "50px",
        },
      },
      categories.map((category) =>
        React.createElement(
          "div",
          {
            key: category.slug,
            onClick: () => window.location.href = `/category/${category.slug}`,
            style: {
              padding: "30px 24px",
              borderRadius: "18px",
              background: "linear-gradient(180deg, #fff, rgba(248,244,239,0.95))",
              border: "1px solid rgba(166,138,100,0.2)",
              boxShadow: "0 8px 24px rgba(166,138,100,0.1)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            },
            onMouseEnter: (e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow = "0 14px 32px rgba(166,138,100,0.15)";
              e.currentTarget.style.border = "1px solid rgba(166,138,100,0.4)";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(166,138,100,0.1)";
              e.currentTarget.style.border = "1px solid rgba(166,138,100,0.2)";
            },
          },
          React.createElement(
            "div",
            {
              style: {
                marginBottom: "16px",
                display: "flex",
                justifyContent: "center",
              },
            },
            React.createElement(CategoryIcon, { category: category.name })
          ),
          React.createElement(
            "h3",
            {
              style: {
                fontFamily: "'Playfair Display', serif",
                fontSize: "24px",
                color: "var(--accent)",
                marginBottom: "12px",
                fontWeight: "600",
              },
            },
            category.name
          ),
          React.createElement(
            "p",
            {
              style: {
                color: "var(--text)",
                fontSize: "15px",
                marginBottom: "16px",
                lineHeight: "1.6",
                fontStyle: "normal",
              },
            },
            category.description
          ),
          React.createElement(
            "div",
            {
              style: {
                color: "var(--accent)",
                fontSize: "14px",
                fontWeight: "600",
                backgroundColor: "rgba(166,138,100,0.1)",
                padding: "6px 12px",
                borderRadius: "20px",
              },
            },
            "Explore products"
          )
        )
      )
    ),

    /* FOOTER */
    React.createElement(
      "footer",
      { style: { textAlign: "center" } },
      React.createElement(
        "div", 
        { style: { fontFamily: "'Neue Montreal', 'Poppins', sans-serif" } },
        "© CraftConnect — handcrafted community"
      ),
      React.createElement(
        "div", 
        { style: { fontFamily: "'Neue Montreal', 'Poppins', sans-serif" } },
        "Made with ❤️ | Beige & brown theme"
      )
    )
    )
  );
}

export default CategoriesPage;
