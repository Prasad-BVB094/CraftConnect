import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../shared/components/Navbar";
import ProductGrid from "./ProductGrid";
import { useCart } from "../../shared/context/CartContext";
import Footer from "../../shared/components/Footer";
import apiService from "../../shared/services/api";

function ProductDetailsPage(props) {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [quantity, setQuantity] = useState(1);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customRequest, setCustomRequest] = useState("");

  /* AR Feature State */
  const [showARModal, setShowARModal] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null); // Fix: Added missing ref
  const [cameraError, setCameraError] = useState(null);
  
  // Lifted State for Snapshot
  const [arPosition, setArPosition] = useState({ x: 0, y: 0 });
  const [arScale, setArScale] = useState(1);
  const [arRotation, setArRotation] = useState(0); // Degrees
  const [arTilt, setArTilt] = useState(1); // 1 = Flat/Upright, <1 = Tilted/Floor
  const [arBrightness, setArBrightness] = useState(1); // 1 = Normal

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        // Fetch main product
        const data = await apiService.getProductById(id);
        
        // Map backend response if needed
        // Backend 'product' object likely contains _id, name, price, description, images[], artisan (object or id)
        const mappedProduct = {
            ...data,
            id: data._id || data.id,
            name: data.name || data.title, // Backend might use title
            image: data.images?.[0] || data.image,
            // Ensure compatibility
            sellerType: data.artisan ? 'artisan' : 'vendor',
            category: data.category?.name || data.category || "Uncategorized",
            artisan: data.artisan?.name || "Unknown Artisan",
            artisanId: data.artisan?._id || data.artisan,
            tags: data.tags || ["Handmade", "Authentic"]
        };
        
        setProduct(mappedProduct);

        // Fetch related/all products for recommendations
        try {
            const allProductsData = await apiService.getProducts();
            const allProducts = Array.isArray(allProductsData) ? allProductsData : (allProductsData.products || []);
            
            // Filter: Same category or just random others
            const related = allProducts
                 .filter(p => (p._id || p.id) !==(mappedProduct.id))
                 .slice(0, 3)
                 .map(p => ({
                     ...p,
                     id: p._id || p.id,
                     name: p.name || p.title,
                     category: p.category?.name || p.category || "Uncategorized", 
                     artisan: p.artisan?.name || "Unknown Artisan",
                     image: p.images?.[0] || p.image
                 }));
            setRelatedProducts(related);
        } catch (e) {
            console.warn("Failed to fetch related products", e);
        }

      } catch (err) {
        console.error("Failed to fetch product details:", err);
        setError("Product not found or connection failed.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
        fetchProductData();
    }
  }, [id]);

  const startCamera = async () => {
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
          if (videoRef.current) {
              videoRef.current.srcObject = stream;
          }
          setCameraError(null);
      } catch (err) {
          console.error("Camera error:", err);
          setCameraError("Camera access denied or unavailable. Using demo mode.");
      }
  };

  const stopCamera = () => {
      if (videoRef.current && videoRef.current.srcObject) {
          const tracks = videoRef.current.srcObject.getTracks();
          tracks.forEach(track => track.stop());
          videoRef.current.srcObject = null;
      }
  };

  useEffect(() => {
      if (showARModal) {
          startCamera();
      } else {
          stopCamera();
      }
  }, [showARModal]);

  const takeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current || !product) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // 1. Set canvas matches video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // 2. Draw Video Frame
    ctx.filter = "none"; // Ensure no filter on video
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 3. Draw Product Image on top
    const rect = video.getBoundingClientRect();
    const scaleFactorX = canvas.width / rect.width;
    const scaleFactorY = canvas.height / rect.height;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = product.image; 
    
    img.onload = () => {
        // Calculate dimensions
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        
        const initialSize = 200;
        const currentWidth = initialSize * arScale;
        const aspectRatio = img.height / img.width;
        const currentHeight = currentWidth * aspectRatio;

        // Position in Canvas Space
        const domCenterX = cx + arPosition.x;
        const domCenterY = cy + arPosition.y;

        const canvasCenterX = domCenterX * scaleFactorX;
        const canvasCenterY = domCenterY * scaleFactorY;
        const canvasW = currentWidth * scaleFactorX;
        // Apply Tilt to Height calculation for final draw area? 
        // No, we use scale() transform for better quality/accuracy
        const canvasH = currentHeight * scaleFactorY;

        // Save context state
        ctx.save();
        
        // Move to target center
        ctx.translate(canvasCenterX, canvasCenterY);
        
        // 1. Rotate
        ctx.rotate((arRotation * Math.PI) / 180);
        
        // 2. Tilt (Vertical Scale)
        ctx.scale(1, arTilt);

        // 3. Brightness/Lighting
        ctx.filter = `brightness(${arBrightness})`;

        // Draw centered at origin (relative to translate)
        // Add shadow for realism
        ctx.shadowColor = "rgba(0,0,0,0.6)";
        ctx.shadowBlur = 30;
        ctx.shadowOffsetY = 30 * arTilt; // Shadow moves closer when flat
        
        ctx.drawImage(img, -canvasW / 2, -canvasH / 2, canvasW, canvasH);
        
        // Restore
        ctx.restore();

        // 4. Download
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `craftconnect-ar-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
    };
  };

  const handleAddToCart = async () => {
    if (product) {
        await addToCart(product, quantity);
        alert(`Added ${quantity} ${product.name}(s) to cart!`);
    }
  };

  if (loading) return React.createElement("div", { style: { padding: "40px", textAlign: "center" } }, "Loading product details...");
  if (error || !product) return React.createElement("div", { style: { padding: "40px", textAlign: "center", color: "red" } }, error || "Product not found");

  return React.createElement(
    "div",
    null,
    
    React.createElement(Navbar),

    React.createElement(
      "div",
      { className: "container", style: { maxWidth: "1200px", margin: "0 auto", padding: "0 20px" } },

    /* -------- PRODUCT TOP SECTION -------- */
    React.createElement(
      "section",
      {
        style: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "30px",
          marginTop: "30px",
        },
      },

      /* LEFT: IMAGE */
      React.createElement("div", null,
        React.createElement("img", {
          src: product.image,
          style: {
            width: "100%",
            height: "auto",
            borderRadius: "16px",
            border: "1px solid rgba(62,44,32,0.05)",
            boxShadow: "0 6px 20px rgba(62,44,32,0.06)",
          },
        }),
        
        /* AR View Button (Unique Feature 3) */
        React.createElement(
            "button",
            {
                style: {
                    marginTop: "16px",
                    width: "100%",
                    padding: "12px",
                    background: "rgba(255,255,255,0.8)",
                    border: "1px solid var(--accent)",
                    borderRadius: "12px",
                    color: "var(--accent)",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    fontFamily: "'Neue Montreal', 'Poppins', sans-serif"
                },
                onClick: () => setShowARModal(true)
            },
            React.createElement("span", { style: { fontSize: "18px" } }, "👁️"),
            "View in your room (AR)"
        )
      ),

      /* RIGHT: DETAILS */
      React.createElement(
        "div",
        null,

        React.createElement(
          "h2",
          {
            style: {
              fontFamily: "'Playfair Display', serif",
              color: "var(--accent)",
              marginBottom: "10px",
              fontSize: "30px",
            },
          },
          product.name
        ),

        /* Seller Info - Artisan or Vendor */
        product.sellerType === "artisan"
          ? React.createElement(
              "div",
              { style: { marginBottom: "10px" } },
              React.createElement(
                "span",
                {
                  style: {
                    color: "var(--secondary)",
                    cursor: "pointer",
                    textDecoration: "underline",
                  },
                  onClick: () => window.location.href = `/artisan/${product.artisanId}`,
                },
                `By: ${product.artisan} ${product.artisanVillage ? "— " + product.artisanVillage : ""}`
              )
            )
          : React.createElement(
              "div",
              { style: { marginBottom: "10px", color: "var(--muted)" } },
              React.createElement(
                "div",
                null,
                `Sold by: Vendor`
              ),
              product.vendorAddress && React.createElement(
                "div",
                { style: { fontSize: "13px", marginTop: "4px" } },
                `📍 ${product.vendorAddress}`
              )
            ),

        React.createElement(
          "div",
          { style: { color: "var(--secondary)", fontWeight: "bold", marginBottom: "20px" } },
          `₹${product.price}`
        ),

        /* Description */
        React.createElement(
          "p",
          {
            style: {
              fontSize: "15px",
              lineHeight: "1.6",
              marginBottom: "20px",
              color: "var(--text)",
            },
          },
          product.description
        ),

        /* Tags */
        product.tags && React.createElement(
          "div",
          { style: { display: "flex", gap: "10px", marginBottom: "20px" } },
          product.tags.map((tag, i) =>
            React.createElement(
              "span",
              {
                key: i,
                style: {
                  padding: "6px 12px",
                  background: "rgba(166,138,100,0.12)",
                  borderRadius: "999px",
                  fontSize: "13px",
                  color: "var(--secondary)",
                },
              },
              tag
            )
          )
        ),

        /* Quantity Selector */
        React.createElement(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "20px",
            },
          },
          React.createElement(
            "span",
            { style: { color: "var(--text)", fontWeight: "600" } },
            "Quantity:"
          ),
          React.createElement(
            "button",
            {
              style: {
                padding: "6px 12px",
                border: "1px solid var(--secondary)",
                background: "transparent",
                borderRadius: "8px",
                cursor: "pointer",
              },
              onClick: () => setQuantity(Math.max(1, quantity - 1)),
            },
            "-"
          ),
          React.createElement(
            "span",
            { style: { minWidth: "30px", textAlign: "center", fontWeight: "600" } },
            quantity
          ),
          React.createElement(
            "button",
            {
              style: {
                padding: "6px 12px",
                border: "1px solid var(--secondary)",
                background: "transparent",
                borderRadius: "8px",
                cursor: "pointer",
              },
              onClick: () => setQuantity(quantity + 1),
            },
            "+"
          )
        ),

        /* Add to cart */
        React.createElement(
          "button",
          {
            className: "add-btn",
            style: { padding: "12px 16px", fontSize: "16px" },
            onClick: handleAddToCart,
          },
          "Add to cart"
        ),

        /* Customization Request Button (Only for Artisans) */
        product.sellerType === "artisan" && React.createElement(
            "button",
            {
              className: "secondary-cta",
              style: { 
                  marginTop: "12px", 
                  width: "100%", 
                  padding: "12px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontFamily: "'Neue Montreal', 'Poppins', sans-serif",
                  fontWeight: "500"
               },
              onClick: () => setShowCustomModal(true),
            },
            "✨ Request Customization"
        )
      )
    ),

    /* -------- CUSTOMIZATION MODAL -------- */
    showCustomModal && React.createElement(
        "div",
        {
            style: {
                position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                background: "rgba(0,0,0,0.5)", zIndex: 2000,
                display: "grid", placeItems: "center"
            },
            onClick: (e) => {
                if(e.target === e.currentTarget) setShowCustomModal(false);
            }
        },
        React.createElement(
            "div",
            {
                style: {
                    background: "#fff", padding: "30px", borderRadius: "16px",
                    width: "90%", maxWidth: "500px",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.2)"
                }
            },
            React.createElement("h3", { style: { fontFamily: "'Playfair Display', serif", marginBottom: "10px", color: "var(--accent)" } }, "Request Customization"),
            React.createElement("p", { style: { fontSize: "14px", color: "var(--muted)", marginBottom: "20px" } }, `Message to Artisan ${product.artisan} about modifying this item.`),
            React.createElement("textarea", {
                placeholder: "Describe your request (e.g., specific color, size, inscription)...",
                value: customRequest,
                onChange: (e) => setCustomRequest(e.target.value),
                style: {
                    width: "100%", height: "100px", padding: "12px",
                    borderRadius: "8px", border: "1px solid rgba(166,138,100,0.3)",
                    marginBottom: "20px", fontFamily: "inherit"
                }
            }),
            React.createElement(
                "div",
                { style: { display: "flex", gap: "10px", justifyContent: "flex-end" } },
                React.createElement("button", { 
                    onClick: () => setShowCustomModal(false),
                    style: { padding: "10px 20px", background: "transparent", border: "none", cursor: "pointer", color: "var(--muted)" }
                }, "Cancel"),
                React.createElement("button", { 
                    onClick: () => {
                        alert("Request Sent! The artisan will review it and contact you.");
                        setShowCustomModal(false);
                        setCustomRequest("");
                    },
                    style: { padding: "10px 24px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }
                }, "Send Request")
            )
        )
    ),

    /* -------- AR VIEW MODAL (Enhanced: Drag, Resize, Snapshot, Rotation, Tilt, Brightness) -------- */
    showARModal && React.createElement(
        "div",
        {
            style: {
                position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                background: "rgba(0,0,0,0.95)", zIndex: 3000,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                touchAction: "none"
            }
        },
        React.createElement("div", {
            style: {
                width: "90%", maxWidth: "450px", height: "70vh",
                borderRadius: "20px", position: "relative",
                border: "4px solid white",
                overflow: "hidden",
                background: "#000",
                touchAction: "none"
            }
        },
           /* Error Message if Camera Fails */
           cameraError && React.createElement(
               "div",
               { style: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "url('https://images.unsplash.com/photo-1594040226829-7f2a1a0a34b2?q=80&w=1000&auto=format&fit=crop') center/cover", opacity: 0.7 } }
           ),

           /* Video Feed */
           !cameraError && React.createElement("video", {
               ref: videoRef,
               autoPlay: true,
               playsInline: true,
               style: { width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }
           }),

           /* Interactive Product Overlay */
           React.createElement(DraggableResizableImage, { 
               src: product.image, 
               initialSize: 200,
               position: arPosition,
               setPosition: setArPosition,
               scale: arScale,
               setScale: setArScale,
               rotation: arRotation,
               setRotation: setArRotation,
               tilt: arTilt,           // NEW
               brightness: arBrightness // NEW
            }),
           
           /* Pro Controls/Instructions */
           React.createElement("div", {
               style: {
                   position: "absolute", bottom: "10px", left: "0", width: "100%",
                   display: "flex", flexDirection: "column", gap: "8px",
                   padding: "10px 20px", pointerEvents: "auto",
                   background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)"
               }
           }, 
               /* Controls */
               React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "5px" } },
                   React.createElement("label", { style: { color: "white", fontSize: "10px" } }, "Rotate"),
                   React.createElement("input", {
                       type: "range", min: "0", max: "360", value: arRotation,
                       onChange: (e) => setArRotation(Number(e.target.value)),
                       style: { width: "100%", accentColor: "white" }
                   }),
                   
                   React.createElement("div", { style: { display: "flex", gap: "10px" } },
                       React.createElement("div", { style: { flex: 1 } },
                            React.createElement("label", { style: { color: "white", fontSize: "10px" } }, "Tilt (Floor)"),
                            React.createElement("input", {
                                type: "range", min: "0.2", max: "1", step: "0.01", value: arTilt,
                                onChange: (e) => setArTilt(Number(e.target.value)),
                                style: { width: "100%", accentColor: "white" }
                            })
                       ),
                       React.createElement("div", { style: { flex: 1 } },
                            React.createElement("label", { style: { color: "white", fontSize: "10px" } }, "Lighting"),
                            React.createElement("input", {
                                type: "range", min: "0.5", max: "1.5", step: "0.1", value: arBrightness,
                                onChange: (e) => setArBrightness(Number(e.target.value)),
                                style: { width: "100%", accentColor: "white" }
                            })
                       )
                   )
               )
           )
        ),
        
        /* Bottom Buttons */
        React.createElement("div", { style: { display: "flex", gap: "16px", marginTop: "24px" } },
            React.createElement("button", {
                onClick: () => setShowARModal(false),
                style: {
                    padding: "12px 24px", borderRadius: "30px",
                    background: "rgba(255,255,255,0.2)", color: "white", border: "1px solid white", fontWeight: "600", cursor: "pointer",
                    backdropFilter: "blur(4px)"
                }
            }, "Close"),
            
            // Hidden canvas for snapshot
            React.createElement("canvas", { ref: canvasRef, style: { display: 'none' } }),

            React.createElement("button", {
                onClick: () => takeSnapshot(), 
                style: {
                    padding: "12px 24px", borderRadius: "30px",
                    background: "white", color: "black", border: "none", fontWeight: "bold", cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(255,255,255,0.2)"
                }
            }, "📸 Save to Device")
        )
    ),

    /* -------- MORE FROM THIS ARTISAN -------- */
    React.createElement(
      "section",
      { style: { marginTop: "40px", maxWidth: "1200px", margin: "40px auto 0", padding: "0 20px" } },

      React.createElement(
        "div",
        { className: "section-title" },
        React.createElement("h3", null, "You might also like"),
        React.createElement("a", { href: "#" }, "View all")
      ),

      React.createElement(ProductGrid, { products: relatedProducts })
    ),

    /* -------- FOOTER -------- */
    React.createElement(Footer)
    )
  );
}

/* --- HELPER: Draggable & Resizable Image Component --- */
function DraggableResizableImage({ src, initialSize, position, setPosition, scale, setScale, rotation, setRotation, tilt, brightness }) {
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    
    /* MOUSE EVENTS */
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    /* TOUCH EVENTS */
    const handleTouchStart = (e) => {
        if (e.touches.length === 1) {
            setIsDragging(true);
            const touch = e.touches[0];
            setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
        }
    };

    const handleTouchMove = (e) => {
        if (isDragging && e.touches.length === 1) {
            const touch = e.touches[0];
            const newX = touch.clientX - dragStart.x;
            const newY = touch.clientY - dragStart.y;
            setPosition({ x: newX, y: newY });
        }
    };

    const handleTouchEnd = () => setIsDragging(false);
    
    /* WHEEL ZOOM */
    const handleWheel = (e) => {
        const delta = -Math.sign(e.deltaY) * 0.1;
        const newScale = Math.min(Math.max(0.5, scale + delta), 3);
        setScale(newScale);
    };

    // Apply tilt via vertical scaling (simple perspective simulation)
    const tiltScale = tilt || 1; 

    return React.createElement("div", {
        style: {
            position: "absolute",
            top: "50%", left: "50%",
            // Combine Translate, Rotate, then Scale (Size), then Scale (Tilt)
            transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) rotate(${rotation}deg) scale(${scale}) scaleY(${tiltScale})`,
            width: `${initialSize}px`,
            cursor: isDragging ? "grabbing" : "grab",
            touchAction: "none",
            userSelect: "none",
            filter: `brightness(${brightness || 1})` // Lighting
        },
        onMouseDown: handleMouseDown,
        onMouseMove: handleMouseMove,
        onMouseUp: handleMouseUp,
        onMouseLeave: handleMouseUp,
        onTouchStart: handleTouchStart,
        onTouchMove: handleTouchMove,
        onTouchEnd: handleTouchEnd,
        onWheel: handleWheel
    }, 
        React.createElement("img", { 
            src: src, 
            style: { 
                width: "100%", 
                pointerEvents: "none",
                // Realistic Drop Shadow
                filter: "drop-shadow(0 25px 25px rgba(0,0,0,0.5))" 
            },
            draggable: false
        }),
        // Resize handle hint (updated)
        React.createElement("div", {
            style: {
                position: "absolute", bottom: -25, left: "50%", transform: "translateX(-50%)",
                background: "rgba(255,255,255,0.7)", padding: "2px 8px", borderRadius: "10px",
                fontSize: "10px", color: "#000", pointerEvents: "none", whitespace: "nowrap"
            }
        }, `${Math.round(scale * 100)}%`)
    );
}

export default ProductDetailsPage;
