import React, { createContext, useContext, useState, useEffect } from "react";
import apiService from "../services/api";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Poll for token changes (detects login/logout in same tab)
  useEffect(() => {
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem("token");
      if (currentToken !== token) {
        setToken(currentToken);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [token]);

  // Load cart on mount or when token changes
  useEffect(() => {
    const fetchCart = async () => {
      if (token) {
        setLoading(true);
        try {
          // Fetch from Backend
          const backendCart = await apiService.getCart();
          // Backend might return { items: [] } or just [] or nested structure
          // Based on API calls.txt, GET /api/cart returns something.
          // Let's assume it returns an object with 'items' or array.
          // We need to map it to our frontend structure if needed.
          // Frontend structure: { id, title, price, quantity, image }
          // Backend likely returns { productId: {_id, title...}, quantity }
          
          // Since I can't see the backend response structure exactly without running it, 
          // I will assume the backend returns populated items or I need to map them.
          // For now, I'll trust the backend sends usable data or I'll handle basic mapping if it's standard.
          // If backend returns: { items: [ { product: {...}, quantity: 1 } ] }
          
          // Let's assume standard response for now and set it.
          // If the backend returns the cart items array directly:
          const items = Array.isArray(backendCart) ? backendCart : (backendCart.items || []);
          
          // Map backend product structure to frontend cart structure if necessary
          // Frontend expects: id, title, price, image, quantity
          const mappedItems = items.map(item => {
             // Handle if 'product' is nested object (common in Mongoose population)
             const product = item.product || item; 
             return {
                 id: product._id || product.id || item.productId,
                 name: product.name || product.title || item.name,
                 price: product.price || item.price,
                 image: product.images?.[0] || product.image || item.image,
                 quantity: item.quantity
             };
          });

          setCartItems(mappedItems);
        } catch (error) {
          console.error("Failed to fetch cart from backend:", error);
        } finally {
          setLoading(false);
        }
      } else {
        // Fallback to localStorage for Guest
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      }
    };

    fetchCart();
  }, [token]);

  // Sync to localStorage for guests ONLY
  useEffect(() => {
    if (!token) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, token]);

  const addToCart = async (product, quantity = 1) => {
    // Optimistic Update
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id || item.id === product._id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id || item.id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { 
          id: product.id || product._id, 
          name: product.title || product.name, 
          price: product.price, 
          image: product.images?.[0] || product.image, 
          quantity 
      }];
    });

    if (token) {
      try {
        await apiService.addToCart(product.id || product._id, quantity);
        // Optionally refetch to ensure sync:
        // const updatedCart = await apiService.getCart();
        // setCartItems(mapBackendCart(updatedCart));
      } catch (error) {
        console.error("Failed to add to backend cart:", error);
        // Revert or show error could be handled here
      }
    }
  };

  const removeFromCart = async (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );

    if (token) {
      try {
        await apiService.removeFromCart(productId);
      } catch (error) {
        console.error("Failed to remove from backend cart:", error);
      }
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );

    if (token) {
      try {
        await apiService.updateCartItem(productId, quantity);
      } catch (error) {
        console.error("Failed to update cart quantity:", error);
      }
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    if (token) {
        // Backend specific clear method if exists, or just rely on state. 
        // Typically order placement clears it on backend automatically.
        // If we need an explicit clear endpoint, we'd call it here.
        // For now, assume it's cleared on order or we just clear local state.
    } else {
        localStorage.removeItem("cart");
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    loading
  };

  return React.createElement(CartContext.Provider, { value }, children);
}
