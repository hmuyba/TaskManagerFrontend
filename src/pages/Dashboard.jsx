// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import taskService from "../services/taskService";

const TaskStatusSummary = ({ tasks }) => {
  // Contar tareas por estado
  const countByStatus = {
    pendiente: tasks.filter((t) => t.status === "pendiente").length,
    enProgreso: tasks.filter((t) => t.status === "en progreso").length,
    completada: tasks.filter((t) => t.status === "completada").length,
  };

  // Total de tareas
  const total = tasks.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-yellow-50 p-4 rounded-lg shadow-sm border border-yellow-200">
        <h3 className="text-lg font-semibold text-yellow-800">Pendientes</h3>
        <p className="text-3xl font-bold text-yellow-600">
          {countByStatus.pendiente}
        </p>
        <p className="text-sm text-yellow-600 mt-1">
          {total > 0 ? Math.round((countByStatus.pendiente / total) * 100) : 0}%
          del total
        </p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800">En Progreso</h3>
        <p className="text-3xl font-bold text-blue-600">
          {countByStatus.enProgreso}
        </p>
        <p className="text-sm text-blue-600 mt-1">
          {total > 0 ? Math.round((countByStatus.enProgreso / total) * 100) : 0}
          % del total
        </p>
      </div>

      <div className="bg-green-50 p-4 rounded-lg shadow-sm border border-green-200">
        <h3 className="text-lg font-semibold text-green-800">Completadas</h3>
        <p className="text-3xl font-bold text-green-600">
          {countByStatus.completada}
        </p>
        <p className="text-sm text-green-600 mt-1">
          {total > 0 ? Math.round((countByStatus.completada / total) * 100) : 0}
          % del total
        </p>
      </div>
    </div>
  );
};

const RecentTasks = ({ tasks }) => {
  // Obtener las 5 tareas más recientes
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (recentTasks.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Tareas Recientes</h3>
        <p className="text-gray-500">No hay tareas registradas aún.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Tareas Recientes</h3>
      <ul className="divide-y divide-gray-200">
        {recentTasks.map((task) => (
          <li key={task.id} className="py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{task.title}</p>
                <p className="text-sm text-gray-500">
                  {task.dueDate
                    ? `Fecha límite: ${new Date(
                        task.dueDate
                      ).toLocaleDateString("es-ES")}`
                    : "Sin fecha límite"}
                </p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  task.status === "pendiente"
                    ? "bg-yellow-100 text-yellow-800"
                    : task.status === "en progreso"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {task.status}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 text-center">
        <Link
          to="/tareas"
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          Ver todas las tareas →
        </Link>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);

  useEffect(() => {
    console.log("Auth state:", { user, isAuthenticated: !!user });
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setTasksLoading(true);
        const tasksData = await taskService.getTasks();
        setTasks(tasksData);
      } catch (error) {
        console.error("Error al cargar tareas:", error);
      } finally {
        setTasksLoading(false);
      }
    };

    if (user) {
      fetchTasks();
    }
  }, [user]);

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

  if (!user) {
    return null;
  }

  // ...continuación del código anterior

  return (
    <div className="bg-gray-50 min-h-screen pb-8">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
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
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Resumen de tareas
          </h2>
          {tasksLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <TaskStatusSummary tasks={tasks} />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {tasksLoading ? (
              <div className="flex justify-center py-8 bg-white rounded-lg shadow-md">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <RecentTasks tasks={tasks} />
            )}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Acciones rápidas</h3>
            <div className="space-y-3">
              <Link
                to="/tareas/nueva"
                className="block w-full py-2 px-4 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Crear nueva tarea
              </Link>
              <Link
                to="/tareas"
                className="block w-full py-2 px-4 bg-gray-200 text-gray-800 text-center rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                Ver todas las tareas
              </Link>
            </div>
          </div>
        </div>
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

export default Dashboard;
