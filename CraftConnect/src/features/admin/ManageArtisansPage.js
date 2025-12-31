import React, { useState, useEffect } from "react";
import Navbar from "../../shared/components/Navbar";
import apiService from "../../shared/services/api";

function ManageArtisansPage() {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  // Fetch artisans on mount
  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        const data = await apiService.getArtisans();
        // Backend returns array of artisans
        // Identify formatting: backend format might differ from frontend.
        // Frontend expects: { id, name, type, village, products, status, email }
        // Backend 'Artisan' model likely has: _id, name, email, businessName, status, possibly 'address' (village)
        
        const formatted = (Array.isArray(data) ? data : (data.artisans || [])).map(a => ({
            id: a._id || a.id,
            name: a.name || a.businessName || "Unknown",
            type: "Artisan", // We only have Artisans now
            village: a.address?.city || a.village || "Unknown",
            products: a.products?.length || 0,
            status: a.status || (a.isActive ? "Active" : "Pending"), // Map boolean or string status
            email: a.email
        }));
        setArtisans(formatted);
      } catch (err) {
        console.error("Failed to fetch artisans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtisans();
  }, []);

  const filtered = artisans.filter(
    (a) =>
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.village.toLowerCase().includes(query.toLowerCase()) ||
      a.email.toLowerCase().includes(query.toLowerCase())
  );

  const handleApprove = async (id) => {
    try {
      await apiService.approveArtisan(id);
      setArtisans(artisans.map(a => a.id === id ? { ...a, status: "Active" } : a));
      alert("Artisan approved successfully!");
    } catch (err) {
      console.error("Approval failed:", err);
      alert("Failed to approve artisan.");
    }
  };

  const handleReject = async (id) => {
    if (window.confirm("Are you sure you want to reject this artisan?")) {
      try {
        await apiService.rejectArtisan(id);
        setArtisans(artisans.filter(a => a.id !== id));
        alert("Artisan rejected.");
      } catch (err) {
        console.error("Rejection failed:", err);
        alert("Failed to reject artisan.");
      }
    }
  };

  const handleDelete = async (id) => {
     // Backend API doesn't list explicit DELETE artisan endpoint in documentation provided,
     // but typical CRUD might support it. Using reject for now if delete unavailable, 
     // or just UI removal if we assume admin delete = reject.
     // Let's use reject for consistency or if strict delete needed, implement generic delete.
     // For now, allow UI to remove it locally or call reject.
     if (window.confirm("Are you sure you want to remove this artisan?")) {
        // Trying reject as deletion mechanism for now
        handleReject(id); 
     }
  };

  // Helper to get Status Color
  const getStatusColor = (status) => {
      if (status === "Active" || status === "approved") return "green";
      if (status === "Pending" || status === "pending_approval") return "#A68A64";
      return "crimson";
  };

  return React.createElement(
    "div",
    { className: "container" },

    React.createElement(Navbar),

    /* PAGE TITLE */
    React.createElement(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "30px",
          marginBottom: "20px",
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
        "Manage Artisans"
      )
    ),

    /* SEARCH BAR */
    React.createElement("input", {
      type: "text",
      placeholder: "Search artisans by name, email, or location...",
      value: query,
      onChange: (e) => setQuery(e.target.value),
      style: {
        width: "100%",
        padding: "12px",
        borderRadius: "12px",
        border: "1px solid rgba(62,44,32,0.1)",
        marginBottom: "20px",
        fontSize: "15px",
      },
    }),

    /* MAIN CARD */
    React.createElement(
      "div",
      {
        style: {
          background: "linear-gradient(180deg,#fff,rgba(248,244,239,0.9))",
          padding: "20px",
          borderRadius: "16px",
          border: "1px solid rgba(62,44,32,0.08)",
          boxShadow: "0 6px 20px rgba(62,44,32,0.05)",
        },
      },

      /* TABLE */
      loading ? React.createElement("div", { style: { padding: "20px", textAlign: "center" } }, "Loading artisans...") :
      React.createElement(
        "table",
        { style: { width: "100%", borderCollapse: "collapse" } },

        /* HEADER */
        React.createElement(
          "thead",
          null,
          React.createElement(
            "tr",
            null,
            head("Name"),
            head("Email"),
            head("Location"),
            head("Products"),
            head("Status"),
            head("Actions")
          )
        ),

        /* BODY */
        React.createElement(
          "tbody",
          null,
          filtered.map((a) =>
            React.createElement(
              "tr",
              {
                key: a.id,
                style: {
                  borderBottom: "1px solid rgba(62,44,32,0.08)",
                },
              },

              cell(a.name),
              cell(a.email),
              cell(a.village),
              cell(a.products),

              /* STATUS BADGE */
              React.createElement(
                "td",
                null,
                React.createElement(
                  "span",
                  {
                    style: {
                      padding: "6px 10px",
                      borderRadius: "8px",
                      color: "#fff",
                      background: getStatusColor(a.status),
                      fontSize: "13px",
                      textTransform: "capitalize"
                    },
                  },
                  a.status
                )
              ),

              /* ACTION BUTTONS */
              React.createElement(
                "td",
                {
                  style: {
                    padding: "10px 0",
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                  },
                },

               (a.status === "Pending" || a.status === "pending_approval") && actionButton("Approve", () => handleApprove(a.id), "primary"),
               (a.status === "Pending" || a.status === "pending_approval") && actionButton("Reject", () => handleReject(a.id), "secondary"),
                actionButton("Remove", () => handleDelete(a.id), "danger")
              )
            )
          )
        )
      )
    ),

    /* FOOTER */
    React.createElement(
      "footer",
      { style: { marginTop: "40px" } },
      React.createElement("div", null, "© CraftConnect — handcrafted community"),
      React.createElement("div", null, "Made with ❤️ | Beige & brown theme")
    )
  );
}

/* ---- Helper Functions ---- */

function head(text) {
  return React.createElement(
    "th",
    {
      style: {
        textAlign: "left",
        paddingBottom: "10px",
        borderBottom: "2px solid rgba(62,44,32,0.1)",
        color: "var(--secondary)",
      },
    },
    text
  );
}

function cell(text) {
  return React.createElement(
    "td",
    {
      style: {
        padding: "10px 0",
        fontSize: "14px",
        color: "var(--text)",
      },
    },
    text
  );
}

function actionButton(text, onClick, type = "primary") {
  const buttonClass = type === "primary" ? "cta" : 
                     type === "secondary" ? "cta secondary-cta" : 
                     "cta secondary-cta"; // Danger could have specific class if needed
  
  const style = {
      padding: "6px 10px",
      fontSize: "12px",
      minWidth: "70px",
      backgroundColor: type === "danger" ? "crimson" : undefined,
      color: type === "danger" ? "white" : undefined,
      border: type === "danger" ? "none" : undefined
  };

  return React.createElement(
    "button",
    {
      className: buttonClass,
      style: style,
      onClick,
    },
    text
  );
}

export default ManageArtisansPage;
