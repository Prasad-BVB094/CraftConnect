import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../../shared/components/Navbar";
import ProductGrid from "../../features/products/ProductGrid";
import apiService from "../../shared/services/api";

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
        try {
            const data = await apiService.getProducts();
            setProducts(data);
        } catch (err) {
            console.error("Failed to fetch products for search", err);
        } finally {
            setLoading(false);
        }
    };
    fetchProducts();
  }, []);

  // Update query state from URL params
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(decodeURIComponent(q));
    }
  }, [searchParams]);

  const filtered = products.filter((item) => {
    if (!query) return true;
    const q = query.toLowerCase();

    return (
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.artisan?.name && item.artisan.name.toLowerCase().includes(q)) ||
      (item.category?.name && item.category.name.toLowerCase().includes(q))
    );
  });

  return (
    <>
      <Navbar />
      <div className="container">

        {/* PAGE TITLE */}
        <h2
          style={{
            marginTop: "30px",
            marginBottom: "20px",
            fontFamily: "'Playfair Display', serif",
            color: "var(--accent)",
          }}
        >
          Search
        </h2>

        {/* SEARCH BAR */}
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            value={query}
            placeholder="Search for products, artisans, categories..."
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setSearchParams({ q: encodeURIComponent(query) });
              }
            }}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              border: "1px solid rgba(62,44,32,0.12)",
              fontSize: "16px",
            }}
          />
        </div>

        {/* CATEGORY FILTER CHIP BAR
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          {["Pottery", "Handloom", "Woodcraft", "Bamboo", "Jewelry"].map((c) => (
            <div
              key={c}
              className="chip"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setQuery(c.toLowerCase());
                setSearchParams({ q: encodeURIComponent(c.toLowerCase()) });
              }}
            >
              {c}
            </div>
          ))}
        </div> */}

        {/* RESULTS COUNT */}
        <p style={{ color: "var(--muted)", marginBottom: "10px" }}>
          {loading ? "Searching..." : `${filtered.length} results found`}
        </p>

        {/* PRODUCT GRID */}
        {loading ? (
             <div>Loading...</div>
        ) : (
            <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "24px",
                marginBottom: "50px",
            }}
            >
            <ProductGrid products={filtered} />
            </div>
        )}

        {/* FOOTER */}
        <footer style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Neue Montreal', 'Poppins', sans-serif" }}>
            © CraftConnect — handcrafted community
          </div>
          <div style={{ fontFamily: "'Neue Montreal', 'Poppins', sans-serif" }}>
            Made with ❤️ | Beige & brown theme
          </div>
        </footer>
      </div>
    </>
  );
}

export default SearchPage;
