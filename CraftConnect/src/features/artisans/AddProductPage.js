import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiService from "../../shared/services/api";
import { useAuth } from "../../shared/hooks/useAuth";
import Footer from "../../shared/components/Footer";
import Navbar from "../../shared/components/Navbar";

function AddProductPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // Check if ID exists (Edit Mode)
  const { user } = useAuth();
  
  const [formData, setFormData] = React.useState({
      title: "", category: "", price: "", description: "", stock: ""
  });
  const [loading, setLoading] = React.useState(false);
  const [initialLoading, setInitialLoading] = React.useState(false); // New state for initial fetch
  const [categories, setCategories] = React.useState([]);
  const [images, setImages] = React.useState([]);


  React.useEffect(() => {
      const loadData = async () => {
          setInitialLoading(true);
          await fetchCategories();
          if (id) {
              await fetchProductForEdit();
          }
          setInitialLoading(false);
      };
      loadData();
  }, [id]);

  const fetchCategories = async () => {
      try {
          const data = await apiService.getCategories();
          setCategories(data);
      } catch (err) {
          console.error("Failed to load categories");
      }
  };

  const fetchProductForEdit = async () => {
      try {
          const product = await apiService.getProductById(id);
          if (product) {
              // Extract category ID whether it's populated or an ID string
              const categoryId = product.category?._id || product.category;
              
              setFormData({
                  title: product.title || product.name,
                  category: categoryId || "",
                  price: product.price,
                  description: product.description || "", 
                  stock: product.stock
              });

          }
      } catch (err) {
          console.error("Failed to load product");
      }
  };
    const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
          // ENSURE NUMERIC VALUES
          const payload = new FormData();
            payload.append("title", formData.title);
            payload.append("description", formData.description);
            payload.append("price", Number(formData.price));
            payload.append("stock", Number(formData.stock));
            payload.append(
              "category",
              typeof formData.category === "object"
                ? formData.category._id
                : formData.category
            );

            // Attach images
            const imageInput = document.querySelector('input[type="file"]');
            if (imageInput?.files?.length) {
              Array.from(imageInput.files).forEach(file => {
                payload.append("images", file);
              });
            }



          if (id) {
              await apiService.updateProduct(id, formPayload);
              alert("Product updated successfully!");
          } else {
               formPayload.append("artisanId", user.id);
               await apiService.addProduct(formPayload);
               alert("Product added successfully!");
          }
          navigate("/artisan/products"); // Go to products list
      } catch (err) {
          console.error("Submit Error:", err);
          alert("Operation failed: " + (err.message || "Unknown error"));
      } finally {
          setLoading(false);
      }
  };

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Navbar),
    React.createElement(
      "div",
      { className: "container" },
      React.createElement(
        "button",
        {
          onClick: () => navigate("/artisan/dashboard"),
          style: {
            background: "transparent",
            border: "1px solid var(--secondary)",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            color: "var(--secondary)",
            marginBottom: "20px",
          },
        },
        "← Back to Dashboard"
      ),
      initialLoading
        ? React.createElement(
            "div",
            { style: { textAlign: "center", padding: "60px" } },
            React.createElement("div", {
              className: "spinner",
              style: {
                width: "40px",
                height: "40px",
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #3E2723",
                borderRadius: "50%",
                margin: "0 auto 20px",
                animation: "spin 1s linear infinite",
              },
            }),
            React.createElement(
              "p",
              { style: { color: "var(--secondary)" } },
              "Loading product details..."
            ),
            React.createElement("style", null, `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`)
          )
        : React.createElement(
            "div",
            { style: { maxWidth: "700px", margin: "0 auto" } },
            React.createElement(
              "div",
              {
                style: {
                  background: "linear-gradient(180deg, #fff, rgba(248,244,239,0.9))",
                  padding: "40px",
                  borderRadius: "18px",
                  border: "1px solid rgba(62,44,32,0.08)",
                },
              },
              React.createElement(
                "h1",
                {
                  style: {
                    fontFamily: "'Playfair Display', serif",
                    color: "var(--accent)",
                    fontSize: "32px",
                    marginBottom: "30px",
                    textAlign: "center",
                  },
                },
                id ? "Edit Product" : "Add New Product"
              ),
              React.createElement(
                "form",
                {
                  style: { display: "flex", flexDirection: "column", gap: "20px" },
                  onSubmit: handleSubmit,
                },
                React.createElement(
                  "div",
                  null,
                  React.createElement(
                    "label",
                    {
                      style: {
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "var(--accent)",
                      },
                    },
                    "Product Name"
                  ),
                  React.createElement("input", {
                    type: "text",
                    required: true,
                    placeholder: "e.g., Handcrafted Clay Pot",
                    value: formData.title,
                    onChange: (e) => setFormData({ ...formData, title: e.target.value }),
                    style: {
                      width: "100%",
                      padding: "12px",
                      borderRadius: "10px",
                      border: "1px solid rgba(62,44,32,0.15)",
                      fontSize: "14px",
                    },
                  })
                ),
                React.createElement(
                  "div",
                  { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" } },
                  React.createElement(
                    "div",
                    null,
                    React.createElement(
                      "label",
                      {
                        style: {
                          display: "block",
                          marginBottom: "8px",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "var(--accent)",
                        },
                      },
                      "Category"
                    ),
                    React.createElement(
                      "select",
                      {
                        required: true,
                        value: formData.category,
                        onChange: (e) => setFormData({ ...formData, category: e.target.value }),
                        style: {
                          width: "100%",
                          padding: "12px",
                          borderRadius: "10px",
                          border: "1px solid rgba(62,44,32,0.15)",
                          fontSize: "14px",
                        },
                      },
                      React.createElement("option", { value: "" }, "Select category"),
                      categories.map((cat) =>
                        React.createElement("option", { key: cat._id, value: cat._id }, cat.name)
                      )
                    )
                  ),
                  React.createElement(
                    "div",
                    null,
                    React.createElement(
                      "label",
                      {
                        style: {
                          display: "block",
                          marginBottom: "8px",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "var(--accent)",
                        },
                      },
                      "Price (₹)"
                    ),
                    React.createElement("input", {
                      type: "number",
                      required: true,
                      placeholder: "999",
                      min: "0",
                      value: formData.price,
                      onChange: (e) => setFormData({ ...formData, price: e.target.value }),
                      style: {
                        width: "100%",
                        padding: "12px",
                        borderRadius: "10px",
                        border: "1px solid rgba(62,44,32,0.15)",
                        fontSize: "14px",
                      },
                    })
                  )
                ),
                React.createElement(
                  "div",
                  null,
                  React.createElement(
                    "label",
                    {
                      style: {
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "var(--accent)",
                      },
                    },
                    "Description"
                  ),
                  React.createElement("textarea", {
                    required: true,
                    rows: 5,
                    placeholder: "Describe your handcrafted product...",
                    value: formData.description,
                    onChange: (e) => setFormData({ ...formData, description: e.target.value }),
                    style: {
                      width: "100%",
                      padding: "12px",
                      borderRadius: "10px",
                      border: "1px solid rgba(62,44,32,0.15)",
                      fontSize: "14px",
                      fontFamily: "inherit",
                      resize: "vertical",
                    },
                  })
                ),
                React.createElement(
                  "div",
                  null,
                  React.createElement(
                    "div",
                    { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" } },
                    React.createElement(
                      "label",
                      {
                        style: {
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "var(--accent)",
                        },
                      },
                      "Product Images"
                    ),
                    React.createElement(
                      "span",
                      { style: { fontSize: "11px", color: "var(--muted)", background: "rgba(166,138,100,0.1)", padding: "4px 8px", borderRadius: "4px" } },
                      "💡 Tip: Use transparent/white background for best AR results"
                    )
                  ),
                  React.createElement("input", {
                      type: "file",
                      accept: "image/*",
                      multiple: true,
                      onChange: handleImageChange,
                      style: {
                        width: "100%",
                        padding: "12px",
                        borderRadius: "10px",
                        border: "1px solid rgba(62,44,32,0.15)",
                        fontSize: "14px",
                      },
                    })
                ),
                React.createElement(
                  "div",
                  { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" } },
                  React.createElement(
                    "div",
                    null,
                    React.createElement(
                      "label",
                      {
                        style: {
                          display: "block",
                          marginBottom: "8px",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "var(--accent)",
                        },
                      },
                      "Stock Quantity"
                    ),
                    React.createElement("input", {
                      type: "number",
                      required: true,
                      placeholder: "10",
                      min: "0",
                      value: formData.stock,
                      onChange: (e) => setFormData({ ...formData, stock: e.target.value }),
                      style: {
                        width: "100%",
                        padding: "12px",
                        borderRadius: "10px",
                        border: "1px solid rgba(62,44,32,0.15)",
                        fontSize: "14px",
                      },
                    })
                  ),
                ),
                //   React.createElement(
                //     "div",
                //     null,
                //     React.createElement(
                //       "label",
                //       {
                //         style: {
                //           display: "block",
                //           marginBottom: "8px",
                //           fontSize: "14px",
                //           fontWeight: "600",
                //           color: "var(--accent)",
                //         },
                //       },
                //       "SKU"
                //     ),
                //     React.createElement("input", {
                //       type: "text",
                //       placeholder: "PROD-001",
                //       value: formData.sku,
                //       onChange: (e) => setFormData({ ...formData, sku: e.target.value }),
                //       style: {
                //         width: "100%",
                //         padding: "12px",
                //         borderRadius: "10px",
                //         border: "1px solid rgba(62,44,32,0.15)",
                //         fontSize: "14px",
                //       },
                //     })
                //   )
                // ),
                React.createElement(
                  "div",
                  { style: { display: "flex", gap: "12px", marginTop: "10px" } },
                  React.createElement(
                    "button",
                    {
                      type: "submit",
                      className: "cta",
                      disabled: loading,
                      style: {
                        flex: 1,
                        padding: "14px",
                        fontSize: "16px",
                      },
                    },
                    loading ? "Saving..." : id ? "Update Product" : "Add Product"
                  ),
                  React.createElement(
                    "button",
                    {
                      type: "button",
                      className: "cta secondary-cta",
                      style: {
                        flex: 1,
                        padding: "14px",
                        fontSize: "16px",
                      },
                      onClick: () => navigate("/artisan/dashboard"),
                    },
                    "Cancel"
                  )
                )
              )
            )
          )
    ),
    React.createElement(Footer)
  );
}

export default AddProductPage;
