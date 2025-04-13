import axios from "axios";

const API_URL = "https://taskmanagerbackend-zg7t.onrender.com/api/auth";

// Configurar axios para enviar cookies
axios.defaults.withCredentials = true;

const authService = {
  // Registrar usuario
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error en el servidor" };
    }
  },

  // Iniciar sesión
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error en el servidor" };
    }
  },

  // Cerrar sesión
  logout: async () => {
    try {
      await axios.post(`${API_URL}/logout`);
      localStorage.removeItem("token");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  },

  // Obtener usuario actual
  // Modify authService.js
  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;

      console.log("Sending token:", token); // For debugging

      const response = await axios.get(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      // Don't return null on error, as this might hide issues
      // Instead, rethrow the error or handle it appropriately
      localStorage.removeItem("token"); // Clear the token if it's invalid
      return null;
    }
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};

export default authService;
