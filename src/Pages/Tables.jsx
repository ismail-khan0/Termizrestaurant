// src/pages/TableManagement.jsx
import React, { useState } from 'react';
import Header from '../Components/common/Header';
import TableForm from '../Components/admin/TableForm';
import { useTables } from '../hooks/useTables';
import { api } from '../services/api';

const TableManagement = () => {
  const { tables, loading, error, refetch } = useTables('All');
  const [showTableForm, setShowTableForm] = useState(false);
  const [editingTable, setEditingTable] = useState(null);

  const handleDeleteTable = async (tableId) => {
    if (window.confirm('Are you sure you want to delete this table?')) {
      try {
        await api.deleteTable(tableId);
        refetch();
      } catch (error) {
        alert('Error deleting table: ' + error.message);
      }
    }
  };

  const handleAssignCustomer = async (tableId) => {
    const customerName = prompt('Enter customer name:');
    if (customerName) {
      try {
        await api.assignCustomerToTable(tableId, { customerName });
        refetch();
      } catch (error) {
        alert('Error assigning customer: ' + error.message);
      }
    }
  };

  const handleFreeTable = async (tableId) => {
    try {
      await api.freeTable(tableId);
      refetch();
    } catch (error) {
      alert('Error freeing table: ' + error.message);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen w-full bg-[#111] text-white p-4 pb-20">
      <Header title="Table Management" />

      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => { setEditingTable(null); setShowTableForm(true); }}
          className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 mb-6"
        >
          + Add Table
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tables.map(table => (
            <div key={table._id} className="bg-[#1a1a1a] p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-lg">Table {table.number}</h3>
                <span className={`px-2 py-1 rounded text-xs ${
                  table.status === 'available' ? 'bg-green-600' :
                  table.status === 'occupied' ? 'bg-red-600' : 'bg-yellow-600'
                }`}>
                  {table.status.toUpperCase()}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-400">
                <p>Capacity: {table.capacity} persons</p>
                <p>Location: {table.location}</p>
                {table.customerName && (
                  <p>Customer: {table.customerName}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={() => { setEditingTable(table); setShowTableForm(true); }}
                  className="bg-yellow-600 px-3 py-1 rounded text-sm hover:bg-yellow-700"
                >
                  Edit
                </button>
                
                {table.status === 'available' ? (
                  <button
                    onClick={() => handleAssignCustomer(table._id)}
                    className="bg-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Assign
                  </button>
                ) : (
                  <button
                    onClick={() => handleFreeTable(table._id)}
                    className="bg-green-600 px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    Free
                  </button>
                )}
                
                <button
                  onClick={() => handleDeleteTable(table._id)}
                  className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showTableForm && (
        <TableForm
          table={editingTable}
          onClose={() => { setShowTableForm(false); setEditingTable(null); }}
          onSave={refetch}
        />
      )}
    </div>
  );
};

export default TableManagement;