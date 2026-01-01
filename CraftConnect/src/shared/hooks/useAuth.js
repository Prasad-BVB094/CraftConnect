import { useState, useEffect } from 'react';
import apiService from '../services/api';

// Custom hook for authentication
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (storedUser && token) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          } catch {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
          }
        } else {
           // Invalid state
           localStorage.removeItem('user');
           localStorage.removeItem('token');
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      // Call the actual API
      const response = await apiService.login(credentials);
      
      // Response structure: { user: {...}, token: "..." }
      const { user: userData, token } = response;
      
      if (token) {
        localStorage.setItem('token', token);
      }
      
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }
      
      return userData;
    } catch (err) {
      console.error("Login service error:", err);
      if (err.message && err.message.includes("Failed to fetch")) {
         setError("Connection to server failed. Please check if backend is running on port 3001.");
      } else {
         setError(err.message || "Login failed");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/';
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Call the actual API
      const response = await apiService.register(userData);
      
      // Check if backend logs user in automatically
      const { user: newUser, token } = response;
      
      if (token) {
          localStorage.setItem('token', token);
      }

      if (newUser) {
          localStorage.setItem('user', JSON.stringify(newUser));
          setUser(newUser);
          return newUser;
      }
      
      return response;
    } catch (err) {
      console.error("Registration service error:", err);
      if (err.message && err.message.includes("Failed to fetch")) {
         setError("Connection to server failed. Please check if backend is running on port 3001.");
      } else {
         setError(err.message || "Registration failed");
      }
      throw err;
    } finally {
        setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    register,
    isAuthenticated: !!user
  };
};
