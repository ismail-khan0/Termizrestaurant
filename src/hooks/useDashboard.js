// src/hooks/useDashboard.js
import { useState, useEffect } from 'react';
import { api } from '../services/api';

export const useDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching dashboard stats...');
      
      const dashboardStats = await api.getDashboardStats();
      console.log('Dashboard stats received:', dashboardStats);
      
      setStats(dashboardStats);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.message);
      
      // Enhanced fallback data
      setStats({
        revenue: { 
          today: 0, 
          weekly: 0, 
          monthly: 0 
        },
        orders: { 
          today: 0, 
          pending: 0, 
          preparing: 0,
          ready: 0,
          completed: 0,
          total: 0
        },
        tables: { 
          total: 8, 
          available: 8, 
          occupied: 0 
        },
        popularDishes: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    
    // Refresh every 15 seconds for real-time updates
    const interval = setInterval(fetchDashboardStats, 15000);
    return () => clearInterval(interval);
  }, []);

  // Function to manually refresh stats
  const refreshStats = () => {
    fetchDashboardStats();
  };

  return { stats, loading, error, refreshStats };
};