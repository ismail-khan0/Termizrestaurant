// src/services/orderService.js
import { api } from './api';

export const orderService = {
  async getAllOrders() {
    return await api.getOrders();
  },

  async createNewOrder(orderData) {
    return await api.createOrder(orderData);
  },

  async updateOrder(orderId, updates) {
    return await api.updateOrderStatus(orderId, updates.status);
  },

  async getOrdersByStatus(status) {
    const orders = await api.getOrders();
    if (status === 'All') return orders;
    return orders.filter(order => order.status === status.toLowerCase());
  }
};