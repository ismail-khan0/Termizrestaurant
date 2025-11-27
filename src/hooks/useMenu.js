// src/hooks/useMenu.js
import { useState, useEffect } from 'react';
import { api } from '../services/api';

export const useMenu = () => {
  const [menuData, setMenuData] = useState({ items: [], categories: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [items, categories] = await Promise.all([
        api.getMenuItems(),
        api.getCategories()
      ]);
      setMenuData({ items, categories });
    } catch (err) {
      setError(err.message);
      console.error('Error fetching menu data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  // Return the refetch function
  return { 
    ...menuData, 
    loading, 
    error, 
    refetch: fetchMenuData 
  };
};