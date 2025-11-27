// src/hooks/useOrders.js
import { useState, useEffect } from 'react';
import { api } from '../services/api';

export const useOrders = (status = 'All') => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const ordersData = await api.getOrders(status);
        setOrders(ordersData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [status]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      setError(err.message);
      console.error('Error updating order status:', err);
    }
  };

  return { orders, loading, error, updateOrderStatus };
};