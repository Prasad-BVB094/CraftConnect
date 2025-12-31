import React, { useEffect, useState } from "react";

// Floating Icons Component (Reused)
const FloatingBackground = () => {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    // Generate random floating elements
    const icons = [
        // Classic Vase
        "M12 2c-3 0-5 2-5 5 0 2 1.5 3.5 1.5 6C8.5 15.5 6 17 6 22h12c0-5-2.5-6.5-2.5-9 0-2.5 1.5-4 1.5-6 0-3-2-5-5-5z",
        // Clay Pot
        "M19 10c0-3-2-5-7-5S5 7 5 10c0 4 3 6 4 9h6c1-3 4-5 4-9z",
        // Leaf
        "M17 8C8 10 5.9 16.17 3.82 21.34 9.17 20.1 15 16.88 17 8zM7 3C9 7.75 14 11 17 8 13 4 8 2 7 3z",
        // Geometric Diamond
        "M12 2L2 12l10 10 10-10L12 2z",
        // Thread Spool
        "M7 4h10v2H7z M7 18h10v2H7z M9 6h6v12H9z"
    ];
    
    const colors = [
        "rgba(166, 138, 100, 0.4)", // Brand Gold/Tan
        "rgba(107, 79, 59, 0.3)",   // Walnut
        "rgba(215, 204, 200, 0.5)", // Light Taupe
        "rgba(141, 110, 99, 0.4)"   // Cocoa
    ];

    const overflowCount = 15; // Number of particles
    const newElements = Array.from({ length: overflowCount }).map((_, i) => ({
      id: i,
      path: icons[Math.floor(Math.random() * icons.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 30 + 20, // 20px to 50px
      left: Math.random() * 100, // 0% to 100%
      duration: Math.random() * 20 + 15, // 15s to 35s
      delay: Math.random() * -20, // Negative delay to start mid-animation
      sway: Math.random() * 20 + 10 // Sway distance
    }));

    setElements(newElements);
  }, []);

  return React.createElement(
    "div",
    {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }
    },
    // CSS for animations
    React.createElement("style", null, `
      @keyframes floatUp {
        0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
      }
      @keyframes sway {
        0%, 100% { margin-left: -10px; }
        50% { margin-left: 10px; }
      }
    `),
    elements.map((el) =>
      React.createElement(
        "svg",
        {
          key: el.id,
          width: el.size,
          height: el.size,
          viewBox: "0 0 24 24",
          fill: el.color,
          style: {
            position: "absolute",
            left: `${el.left}%`,
            bottom: "-50px", // Start below view
            animation: `floatUp ${el.duration}s linear infinite ${el.delay}s, sway ${el.sway/2}s ease-in-out infinite alternate`,
            opacity: 0.6,
          }
        },
        React.createElement("path", { d: el.path })
      )
    )
  );
};

export default FloatingBackground;
