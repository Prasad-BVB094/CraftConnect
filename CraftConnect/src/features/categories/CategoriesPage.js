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
      { 
        style: { 
          minHeight: "100vh",
          position: "relative",
          background: "#121212", // Dark base
        } 
      },
      /* Background Layer - Fixed to viewport */
      React.createElement("div", {
        style: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url('/wallpaper.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          zIndex: 0
        }
      }),
      /* Tint Overlay - Fixed to viewport */
      React.createElement("div", {
        style: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.65)", // Black tint
          zIndex: 1
        }
      }),

      React.createElement(
        "div",
        { 
          style: { position: "relative", zIndex: 10 }
        },
        React.createElement(Navbar),

        React.createElement(
          "div",
          { 
            className: "container",
            style: { paddingBottom: "50px" }
          },


          /* PAGE HEADER */
          React.createElement(
            "div",
            {
              style: {
                paddingTop: "60px",
                marginBottom: "40px",
                textAlign: "center"
              },
            },
            React.createElement(
              "h2",
              {
                style: {
                  fontFamily: "'Playfair Display', serif",
                  color: "#E8DED1", // Light beige for visibility
                  fontSize: "42px",
                  marginBottom: "16px",
                  textShadow: "2px 2px 10px rgba(0,0,0,0.5)"
                },
              },
              "Explore Our Heritage"
            ),
            React.createElement(
              "p",
              {
                style: {
                  color: "rgba(232,222,209,0.8)",
                  fontSize: "18px",
                  maxWidth: "600px",
                  margin: "0 auto",
                  fontStyle: "italic"
                },
              },
              "Discover the soul of India through our curated collection of masterfully crafted goods."
            )
          ),

          /* CATEGORIES GRID */
          loading
            ? React.createElement(
                "p",
                { style: { textAlign: "center", padding: "40px", color: "#fff" } },
                "Loading categories..."
              )
            : React.createElement(
                "div",
                {
                  style: {
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                    gap: "30px",
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
                        padding: "35px 28px",
                        borderRadius: "20px",
                        background: "rgba(255, 255, 255, 0.05)", // Glassmorphism
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(232, 222, 209, 0.15)",
                        boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
                        cursor: "pointer",
                        transition: "all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                      },
                      onMouseEnter: (e) => {
                        e.currentTarget.style.transform = "translateY(-8px)";
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                        e.currentTarget.style.borderColor = "rgba(166,138,100,0.4)";
                        e.currentTarget.style.boxShadow = "0 25px 50px rgba(0,0,0,0.4)";
                      },
                      onMouseLeave: (e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                        e.currentTarget.style.borderColor = "rgba(232, 222, 209, 0.15)";
                        e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.2)";
                      },
                    },
                    React.createElement(
                      "div",
                      {
                        style: {
                          marginBottom: "20px",
                          display: "flex",
                          justifyContent: "center",
                          padding: "15px",
                          borderRadius: "50%",
                          background: "rgba(166,138,100,0.15)"
                        },
                      },
                      React.createElement(CategoryIcon, { category: category.name })
                    ),
                    React.createElement(
                      "h3",
                      {
                        style: {
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "26px",
                          color: "#E8DED1",
                          marginBottom: "14px",
                          fontWeight: "600",
                        },
                      },
                      category.name
                    ),
                    React.createElement(
                      "p",
                      {
                        style: {
                          color: "rgba(232,222,209,0.75)",
                          fontSize: "15px",
                          marginBottom: "20px",
                          lineHeight: "1.6",
                        },
                      },
                      category.description
                    ),
                    React.createElement(
                      "div",
                      {
                        style: {
                          color: "#fff",
                          fontSize: "14px",
                          fontWeight: "600",
                          backgroundColor: "var(--accent)",
                          padding: "8px 20px",
                          borderRadius: "25px",
                          transition: "all 0.3s ease"
                        },
                      },
                      "Explore Collection"
                    )
                  )
                )
              ),

          /* FOOTER */
          React.createElement(
            "footer",
            { 
              style: { 
                textAlign: "center", 
                borderTop: "1px solid rgba(232,222,209,0.1)",
                paddingTop: "40px",
                color: "rgba(232,222,209,0.5)"
              } 
            },
            React.createElement(
              "div", 
              { style: { fontFamily: "'Neue Montreal', 'Poppins', sans-serif", fontSize: "14px", marginBottom: "8px" } },
              "© CraftConnect — Preserving Heritage, Supporting Artisans"
            ),
            React.createElement(
              "div", 
              { style: { fontFamily: "'Neue Montreal', 'Poppins', sans-serif", fontSize: "12px" } },
              "Beige & Brown Heritage Theme | Proudly Indian"
            )
          )
        )
      )
    )


  );
}

export default CategoriesPage;
