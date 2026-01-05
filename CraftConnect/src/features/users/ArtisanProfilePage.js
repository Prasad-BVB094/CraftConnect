import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../shared/components/Navbar";
import ProductGrid from "../../features/products/ProductGrid";
import Footer from "../../shared/components/Footer";
import apiService from "../../shared/services/api";

function ArtisanProfilePage() {
  const { id } = useParams();
  const [artisan, setArtisan] = useState(null);
  const [artisanProducts, setArtisanProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtisanData = async () => {
      setLoading(true);
      try {
        // Fetch all products and filter by artisan ID
        const allProductsData = await apiService.getProducts();
        const allProducts = Array.isArray(allProductsData) ? allProductsData : (allProductsData.products || []);
        
        // Filter products by this artisan
        const artisanProds = allProducts.filter(p => {
          const artisanId = p.artisan?._id || p.artisan;
          return artisanId === id;
        });

        if (artisanProds.length > 0) {
          // Extract artisan info from the first product
          const firstProduct = artisanProds[0];
          const artisanData = firstProduct.artisan;
          
          setArtisan({
            id: artisanData?._id || id,
            name: artisanData?.name || "Artisan",
            email: artisanData?.email || "",
            role: artisanData?.craftType || "Artisan",
            village: artisanData?.village || artisanData?.address || "India",
            years: artisanData?.experience || 5,
            avatar: (artisanData?.name || "A").charAt(0).toUpperCase(),
            story: artisanData?.bio || artisanData?.story || "A skilled artisan creating beautiful handcrafted products with traditional techniques passed down through generations.",
            achievements: artisanData?.achievements || [],
            totalProducts: artisanProds.length,
            totalOrders: artisanData?.totalOrders || 0,
          });

          // Map products for display
          setArtisanProducts(artisanProds.map(p => ({
            ...p,
            id: p._id || p.id,
            name: p.name || p.title,
            image: p.images?.[0] || p.image,
            artisan: artisanData?.name || "Artisan",
            category: p.category?.name || p.category || "Handmade"
          })));
        } else {
          setError("No products found for this artisan.");
        }
      } catch (err) {
        console.error("Failed to fetch artisan data:", err);
        setError("Failed to load artisan profile.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArtisanData();
    }
  }, [id]);

  if (loading) return React.createElement("div", { style: { padding: "40px", textAlign: "center" } }, "Loading artisan profile...");
  if (error || !artisan) return React.createElement("div", { style: { padding: "40px", textAlign: "center", color: "red" } }, error || "Artisan not found");

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Navbar),
    React.createElement(
      "div",
      { className: "container", style: { maxWidth: "1200px", margin: "0 auto", padding: "0 20px" } },

    /* -------- ARTISAN HEADER -------- */
    React.createElement(
      "section",
      {
        style: {
          display: "flex",
          gap: "24px",
          marginTop: "30px",
          padding: "30px",
          borderRadius: "20px",
          background: "linear-gradient(180deg, #fff, rgba(248,244,239,0.95))",
          border: "1px solid rgba(166,138,100,0.15)",
          boxShadow: "0 8px 30px rgba(62,44,32,0.08)",
        },
      },

      /* Avatar */
      React.createElement(
        "div",
        {
          style: {
            width: "100px",
            height: "100px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, var(--secondary), var(--accent))",
            display: "grid",
            placeItems: "center",
            color: "#fff",
            fontFamily: "'Playfair Display', serif",
            fontSize: "32px",
            fontWeight: 700,
            flexShrink: 0,
          },
        },
        artisan.avatar
      ),

      /* Info */
      React.createElement(
        "div",
        { style: { flex: 1 } },

        React.createElement(
          "h2",
          {
            style: {
              fontFamily: "'Playfair Display', serif",
              fontSize: "32px",
              color: "var(--accent)",
              marginBottom: "8px",
            },
          },
          artisan.name
        ),

        React.createElement(
          "div",
          { 
            style: { 
              color: "var(--muted)", 
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap"
            } 
          },
          React.createElement("span", { 
            style: { 
              background: "rgba(166,138,100,0.15)", 
              padding: "4px 12px", 
              borderRadius: "20px",
              fontSize: "14px"
            } 
          }, `📍 ${artisan.village}`),
          React.createElement("span", { 
            style: { 
              background: "rgba(166,138,100,0.15)", 
              padding: "4px 12px", 
              borderRadius: "20px",
              fontSize: "14px"
            } 
          }, `🎨 ${artisan.role}`)
        ),

        React.createElement(
          "p",
          {
            style: {
              color: "var(--text)",
              fontSize: "15px",
              lineHeight: "1.7",
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
              gap: "16px",
              marginTop: "20px",
              flexWrap: "wrap"
            },
          },
          React.createElement(
            "div",
            {
              style: {
                padding: "12px 20px",
                background: "rgba(166,138,100,0.1)",
                borderRadius: "12px",
                textAlign: "center",
              },
            },
            React.createElement(
              "div",
              { style: { fontSize: "24px", fontWeight: "bold", color: "var(--accent)" } },
              artisan.totalProducts
            ),
            React.createElement(
              "div",
              { style: { fontSize: "12px", color: "var(--muted)", marginTop: "4px" } },
              "Products"
            )
          ),
          React.createElement(
            "div",
            {
              style: {
                padding: "12px 20px",
                background: "rgba(166,138,100,0.1)",
                borderRadius: "12px",
                textAlign: "center",
              },
            },
            React.createElement(
              "div",
              { style: { fontSize: "24px", fontWeight: "bold", color: "var(--accent)" } },
              artisan.years
            ),
            React.createElement(
              "div",
              { style: { fontSize: "12px", color: "var(--muted)", marginTop: "4px" } },
              "Years Exp."
            )
          ),
          /* Verified Badge */
          React.createElement(
            "div",
            {
              style: {
                padding: "12px 20px",
                background: "linear-gradient(135deg, rgba(76,175,80,0.15), rgba(76,175,80,0.05))",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: "1px solid rgba(76,175,80,0.2)"
              },
            },
            React.createElement("span", { style: { fontSize: "18px" } }, "✓"),
            React.createElement(
              "div",
              { style: { fontSize: "14px", color: "#4CAF50", fontWeight: "600" } },
              "Verified Artisan"
            )
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
        { 
          style: { 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: "24px"
          } 
        },
        React.createElement(
          "h3",
          { 
            style: { 
              fontFamily: "'Playfair Display', serif",
              fontSize: "24px",
              color: "var(--accent)"
            } 
          },
          `Products by ${artisan.name}`
        ),
        React.createElement(
          "span",
          { style: { color: "var(--muted)", fontSize: "14px" } },
          `${artisanProducts.length} items`
        )
      ),

      /* Product Grid with proper wrapper */
      React.createElement(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "24px"
          }
        },
        React.createElement(ProductGrid, { products: artisanProducts })
      )
    ),

    /* -------- FOOTER -------- */
    React.createElement(Footer)
    )
  );
}

export default ArtisanProfilePage;
