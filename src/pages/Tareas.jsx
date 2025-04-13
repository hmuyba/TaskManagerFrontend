// src/pages/Tareas.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import TaskFilters from "../components/TaskFilters";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";

const Tareas = () => {
  const { user, logout } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filters, setFilters] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Verificar si el usuario está autenticado
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Comprobar si estamos en la ruta de creación de nueva tarea
  useEffect(() => {
    if (location.pathname === "/tareas/nueva") {
      setShowAddForm(true);
      setSelectedTask(null);
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      toast.success("Sesión cerrada correctamente");
      navigate("/login");
    } catch (error) {
      toast.error("Error al cerrar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleAddTask = () => {
    setSelectedTask(null);
    setShowAddForm(true);
    // Actualizar la URL para reflejar que estamos creando una nueva tarea
    navigate("/tareas/nueva", { replace: true });
  };

  const handleTaskSelect = (task) => {
    setSelectedTask(task);
    setShowAddForm(true);
    // Actualizar la URL para reflejar que estamos editando una tarea
    navigate(`/tareas/editar/${task.id}`, { replace: true });
  };

  const handleFormCancel = () => {
    setShowAddForm(false);
    setSelectedTask(null);
    // Volver a la lista de tareas al cancelar
    navigate("/tareas", { replace: true });
  };

  const handleTaskSaved = () => {
    setShowAddForm(false);
    setSelectedTask(null);
    // Forzar recarga de la lista de tareas
    setRefreshKey((prevKey) => prevKey + 1);
    // Volver a la lista de tareas después de guardar
    navigate("/tareas", { replace: true });
  };

  const handleTaskChange = () => {
    // Forzar recarga de la lista de tareas
    setRefreshKey((prevKey) => prevKey + 1);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header igual al del Dashboard */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Gestión de Tareas
            </h1>
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Volver al Dashboard
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              Hola, {user.name || user.email}
            </span>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? "Cerrando sesión..." : "Cerrar sesión"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-700">
            {showAddForm
              ? selectedTask
                ? "Editar Tarea"
                : "Nueva Tarea"
              : "Lista de Tareas"}
          </h2>

          {!showAddForm && (
            <button
              onClick={handleAddTask}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Nueva Tarea
            </button>
          )}
        </div>

        {showAddForm ? (
          <TaskForm
            task={selectedTask}
            onCancel={handleFormCancel}
            onTaskSaved={handleTaskSaved}
          />
        ) : (
          <>
            <TaskFilters onFilterChange={handleFilterChange} />

            <TaskList
              key={refreshKey}
              filters={filters}
              onTaskSelect={handleTaskSelect}
              onTaskChange={handleTaskChange}
            />
          </>
        )}
      </main>

      <footer className="mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-gray-200 py-4">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} TaskManager - Todos los derechos
            reservados
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Tareas;
