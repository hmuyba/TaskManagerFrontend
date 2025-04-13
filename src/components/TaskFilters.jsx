// src/components/TaskFilters.jsx
import { useState } from 'react';

const TaskFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    from: '',
    to: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      status: '',
      search: '',
      from: '',
      to: ''
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Filtros</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="en progreso">En Progreso</option>
            <option value="completada">Completada</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Buscar
          </label>
          <input
            id="search"
            name="search"
            type="text"
            value={filters.search}
            onChange={handleInputChange}
            placeholder="Título o palabra clave"
            className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">
            Desde fecha
          </label>
          <input
            id="from"
            name="from"
            type="date"
            value={filters.from}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
            Hasta fecha
          </label>
          <input
            id="to"
            name="to"
            type="date"
            value={filters.to}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Limpiar Filtros
        </button>
      </div>
    </div>
  );
};

export default TaskFilters;