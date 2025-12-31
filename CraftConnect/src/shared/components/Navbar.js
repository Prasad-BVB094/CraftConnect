import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../hooks/useAuth";

function Navbar(props) {
  const { getCartCount } = useCart();
  const { user } = useAuth(); // Use explicit hook for user data
  const cartCount = getCartCount();
  const isAdmin = user?.role === "admin";
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [artisanMode, setArtisanMode] = useState(false);

  useEffect(() => {
    // Sync local state with hook user data (PRIMARY SOURCE OF TRUTH)
    if (user) {
        setIsUserLoggedIn(true);
        if (user.role === 'artisan') {
            setArtisanMode(true);
        } else {
            setArtisanMode(false);
        }
    } else {
        // If no user from hook, clear logged-in state
        setIsUserLoggedIn(false);
        setArtisanMode(false);
    }
  }, [user]);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handleLocationChange);
    handleLocationChange();

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };


  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  // ... inside Navbar component ...

  // Helper to check if active link
  const isActive = (path) => currentPath === path;
  
  // Helper to check if dashboard view
  const isDashboard = currentPath.startsWith('/artisan') || currentPath.startsWith('/admin');

  return React.createElement(
    "header",
    { 
      style: {
        width: "100%",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(166,138,100,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        transition: "all 0.3s ease",
      }
    },
    
    React.createElement(
      "div",
      {
        className: "navbar-root",
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 40px",
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
        }
      },

    /* Branding and Search */
    React.createElement(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          gap: "40px",
          flex: 1,
        }
      },

      /* Branding */
      React.createElement(
        "a",
        { href: "/", className: "brand", style: { display: "flex", gap: "12px", textDecoration: "none", alignItems: 'center' } },
        React.createElement(
          "div",
          {
            className: "logo",
            style: {
              width: "48px",
              height: "48px",
              background: "linear-gradient(135deg,var(--primary),var(--secondary))",
              borderRadius: "12px",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 4px 12px rgba(107,79,59,0.15)",
            },
          },
          React.createElement(
            "svg",
            {
              width: "24",
              height: "24",
              viewBox: "0 0 24 24",
              fill: "none",
              xmlns: "http://www.w3.org/2000/svg"
            },
            React.createElement("path", {
              d: "M12 2L2 7L12 12L22 7L12 2Z",
              stroke: "white",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }),
            React.createElement("path", {
              d: "M2 17L12 22L22 17",
              stroke: "white",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }),
            React.createElement("path", {
              d: "M2 12L12 17L22 12",
              stroke: "white",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round"
            })
          )
        ),
        React.createElement(
          "div",
          null,
          React.createElement(
            "h1",
            { style: { fontFamily: "'Playfair Display', serif", fontSize: "24px", margin: "0", color: "var(--accent)", lineHeight: "1", letterSpacing: "-0.02em" } },
            "CraftConnect"
          ),
          React.createElement(
            "p",
            { style: { color: "var(--muted)", fontSize: "12px", margin: "4px 0 0", fontFamily: "'Neue Montreal', 'Poppins', sans-serif", letterSpacing: "0.02em" } },
            "Connecting artisans to the world"
          )
        )
      ),

    /* Search Bar - Hidden on Dashboard */
    !isDashboard && React.createElement(
        "form",
        {
          onSubmit: handleSearch,
          style: {
            flex: 1,
            maxWidth: "400px",
          }
        },
        React.createElement("div", { style: { position: "relative" } },
          React.createElement("input", {
            type: "text",
            placeholder: "Search for handcrafted goods...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            style: {
              width: "100%",
              padding: "12px 20px 12px 44px",
              borderRadius: "50px",
              border: "1px solid rgba(166,138,100,0.15)",
              fontSize: "14px",
              outline: "none",
              transition: "all 0.2s ease",
              fontFamily: "'Neue Montreal', 'Poppins', sans-serif",
              background: "rgba(248,244,239,0.5)",
            },
            onFocus: (e) => {
              e.target.style.borderColor = "var(--secondary)";
              e.target.style.background = "#fff";
              e.target.style.boxShadow = "0 4px 12px rgba(166,138,100,0.08)";
            },
            onBlur: (e) => {
              e.target.style.borderColor = "rgba(166,138,100,0.15)";
              e.target.style.background = "rgba(248,244,239,0.5)";
              e.target.style.boxShadow = "none";
            }
          }),
          /* Search Icon (SVG) */
          React.createElement(
              "svg",
              {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "18",
                  height: "18",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "var(--muted)",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  style: { position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }
              },
              React.createElement("circle", { cx: "11", cy: "11", r: "8" }),
              React.createElement("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
          ),
        )
      )
    ),

    /* Navigation buttons */
    React.createElement(
      "nav",
      { style: { display: "flex", gap: "12px", alignItems: "center" } },

      // Explore - Hidden on Dashboard
      isDashboard ? null : React.createElement(
        "button",
        {
          key: "explore-btn",
          className: "nav-btn",
          style: navBtnStyle(isActive('/categories')),
          onClick: () => window.location.href = "/categories"
        },
        "Explore"
      ),



      // User Dropdown Button
      React.createElement(
        "div",
        {
          style: {
            position: "relative",
            display: "flex",
            alignItems: "center"
          }
        },
            React.createElement(
              "button",
              {
                className: "nav-btn",
                style: {
                  ...navBtnStyle(false),
                  paddingRight: "12px",
                  display: "flex", 
                  alignItems: "center", 
                  gap: "6px",
                  color: "#5D4037", 
                  fontWeight: "600"
                },
                onClick: () => setShowUserDropdown(!showUserDropdown)
              },
              "Account"
            ),
        showUserDropdown && React.createElement(
          "div",
          {
            style: {
              position: "absolute",
              top: "calc(100% + 10px)",
              right: "0",
              background: "white",
              borderRadius: "16px",
              boxShadow: "0 10px 40px rgba(107,79,59,0.12)",
              border: "1px solid rgba(166,138,100,0.1)",
              minWidth: "220px",
              zIndex: 100,
              padding: "8px",
              overflow: "hidden"
            }
          },
          // === NOT LOGGED IN ===
          !isUserLoggedIn && React.createElement(
            "button",
            {
              className: "dropdown-item",
              style: dropdownItemStyle(),
              onClick: () => {
                window.location.href = "/login/user";
                setShowUserDropdown(false);
              }
            },
            "Sign In"
          ),
          !isUserLoggedIn && React.createElement(
            "button",
            {
              className: "dropdown-item",
              style: dropdownItemStyle(),
              onClick: () => {
                window.location.href = "/register/user";
                setShowUserDropdown(false);
              }
            },
            "Create Account"
          ),
          !isUserLoggedIn && React.createElement(
            "div",
            { style: { borderTop: "1px dashed rgba(166,138,100,0.2)", marginTop: "8px", paddingTop: "8px" } },
            React.createElement(
              "div",
              { style: { fontSize: "11px", color: "var(--muted)", paddingLeft: "12px", marginBottom: "4px", fontWeight: "600", textTransform: "uppercase" } },
              "Sell"
            ),
            React.createElement(
              "button",
              {
                className: "dropdown-item",
                style: dropdownItemStyle(),
                onClick: () => {
                  window.location.href = "/register/artisan";
                  setShowUserDropdown(false);
                }
              },
              "Join as Artisan"
            ),
            React.createElement(
              "button",
              {
                className: "dropdown-item",
                style: dropdownItemStyle(),
                onClick: () => {
                  window.location.href = "/login/artisan";
                  setShowUserDropdown(false);
                }
              },
              "Seller Central"
            )
          ),

          // === LOGGED IN AS ARTISAN ===
          isUserLoggedIn && artisanMode && React.createElement(
            "button",
            {
              className: "dropdown-item",
              style: dropdownItemStyle(),
              onClick: () => {
                window.location.href = "/artisan/profile";
                setShowUserDropdown(false);
              }
            },
            "Artisan Profile"
          ),
          isUserLoggedIn && artisanMode && React.createElement(
            "button",
            {
              className: "dropdown-item",
              style: dropdownItemStyle(),
              onClick: () => {
                window.location.href = "/artisan/orders";
                setShowUserDropdown(false);
              }
            },
            "My Orders"
          ),
          isUserLoggedIn && artisanMode && !isDashboard && React.createElement(
            "button",
            {
              className: "dropdown-item",
              style: dropdownItemStyle(),
              onClick: () => {
                window.location.href = "/artisan/dashboard";
                setShowUserDropdown(false);
              }
            },
            "Artisan Dashboard"
          ),

          // === LOGGED IN AS ADMIN ===
          isAdmin && React.createElement(
            "button",
            {
              className: "dropdown-item",
              style: dropdownItemStyle(),
              onClick: () => {
                window.location.href = "/admin/dashboard";
                setShowUserDropdown(false);
              }
            },
            "Admin Dashboard"
          ),

          // === LOGGED IN AS REGULAR USER ===
          isUserLoggedIn && !artisanMode && React.createElement(
            "button",
            {
              className: "dropdown-item",
              style: dropdownItemStyle(),
              onClick: () => {
                window.location.href = "/profile";
                setShowUserDropdown(false);
              }
            },
            "My Profile"
          ),
          isUserLoggedIn && !artisanMode && React.createElement(
            "button",
            {
              className: "dropdown-item",
              style: dropdownItemStyle(),
              onClick: () => {
                window.location.href = "/orders";
                setShowUserDropdown(false);
              }
            },
            "My Orders"
          ),
          
          // Show Logout option if user is logged in or admin
          (isUserLoggedIn || isAdmin) && React.createElement(
            "div",
            { style: { padding: "8px", borderTop: "1px solid rgba(0,0,0,0.05)", marginTop: "4px" } },
            React.createElement(
              "button",
              {
                className: "dropdown-item",
                style: { ...dropdownItemStyle(), color: "#dc3545" },
                onClick: () => {
                  handleLogout();
                  setShowUserDropdown(false);
                }
              },
              "Sign Out"
            )
          )
        )
      ),

      /* Dashboard Specific Logout with SVG */
      isDashboard ? React.createElement(
        "button",
        {
          className: "nav-btn",
          onClick: handleLogout,
          style: {
            ...navBtnStyle(false),
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--accent)", // Brown color to match theme
            paddingLeft: "24px", 
            borderLeft: "1px solid rgba(0,0,0,0.1)",
            borderRadius: "0",
            marginLeft: "12px"
          }
        },
        React.createElement("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          width: "18",
          height: "18",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        },
          React.createElement("path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }),
          React.createElement("polyline", { points: "16 17 21 12 16 7" }),
          React.createElement("line", { x1: "21", y1: "12", x2: "9", y2: "12" })
        ),
        "Logout"
      ) :
      // Cart button (Standard View)
      React.createElement(
        "button",
        {
          className: "nav-btn",
          style: { ...navBtnStyle(isActive('/cart')), position: "relative", paddingRight: cartCount > 0 ? "28px" : "16px", display: "flex", alignItems: "center", gap: "6px" },
          onClick: () => window.location.href = "/cart"
        },
        React.createElement(
            "svg",
            {
                xmlns: "http://www.w3.org/2000/svg",
                width: "20",
                height: "20",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "var(--text)",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round"
            },
            React.createElement("circle", { cx: "9", cy: "21", r: "1" }),
            React.createElement("circle", { cx: "20", cy: "21", r: "1" }),
            React.createElement("path", { d: "M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" })
        ),
        "Cart",
        cartCount > 0 && React.createElement(
          "span",
          {
            style: {
              position: "absolute",
              top: "4px",
              right: "4px",
              background: "var(--accent)",
              color: "white",
              borderRadius: "50%",
              minWidth: "18px",
              height: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              fontWeight: "700",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }
          },
          cartCount
        )
      )
      )
    )
  );
}

/* Shared Styles */
function navBtnStyle(isActive) {
  return {
    background: isActive ? "rgba(166,138,100,0.1)" : "transparent",
    border: isActive ? "1px solid rgba(166,138,100,0.2)" : "1px solid transparent",
    padding: "10px 20px",
    borderRadius: "24px",
    fontWeight: "500",
    color: isActive ? "var(--accent)" : "var(--text)",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.2s ease",
    fontFamily: "'Neue Montreal', 'Poppins', sans-serif",
  };
}

function dropdownItemStyle() {
    return {
        display: "block",
        width: "100%",
        textAlign: "left",
        borderRadius: "8px",
        border: "none",
        padding: "10px 12px",
        background: "transparent",
        color: "var(--text)",
        cursor: "pointer",
        fontSize: "14px",
        transition: "all 0.1s ease",
        fontFamily: "'Neue Montreal', 'Poppins', sans-serif",
    };
}

export default Navbar;
