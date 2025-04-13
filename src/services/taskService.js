import axios from "axios";

const API_URL = "https://taskmanagerbackend-zg7t.onrender.com/api/tasks";

// Configure axios for credentials
axios.defaults.withCredentials = true;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return {};
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const taskService = {
  // Get all tasks with possible filters
  getTasks: async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      // Add filters to parameters if they exist
      if (filters.status) params.append("status", filters.status);
      if (filters.search) params.append("search", filters.search);
      if (filters.from) params.append("from", filters.from);
      if (filters.to) params.append("to", filters.to);

      console.log("Getting tasks with auth header:", getAuthHeader());

      const response = await axios.get(
        `${API_URL}?${params.toString()}`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error.response?.data || { message: "Error getting tasks" };
    }
  },

  // Obtener una tarea específica
  getTask: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`, getAuthHeader());
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error al obtener la tarea" };
    }
  },

  // Crear nueva tarea
  createTask: async (taskData) => {
    try {
      const response = await axios.post(API_URL, taskData, getAuthHeader());
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error al crear la tarea" };
    }
  },

  // Actualizar tarea existente
  updateTask: async (id, taskData) => {
    try {
      const response = await axios.put(
        `${API_URL}/${id}`,
        taskData,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error al actualizar la tarea" };
    }
  },

  // Eliminar tarea
  deleteTask: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error al eliminar la tarea" };
    }
  },
};

export default taskService;
