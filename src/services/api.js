// src/services/api.js

// Simple localStorage-based database for Electron
class LocalDatabase {
  constructor() {
    this.storageKey = 'termizrestaurant_data_v4';
    this.init();
  }

  init() {
    try {
      if (!this.getData()) {
        const defaultData = this.getDefaultData();
        this.saveData(defaultData);
      }
    } catch (error) {
      console.error('Database initialization error:', error);
      // Fallback to default data
      return this.getDefaultData();
    }
  }

  getDefaultData() {
    return {
      tables: [
        { _id: '1', number: 1, capacity: 4, status: 'available', location: 'main-hall', currentOrder: null },
        { _id: '2', number: 2, capacity: 6, status: 'available', location: 'main-hall', currentOrder: null },
        { _id: '3', number: 3, capacity: 2, status: 'available', location: 'terrace', currentOrder: null },
        { _id: '4', number: 4, capacity: 4, status: 'available', location: 'main-hall', currentOrder: null },
        { _id: '5', number: 5, capacity: 8, status: 'available', location: 'vip-room', currentOrder: null },
        { _id: '6', number: 6, capacity: 4, status: 'available', location: 'terrace', currentOrder: null }
      ],
      menuItems: [
        { 
          _id: '1', 
          title: 'Chicken Biryani', 
          price: 450, 
          category: '1',
          description: 'Traditional Pakistani rice dish with chicken and spices',
          preparationTime: 25,
          isAvailable: true,
          ingredients: ['Basmati Rice', 'Chicken', 'Spices'],
          spicyLevel: 'medium',
          image: null
        },
        { 
          _id: '2', 
          title: 'Seekh Kebab', 
          price: 320, 
          category: '1',
          description: 'Minced meat kebabs with traditional spices',
          preparationTime: 20,
          isAvailable: true,
          ingredients: ['Minced Meat', 'Spices', 'Herbs'],
          spicyLevel: 'medium',
          image: null
        },
        { 
          _id: '3', 
          title: 'Chicken Karahi', 
          price: 650, 
          category: '2',
          description: 'Traditional Pakistani wok-cooked chicken curry',
          preparationTime: 30,
          isAvailable: true,
          ingredients: ['Chicken', 'Tomatoes', 'Ginger', 'Garlic'],
          spicyLevel: 'medium',
          image: null
        },
        { 
          _id: '4', 
          title: 'Mutton Karahi', 
          price: 850, 
          category: '2',
          description: 'Traditional Pakistani wok-cooked mutton curry',
          preparationTime: 35,
          isAvailable: true,
          ingredients: ['Mutton', 'Tomatoes', 'Ginger', 'Garlic'],
          spicyLevel: 'high',
          image: null
        },
        { 
          _id: '5', 
          title: 'Fresh Lime', 
          price: 80, 
          category: '3',
          description: 'Fresh lime soda with mint',
          preparationTime: 5,
          isAvailable: true,
          ingredients: ['Lime', 'Soda', 'Mint', 'Sugar'],
          spicyLevel: 'none',
          image: null
        },
        { 
          _id: '6', 
          title: 'Chicken Tikka', 
          price: 550, 
          category: '1',
          description: 'Grilled chicken pieces with spices',
          preparationTime: 25,
          isAvailable: true,
          ingredients: ['Chicken', 'Yogurt', 'Spices'],
          spicyLevel: 'medium',
          image: null
        },
        { 
          _id: '7', 
          title: 'Fish Curry', 
          price: 750, 
          category: '2',
          description: 'Spicy fish curry with traditional spices',
          preparationTime: 20,
          isAvailable: true,
          ingredients: ['Fish', 'Spices', 'Coconut Milk'],
          spicyLevel: 'medium',
          image: null
        },
        { 
          _id: '8', 
          title: 'Gulab Jamun', 
          price: 120, 
          category: '4',
          description: 'Sweet milk balls in sugar syrup',
          preparationTime: 10,
          isAvailable: true,
          ingredients: ['Milk', 'Sugar', 'Flour'],
          spicyLevel: 'none',
          image: null
        }
      ],
      categories: [
        { _id: '1', name: 'Starters', color: 'bg-red-500', description: 'Appetizers and small bites' },
        { _id: '2', name: 'Main Course', color: 'bg-purple-500', description: 'Main dishes and entrees' },
        { _id: '3', name: 'Beverages', color: 'bg-blue-500', description: 'Drinks and refreshments' },
        { _id: '4', name: 'Desserts', color: 'bg-pink-500', description: 'Sweet treats and desserts' }
      ],
      orders: [
        {
          _id: '1',
          orderNumber: 'ORD001',
          tableNumber: 1,
          customerName: 'Ali Ahmed',
          waiterName: 'Waiter 1',
          items: [
            { _id: '1', title: 'Chicken Biryani', price: 450, quantity: 2, total: 900 },
            { _id: '5', title: 'Fresh Lime', price: 80, quantity: 2, total: 160 }
          ],
          subtotal: 1060,
          tax: 55.65,
          total: 1115.65,
          status: 'completed',
          paymentStatus: 'paid',
          paymentMethod: 'cash',
          type: 'dine-in',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          paidAt: new Date().toISOString()
        }
      ],
      settings: {
        restaurantName: 'Termiz Restaurant',
        taxRate: 5.25,
        currency: 'PKR',
        address: '123 Food Street, Karachi, Pakistan',
        phone: '+92 300 1234567',
        email: 'info@termizrestaurant.com',
        gstin: 'PK-123456789',
        website: 'www.termizrestaurant.com'
      },
      orderCounter: 2
    };
  }

