// src/components/TaskList.jsx
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import taskService from '../services/taskService';

const TaskList = ({ filters, onTaskSelect, onTaskChange }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar tareas cuando cambian los filtros
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const tasksData = await taskService.getTasks(filters);
        setTasks(tasksData);
      } catch (error) {
        toast.error(error.message || 'Error al cargar las tareas');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [filters]);

  // Actualizar estado de tarea
  const handleStatusChange = async (task, newStatus) => {
    try {
      // Validar cambios de estado según las reglas
      if (task.status === 'pendiente' && newStatus !== 'en progreso') {
        toast.error('Solo se puede cambiar a "en progreso" desde "pendiente"');
        return;
      }
      
      if (task.status === 'en progreso' && newStatus !== 'completada') {
        toast.error('Solo se puede cambiar a "completada" desde "en progreso"');
        return;
      }

      if (task.status === 'completada') {
        toast.error('No se puede modificar una tarea completada');
        return;
      }

      await taskService.updateTask(task.id, { ...task, status: newStatus });
      toast.success('Estado actualizado correctamente');
      
      // Actualizar la lista de tareas
      setTasks(tasks.map(t => 
        t.id === task.id ? { ...t, status: newStatus } : t
      ));
      
      // Notificar al componente padre
      if (onTaskChange) onTaskChange();
    } catch (error) {
      toast.error(error.message || 'Error al actualizar el estado');
    }
  };

  // Eliminar tarea
  const handleDelete = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      
      if (task.status !== 'completada') {
        toast.error('Solo se pueden eliminar tareas completadas');
        return;
      }
      
      await taskService.deleteTask(taskId);
      toast.success('Tarea eliminada correctamente');
      
      // Actualizar la lista de tareas
      setTasks(tasks.filter(t => t.id !== taskId));
      
      // Notificar al componente padre
      if (onTaskChange) onTaskChange();
    } catch (error) {
      toast.error(error.message || 'Error al eliminar la tarea');
    }
  };

  // Renderizar estados según lo permitido
  const renderStatusOptions = (task) => {
    const { status } = task;
    
    if (status === 'pendiente') {
      return (
        <button 
          onClick={() => handleStatusChange(task, 'en progreso')}
          className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
        >
          Cambiar a En Progreso
        </button>
      );
    }
    
    if (status === 'en progreso') {
      return (
        <button 
          onClick={() => handleStatusChange(task, 'completada')}
          className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
        >
          Marcar como Completada
        </button>
      );
    }
    
    return null;
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'No definida';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  };

  // Obtener clase CSS según el estado
  const getStatusClass = (status) => {
    switch (status) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'en progreso':
        return 'bg-blue-100 text-blue-800';
      case 'completada':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100';
    }
  };

  if (loading) {
    return <div className="text-center py-10">Cargando tareas...</div>;
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No hay tareas que coincidan con los filtros aplicados
      </div>
    );
  }

  return (
    <div className="mt-6">
      <ul className="divide-y divide-gray-200">
        {tasks.map(task => (
          <li key={task.id} className="py-4 hover:bg-gray-50 rounded-lg">
            <div className="flex items-start justify-between px-4">
              <div className="flex-1" onClick={() => onTaskSelect && onTaskSelect(task)}>
                <div className="flex items-center">
                  <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
                    {task.title}
                  </h3>
                  <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(task.status)}`}>
                    {task.status}
                  </span>
                </div>
                
                {task.description && (
                  <p className="mt-1 text-gray-600 line-clamp-2">{task.description}</p>
                )}
                
                <div className="mt-2 text-sm text-gray-500">
                  Fecha límite: {formatDate(task.dueDate)}
                </div>
              </div>
              
              <div className="ml-4 flex flex-col space-y-2">
                {renderStatusOptions(task)}
                
                {task.status === 'completada' && (
                  <button 
                    onClick={() => handleDelete(task.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                )}
                
                {task.status !== 'completada' && (
                  <button 
                    onClick={() => onTaskSelect && onTaskSelect(task)}
                    className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-300"
                  >
                    Editar
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;