import React, { useState, useEffect } from "react";
import Navbar from "../../shared/components/Navbar";
import Footer from "../../shared/components/Footer";
import apiService from "../../shared/services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/hooks/useAuth";

// SVG Icons
const Icons = {
  User: () => React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }),
    React.createElement("circle", { cx: "12", cy: "7", r: "4" })
  ),
  Package: () => React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("path", { d: "M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" }),
    React.createElement("polyline", { points: "3.27 6.96 12 12.01 20.73 6.96" }),
    React.createElement("line", { x1: "12", y1: "22.08", x2: "12", y2: "12" })
  ),
  Check: () => React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3" },
    React.createElement("polyline", { points: "20 6 9 17 4 12" })
  ),
  X: () => React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3" },
    React.createElement("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
    React.createElement("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
  ),
  ChevronDown: () => React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("polyline", { points: "6 9 12 15 18 9" })
  ),
  Mail: () => React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("path", { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" }),
    React.createElement("polyline", { points: "22,6 12,13 2,6" })
  ),
  MapPin: () => React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("path", { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" }),
    React.createElement("circle", { cx: "12", cy: "10", r: "3" })
  ),
  Calendar: () => React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2", ry: "2" }),
    React.createElement("line", { x1: "16", y1: "2", x2: "16", y2: "6" }),
    React.createElement("line", { x1: "8", y1: "2", x2: "8", y2: "6" }),
    React.createElement("line", { x1: "3", y1: "10", x2: "21", y2: "10" })
  ),
  ArrowLeft: () => React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("line", { x1: "19", y1: "12", x2: "5", y2: "12" }),
    React.createElement("polyline", { points: "12 19 5 12 12 5" })
  ),
  Search: () => React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("circle", { cx: "11", cy: "11", r: "8" }),
    React.createElement("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
  ),
  Trash: () => React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("polyline", { points: "3 6 5 6 21 6" }),
    React.createElement("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })
  )
};

function ManageArtisansPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [expandedArtisan, setExpandedArtisan] = useState(null);
  const [artisanProducts, setArtisanProducts] = useState({});
  const [loadingProducts, setLoadingProducts] = useState({});
  const [filter, setFilter] = useState("all"); // all, pending, approved

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== "admin") {
      navigate("/login/admin", { replace: true });
      return;
    }
    fetchArtisans();
  }, [user, authLoading]);

  const fetchArtisans = async () => {
    try {
      const data = await apiService.getArtisans();
      const formatted = (Array.isArray(data) ? data : (data.artisans || [])).map(a => ({
        id: a._id || a.id,
        name: a.name || a.businessName || "Unknown",
        email: a.email,
        phone: a.phone || "",
        address: a.address || "",
        bio: a.bio || "",
        isApproved: a.isApproved,
        isVerified: a.isVerified,
        createdAt: a.createdAt,
        productCount: 0
      }));
      setArtisans(formatted);
    } catch (err) {
      console.error("Failed to fetch artisans:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchArtisanProducts = async (artisanId) => {
    if (artisanProducts[artisanId]) return;

    setLoadingProducts(prev => ({ ...prev, [artisanId]: true }));
    try {
      const allProducts = await apiService.getAdminProducts();
      const products = (Array.isArray(allProducts) ? allProducts : [])
        .filter(p => p.artisan?._id === artisanId || p.artisan?.id === artisanId || p.artisan === artisanId);
      setArtisanProducts(prev => ({ ...prev, [artisanId]: products }));
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setArtisanProducts(prev => ({ ...prev, [artisanId]: [] }));
    } finally {
      setLoadingProducts(prev => ({ ...prev, [artisanId]: false }));
    }
  };

  const toggleExpand = (artisanId) => {
    if (expandedArtisan === artisanId) {
      setExpandedArtisan(null);
    } else {
      setExpandedArtisan(artisanId);
      fetchArtisanProducts(artisanId);
    }
  };

  const handleApprove = async (id) => {
    try {
      await apiService.approveArtisan(id);
      setArtisans(artisans.map(a => a.id === id ? { ...a, isApproved: true } : a));
      alert("Artisan approved successfully! They will receive an email notification.");
    } catch (err) {
      alert("Failed to approve artisan.");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this artisan? This will delete their account.")) return;
    try {
      await apiService.rejectArtisan(id);
      setArtisans(artisans.filter(a => a.id !== id));
      alert("Artisan rejected and removed.");
    } catch (err) {
      alert("Failed to reject artisan.");
    }
  };

  const getFiltered = () => {
    let list = artisans;
    if (filter === "pending") list = list.filter(a => !a.isApproved);
    if (filter === "approved") list = list.filter(a => a.isApproved);
    if (query) {
      list = list.filter(a =>
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.email.toLowerCase().includes(query.toLowerCase())
      );
    }
    return list;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const filtered = getFiltered();
  const pendingCount = artisans.filter(a => !a.isApproved).length;
  const approvedCount = artisans.filter(a => a.isApproved).length;

  return React.createElement(
    "div",
    { style: { minHeight: "100vh", background: "linear-gradient(180deg, #FDFBF7 0%, #F8F4EF 100%)" } },
    React.createElement(Navbar),

    React.createElement(
      "div",
      { style: { maxWidth: "1400px", margin: "0 auto", padding: "30px 20px" } },

      /* HEADER */
      React.createElement(
        "div",
        { style: { marginBottom: "30px" } },
        React.createElement(
          "button",
          {
            onClick: () => navigate("/admin/dashboard"),
            style: { background: "transparent", border: "none", color: "#A68A64", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", fontSize: "14px" }
          },
          React.createElement(Icons.ArrowLeft),
          "Back to Dashboard"
        ),
        React.createElement("h1", {
          style: { fontFamily: "'Playfair Display', serif", fontSize: "32px", color: "#3E2723", margin: "0 0 8px" }
        }, "Artisan Management"),
        React.createElement("p", {
          style: { color: "#8D6E63", margin: 0 }
        }, `${artisans.length} total artisans • ${pendingCount} pending approval`)
      ),

      /* FILTER TABS */
      React.createElement(
        "div",
        { style: { display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" } },
        [
          { key: "all", label: `All (${artisans.length})` },
          { key: "pending", label: `Pending (${pendingCount})`, highlight: pendingCount > 0 },
          { key: "approved", label: `Approved (${approvedCount})` }
        ].map(f =>
          React.createElement("button", {
            key: f.key,
            onClick: () => setFilter(f.key),
            style: {
              padding: "10px 20px",
              borderRadius: "10px",
              border: filter === f.key ? "2px solid #A68A64" : "1px solid rgba(166,138,100,0.2)",
              background: filter === f.key ? "#A68A64" : (f.highlight ? "#FFF3E0" : "#fff"),
              color: filter === f.key ? "#fff" : (f.highlight ? "#E65100" : "#5D4037"),
              cursor: "pointer",
              fontWeight: "500",
              fontSize: "14px"
            }
          }, f.label)
        )
      ),

      /* SEARCH */
      React.createElement(
        "div",
        { style: { position: "relative", marginBottom: "24px" } },
        React.createElement("div", {
          style: { position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#A68A64" }
        }, React.createElement(Icons.Search)),
        React.createElement("input", {
          type: "text",
          placeholder: "Search artisans by name or email...",
          value: query,
          onChange: (e) => setQuery(e.target.value),
          style: {
            width: "100%",
            padding: "14px 14px 14px 48px",
            borderRadius: "12px",
            border: "1px solid rgba(166,138,100,0.2)",
            fontSize: "15px",
            background: "#fff"
          }
        })
      ),

      /* ARTISANS LIST */
      loading
        ? React.createElement("div", { style: { textAlign: "center", padding: "60px", color: "#8D6E63" } }, "Loading artisans...")
        : filtered.length === 0
        ? React.createElement(
            "div",
            { style: { textAlign: "center", padding: "80px", background: "#fff", borderRadius: "16px" } },
            React.createElement(Icons.User),
            React.createElement("h3", { style: { color: "#3E2723", marginTop: "16px" } }, "No Artisans Found"),
            React.createElement("p", { style: { color: "#8D6E63" } }, "No artisans match your current filter.")
          )
        : React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "16px" } },
            filtered.map(artisan =>
              React.createElement(
                "div",
                {
                  key: artisan.id,
                  style: {
                    background: "#fff",
                    borderRadius: "16px",
                    border: artisan.isApproved ? "1px solid rgba(166,138,100,0.15)" : "2px solid #FFB74D",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
                    overflow: "hidden"
                  }
                },

                /* ARTISAN HEADER */
                React.createElement(
                  "div",
                  {
                    onClick: () => toggleExpand(artisan.id),
                    style: {
                      padding: "20px 24px",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: !artisan.isApproved ? "linear-gradient(135deg, #FFF8E1, #FFF3E0)" : "transparent"
                    }
                  },
                  React.createElement(
                    "div",
                    { style: { display: "flex", alignItems: "center", gap: "16px" } },
                    /* Avatar */
                    React.createElement("div", {
                      style: {
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        background: artisan.isApproved ? "linear-gradient(135deg, #A68A64, #8B6F47)" : "linear-gradient(135deg, #FFB74D, #FFA726)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: "20px",
                        fontWeight: "600"
                      }
                    }, artisan.name.charAt(0).toUpperCase()),
                    /* Info */
                    React.createElement(
                      "div",
                      null,
                      React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "10px" } },
                        React.createElement("h3", { style: { margin: 0, fontSize: "18px", color: "#3E2723" } }, artisan.name),
                        !artisan.isApproved && React.createElement("span", {
                          style: { background: "#FFB74D", color: "#fff", padding: "3px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "600" }
                        }, "PENDING APPROVAL")
                      ),
                      React.createElement("div", { style: { display: "flex", gap: "16px", marginTop: "6px", color: "#8D6E63", fontSize: "13px" } },
                        React.createElement("span", { style: { display: "flex", alignItems: "center", gap: "4px" } },
                          React.createElement(Icons.Mail), artisan.email
                        ),
                        artisan.createdAt && React.createElement("span", { style: { display: "flex", alignItems: "center", gap: "4px" } },
                          React.createElement(Icons.Calendar), `Joined ${formatDate(artisan.createdAt)}`
                        )
                      )
                    )
                  ),
                  React.createElement(
                    "div",
                    { style: { display: "flex", alignItems: "center", gap: "12px" } },
                    /* Action Buttons */
                    !artisan.isApproved && React.createElement("button", {
                      onClick: (e) => { e.stopPropagation(); handleApprove(artisan.id); },
                      style: {
                        background: "#4CAF50",
                        color: "#fff",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontWeight: "500",
                        fontSize: "13px"
                      }
                    }, React.createElement(Icons.Check), "Approve"),
                    !artisan.isApproved && React.createElement("button", {
                      onClick: (e) => { e.stopPropagation(); handleReject(artisan.id); },
                      style: {
                        background: "#fff",
                        color: "#E53935",
                        border: "1px solid #E53935",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontWeight: "500",
                        fontSize: "13px"
                      }
                    }, React.createElement(Icons.X), "Reject"),
                    React.createElement("div", {
                      style: {
                        transform: expandedArtisan === artisan.id ? "rotate(180deg)" : "rotate(0)",
                        transition: "transform 0.2s ease",
                        color: "#A68A64"
                      }
                    }, React.createElement(Icons.ChevronDown))
                  )
                ),

                /* EXPANDED CONTENT */
                expandedArtisan === artisan.id && React.createElement(
                  "div",
                  { style: { borderTop: "1px solid rgba(166,138,100,0.1)", padding: "24px" } },

                  /* ARTISAN DETAILS */
                  React.createElement(
                    "div",
                    { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "24px" } },
                    React.createElement("div", null,
                      React.createElement("label", { style: { fontSize: "12px", color: "#8D6E63", fontWeight: "500" } }, "Phone"),
                      React.createElement("div", { style: { color: "#3E2723" } }, artisan.phone || "Not provided")
                    ),
                    React.createElement("div", null,
                      React.createElement("label", { style: { fontSize: "12px", color: "#8D6E63", fontWeight: "500" } }, "Address"),
                      React.createElement("div", { style: { color: "#3E2723" } }, artisan.address || "Not provided")
                    ),
                    React.createElement("div", null,
                      React.createElement("label", { style: { fontSize: "12px", color: "#8D6E63", fontWeight: "500" } }, "Status"),
                      React.createElement("div", { style: { color: artisan.isApproved ? "#2E7D32" : "#E65100", fontWeight: "500" } },
                        artisan.isApproved ? "✓ Approved" : "⏳ Pending Approval"
                      )
                    )
                  ),

                  /* PRODUCTS SECTION */
                  React.createElement("h4", {
                    style: { display: "flex", alignItems: "center", gap: "8px", color: "#3E2723", marginBottom: "16px" }
                  }, React.createElement(Icons.Package), "Products by this Artisan"),

                  loadingProducts[artisan.id]
                    ? React.createElement("div", { style: { color: "#8D6E63", padding: "20px" } }, "Loading products...")
                    : (!artisanProducts[artisan.id] || artisanProducts[artisan.id].length === 0)
                    ? React.createElement("div", {
                        style: { background: "#FAFAFA", padding: "30px", textAlign: "center", borderRadius: "12px", color: "#8D6E63" }
                      }, "No products listed yet")
                    : React.createElement(
                        "div",
                        { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" } },
                        artisanProducts[artisan.id].map(product =>
                          React.createElement(
                            "div",
                            {
                              key: product._id,
                              style: {
                                background: "#FAFAFA",
                                borderRadius: "12px",
                                padding: "16px",
                                border: "1px solid rgba(166,138,100,0.1)"
                              }
                            },
                            product.images?.[0] && React.createElement("img", {
                              src: product.images[0],
                              alt: product.title,
                              style: { width: "100%", height: "120px", objectFit: "cover", borderRadius: "8px", marginBottom: "12px" }
                            }),
                            React.createElement("div", { style: { fontWeight: "600", color: "#3E2723", marginBottom: "4px" } }, product.title),
                            React.createElement("div", { style: { color: "#A68A64", fontWeight: "600" } }, `₹${product.price}`),
                            React.createElement("div", { style: { fontSize: "12px", color: "#8D6E63", marginTop: "4px" } },
                              `Stock: ${product.stock} • ${product.isActive ? "Active" : "Inactive"}`
                            )
                          )
                        )
                      ),

                  /* DELETE ARTISAN */
                  artisan.isApproved && React.createElement(
                    "div",
                    { style: { marginTop: "24px", paddingTop: "20px", borderTop: "1px dashed rgba(166,138,100,0.2)" } },
                    React.createElement("button", {
                      onClick: () => handleReject(artisan.id),
                      style: {
                        background: "#fff",
                        color: "#E53935",
                        border: "1px solid #E53935",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontWeight: "500"
                      }
                    }, React.createElement(Icons.Trash), "Remove Artisan")
                  )
                )
              )
            )
          )
    ),

    React.createElement(Footer)
  );
}

export default ManageArtisansPage;