  getData() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  saveData(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }

  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}

// Create database instance
const localDb = new LocalDatabase();

// Mock API calls with better error handling
const mockApiCall = (data, delay = 100) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data === null) {
        reject(new Error('Data not found'));
      } else {
        resolve(data);
      }
    }, delay);
  });
};

// Generate order number
const generateOrderNumber = () => {
  const data = localDb.getData() || localDb.getDefaultData();
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const number = data.orderCounter.toString().padStart(3, '0');
  data.orderCounter++;
  localDb.saveData(data);
  return `ORD${dateStr}${number}`;
};

// Main API object
export const api = {
  // Dashboard Stats
  getDashboardStats: () => {
    try {
      const data = localDb.getData() || localDb.getDefaultData();
      const today = new Date().toISOString().split('T')[0];
      const todayOrders = data.orders.filter(order => 
        order.createdAt && order.createdAt.startsWith(today)
      );

      const last7Days = new Date();
      last7Days.setDate(last7Days.getDate() - 7);
      const weeklyOrders = data.orders.filter(order => 
        new Date(order.createdAt) >= last7Days
      );

      const stats = {
        revenue: {
          today: todayOrders.reduce((sum, order) => sum + (order.total || 0), 0),
          weekly: weeklyOrders.reduce((sum, order) => sum + (order.total || 0), 0),
          monthly: data.orders.reduce((sum, order) => sum + (order.total || 0), 0)
        },
        orders: {
          today: todayOrders.length,
          pending: data.orders.filter(o => o.status === 'pending').length,
          preparing: data.orders.filter(o => o.status === 'preparing').length,
          ready: data.orders.filter(o => o.status === 'ready').length,
          completed: data.orders.filter(o => o.status === 'completed').length,
          total: data.orders.length
        },
        tables: {
          total: data.tables.length,
          available: data.tables.filter(t => t.status === 'available').length,
          occupied: data.tables.filter(t => t.status === 'occupied').length
        },
        popularDishes: [
          { name: 'Chicken Biryani', orders: 45, revenue: 20250 },
          { name: 'Seekh Kebab', orders: 32, revenue: 10240 },
          { name: 'Chicken Karahi', orders: 28, revenue: 18200 },
          { name: 'Mutton Karahi', orders: 25, revenue: 21250 },
          { name: 'Fresh Lime', orders: 50, revenue: 4000 }
        ]
      };

      return mockApiCall(stats);
    } catch (error) {
      console.error('Error in getDashboardStats:', error);
      return mockApiCall({
        revenue: { today: 0, weekly: 0, monthly: 0 },
        orders: { today: 0, pending: 0, preparing: 0, ready: 0, completed: 0, total: 0 },
        tables: { total: 6, available: 6, occupied: 0 },
        popularDishes: []
      });
    }
  },

  // Menu Items
  getMenuItems: () => {
    try {
      const data = localDb.getData() || localDb.getDefaultData();
      const itemsWithCategory = data.menuItems.map(item => {
        const category = data.categories.find(cat => cat._id === item.category);
        return {
          ...item,
          category: category || { name: 'Uncategorized', color: 'bg-gray-500' }
        };
      });
      return mockApiCall(itemsWithCategory);
    } catch (error) {
      console.error('Error in getMenuItems:', error);
      return mockApiCall([]);
    }
  },

  createMenuItem: (itemData) => {
    try {
      const data = localDb.getData() || localDb.getDefaultData();
      const newItem = {
        _id: localDb.generateId(),
        ...itemData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      data.menuItems.push(newItem);
      localDb.saveData(data);
      return mockApiCall(newItem);
    } catch (error) {
      console.error('Error in createMenuItem:', error);
      return mockApiCall(null);
    }
  },

  updateMenuItem: (id, itemData) => {
    try {
      const data = localDb.getData() || localDb.getDefaultData();
      const itemIndex = data.menuItems.findIndex(item => item._id === id);
      if (itemIndex !== -1) {
        data.menuItems[itemIndex] = { 
          ...data.menuItems[itemIndex], 
          ...itemData,
          updatedAt: new Date().toISOString()
        };
        localDb.saveData(data);
        return mockApiCall(data.menuItems[itemIndex]);
      }
      return mockApiCall(null);
    } catch (error) {
      console.error('Error in updateMenuItem:', error);
      return mockApiCall(null);
    }
  },

  deleteMenuItem: (id) => {
    try {
      const data = localDb.getData() || localDb.getDefaultData();
      data.menuItems = data.menuItems.filter(item => item._id !== id);
      localDb.saveData(data);
      return mockApiCall({ success: true });
    } catch (error) {
      console.error('Error in deleteMenuItem:', error);
      return mockApiCall({ success: false });
    }
  },

  // Categories
  getCategories: () => {
    try {
      const data = localDb.getData() || localDb.getDefaultData();
      return mockApiCall(data.categories);
    } catch (error) {
      console.error('Error in getCategories:', error);
      return mockApiCall([]);
    }
  },

  createCategory: (categoryData) => {
    try {
      const data = localDb.getData() || localDb.getDefaultData();
      const newCategory = {
        _id: localDb.generateId(),
        ...categoryData
      };
      data.categories.push(newCategory);
      localDb.saveData(data);
      return mockApiCall(newCategory);
    } catch (error) {
      console.error('Error in createCategory:', error);
      return mockApiCall(null);
    }
  },

  updateCategory: (id, categoryData) => {
    try {
      const data = localDb.getData() || localDb.getDefaultData();
      const categoryIndex = data.categories.findIndex(cat => cat._id === id);
      if (categoryIndex !== -1) {
        data.categories[categoryIndex] = { ...data.categories[categoryIndex], ...categoryData };
        localDb.saveData(data);
        return mockApiCall(data.categories[categoryIndex]);
      }
      return mockApiCall(null);
    } catch (error) {
      console.error('Error in updateCategory:', error);
      return mockApiCall(null);
    }
  },

  deleteCategory: (id) => {
    try {
      const data = localDb.getData() || localDb.getDefaultData();
      data.categories = data.categories.filter(cat => cat._id !== id);
      localDb.saveData(data);
      return mockApiCall({ success: true });
    } catch (error) {
      console.error('Error in deleteCategory:', error);
      return mockApiCall({ success: false });
    }
  },

  // Tables
  getTables: (status = "All") => {
    try {
      const data = localDb.getData() || localDb.getDefaultData();
      let tables = data.tables;
      if (status !== "All") {
        tables = tables.filter(table => table.status === status.toLowerCase());
      }
      return mockApiCall(tables);
    } catch (error) {
      console.error('Error in getTables:', error);
      return mockApiCall([]);
    }
  },

  createTable: (tableData) => {
    try {
      const data = localDb.getData() || localDb.getDefaultData();
      const newTable = {
        _id: localDb.generateId(),
        ...tableData,
        status: 'available',
        currentOrder: null
      };
      data.tables.push(newTable);
      localDb.saveData(data);
      return mockApiCall(newTable);
    } catch (error) {
      console.error('Error in createTable:', error);
      return mockApiCall(null);
    }
  },

  updateTable: (id, tableData) => {
    try {
      const data = localDb.getData() || localDb.getDefaultData();
      const tableIndex = data.tables.findIndex(table => table._id === id);
      if (tableIndex !== -1) {
        data.tables[tableIndex] = { ...data.tables[tableIndex], ...tableData };
        localDb.saveData(data);
        return mockApiCall(data.tables[tableIndex]);
      }
      return mockApiCall(null);
    } catch (error) {
      console.error('Error in updateTable:', error);
      return mockApiCall(null);
    }
  },

  deleteTable: (id) => {
    try {
      const data = localDb.getData() || localDb.getDefaultData();
      data.tables = data.tables.filter(table => table._id !== id);
      localDb.saveData(data);
      return mockApiCall({ success: true });
    } catch (error) {
      console.error('Error in deleteTable:', error);
      return mockApiCall({ success: false });
    }
  },

  assignCustomerToTable: (tableId, customerData) => {
    try {
      const data = localDb.getData() || localDb.getDefaultData();
      const tableIndex = data.tables.findIndex(table => table._id === tableId);
      if (tableIndex !== -1) {
        data.tables[tableIndex] = {
          ...data.tables[tableIndex],
          status: 'occupied',
          customerName: customerData.customerName,
          customerPhone: customerData.customerPhone || '',
          occupiedAt: new Date().toISOString()
        };
        localDb.saveData(data);
        return mockApiCall(data.tables[tableIndex]);
      }
      return mockApiCall(null);
    } catch (error) {
      console.error('Error in assignCustomerToTable:', error);
      return mockApiCall(null);
    }
  },

  freeTable: (tableId) => {
    try {
      const data = localDb.getData() || localDb.getDefaultData();
      const tableIndex = data.tables.findIndex(table => table._id === tableId);
      if (tableIndex !== -1) {
        data.tables[tableIndex] = {
          ...data.tables[tableIndex],
          status: 'available',
          customerName: '',
          customerPhone: '',
          currentOrder: null,
          occupiedAt: null
        };
        localDb.saveData(data);
        return mockApiCall(data.tables[tableIndex]);
      }
      return mockApiCall(null);
    } catch (error) {
      console.error('Error in freeTable:', error);
      return mockApiCall(null);
    }
  },

  // Orders
  getOrders: (status = "All") => {
    try {
      const data = localDb.getData() || localDb.getDefaultData();
      let orders = data.orders;
      if (status !== "All") {
        orders = orders.filter(order => order.status === status.toLowerCase());
      }
      // Sort by creation date, newest first
      orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return mockApiCall(orders);
    } catch (error) {
      console.error('Error in getOrders:', error);
      return mockApiCall([]);
    }
  },

  createOrder: (orderData) => {
    try {
      const data = localDb.getData() || localDb.getDefaultData();
      
      const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const taxRate = (data.settings && data.settings.taxRate) || 5.25;
      const tax = subtotal * (taxRate / 100);
      const total = subtotal + tax;

      const newOrder = {
        _id: localDb.generateId(),
        orderNumber: generateOrderNumber(),
        ...orderData,
        subtotal,
        tax,
        total,
        status: "pending",
        paymentStatus: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      data.orders.push(newOrder);
      localDb.saveData(data);
      return mockApiCall(newOrder);
    } catch (error) {
      console.error('Error in createOrder:', error);
      return mockApiCall(null);
    }
  },

  processPayment: (orderId, paymentData) => {
    try {
      const data = localDb.getData() || localDb.getDefaultData();
      const orderIndex = data.orders.findIndex(order => order._id === orderId);
      if (orderIndex !== -1) {
        data.orders[orderIndex] = {
          ...data.orders[orderIndex],
          paymentMethod: paymentData.paymentMethod,
          paymentStatus: 'paid',
          amountPaid: parseFloat(paymentData.amountPaid),
          status: 'completed',
          paidAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        localDb.saveData(data);
        return mockApiCall(data.orders[orderIndex]);
      }
      return mockApiCall(null);
    } catch (error) {
      console.error('Error in processPayment:', error);
      return mockApiCall(null);
    }
  },

  updateOrderStatus: (orderId, status) => {
    try {
      const data = localDb.getData() || localDb.getDefaultData();
      const orderIndex = data.orders.findIndex(order => order._id === orderId);
      if (orderIndex !== -1) {
        data.orders[orderIndex].status = status;
        data.orders[orderIndex].updatedAt = new Date().toISOString();
        localDb.saveData(data);
        return mockApiCall(data.orders[orderIndex]);
      }
      return mockApiCall(null);
    } catch (error) {
      console.error('Error in updateOrderStatus:', error);
      return mockApiCall(null);
    }
  },

  updateOrder: (orderId, orderData) => {
    try {
      const data = localDb.getData() || localDb.getDefaultData();
      const orderIndex = data.orders.findIndex(order => order._id === orderId);
      if (orderIndex !== -1) {
        // Recalculate totals if items changed
        if (orderData.items) {
          const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          const taxRate = (data.settings && data.settings.taxRate) || 5.25;
          const tax = subtotal * (taxRate / 100);
          const total = subtotal + tax;
          
          orderData.subtotal = subtotal;
          orderData.tax = tax;
          orderData.total = total;
        }

        data.orders[orderIndex] = { 
          ...data.orders[orderIndex], 
          ...orderData,
          updatedAt: new Date().toISOString()
        };
        localDb.saveData(data);
        return mockApiCall(data.orders[orderIndex]);
      }
      return mockApiCall(null);
    } catch (error) {
      console.error('Error in updateOrder:', error);
      return mockApiCall(null);
    }
  },

  deleteOrder: (orderId) => {
    try {
      const data = localDb.getData() || localDb.getDefaultData();
      data.orders = data.orders.filter(order => order._id !== orderId);
      localDb.saveData(data);
      return mockApiCall({ success: true });
    } catch (error) {
      console.error('Error in deleteOrder:', error);
      return mockApiCall({ success: false });
    }
  },

  // Settings
  getSettings: () => {
    try {
      const data = localDb.getData() || localDb.getDefaultData();
      return mockApiCall(data.settings);
    } catch (error) {
      console.error('Error in getSettings:', error);
      return mockApiCall({
        restaurantName: 'Termiz Restaurant',
        taxRate: 5.25,
        currency: 'PKR',
        address: '123 Food Street, Karachi, Pakistan',
        phone: '+92 300 1234567',
        email: 'info@termizrestaurant.com'
      });
    }
  },

  updateSettings: (settings) => {
    try {
      const data = localDb.getData() || localDb.getDefaultData();
      data.settings = { ...data.settings, ...settings };
      localDb.saveData(data);
      return mockApiCall(data.settings);
    } catch (error) {
      console.error('Error in updateSettings:', error);
      return mockApiCall(null);
    }
  },

  // Search
  searchOrders: (query) => {
    try {
      const data = localDb.getData() || localDb.getDefaultData();
      const searchTerm = query.toLowerCase();
      const filteredOrders = data.orders.filter(order => 
        order.customerName?.toLowerCase().includes(searchTerm) ||
        order.orderNumber?.toLowerCase().includes(searchTerm) ||
        order.tableNumber?.toString().includes(searchTerm)
      );
      return mockApiCall(filteredOrders);
    } catch (error) {
      console.error('Error in searchOrders:', error);
      return mockApiCall([]);
    }
  },

  searchMenuItems: (query) => {
    try {
      const data = localDb.getData() || localDb.getDefaultData();
      const searchTerm = query.toLowerCase();
      const filteredItems = data.menuItems.filter(item => 
        item.title?.toLowerCase().includes(searchTerm) ||
        item.description?.toLowerCase().includes(searchTerm) ||
        (item.category && data.categories.find(cat => 
          cat._id === item.category && cat.name.toLowerCase().includes(searchTerm)
        ))
      );
      return mockApiCall(filteredItems);
    } catch (error) {
      console.error('Error in searchMenuItems:', error);
      return mockApiCall([]);
    }
  },

  // Additional utility methods
  getRecentOrders: (limit = 10) => {
    try {
      const data = localDb.getData() || localDb.getDefaultData();
      const recentOrders = data.orders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit);
      return mockApiCall(recentOrders);
    } catch (error) {
      console.error('Error in getRecentOrders:', error);
      return mockApiCall([]);
    }
  },

  getOrdersByDateRange: (startDate, endDate) => {
    try {
      const data = localDb.getData() || localDb.getDefaultData();
      const filteredOrders = data.orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
      });
      return mockApiCall(filteredOrders);
    } catch (error) {
      console.error('Error in getOrdersByDateRange:', error);
      return mockApiCall([]);
    }
  },

  // Export data (for backup)
  exportData: () => {
    try {
      const data = localDb.getData() || localDb.getDefaultData();
      return mockApiCall(data);
    } catch (error) {
      console.error('Error in exportData:', error);
      return mockApiCall(null);
    }
  },

  // Import data (for restore)
  importData: (importedData) => {
    try {
      localDb.saveData(importedData);
      return mockApiCall({ success: true });
    } catch (error) {
      console.error('Error in importData:', error);
      return mockApiCall({ success: false });
    }
  },

  // Reset to default data
  resetData: () => {
    try {
      const defaultData = localDb.getDefaultData();
      localDb.saveData(defaultData);
      return mockApiCall({ success: true });
    } catch (error) {
      console.error('Error in resetData:', error);
      return mockApiCall({ success: false });
    }
  }
};