import React, { useState, useEffect } from "react";
import Navbar from "../../shared/components/Navbar";
import ProductGrid from "../../features/products/ProductGrid";
import CategoryIcon from "../../features/categories/CategoryIcon";
import Footer from "../../shared/components/Footer";
import apiService from "../../shared/services/api";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  // Fetch products and artisans on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, artisansData] = await Promise.all([
            apiService.getProducts().catch(() => []), 
            apiService.getArtisans().catch(() => []) 
        ]);

        /* --- PROCESS PRODUCTS --- */
        let productList = Array.isArray(productsData) ? productsData : (productsData.products || []);
        
        // Map backend fields
        const formattedProducts = productList.map(p => ({
            ...p,
            id: p._id || p.id,
            sellerType: p.artisan ? 'artisan' : 'vendor',
            artisan: p.artisan?.name || "Unknown Artisan",
            category: p.category?.name || p.category || "Uncategorized",
            price: Number(p.price),
            createdAt: p.createdAt || new Date(0) 
        }));
        setProducts(formattedProducts);

        // /* --- PROCESS ARTISANS FOR SPOTLIGHT --- */
        // let artisanList = [];
        // if (Array.isArray(artisansData)) {
        //     artisanList = artisansData;
        // } else if (artisansData && artisansData.artisans) {
        //     artisanList = artisansData.artisans;
        // }

        // if (artisanList.length > 0) {
        //     const randomArtisan = artisanList[Math.floor(Math.random() * artisanList.length)];
        //     setFeaturedArtisan({
        //         id: randomArtisan._id || randomArtisan.id,
        //         name: randomArtisan.name,
        //         businessName: randomArtisan.businessName || "Master Artisan",
        //         bio: randomArtisan.bio || "Preserving heritage through handcrafted excellence.",
        //         story: randomArtisan.story,
        //         image: "https://images.unsplash.com/photo-1594040226829-7f2a1a0a34b2?auto=format&fit=crop&w=400&q=80" 
        //     });
        // }

        /* --- FETCH CATEGORIES FROM BACKEND --- */
        try {
          const categoriesData = await apiService.getCategories();
          const activeCategories = Array.isArray(categoriesData)
            ? categoriesData.filter(cat => cat.isActive)
            : [];

          setCategories(activeCategories);
        } catch (e) {
          console.error("Failed to fetch categories", e);
        }


      } catch (err) {
        console.error("Failed to fetch home data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper for descriptions
  // const getCategoryDescription = (name) => {
  //     const descriptions = {
  //         "Pottery": "Handcrafted pottery made using traditional techniques",
  //         "Handloom": "Beautiful textiles woven on traditional looms",
  //         "Woodcraft": "Carved wooden items made with precision",
  //         "Bamboo": "Eco-friendly bamboo products",
  //         "Jewelry": "Exquisite handmade jewelry",
  //         "Natural dyes": "Fabrics dyed with organic natural colors"
  //     };
  //     return descriptions[name] || `Explore our unique ${name} collection`;
  // };

  // Categories are now derived from state

  // Select a random featured artisan
  // Use fetched products, or empty if loading
  const artisanProducts = products.filter(p => p.sellerType === 'artisan');
  const featuredProduct = artisanProducts.length > 0 
      ? artisanProducts[Math.floor(Math.random() * artisanProducts.length)]
      : null;

  return React.createElement(
    "div",
    { style: { width: "100%" } },

    /* -------- NAVBAR -------- */
    React.createElement(Navbar),

    /* -------- HERO -------- */
    React.createElement(
      "section",
      { 
        className: "hero",
        style: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          alignItems: "center",
        }
      },

      /* HERO LEFT */
      React.createElement(
        "div",
        { 
          className: "hero-left",
          style: {
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }
        },

        React.createElement(
          "h2",
          { 
            style: {
              fontFamily: "'Playfair Display', serif",
              fontSize: "42px",
              color: "var(--accent)",
              lineHeight: "1.2",
              margin: 0,
            }
          },
          "Handmade. Honest. Homegrown."
        ),

        React.createElement(
          "p",
          { 
            style: {
              fontSize: "18px",
              color: "var(--text)",
              lineHeight: "1.6",
              margin: 0,
              fontFamily: "'Neue Montreal', 'Poppins', sans-serif",
            }
          },
          "Discover goods crafted with tradition and purpose. Explore stories and products from artisans and local vendors."
        ),

        /* CTA BUTTONS */
        React.createElement(
          "div",
          { 
            className: "cta-row",
            style: {
              display: "flex",
              gap: "16px",
            }
          },

          React.createElement(
            "button",
            {
              className: "cta",
              onClick: () => (window.location.href = "/"),
              style: {
                padding: "14px 24px",
                borderRadius: "12px",
                background: "var(--accent)",
                color: "#fff",
                border: "none",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 6px 16px rgba(166,138,100,0.2)",
                transition: "all 0.2s ease",
                fontFamily: "'Neue Montreal', 'Poppins', sans-serif",
              },
              onMouseEnter: (e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(166,138,100,0.3)";
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(166,138,100,0.2)";
              },
            },
            "Shop curated goods"
          ),

          React.createElement(
            "button",
            {
              className: "cta secondary-cta",
              onClick: () => (window.location.href = "/register/artisan"),
              style: {
                padding: "14px 24px",
                borderRadius: "12px",
                background: "transparent",
                color: "var(--accent)",
                border: "2px solid var(--accent)",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontFamily: "'Neue Montreal', 'Poppins', sans-serif",
              },
              onMouseEnter: (e) => {
                e.currentTarget.style.background = "rgba(166,138,100,0.1)";
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.background = "transparent";
              },
            },
            "Join as artisan"
          )
        ),

        /* BADGES */
        React.createElement(
          "div",
          { 
            className: "badges",
            style: {
              display: "flex",
              gap: "20px",
              marginTop: "10px",
            }
          },
          React.createElement(
            "div", 
            { 
              className: "badge",
              style: {
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--text)",
                fontSize: "15px",
                fontFamily: "'Neue Montreal', 'Poppins', sans-serif",
              }
            },
            React.createElement(
              "div",
              {
                style: {
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "var(--accent)",
                }
              }
            ),
            "Authentic makers"
          ),
          React.createElement(
            "div", 
            { 
              className: "badge",
              style: {
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--text)",
                fontSize: "15px",
                fontFamily: "'Neue Montreal', 'Poppins', sans-serif",
              }
            },
            React.createElement(
              "div",
              {
                style: {
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "var(--accent)",
                }
              }
            ),
            "Eco-conscious"
          ),
          React.createElement(
            "div", 
            { 
              className: "badge",
              style: {
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--text)",
                fontSize: "15px",
                fontFamily: "'Neue Montreal', 'Poppins', sans-serif",
              }
            },
            React.createElement(
              "div",
              {
                style: {
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "var(--accent)",
                }
              }
            ),
            "Direct to artisan"
          )
        )
      ),

      /* HERO RIGHT */
      React.createElement(
        "div",
        { 
          className: "hero-right",
          style: {
            background:
              "linear-gradient(135deg, rgba(166,138,100,0.06), rgba(107,79,59,0.04))",
            padding: "24px",
            borderRadius: "16px",
            border: "1px solid rgba(166,138,100,0.1)",
          }
        },
      React.createElement(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          },
        },
        categories.slice(0, 2).map(category =>
          React.createElement(
            "div",
            {
              key: category.slug,
              style: {
                borderRadius: "14px",
                padding: "16px",
                background: "#fff",
                border: "1px solid rgba(166,138,100,0.1)",
                boxShadow: "0 4px 12px rgba(166,138,100,0.08)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              },
              onClick: () => window.location.href = `/category/${category.slug}`,
              onMouseEnter: (e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(166,138,100,0.12)";
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(166,138,100,0.08)";
              },
            },
            React.createElement(
              "div",
              {
                style: {
                  height: "110px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg,#fff,#f7efe3)",
                  display: "grid",
                  placeItems: "center",
                  marginBottom: "8px",
                },
              },
              React.createElement(CategoryIcon, { category: category.name })
            ),

            // CATEGORY NAME
            React.createElement(
              "h4",
              {
                style: {
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "18px",
                  color: "var(--accent)",
                  margin: "6px 0",
                  textAlign: "center",
                },
              },
              category.name
            ),

            // CATEGORY DESCRIPTION
            React.createElement(
              "p",
              {
                style: {
                  fontSize: "14px",
                  color: "var(--muted)",
                  lineHeight: "1.5",
                  fontFamily: "'Neue Montreal', 'Poppins', sans-serif",
                  textAlign: "center",
                },
              },
              category.description
            )

          )
        )
      ),


        // /* MINI CARDS GRID */
        // React.createElement(
        //   "div",
        //   {
        //     style: {
        //       display: "grid",
        //       gridTemplateColumns: "1fr 1fr",
        //       gap: "16px",
        //     },
        //   },

        //   /* MINI CARD 1 */
        //   React.createElement(
        //     "div",
        //     {
        //       style: {
        //         borderRadius: "14px",
        //         padding: "16px",
        //         background: "#fff",
        //         border: "1px solid rgba(166,138,100,0.1)",
        //         boxShadow: "0 4px 12px rgba(166,138,100,0.08)",
        //         transition: "all 0.2s ease",
        //       },
        //       onMouseEnter: (e) => {
        //         e.currentTarget.style.transform = "translateY(-4px)";
        //         e.currentTarget.style.boxShadow = "0 6px 16px rgba(166,138,100,0.12)";
        //       },
        //       onMouseLeave: (e) => {
        //         e.currentTarget.style.transform = "translateY(0)";
        //         e.currentTarget.style.boxShadow = "0 4px 12px rgba(166,138,100,0.08)";
        //       },
        //     },
        //     React.createElement("div", {
        //       style: {
        //         height: "130px",
        //         borderRadius: "10px",
        //         background: "linear-gradient(135deg,#fff,#f7efe3)",
        //         display: "grid",
        //         placeItems: "center",
        //         fontFamily: "'Playfair Display', serif",
        //         color: "var(--accent)",
        //         fontSize: "18px",
        //         fontWeight: "600",
        //       },
        //       children: "Pottery of Kera",
        //     }),
        //     React.createElement(
        //       "p",
        //       {
        //         style: {
        //           fontSize: "14px",
        //           color: "var(--muted)",
        //           marginTop: "12px",
        //           lineHeight: "1.5",
        //           fontFamily: "'Neue Montreal', 'Poppins', sans-serif",
        //         },
        //       },
        //       "Hand-thrown red clay pots"
        //     )
        //   ),

        //   /* MINI CARD 2 */
        //   React.createElement(
        //     "div",
        //     {
        //       style: {
        //         borderRadius: "14px",
        //         padding: "16px",
        //         background: "#fff",
        //         border: "1px solid rgba(166,138,100,0.1)",
        //         boxShadow: "0 4px 12px rgba(166,138,100,0.08)",
        //         transition: "all 0.2s ease",
        //       },
        //       onMouseEnter: (e) => {
        //         e.currentTarget.style.transform = "translateY(-4px)";
        //         e.currentTarget.style.boxShadow = "0 6px 16px rgba(166,138,100,0.12)";
        //       },
        //       onMouseLeave: (e) => {
        //         e.currentTarget.style.transform = "translateY(0)";
        //         e.currentTarget.style.boxShadow = "0 4px 12px rgba(166,138,100,0.08)";
        //       },
        //     },
        //     React.createElement("div", {
        //       style: {
        //         height: "130px",
        //         borderRadius: "10px",
        //         background: "linear-gradient(135deg,#fff,#f7efe3)",
        //         display: "grid",
        //         placeItems: "center",
        //         fontFamily: "'Playfair Display', serif",
        //         color: "var(--accent)",
        //         fontSize: "18px",
        //         fontWeight: "600",
        //       },
        //       children: "Weaves of Mira",
        //     }),
        //     React.createElement(
        //       "p",
        //       {
        //         style: {
        //           fontSize: "14px",
        //           color: "var(--muted)",
        //           marginTop: "12px",
        //           lineHeight: "1.5",
        //           fontFamily: "'Neue Montreal', 'Poppins', sans-serif",
        //         },
        //       },
        //       "Handloom scarves & stoles"
        //     )
        //   )
        // ),

        /* FEATURED ARTISAN ROW */
        featuredProduct && React.createElement(
          "div",
          {
            style: {
              marginTop: "20px",
              display: "flex",
              gap: "12px",
              alignItems: "center",
            },
          },
          React.createElement(
            "div",
            {
              style: {
                flex: 1,
                borderRadius: "14px",
                padding: "14px",
                background: "rgba(166,138,100,0.08)",
                fontSize: "15px",
                color: "var(--secondary)",
                fontWeight: "500",
                fontFamily: "'Neue Montreal', 'Poppins', sans-serif",
                cursor: "pointer",
              },
              onClick: () => window.location.href = `/product/${featuredProduct.id}`,
            },
            `Featured artisan: ${featuredProduct.artisan} — ${featuredProduct.category}`
          ),
          React.createElement(
            "div",
            {
              style: {
                width: "50px",
                height: "50px",
                borderRadius: "14px",
                background: "var(--accent)",
                display: "grid",
                placeItems: "center",
                color: "#fff",
                fontSize: "20px",
                fontWeight: "600",
              },
              title: "Certified Authentic",
            },
            "★"
          )
        )
      )
    ),

    /* -------- CATEGORY SECTION -------- */
    React.createElement(
      "section",
      { style: { marginTop: "60px" } },
      
      React.createElement(
        "div",
        { 
          className: "section-title",
          style: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }
        },
        React.createElement(
          "h3",
          { 
            style: { 
              margin: 0,
              fontFamily: "'Playfair Display', serif",
              color: "var(--accent)",
              fontSize: "28px",
            } 
          }, 
          "Explore categories"
        ),
        React.createElement(
          "a", 
          { 
            href: "/categories",
            style: {
              color: "var(--accent)",
              textDecoration: "none",
              fontWeight: "500",
              fontSize: "15px",
              fontFamily: "'Neue Montreal', 'Poppins', sans-serif",
            }
          }, 
          "See all"
        )
      ),
      
      React.createElement(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "24px",
            margin: "0 auto 50px",
            maxWidth: "1400px",
            padding: "0 40px",
          },
        },
        categories.slice(0, 4).map((category) =>
          React.createElement(
            "div",
            {
              key: category.slug,
              onClick: () => window.location.href = `/category/${category.slug}`,
              style: {
                padding: "24px 20px",
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
                  fontSize: "22px",
                  color: "var(--accent)",
                  marginBottom: "8px",
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
                  marginBottom: "12px",
                  lineHeight: "1.5",
                  fontStyle: "normal",
                  fontFamily: "'Neue Montreal', 'Poppins', sans-serif",
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
                  fontFamily: "'Neue Montreal', 'Poppins', sans-serif",
                },
              },
              "Explore products"
            )
          )
        )
      )
    ),

    /* -------- FEATURED PRODUCTS SECTION -------- */
    React.createElement(
      "section",
      { style: { marginTop: "60px" } },

      React.createElement(
        "div",
        { 
          className: "section-title",
          style: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }
        },
        React.createElement(
          "h3",
          { 
            style: { 
              margin: 0,
              fontFamily: "'Playfair Display', serif",
              color: "var(--accent)",
              fontSize: "28px",
            } 
          }, 
          "Featured products"
        ),
        React.createElement(
          "a", 
          { 
            href: "/catalog",
            style: {
              color: "var(--accent)",
              textDecoration: "none",
              fontWeight: "500",
              fontSize: "15px",
              fontFamily: "'Neue Montreal', 'Poppins', sans-serif",
            }
          }, 
          "View catalog"
        )
      ),

      React.createElement(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "24px",
            margin: "0 auto 50px",
            maxWidth: "1400px",
            padding: "0 40px",
          }
        },
        loading ? React.createElement("div", { style: { padding: "20px" } }, "Loading products...") :
        React.createElement(ProductGrid, {
          products: products.slice(0, 4),
        })
      )
    ),

       React.createElement(
        "section",
        {
            style: {
                marginTop: "100px",
                padding: "80px 20px",
                background: "linear-gradient(to bottom, #fff, rgba(166,138,100,0.08))",
                position: "relative",
                overflow: "hidden" // Ensure particles don't spill out
            }
        },
        // Floating Particles Background
        React.createElement(FloatingBackground),
        
        // Decorative line
        React.createElement("div", {
            style: {
                position: "absolute", top: 0, left: 0, width: "100%", height: "1px",
                background: "linear-gradient(90deg, transparent, rgba(166,138,100,0.3), transparent)"
            }
        }),
        
        // Content Wrapper (z-index to sit above particles)
        React.createElement("div", { style: { position: "relative", zIndex: 2 } },
            React.createElement("div", { className: "section-title", style: { textAlign: "center", marginBottom: "60px" } },
                React.createElement("h3", { 
                    style: { 
                        fontFamily: "'Playfair Display', serif", 
                        fontSize: "36px", 
                        color: "var(--accent)",
                        marginBottom: "16px"
                    } 
                }, "Why CraftConnect?"),
                React.createElement("p", { 
                    style: { 
                        maxWidth: "600px", margin: "0 auto", 
                        color: "var(--text)", fontSize: "16px",
                        fontFamily: "'Neue Montreal', 'Poppins', sans-serif"
                    } 
                }, "We're building a future where tradition meets transparency.")
            ),
            
            React.createElement("div", {
                style: {
                    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "30px",
                    maxWidth: "1200px", margin: "0 auto"
                }
            },
               [
                   { 
                       title: "Direct to Artisan", 
                       desc: "No middlemen. 100% of the listed price and profits go directly to the artisan families.",
                       svg: React.createElement("svg", { width: "40", height: "40", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" },
                           React.createElement("path", { d: "M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" }),
                           React.createElement("path", { d: "M12 5.36l-1.4 1.4" })
                       ) 
                   },
                   { 
                       title: "Authenticity Assured", 
                       desc: "Every item is hand-verified. We visit villages to ensure true craftsmanship.",
                       svg: React.createElement("svg", { width: "40", height: "40", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" },
                            React.createElement("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }),
                            React.createElement("path", { d: "M9 12l2 2 4-4" })
                       ) 
                   },
                   { 
                       title: "Planet Conscious", 
                       desc: "Sustainable materials, plastic-free packaging, and carbon-neutral shipping.",
                       svg: React.createElement("svg", { width: "40", height: "40", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" },
                           React.createElement("path", { d: "M12 10a6 6 0 0 0-6-6c-2 0-3 .5-3.5 1.5 1.5 3 4 5 3.5 7.5.5-1.5 2.5-3.5 6-3z" }), 
                           React.createElement("path", { d: "M12 10a6 6 0 0 1 6-6c2 0 3 .5 3.5 1.5-1.5 3-4 5-3.5 7.5-.5-1.5-2.5-3.5-6-3z" }), 
                           React.createElement("path", { d: "M12 22v-7" }) 
                       )
                   }
               ].map((feature, i) => 
                   React.createElement("div", { 
                       key: i, 
                       style: { 
                           background: "rgba(255,255,255,0.4)", 
                           backdropFilter: "blur(4px)",
                           padding: "40px 30px",
                           borderRadius: "16px",
                           border: "1px solid rgba(166,138,100,0.15)",
                           boxShadow: "0 0 0 transparent",
                           textAlign: "center",
                           transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                           display: "flex", flexDirection: "column", alignItems: "center",
                           cursor: "default"
                       },
                       onMouseEnter: (e) => {
                           e.currentTarget.style.transform = "translateY(-8px)";
                           e.currentTarget.style.background = "#fff";
                           e.currentTarget.style.boxShadow = "0 20px 40px rgba(166,138,100,0.15)";
                           e.currentTarget.style.borderColor = "rgba(166,138,100,0.3)";
                       },
                       onMouseLeave: (e) => {
                           e.currentTarget.style.transform = "translateY(0)";
                           e.currentTarget.style.background = "rgba(255,255,255,0.4)";
                           e.currentTarget.style.boxShadow = "0 0 0 transparent";
                           e.currentTarget.style.borderColor = "rgba(166,138,100,0.15)";
                       }
                   },
                       React.createElement("div", { 
                           style: { 
                               width: "70px", height: "70px",
                               borderRadius: "50%",
                               background: "linear-gradient(135deg, rgba(166,138,100,0.1), rgba(166,138,100,0.05))",
                               display: "grid", placeItems: "center",
                               marginBottom: "24px",
                               color: "var(--accent)"
                           } 
                       }, feature.svg),
                       
                       React.createElement("h4", { 
                           style: { 
                               fontSize: "22px", 
                               marginBottom: "12px", 
                               color: "var(--accent)",
                               fontFamily: "'Playfair Display', serif" 
                           } 
                       }, feature.title),
                       
                       React.createElement("p", { 
                           style: { 
                               color: "var(--text)", 
                               lineHeight: "1.6",
                               fontSize: "15px",
                               marginTop: "auto",
                               fontFamily: "'Neue Montreal', 'Poppins', sans-serif",
                               opacity: 0.85
                           } 
                       }, feature.desc)
                   )
               )
            )
        )
    ),

    /* -------- TESTIMONIALS -------- */
    React.createElement(
        "section",
        {
            style: {
                marginTop: "0px",
                padding: "80px 20px",
                background: "rgba(166, 138, 100, 0.15)" // Soft Latte (Matches Homepage Accent)
            }
        },
        React.createElement("div", { className: "section-title", style: { textAlign: "center", marginBottom: "50px" } },
            React.createElement("h3", { style: { fontFamily: "'Playfair Display', serif", fontSize: "32px", color: "#4E342E" } }, "Words from our Community")
        ),
        React.createElement("div", {
            style: {
                display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px",
                maxWidth: "1200px", margin: "0 auto"
            }
        },
           [
               { name: "Priya S.", loc: "Mumbai", quote: "The pottery I bought is absolutely stunning. You can feel the love put into it." },
               { name: "Rahul M.", loc: "Bangalore", quote: "Finally, a place where I know my money is actually helping the weavers." },
               { name: "Sarah J.", loc: "Delhi", quote: "The AR feature helped me pick the perfect rug size! Amazing experience." }
           ].map((t, i) => 
               React.createElement("div", { 
                   key: i, 
                   style: { 
                       padding: "30px", borderRadius: "16px", 
                       // Glossy Coffee Gradient
                       background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(215,204,200,0.7))", 
                       backdropFilter: "blur(12px)",
                       WebkitBackdropFilter: "blur(12px)", // Safari support
                       border: "1px solid rgba(255,255,255,0.8)",
                       boxShadow: "0 10px 30px rgba(109,76,65,0.15)", // Soft Brown Glow
                       transition: "transform 0.3s ease",
                       cursor: "default"
                   },
                   onMouseEnter: (e) => { e.currentTarget.style.transform = "translateY(-5px)"; },
                   onMouseLeave: (e) => { e.currentTarget.style.transform = "translateY(0)"; }
               },
                   React.createElement("div", { style: { color: "var(--accent)", fontSize: "24px", marginBottom: "16px" } }, "❝"),
                   React.createElement("p", { style: { fontStyle: "italic", marginBottom: "20px", color: "#3E2723", lineHeight: "1.6" } }, t.quote),
                   React.createElement("div", { style: { fontWeight: "bold", color: "#5D4037" } }, t.name),
                   React.createElement("div", { style: { fontSize: "12px", color: "#8D6E63" } }, t.loc)
               )
           )
        )
    ),

    /* -------- NEWSLETTER -------- */
    React.createElement(
        "section",
        {
            style: {
                padding: "80px 20px",
                background: "var(--accent)",
                color: "#fff",
                textAlign: "center"
            }
        },
        React.createElement("h3", { style: { fontFamily: "'Playfair Display', serif", fontSize: "36px", marginBottom: "16px" } }, "Join the Movement"),
        React.createElement("p", { style: { fontSize: "16px", opacity: "0.9", marginBottom: "32px", maxWidth: "600px", margin: "0 auto 32px" } }, "Get stories of heritage, exclusive collections, and artisan updates delivered to your inbox."),
        React.createElement("div", { 
            style: { 
                display: "flex", gap: "10px", justifyContent: "center", maxWidth: "500px", margin: "0 auto",
                flexWrap: "wrap"
            } 
        },
            React.createElement("input", { 
                type: "email", 
                placeholder: "Enter your email", 
                style: { 
                    padding: "16px", borderRadius: "8px", border: "none", flex: "1", minWidth: "250px",
                    outline: "none"
                } 
            }),
            React.createElement("button", { 
                style: { 
                    padding: "16px 32px", borderRadius: "8px", border: "1px solid #fff", 
                    background: "transparent", color: "#fff", fontWeight: "bold", cursor: "pointer" 
                },
                onMouseEnter: (e) => { e.target.style.background = "#fff"; e.target.style.color = "var(--accent)"; },
                onMouseLeave: (e) => { e.target.style.background = "transparent"; e.target.style.color = "#fff"; }
            }, "Subscribe")
        )
    ),

    /* -------- FOOTER -------- */
    React.createElement(Footer)
  );
}

/* --- HELPER: Floating Background Particles --- */
function FloatingBackground() {
    // Inject Styles once
    useEffect(() => {
        const styleId = 'floating-anim-style';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
                @keyframes floatUp {
                    0% { transform: translateY(0) rotate(0deg) translateX(0); opacity: 0; }
                    10% { opacity: 0.6; }
                    90% { opacity: 0.6; }
                    100% { transform: translateY(-1200px) rotate(360deg) translateX(50px); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }, []);

    // High-Fidelity Artisan Icons (Sourced for Visual Relevance)
    const icons = [
        // Classic Pottery Vase (Elegant Curve)
        React.createElement("svg", { viewBox: "0 0 24 24", fill: "currentColor" }, 
            React.createElement("path", { d: "M16.23 2H7.77C6.67 2 6.07 3.32 6.81 4.14L7.5 4.91C8.25 5.74 8.5 7.03 7.85 8.04C7.03 9.32 6 11.23 6 13.5C6 17.64 9.36 21 13.5 21H16V19H13.5C10.46 19 8 16.54 8 13.5C8 11.69 8.84 10.15 9.54 9.13C10.87 7.21 10.39 4.69 8.94 3.09C8.94 3.09 9.12 3.29 9.24 3.42L8.94 3.09L8.3 2.37C8.12 2.17 8.26 1.85 8.53 1.85H15.47C15.74 1.85 15.88 2.17 15.7 2.37L15.06 3.09C13.61 4.69 13.13 7.21 14.46 9.13C15.16 10.15 16 11.69 16 13.5C16 15.5 15.2 17.3 13.92 18.59L15.42 19.91C17.02 18.23 18 15.98 18 13.5C18 11.23 16.97 9.32 16.15 8.04C15.5 7.03 15.75 5.74 16.5 4.91L17.19 4.14C17.93 3.32 17.33 2 16.23 2Z" })
        ),
        
        // Clay Pot (Traditional & Sturdy)
        React.createElement("svg", { viewBox: "0 0 24 24", fill: "currentColor" }, 
            React.createElement("path", { d: "M19 9c-1.1-2.9-3.3-4-3.3-4C15.1 4.5 13.5 4 12 4S8.9 4.5 8.3 5c0 0-2.2 1.1-3.3 4C4 11.8 6 18 6 18c.8 1.8 2.5 3 4.5 3h3c2 0 3.7-1.2 4.5-3 0 0 2-6.2 1-9zM12 6c.8 0 1.5.3 2 .8.5.5.9 1.4.9 2.2H9.1c0-.8.4-1.7.9-2.2.5-.5 1.2-.8 2-.8z" })
        ),
        
        // Woven Basket (Intricate Craft)
        React.createElement("svg", { viewBox: "0 0 24 24", fill: "currentColor" }, 
            React.createElement("path", { d: "M12 2l-5.5 9h11L12 2zm0 3.8L14.2 9H9.8L12 5.8zM4 13c0 4.4 3.6 8 8 8s8-3.6 8-8h-2c0 3.3-2.7 6-6 6s-6-2.7-6-6H4zm1-2h14v1H5z" })
        ),

        // Handmade / Artisan Hand
        React.createElement("svg", { viewBox: "0 0 24 24", fill: "currentColor" }, 
            React.createElement("path", { d: "M21.5 12.5c-.83 0-1.5-.67-1.5-1.5V6.76l-1.39-4.88c-.14-.5-.6-.85-1.12-.86H6.51c-.53 0-.99.35-1.12.86L4 6.76V11c0 .83-.67 1.5-1.5 1.5S1 11.83 1 11V6c0-1.1.9-2 2-2h.09l1-3.51C4.38.16 4.67 0 5 0h14c.33 0 .62.16.91.49L21 4h.09c1.1 0 2 .9 2 2v5c0 .83-.67 1.5-1.5 1.5zm-5 6h-9c-1.1 0-2 .9-2 2v2c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-2c0-1.1-.9-2-2-2z" })
        )
    ];

    // Darker, Rich Artistic Palette (High Visibility)
    const colors = [
        "rgba(80, 50, 30, 0.7)",   // Deep Walnut
        "rgba(120, 60, 20, 0.65)", // Terracotta
        "rgba(50, 50, 50, 0.6)",   // Charcoal
        "rgba(85, 107, 47, 0.7)"   // Dark Olive
    ];

    // Generate random particles
    const particles = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        icon: icons[i % icons.length],
        color: colors[i % colors.length],
        left: Math.random() * 100, // %
        duration: 22 + Math.random() * 18, // 22-40s float
        delay: Math.random() * -30, 
        size: 30 + Math.random() * 40 // 30-70px varied size
    }));

    return React.createElement("div", {
        style: {
            position: "absolute",
            top: 0, left: 0, width: "100%", height: "100%",
            pointerEvents: "none", zIndex: 0
        }
    },
        particles.map(p => 
            React.createElement("div", {
                key: p.id,
                style: {
                    position: "absolute",
                    left: `${p.left}%`,
                    bottom: "-150px", // Start further below
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    color: p.color, 
                    animation: `floatUp ${p.duration}s ease-in-out infinite alternate`, 
                    animationName: "floatUp", 
                    animationDuration: `${p.duration}s`,
                    animationTimingFunction: "linear",
                    animationIterationCount: "infinite",
                    animationDelay: `${p.delay}s`,
                    opacity: 0 
                }
            }, p.icon)
        )
    );
}

export default HomePage;
