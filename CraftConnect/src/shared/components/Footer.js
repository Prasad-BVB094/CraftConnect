import React from 'react';

function Footer() {
  return React.createElement(
    "footer",
    {
      style: {
        marginTop: "60px",
        borderTop: "1px dashed rgba(166,138,100,0.2)",
        padding: "40px",
        background: "linear-gradient(180deg, rgba(248,244,239,0.3) 0%, rgba(220,199,170,0.1) 100%)",
        color: "var(--text)",
        fontFamily: "var(--font-body)",
        fontSize: "14px",
      }
    },
    React.createElement(
      "div",
      { className: "container", style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px" } },
      
      /* Column 1: Brand */
      React.createElement(
        "div",
        null,
        React.createElement(
          "h4",
          { style: { fontFamily: "var(--font-heading)", fontSize: "18px", marginBottom: "16px", color: "var(--accent)" } },
          "CraftConnect"
        ),
        React.createElement("p", { style: { color: "var(--muted)", lineHeight: "1.6" } }, "Empowering artisans, preserving culture, and bringing timeless handcrafted treasures to your home.")
      ),

      /* Column 2: Shop */
      React.createElement(
        "div",
        null,
        React.createElement("h4", { style: { fontWeight: "600", marginBottom: "16px" } }, "Shop"),
        React.createElement("ul", { style: { listStyle: "none", padding: 0 } },
          React.createElement("li", { style: { marginBottom: "10px" } }, React.createElement("a", { href: "/categories", style: { textDecoration: "none", color: "var(--muted)" } }, "All Categories")),
          React.createElement("li", { style: { marginBottom: "10px" } }, React.createElement("a", { href: "/search", style: { textDecoration: "none", color: "var(--muted)" } }, "Search Products")),
          React.createElement("li", { style: { marginBottom: "10px" } }, React.createElement("a", { href: "#", style: { textDecoration: "none", color: "var(--muted)" } }, "New Arrivals"))
        )
      ),

      /* Column 3: Sell (The new home for Artisan/Vendor links) */
      React.createElement(
        "div",
        null,
        React.createElement("h4", { style: { fontWeight: "600", marginBottom: "16px" } }, "Sell with Us"),
        React.createElement("ul", { style: { listStyle: "none", padding: 0 } },
          React.createElement("li", { style: { marginBottom: "10px" } }, 
            React.createElement("a", { href: "/register/artisan", style: { textDecoration: "none", color: "var(--secondary)", fontWeight: "500" } }, "Join as an Artisan")
          ),
          React.createElement("li", { style: { marginBottom: "10px" } }, 
            React.createElement("a", { href: "/register/vendor", style: { textDecoration: "none", color: "var(--muted)" } }, "Register as a Vendor")
          ),
          React.createElement("li", { style: { marginBottom: "10px" } }, 
            React.createElement("a", { href: "/login/vendor", style: { textDecoration: "none", color: "var(--muted)" } }, "Seller Login")
          )
        )
      ),

      /* Column 4: Support */
      React.createElement(
        "div",
        null,
        React.createElement("h4", { style: { fontWeight: "600", marginBottom: "16px" } }, "Support"),
        React.createElement("ul", { style: { listStyle: "none", padding: 0 } },
          React.createElement("li", { style: { marginBottom: "10px" } }, React.createElement("a", { href: "#", style: { textDecoration: "none", color: "var(--muted)" } }, "Help Center")),
          React.createElement("li", { style: { marginBottom: "10px" } }, React.createElement("a", { href: "#", style: { textDecoration: "none", color: "var(--muted)" } }, "Shipping & Returns")),
          React.createElement("li", { style: { marginBottom: "10px" } }, React.createElement("a", { href: "#", style: { textDecoration: "none", color: "var(--muted)" } }, "Contact Us"))
        )
      )
    ),
    React.createElement(
      "div",
      { style: { textAlign: "center", marginTop: "40px", borderTop: "1px solid rgba(166,138,100,0.1)", paddingTop: "20px", color: "var(--muted)", fontSize: "13px" } },
      "© 2026 CraftConnect. Handcrafted with tradition."
    )
  );
}

export default Footer;
