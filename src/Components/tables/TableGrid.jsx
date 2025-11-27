// src/Components/tables/TableGrid.jsx
import React from 'react';
import TableCard from './TableCard';

const TableGrid = ({ 
  tables, 
  selectedTable, 
  onTableSelect, 
  filter = 'all',
  layout = 'grid'
}) => {
  const filteredTables = tables.filter(table => {
    if (filter === 'all') return true;
    return table.status === filter;
  });

  const getFilteredCount = (status) => {
    return tables.filter(table => table.status === status).length;
  };

  const gridClasses = {
    grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4',
    list: 'flex flex-col gap-3',
    compact: 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3'
  };

  return (
    <div className="space-y-4">
      {/* Filter Stats */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-green-500 bg-opacity-20 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-400">{getFilteredCount('available')}</div>
          <div className="text-xs text-green-300">Available</div>
        </div>
        <div className="bg-red-500 bg-opacity-20 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-400">{getFilteredCount('occupied')}</div>
          <div className="text-xs text-red-300">Occupied</div>
        </div>
        <div className="bg-yellow-500 bg-opacity-20 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-400">{getFilteredCount('reserved')}</div>
          <div className="text-xs text-yellow-300">Reserved</div>
        </div>
        <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-400">{getFilteredCount('cleaning')}</div>
          <div className="text-xs text-blue-300">Cleaning</div>
        </div>
      </div>

      {/* Tables Grid */}
      <div className={gridClasses[layout]}>
        {filteredTables.map(table => (
          <TableCard
            key={table._id}
            table={table}
            isSelected={selectedTable?._id === table._id}
            onSelect={onTableSelect}
            showDetails={layout !== 'compact'}
          />
        ))}
      </div>

      {filteredTables.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <div className="text-6xl mb-4">🍽️</div>
          <p className="text-lg">No tables found</p>
          <p className="text-sm">Try changing your filter</p>
        </div>
      )}
    </div>
  );
};

export default TableGrid;