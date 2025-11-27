// src/services/mockApi.js
import sampleData from '';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Menu endpoints
  getMenuItems: async () => {
    await delay(500);
    return sampleData.menuItems;
  },
  
  getCategories: async () => {
    await delay(300);
    return sampleData.categories;
  },
  
  // Order endpoints
  getOrders: async () => {
    await delay(600);
    return sampleData.orders;
  },
  
  createOrder: async (orderData) => {
    await delay(800);
    const newOrder = {
      ...orderData,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      orderNumber: (sampleData.orders.length + 101).toString()
    };
    sampleData.orders.push(newOrder);
    return newOrder;
  },
  
  updateOrderstatus: async (orderId, status) => {
    await delay(400);
    const order = sampleData.orders.find(o => o._id === orderId);
    if (order) {
      order.status = status;
    }
    return order;
  },
  
  // Table endpoints
  getTables: async () => {
    await delay(400);
    return sampleData.tables;
  },
  
  updateTableStatus: async (tableId, status, customerData = {}) => {
    await delay(400);
    const table = sampleData.tables.find(t => t._id === tableId);
    if (table) {
      table.status = status;
      if (customerData.name) {
        table.customerName = customerData.name;
        table.customerInitials = customerData.name.split(' ').map(n => n[0]).join('').toUpperCase();
      }
    }
    return table;
  },
  
  // Dashboard data
  getDashboardStats: async () => {
    await delay(700);
    return {
      todayRevenue: 5120,
      inProgressOrders: 16,
      availableTables: 8,
      popularDishes: sampleData.popularDishes
    };
  }
};