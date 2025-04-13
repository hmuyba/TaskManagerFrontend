import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";
import { jwtDecode } from "jwt-decode"; // Using named import

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Extract user from token
  const getUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      // Decode the token to get user info
      const decoded = jwtDecode(token);

      // Check if token is expired
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        return null;
      }

      return {
        id: decoded.id,
        email: decoded.email,
      };
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem("token");
      return null;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to get user info from token directly
        const userData = getUserFromToken();
        setUser(userData);
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    const userData = getUserFromToken();
    setUser(userData);
    return response;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!user;
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
