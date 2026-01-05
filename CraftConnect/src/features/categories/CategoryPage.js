import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../shared/components/Navbar";
import ProductGrid from "../../features/products/ProductGrid";
import apiService from "../../shared/services/api";
import CategoryIcon from "./CategoryIcon";
import Footer from "../../shared/components/Footer";
import FloatingBackground from "../../shared/components/FloatingBackground";

function CategoryPage() {
  const { name } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);

  
  // Filter & Sort State
  const [sortBy, setSortBy] = useState("newest"); // newest, price-low, price-high
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [showFilters, setShowFilters] = useState(false); // Mobile toggle

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiService.getProducts();
        const productList = Array.isArray(data) ? data : (data.products || []);
        
        // Map backend fields
        const formatted = productList.map(p => ({
            ...p,
            id: p._id || p.id,
            price: Number(p.price),
            category: p.category,
            categoryName: p.category?.name || "",
            categorySlug: p.category?.slug || "",
            artisan: p.artisan?.name || "Unknown Artisan",
            createdAt: p.createdAt || new Date(0)
        }));

        setProducts(formatted);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    fetchCategory();
  }, [name]);


  // Description map
    const fetchCategory = async () => {
        try {
            const data = await apiService.getCategories();
            const match = data.find(cat => cat.slug === name);
            setCategory(match || null);
        } catch (err) {
            console.error("Failed to fetch category", err);
        }
    };


  // Image URL Helper
  const getImageUrl = (path) => {
      if (!path) return "https://via.placeholder.com/300?text=No+Image";
      if (path.startsWith("http")) return path;
      return `http://localhost:3001${path}`;
  };

  const processedProducts = useMemo(() => {
      // 1. Filter by Category (Case-insensitive partial match)
      let result = products;
      
      if (name) {
        const targetSlug = name.toLowerCase();
        result = result.filter(p => p.categorySlug === targetSlug); 
      }
   


      // 2. Filter by Price
      result = result.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);

      // 3. Sort
      if (sortBy === "price-low") {
          result.sort((a, b) => a.price - b.price);
      } else if (sortBy === "price-high") {
          result.sort((a, b) => b.price - a.price);
      } else {
          // Newest
          result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      
      // Fix images for grid
      return result.map(p => ({
          ...p,
          image: getImageUrl(p.images?.[0] || p.image) 
      }));
  }, [products, name, priceRange, sortBy]);
  

  // Background images for headers
  const headerImages = {
      pottery: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=1920",
      handloom: "https://images.unsplash.com/photo-1528574698132-0a82200670d5?auto=format&fit=crop&q=80&w=1920",
      woodcraft: "https://images.unsplash.com/photo-1610701596061-2ecf2022a585?auto=format&fit=crop&q=80&w=1920",
      bamboo: "https://images.unsplash.com/photo-1519781542704-957ff19aa471?auto=format&fit=crop&q=80&w=1920",
      default: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&q=80&w=1920"
  };

  const currentHeaderBg = headerImages[name?.toLowerCase()] || headerImages.default;

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#121212" }}>
      {/* Fixed Background Layer */}
      <div style={{
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
      }}></div>
      
      {/* Black Tint Overlay */}
      <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.7)",
          zIndex: 1
      }}></div>

      <div style={{ position: "relative", zIndex: 10 }}>
        {/* Header/Navbar Wrapper with background */}
        <div style={{ background: "#FDFBF7" }}>
          <Navbar />
        </div>
        
        {/* STORYBOOK STYLE HEADER */}
        <div style={{ 
            position: "relative",
            padding: "60px 20px 100px",
            overflow: "hidden",
            textAlign: "center",
            background: "#2C2016", // Solid dark background for banner
            borderBottom: "1px solid rgba(166,138,100,0.3)"
        }}>
            {/* Background Image with Overlay (Specific Category Image) */}
            <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundImage: `url(${currentHeaderBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
                opacity: 0.6, // Increased opacity to hide wallpaper completely
                zIndex: 0
            }}></div>
            
            {/* Vignette Shadow Effect */}
            <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "radial-gradient(circle, transparent 40%, rgba(0,0,0,0.7) 100%)",
                pointerEvents: "none",
                zIndex: 1
            }}></div>
            
            {/* Floating Particles */}
            <div style={{ opacity: 0.3, position: "relative", zIndex: 1 }}>
              <FloatingBackground />
            </div>

          {/* Breadcrumbs */}
          <div style={{ position: "relative", zIndex: 4, marginBottom: "24px", fontSize: "12px", color: "rgba(232,222,209,0.8)", fontWeight: "500", letterSpacing: "2px" }}>
            <span style={{ cursor: "pointer", transition: "color 0.2s" }} onClick={() => window.location.href="/"}>HOME</span>
            <span style={{ margin: "0 12px", opacity: 0.4 }}>›</span>
            <span style={{ color: "#E8DED1" }}>{name?.toUpperCase()}</span>
          </div>

          <div className="container" style={{ position: "relative", zIndex: 2, maxWidth: "800px", margin: "0 auto" }}>
             
             {/* Glass Icon Box with Glow */}
             <div style={{ 
                 display: "inline-block", 
                 padding: "16px", 
                 background: "linear-gradient(135deg, rgba(166,138,100,0.4), rgba(166,138,100,0.2))", 
                 backdropFilter: "blur(10px)",
                 borderRadius: "50%", 
                 marginBottom: "20px", 
                 boxShadow: "0 15px 40px rgba(0,0,0,0.4), inset 0 0 20px rgba(255,255,255,0.1)",
                 border: "1px solid rgba(232,222,209,0.3)"
             }}>
                <span style={{ filter: "brightness(0) invert(1)" }}>
                    <CategoryIcon category={category?.name || ""} size={40} />
                </span>
             </div>
             
             <h1 style={{ 
                 fontFamily: "'Playfair Display', serif", 
                 fontSize: "52px", 
                 color: "#E8DED1",
                 marginBottom: "16px",
                 fontWeight: "700",
                 letterSpacing: "-0.5px",
                 textShadow: "2px 4px 20px rgba(0,0,0,0.6)"
             }}>
                 {category?.name}
             </h1>
             
             {/* Decorative Line */}
             <div style={{ 
                 width: "80px", 
                 height: "3px", 
                 background: "linear-gradient(90deg, transparent, rgba(166,138,100,1), transparent)", 
                 margin: "0 auto 20px", 
                 borderRadius: "2px"
             }}></div>
 
             <p style={{ 
                 color: "rgba(232,222,209,0.95)",
                 fontSize: "17px", 
                 lineHeight: "1.7",
                 fontFamily: "'Neue Montreal', sans-serif",
                 maxWidth: "600px",
                 margin: "0 auto 28px",
                 fontWeight: "400",
                 fontStyle: "italic",
                 textShadow: "1px 1px 4px rgba(0,0,0,0.4)"
             }}>
                 {category?.description}
             </p>

             {/* BADGES ROW */}
             <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
                {["Authentic", "Handcrafted", "Direct from Artisan"].map(tag => (
                    <span key={tag} style={{ 
                        background: "rgba(166,138,100,0.25)", 
                        border: "1px solid rgba(232,222,209,0.3)",
                        padding: "8px 20px", 
                        borderRadius: "24px", 
                        color: "#E8DED1", 
                        fontSize: "13px",
                        fontWeight: "600",
                        backdropFilter: "blur(4px)",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
                    }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginRight: "6px", verticalAlign: "middle" }}>
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        {tag}
                    </span>
                ))}
             </div>
          </div>
      </div>

      {/* Content Area */}
      <div className="container" style={{ maxWidth: "1200px", margin: "-40px auto 60px", padding: "0 20px", position: "relative", zIndex: 3 }}>
        
        {/* TOOLBAR */}
        <div style={{ 
            background: "#fff",
            borderRadius: "16px", 
            padding: "16px 30px",
            boxShadow: "0 15px 40px rgba(62,39,35,0.12)",
            display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "20px",
            border: "1px solid rgba(0,0,0,0.1)",
            marginBottom: "40px",
            color: "#4E342E" 
        }}>
            {/* Left: Result Count */}
             <span style={{ color: "#5D4037", fontWeight: "700", fontSize: "15px" }}>
                Found {processedProducts.length} unique items
            </span>

            {/* Right: Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                
                {/* Price Range */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingRight: "20px", borderRight: "1px solid #eee" }}>
                    <span style={{ fontSize: "14px", color: "#6D4C41", fontWeight: "600" }}>Price:</span>
                    <input 
                        type="number" placeholder="Min" value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                        style={{ width: "70px", padding: "8px", borderRadius: "8px", border: "1px solid #ddd", background: "#FAFAFA" }}
                    />
                    <span style={{ color: "#aaa" }}>-</span>
                    <input 
                        type="number" placeholder="Max" value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                        style={{ width: "70px", padding: "8px", borderRadius: "8px", border: "1px solid #ddd", background: "#FAFAFA" }}
                    />
                </div>

                {/* Sort By */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "14px", color: "#6D4C41", fontWeight: "600" }}>Sort by:</span>
                    <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{ 
                            padding: "10px 16px", borderRadius: "8px", 
                            border: "1px solid #ddd", 
                            background: "#FAFAFA", cursor: "pointer",
                            color: "#3E2723", fontWeight: "500"
                        }}
                    >
                        <option value="newest">Newest Arrivals</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to High</option>
                    </select>
                </div>
            </div>
        </div>

        {/* PRODUCT GRID - FULL WIDTH */}
        <main>
            {loading ? (
                    <div style={{ textAlign: 'center', padding: '80px' }}>
                        <div style={{ display: "inline-block", width: "40px", height: "40px", border: "4px solid #ddd", borderTopColor: "#3E2723", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
                        <p style={{ marginTop: "20px", color: "#8D6E63" }}>Curating collection...</p>
                        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    </div>
            ) : (
                <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "30px",
                }}
                >
                {processedProducts.length > 0 ? (
                    <ProductGrid products={processedProducts} />
                ) : (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: "80px", background: "#fff", borderRadius: "20px", border: "1px dashed #ccc" }}>
                        <div style={{ fontSize: "40px", marginBottom: "20px" }}>🏺</div>
                        <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#3E2723", marginBottom: "10px" }}>No products found</h3>
                        <p style={{ color: '#8D6E63', maxWidth: "400px", margin: "0 auto 20px" }}>We couldn't find any items matching your filters. Try adjusting the price range.</p>
                        <button 
                            onClick={() => { setPriceRange({min:0, max:10000}); setSortBy("newest"); }}
                            style={{ 
                                background: "#3E2723", color: "#fff", border: "none", 
                                padding: "10px 24px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" 
                            }}
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
                </div>
            )}
        </main>
      </div>
      
      {/* Footer Area with solid background */}
      <div style={{ background: "#FDFBF7", paddingBottom: "20px", borderTop: "1px solid rgba(166,138,100,0.1)" }}>
        <Footer />
      </div>
    </div>
  </div>
  );
}

export default CategoryPage;
