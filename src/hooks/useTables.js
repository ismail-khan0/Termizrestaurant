import { useState, useEffect } from 'react';
import { api } from '../services/api';

export const useTables = (status = 'All') => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const tablesData = await api.getTables(status);
      setTables(tablesData);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching tables:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, [status]);

  const updateTableStatus = async (tableId, newStatus, customerName = '') => {
    try {
      // Use the new updateTableStatus API function
      await api.updateTableStatus(tableId, newStatus, customerName);
      
      setTables(prev => prev.map(table => 
        table._id === tableId ? { 
          ...table, 
          status: newStatus,
          customerName: customerName || table.customerName,
          customerInitials: customerName 
            ? customerName.split(' ').map(n => n[0]).join('').toUpperCase()
            : table.customerInitials
        } : table
      ));
    } catch (err) {
      setError(err.message);
      console.error('Error updating table status:', err);
    }
  };

  return { tables, loading, error, updateTableStatus, refetch: fetchTables };
};