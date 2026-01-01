import React, { useEffect, useState } from "react";
import Navbar from "../../shared/components/Navbar";
import apiService from "../../shared/services/api";


function ManageProductsPage() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);


const filtered = products.filter((p) => {
  const q = query.toLowerCase();
  return (
    p.title?.toLowerCase().includes(q) ||
    p.artisan?.name?.toLowerCase().includes(q) ||
    p.category?.name?.toLowerCase().includes(q)
  );
});



const handleDelete = async (id) => {
  if (!window.confirm("Delete this product permanently?")) return;
  try {
    await apiService.deleteAdminProduct(id);
    setProducts(products.filter(p => p._id !== id));
  } catch (err) {
    alert("Delete failed");
  }
};


const handleEdit = async (id) => {
  const product = products.find(p => p._id === id);
  if (!product) return;

  const title = prompt("Title", product.title);
  const price = prompt("Price", product.price);
  const stock = prompt("Stock", product.stock);

  if (!title || !price || !stock) return;

  try {
    const updated = await apiService.adminUpdateProduct(id, {
  title,
  price: Number(price),
  stock: Number(stock),
});

    setProducts(products.map(p => p._id === id ? updated : p));
  } catch {
    alert("Update failed");
  }
};

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const data = await apiService.getAdminProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch admin products", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };
  fetchProducts();
}, []);

  // const handleAddProduct = () => {
  //   const name = prompt("Enter product name:");
  //   const artisan = prompt("Enter artisan name:");
  //   const category = prompt("Enter category:");
  //   const price = prompt("Enter price:");
  //   const stock = prompt("Enter stock:");
    
  //   if (name && artisan && category && price && stock) {
  //     const newProduct = {
  //       id: Date.now(),
  //       name,
  //       artisan,
  //       category,
  //       price: parseInt(price),
  //       stock: parseInt(stock),
  //       created: new Date().toISOString().split('T')[0],
  //       image: "https://via.placeholder.com/300x200"
  //     };
  //     setProducts([...products, newProduct]);
  //     alert(`Product added successfully`);
  //   }
  // };

  return React.createElement(
    "div",
    { className: "container" },

    React.createElement(Navbar),

    /* Title + action */
    React.createElement(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "30px",
          gap: "12px",
          flexWrap: "wrap",
        },
      },
      React.createElement(
        "h2",
        {
          style: {
            fontFamily: "'Playfair Display', serif",
            color: "var(--accent)",
            margin: 0,
          },
        },
        "Manage Products"
      ),
      React.createElement(
        "div",
        null,
        React.createElement(
          "button",
          { className: "cta", disabled: true },
          "Add New Product"
        )
      )
    ),

    /* Search */
    React.createElement("input", {
      type: "text",
      placeholder: "Search by product, artisan, category...",
      value: query,
      onChange: (e) => setQuery(e.target.value),
      style: {
        width: "100%",
        padding: "12px",
        borderRadius: "12px",
        border: "1px solid rgba(62,44,32,0.1)",
        marginTop: "18px",
        marginBottom: "18px",
        fontSize: "15px",
      },
    }),
    loading && React.createElement(
  "p",
  { style: { color: "var(--muted)" } },
  "Loading products..."
),

    /* Products grid */
    React.createElement(
      "div",
      {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "18px",
        },
      },
      filtered.map((p) =>
        React.createElement(
          "div",
          {
            key: p._id,
            style: {
              background: "linear-gradient(180deg,#fff,rgba(248,244,239,0.9))",
              borderRadius: "14px",
              padding: "14px",
              border: "1px solid rgba(62,44,32,0.08)",
              boxShadow: "0 6px 20px rgba(62,44,32,0.05)",
              display: "flex",
              gap: "12px",
              alignItems: "flex-start",
            },
          },

          /* image */
          React.createElement("img", {
            src: (() => {
                if (Array.isArray(p.images) && p.images.length > 0) {
                  const img = p.images[0];
                  return img.startsWith("http")
                    ? img
                    : `http://localhost:3001${img}`;
                }
                if (typeof p.images === "string") {
                  return p.images.startsWith("http")
                    ? p.images
                    : `http://localhost:3001${p.images}`;
                }

                return "https://via.placeholder.com/300x200";
              })(),
            alt: p.title,
            style: {
              width: "120px",
              height: "90px",
              objectFit: "cover",
              borderRadius: "10px",
              border: "1px solid rgba(62,44,32,0.06)",
              flexShrink: 0,
            },
          }),

          /* main info */
          React.createElement(
            "div",
            { style: { flex: 1 } },
            React.createElement(
              "div",
              { style: { display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "flex-start" } },
              React.createElement(
                "div",
                null,
                React.createElement(
                  "h3",
                  { style: { margin: "0 0 6px 0", color: "var(--secondary)" } },
                  p.title
                ),
                React.createElement("div", { style: { color: "var(--muted)", fontSize: "13px", marginBottom: "6px" } }, p.artisan?.name || "—"),
                React.createElement("div", { style: { color: "var(--muted)", fontSize: "13px" } }, `Category: ${p.category?.name}`)
              ),
              React.createElement(
                "div",
                { style: { textAlign: "right" } },
                React.createElement("div", { style: { color: "var(--secondary)", fontWeight: 700 } }, `₹${p.price}`),
                React.createElement("div", { style: { color: "var(--muted)", fontSize: "13px" } }, `Stock: ${p.stock}`)
              )
            ),

            React.createElement(
              "div",
              { style: { display: "flex", gap: "8px", marginTop: "12px" } },
              React.createElement(
                "button",
                {
                  className: "cta",
                  onClick: () => handleEdit(p._id),
                  style: { flex: 1 },
                },
                "Edit"
              ),
              React.createElement(
                "button",
                {
                  className: "cta secondary-cta",
                  onClick: () => handleDelete(p._id),
                  style: { flex: 1 },
                },
                "Delete"
              )
            )
          )
        )
      )
    ),

    /* Footer */
    React.createElement(
      "footer",
      { style: { marginTop: "40px" } },
      React.createElement("div", null, "© CraftConnect — handcrafted community"),
      React.createElement("div", null, "Made with ❤️ | Beige & brown theme")
    )
  );
}

export default ManageProductsPage;
