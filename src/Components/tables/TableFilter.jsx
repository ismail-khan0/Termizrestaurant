// src/components/tables/TableFilter.jsx
import React from 'react';

const TableFilter = ({ activeFilter, onFilterChange }) => {
  const filters = ["All", "Booked", "Available", "Occupied"];

  return (
    <div className="flex gap-3 mb-6">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`px-4 py-1 rounded-lg text-sm ${
            activeFilter === filter ? "bg-gray-700" : "bg-gray-800"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default TableFilter;