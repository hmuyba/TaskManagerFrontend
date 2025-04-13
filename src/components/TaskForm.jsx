// src/components/TaskForm.jsx
import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import taskService from '../services/taskService';

const TaskForm = ({ task = null, onCancel, onTaskSaved }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!task;

  // Esquema de validación
  const validationSchema = Yup.object({
    title: Yup.string().required('El título es obligatorio'),
    description: Yup.string(),
    dueDate: Yup.date().nullable()
  });

  // Inicializar formulario
  const formik = useFormik({
    initialValues: {
      title: task?.title || '',
      description: task?.description || '',
      dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        
        // Formatear datos para enviar
        const taskData = {
          ...values,
          // Solo enviar dueDate si no está vacío
          dueDate: values.dueDate || undefined
        };
        
        if (isEditing) {
          // No permitir editar tareas completadas
          if (task.status === 'completada') {
            toast.error('No se puede modificar una tarea completada');
            return;
          }
          
          await taskService.updateTask(task.id, taskData);
          toast.success('Tarea actualizada correctamente');
        } else {
          await taskService.createTask(taskData);
          toast.success('Tarea creada correctamente');
        }
        
        // Notificar al componente padre
        if (onTaskSaved) onTaskSaved();
      } catch (error) {
        toast.error(error.message || 'Error al guardar la tarea');
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  // Verificar si se puede editar la tarea
  useEffect(() => {
    if (isEditing && task.status === 'completada') {
      toast.warn('Las tareas completadas no se pueden modificar, solo eliminar');
      onCancel();
    }
  }, [isEditing, task, onCancel]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? 'Editar Tarea' : 'Nueva Tarea'}
      </h2>
      
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
            Título *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${
              formik.touched.title && formik.errors.title 
                ? 'border-red-500' 
                : 'border-gray-300 focus:border-blue-500'
            }`}
            placeholder="Título de la tarea"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
          />
          {formik.touched.title && formik.errors.title && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.title}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Descripción de la tarea (opcional)"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
          ></textarea>
        </div>

        <div className="mb-6">
          <label htmlFor="dueDate" className="block text-gray-700 text-sm font-bold mb-2">
            Fecha límite
          </label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.dueDate}
          />
          <p className="text-gray-500 text-xs mt-1">Opcional</p>
        </div>

        {isEditing && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Estado actual:</span>{' '}
              <span className={`px-2 py-1 rounded-full text-xs ${
                task.status === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                task.status === 'en progreso' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {task.status}
              </span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Nota: El estado solo se puede cambiar desde la lista de tareas según el flujo permitido.
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting 
              ? (isEditing ? 'Actualizando...' : 'Creando...') 
              : (isEditing ? 'Actualizar' : 'Crear')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;