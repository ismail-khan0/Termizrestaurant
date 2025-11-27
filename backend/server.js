const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.static('public'));

// Data persistence
const DATA_FILE = path.join(__dirname, 'restaurant-data.json');

const loadData = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
  
  // Default data with Pakistani settings
  return {
    tables: [
      { _id: '1', number: 1, capacity: 4, status: 'available', location: 'main-hall', currentOrder: null },
      { _id: '2', number: 2, capacity: 6, status: 'available', location: 'main-hall', currentOrder: null },
      { _id: '3', number: 3, capacity: 2, status: 'available', location: 'terrace', currentOrder: null },
      { _id: '4', number: 4, capacity: 4, status: 'available', location: 'main-hall', currentOrder: null },
      { _id: '5', number: 5, capacity: 3, status: 'available', location: 'terrace', currentOrder: null },
      { _id: '6', number: 6, capacity: 4, status: 'available', location: 'main-hall', currentOrder: null },
      { _id: '7', number: 7, capacity: 8, status: 'available', location: 'private-room', currentOrder: null },
      { _id: '8', number: 8, capacity: 4, status: 'available', location: 'terrace', currentOrder: null }
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
        ingredients: ['Basmati Rice', 'Chicken', 'Spices', 'Yogurt', 'Onions'],
        spicyLevel: 'medium',
        image: '/images/chicken-biryani.jpg'
      },
      { 
        _id: '2', 
        title: 'Seekh Kebab', 
        price: 320, 
        category: '1',
        description: 'Minced meat kebabs with traditional spices',
        preparationTime: 20,
        isAvailable: true,
        ingredients: ['Minced Meat', 'Spices', 'Herbs', 'Onions'],
        spicyLevel: 'medium',
        image: '/images/seekh-kebab.jpg'
      },
      { 
        _id: '3', 
        title: 'Chicken Karahi', 
        price: 650, 
        category: '2',
        description: 'Traditional Pakistani wok-cooked chicken curry',
        preparationTime: 30,
        isAvailable: true,
        ingredients: ['Chicken', 'Tomatoes', 'Ginger', 'Garlic', 'Green Chilies', 'Spices'],
        spicyLevel: 'medium',
        image: '/images/chicken-karahi.jpg'
      },
      { 
        _id: '4', 
        title: 'Pepsi', 
        price: 80, 
        category: '3',
        description: 'Cold refreshing beverage',
        preparationTime: 2,
        isAvailable: true,
        ingredients: ['Carbonated Water', 'Sugar', 'Caramel Color'],
        spicyLevel: 'mild',
        image: '/images/pepsi.jpg'
      },
      { 
        _id: '5', 
        title: 'Gulab Jamun', 
        price: 120, 
        category: '4',
        description: 'Sweet milk-solid balls in sugar syrup',
        preparationTime: 10,
        isAvailable: true,
        ingredients: ['Milk Solids', 'Flour', 'Sugar Syrup', 'Rose Water'],
        spicyLevel: 'mild',
        image: '/images/gulab-jamun.jpg'
      }
    ],
    categories: [
      { _id: '1', name: 'Starters', color: 'bg-red-500', description: 'Appetizers and small bites' },
      { _id: '2', name: 'Main Course', color: 'bg-purple-500', description: 'Main dishes and entrees' },
      { _id: '3', name: 'Beverages', color: 'bg-blue-500', description: 'Drinks and refreshments' },
      { _id: '4', name: 'Desserts', color: 'bg-pink-500', description: 'Sweet treats and desserts' }
    ],
    orders: [],
    settings: {
      restaurantName: 'Termiz Restaurant',
      taxRate: 5.25,
      currency: 'PKR',
      address: '123 Food Street, Karachi, Pakistan',
      phone: '+92 300 1234567',
      gstin: 'PK-123456789',
      email: 'info@termizrestaurant.com',
      website: 'www.termizrestaurant.com'
    },
    orderCounter: 1
  };
};

const saveData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

let restaurantData = loadData();

// Generate order number
const generateOrderNumber = () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const number = restaurantData.orderCounter.toString().padStart(3, '0');
  restaurantData.orderCounter++;
  saveData(restaurantData);
  return `ORD${dateStr}${number}`;
};

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: '✅ Termiz Restaurant POS Backend - READY FOR SERVICE!',
    status: 'success',
    timestamp: new Date().toISOString(),
    location: 'Karachi, Pakistan'
  });
});

// ========== SETTINGS ==========
app.get('/api/settings', (req, res) => {
  res.json(restaurantData.settings);
});

app.put('/api/settings', (req, res) => {
  restaurantData.settings = { ...restaurantData.settings, ...req.body };
  saveData(restaurantData);
  res.json({ success: true, settings: restaurantData.settings });
});

// ========== TABLE MANAGEMENT ==========
app.get('/api/tables', (req, res) => {
  const { status } = req.query;
  let filteredTables = restaurantData.tables;
  
  if (status && status !== 'All') {
    filteredTables = restaurantData.tables.filter(table => 
      table.status === status.toLowerCase()
    );
  }
  
  res.json(filteredTables);
});

app.post('/api/tables', (req, res) => {
  const { number, capacity, location } = req.body;
  
  if (!number || !capacity) {
    return res.status(400).json({ error: 'Table number and capacity are required' });
  }
  
  const existingTable = restaurantData.tables.find(t => t.number == number);
  if (existingTable) {
    return res.status(400).json({ error: 'Table number already exists' });
  }
  
  const newTable = {
    _id: Date.now().toString(),
    number: parseInt(number),
    capacity: parseInt(capacity),
    location: location || 'main-hall',
    status: 'available',
    currentOrder: null
  };
  
  restaurantData.tables.push(newTable);
  saveData(restaurantData);
  res.status(201).json(newTable);
});

app.put('/api/tables/:id', (req, res) => {
  const tableIndex = restaurantData.tables.findIndex(t => t._id === req.params.id);
  
  if (tableIndex === -1) {
    return res.status(404).json({ error: 'Table not found' });
  }
  
  restaurantData.tables[tableIndex] = {
    ...restaurantData.tables[tableIndex],
    ...req.body,
    number: parseInt(req.body.number) || restaurantData.tables[tableIndex].number,
    capacity: parseInt(req.body.capacity) || restaurantData.tables[tableIndex].capacity
  };
  
  saveData(restaurantData);
  res.json(restaurantData.tables[tableIndex]);
});

app.delete('/api/tables/:id', (req, res) => {
  const tableIndex = restaurantData.tables.findIndex(t => t._id === req.params.id);
  
  if (tableIndex === -1) {
    return res.status(404).json({ error: 'Table not found' });
  }
  
  const deletedTable = restaurantData.tables.splice(tableIndex, 1)[0];
  saveData(restaurantData);
  res.json({ success: true, message: `Table ${deletedTable.number} deleted` });
});

app.post('/api/tables/:id/assign', (req, res) => {
  const { customerName, customerPhone, persons } = req.body;
  const tableIndex = restaurantData.tables.findIndex(t => t._id === req.params.id);
  
  if (tableIndex === -1) {
    return res.status(404).json({ error: 'Table not found' });
  }
  
  if (restaurantData.tables[tableIndex].status !== 'available') {
    return res.status(400).json({ error: 'Table is not available' });
  }
  
  restaurantData.tables[tableIndex] = {
    ...restaurantData.tables[tableIndex],
    status: 'occupied',
    customerName,
    customerPhone: customerPhone || '',
    persons: parseInt(persons) || restaurantData.tables[tableIndex].capacity,
    customerInitials: customerName ? customerName.split(' ').map(n => n[0]).join('').toUpperCase() : '',
    occupiedAt: new Date().toISOString()
  };
  
  saveData(restaurantData);
  res.json({
    success: true,
    message: `Customer ${customerName} assigned to table`,
    table: restaurantData.tables[tableIndex]
  });
});

app.post('/api/tables/:id/free', (req, res) => {
  const tableIndex = restaurantData.tables.findIndex(t => t._id === req.params.id);
  
  if (tableIndex === -1) {
    return res.status(404).json({ error: 'Table not found' });
  }
  
  restaurantData.tables[tableIndex] = {
    ...restaurantData.tables[tableIndex],
    status: 'available',
    customerName: '',
    customerPhone: '',
    customerInitials: '',
    currentOrder: null,
    occupiedAt: null,
    persons: restaurantData.tables[tableIndex].capacity
  };
  
  saveData(restaurantData);
  res.json({
    success: true,
    message: `Table ${restaurantData.tables[tableIndex].number} is now available`,
    table: restaurantData.tables[tableIndex]
  });
});

// ========== MENU MANAGEMENT ==========
app.get('/api/menu/items', (req, res) => {
  const itemsWithCategory = restaurantData.menuItems.map(item => {
    const category = restaurantData.categories.find(cat => cat._id === item.category);
    return {
      ...item,
      category: category || { name: 'Uncategorized', color: 'bg-gray-500' }
    };
  });
  res.json(itemsWithCategory);
});

app.get('/api/menu/categories', (req, res) => {
  res.json(restaurantData.categories);
});

// Enhanced menu item creation with size prices
app.post('/api/menu/items', (req, res) => {
  const {
    title,
    price,
    category,
    description,
    preparationTime,
    ingredients,
    spicyLevel,
    isAvailable,
    supportsSizes,
    sizePrices
  } = req.body;

  const newItem = {
    _id: Date.now().toString(),
    title,
    price: parseFloat(price),
    category,
    description: description || '',
    preparationTime: parseInt(preparationTime) || 15,
    ingredients: ingredients || [],
    spicyLevel: spicyLevel || 'mild',
    isAvailable: isAvailable !== false,
    supportsSizes: supportsSizes || false,
    sizePrices: supportsSizes ? sizePrices : undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  restaurantData.menuItems.push(newItem);
  saveData(restaurantData);
  res.status(201).json(newItem);
});

// Enhanced menu item update
app.put('/api/menu/items/:id', (req, res) => {
  const itemIndex = restaurantData.menuItems.findIndex(item => item._id === req.params.id);
  
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Menu item not found' });
  }
  
  restaurantData.menuItems[itemIndex] = {
    ...restaurantData.menuItems[itemIndex],
    ...req.body,
    price: parseFloat(req.body.price) || restaurantData.menuItems[itemIndex].price,
    preparationTime: parseInt(req.body.preparationTime) || restaurantData.menuItems[itemIndex].preparationTime,
    updatedAt: new Date().toISOString()
  };
  
  saveData(restaurantData);
  res.json(restaurantData.menuItems[itemIndex]);
});
app.put('/api/menu/items/:id', (req, res) => {
  const itemIndex = restaurantData.menuItems.findIndex(item => item._id === req.params.id);
  
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Menu item not found' });
  }
  
  restaurantData.menuItems[itemIndex] = {
    ...restaurantData.menuItems[itemIndex],
    ...req.body,
    price: parseFloat(req.body.price) || restaurantData.menuItems[itemIndex].price,
    preparationTime: parseInt(req.body.preparationTime) || restaurantData.menuItems[itemIndex].preparationTime,
    updatedAt: new Date().toISOString()
  };
  
  saveData(restaurantData);
  res.json(restaurantData.menuItems[itemIndex]);
});

app.delete('/api/menu/items/:id', (req, res) => {
  const itemIndex = restaurantData.menuItems.findIndex(item => item._id === req.params.id);
  
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Menu item not found' });
  }
  
  const deletedItem = restaurantData.menuItems.splice(itemIndex, 1)[0];
  saveData(restaurantData);
  res.json({
    success: true,
    message: `Menu item "${deletedItem.title}" deleted successfully`
  });
});

// Categories CRUD
app.post('/api/menu/categories', (req, res) => {
  const newCategory = {
    _id: Date.now().toString(),
    ...req.body
  };
  
  restaurantData.categories.push(newCategory);
  saveData(restaurantData);
  res.status(201).json(newCategory);
});

app.put('/api/menu/categories/:id', (req, res) => {
  const categoryIndex = restaurantData.categories.findIndex(cat => cat._id === req.params.id);
  
  if (categoryIndex === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }
  
  restaurantData.categories[categoryIndex] = {
    ...restaurantData.categories[categoryIndex],
    ...req.body
  };
  
  saveData(restaurantData);
  res.json(restaurantData.categories[categoryIndex]);
});

app.delete('/api/menu/categories/:id', (req, res) => {
  const categoryIndex = restaurantData.categories.findIndex(cat => cat._id === req.params.id);
  
  if (categoryIndex === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }
  
  // Check if category is used by any menu items
  const itemsInCategory = restaurantData.menuItems.filter(item => item.category === req.params.id);
  if (itemsInCategory.length > 0) {
    return res.status(400).json({ 
      error: 'Cannot delete category. There are menu items in this category.' 
    });
  }
  
  const deletedCategory = restaurantData.categories.splice(categoryIndex, 1)[0];
  saveData(restaurantData);
  res.json({
    success: true,
    message: `Category "${deletedCategory.name}" deleted successfully`
  });
});

// ========== ORDER MANAGEMENT ==========
app.get('/api/orders', (req, res) => {
  const { status, tableNumber } = req.query;
  
  let filteredOrders = restaurantData.orders;
  
  if (status && status !== 'All') {
    filteredOrders = filteredOrders.filter(order => order.status === status.toLowerCase());
  }
  
  if (tableNumber) {
    filteredOrders = filteredOrders.filter(order => order.tableNumber == tableNumber);
  }
  
  filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(filteredOrders);
});

// FIXED: POST /api/orders endpoint
// Enhanced order creation with delivery support
app.post('/api/orders', (req, res) => {
  const { 
    tableNumber, 
    customerName, 
    items, 
    type, 
    notes, 
    waiterName,
    deliveryAddress,
    deliveryCharges = 0,
    discount = 0
  } = req.body;
  
  if (!customerName || !items || items.length === 0) {
    return res.status(400).json({ error: 'Customer name and items are required' });
  }
  
  if (type === 'dine-in' && !tableNumber) {
    return res.status(400).json({ error: 'Table number is required for dine-in orders' });
  }
  
  if (type === 'delivery' && !deliveryAddress) {
    return res.status(400).json({ error: 'Delivery address is required for delivery orders' });
  }
  
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = discount;
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const tax = discountedSubtotal * (restaurantData.settings.taxRate / 100);
  const total = discountedSubtotal + tax + (type === 'delivery' ? parseFloat(deliveryCharges) : 0);
  
  const newOrder = {
    _id: Date.now().toString(),
    orderNumber: generateOrderNumber(),
    tableNumber: tableNumber ? parseInt(tableNumber) : null,
    customerName,
    type: type || 'dine-in',
    waiterName: waiterName || null,
    deliveryAddress: deliveryAddress || null,
    deliveryCharges: parseFloat(deliveryCharges) || 0,
    items: items.map(item => ({
      ...item,
      total: item.price * item.quantity
    })),
    subtotal,
    discount: discountAmount,
    tax,
    total,
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "pending",
    notes: notes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  restaurantData.orders.push(newOrder);
  
  // Update table status for dine-in orders
  if (type === 'dine-in' && tableNumber) {
    const tableIndex = restaurantData.tables.findIndex(t => t.number === parseInt(tableNumber));
    if (tableIndex !== -1) {
      restaurantData.tables[tableIndex].currentOrder = newOrder._id;
      restaurantData.tables[tableIndex].status = 'occupied';
      restaurantData.tables[tableIndex].customerName = customerName;
    }
  }
  
  saveData(restaurantData);
  res.status(201).json(newOrder);
});

// Search endpoints
app.get('/api/orders/search', (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Search query is required' });
  }
  
  const searchTerm = q.toLowerCase();
  const filteredOrders = restaurantData.orders.filter(order => 
    order.customerName?.toLowerCase().includes(searchTerm) ||
    order.orderNumber?.toLowerCase().includes(searchTerm) ||
    order.tableNumber?.toString().includes(searchTerm) ||
    order.items?.some(item => 
      item.title?.toLowerCase().includes(searchTerm)
    )
  );
  
  res.json(filteredOrders);
});

app.get('/api/menu/items/search', (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Search query is required' });
  }
  
  const searchTerm = q.toLowerCase();
  const filteredItems = restaurantData.menuItems.filter(item => 
    item.title?.toLowerCase().includes(searchTerm) ||
    item.description?.toLowerCase().includes(searchTerm) ||
    item.category?.toLowerCase().includes(searchTerm)
  );
  
  res.json(filteredItems);
});
app.patch('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const orderIndex = restaurantData.orders.findIndex(o => o._id === req.params.id);
  
  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  restaurantData.orders[orderIndex].status = status;
  restaurantData.orders[orderIndex].updatedAt = new Date().toISOString();
  
  saveData(restaurantData);
  res.json(restaurantData.orders[orderIndex]);
});

app.delete('/api/orders/:id', (req, res) => {
  const orderIndex = restaurantData.orders.findIndex(o => o._id === req.params.id);
  
  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  const deletedOrder = restaurantData.orders.splice(orderIndex, 1)[0];
  
  // Free the table if it was occupied by this order
  const tableIndex = restaurantData.tables.findIndex(t => t.currentOrder === deletedOrder._id);
  if (tableIndex !== -1) {
    restaurantData.tables[tableIndex].status = 'available';
    restaurantData.tables[tableIndex].currentOrder = null;
  }
  
  saveData(restaurantData);
  res.json({
    success: true,
    message: `Order #${deletedOrder.orderNumber} deleted successfully`
  });
});

// Payment processing endpoint
app.post('/api/orders/:id/payment', (req, res) => {
  const { paymentMethod, amountPaid } = req.body;
  const orderIndex = restaurantData.orders.findIndex(o => o._id === req.params.id);
  
  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  restaurantData.orders[orderIndex].paymentMethod = paymentMethod;
  restaurantData.orders[orderIndex].paymentStatus = 'paid';
  restaurantData.orders[orderIndex].amountPaid = parseFloat(amountPaid);
  restaurantData.orders[orderIndex].paidAt = new Date().toISOString();
  restaurantData.orders[orderIndex].status = 'completed';
  restaurantData.orders[orderIndex].updatedAt = new Date().toISOString();
  
  // Free the table if dine-in
  if (restaurantData.orders[orderIndex].type === 'dine-in') {
    const tableIndex = restaurantData.tables.findIndex(t => t.number === restaurantData.orders[orderIndex].tableNumber);
    if (tableIndex !== -1) {
      restaurantData.tables[tableIndex].status = 'available';
      restaurantData.tables[tableIndex].customerName = '';
      restaurantData.tables[tableIndex].customerInitials = '';
      restaurantData.tables[tableIndex].currentOrder = null;
    }
  }
  
  saveData(restaurantData);
  res.json({
    success: true,
    message: 'Payment processed successfully',
    order: restaurantData.orders[orderIndex]
  });
});

// ========== DASHBOARD & REPORTS ==========
app.get('/api/dashboard/stats', (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Filter today's orders properly
    const todayOrders = restaurantData.orders.filter(order => {
      if (!order.createdAt) return false;
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      return orderDate === today;
    });

    // Calculate today's revenue from ALL today's orders (not just completed)
    const todayRevenue = todayOrders.reduce((sum, order) => {
      return sum + (order.total || 0);
    }, 0);

    // Calculate monthly revenue (current month)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyOrders = restaurantData.orders.filter(order => {
      if (!order.createdAt) return false;
      const orderDate = new Date(order.createdAt);
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    });
    const monthlyRevenue = monthlyOrders.reduce((sum, order) => {
      return sum + (order.total || 0);
    }, 0);

    // Calculate yearly revenue
    const yearlyOrders = restaurantData.orders.filter(order => {
      if (!order.createdAt) return false;
      return new Date(order.createdAt).getFullYear() === currentYear;
    });
    const yearlyRevenue = yearlyOrders.reduce((sum, order) => {
      return sum + (order.total || 0);
    }, 0);

    // Order counts by status
    const allOrders = restaurantData.orders;
    const orderCounts = {
      pending: allOrders.filter(o => o.status === 'pending').length,
      preparing: allOrders.filter(o => o.status === 'preparing').length,
      ready: allOrders.filter(o => o.status === 'ready').length,
      completed: allOrders.filter(o => o.status === 'completed').length,
      today: todayOrders.length,
      total: allOrders.length
    };

    // Calculate popular dishes
    const dishCount = {};
    allOrders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          if (item.title) {
            if (!dishCount[item.title]) {
              dishCount[item.title] = { orders: 0, revenue: 0 };
            }
            dishCount[item.title].orders += item.quantity || 1;
            dishCount[item.title].revenue += item.total || (item.price * (item.quantity || 1));
          }
        });
      }
    });

    const popularDishes = Object.entries(dishCount)
      .map(([name, data]) => ({ 
        name, 
        orders: data.orders,
        revenue: data.revenue
      }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5);

    const stats = {
      revenue: {
        today: todayRevenue,
        monthly: monthlyRevenue,
        yearly: yearlyRevenue
      },
      orders: orderCounts,
      tables: {
        total: restaurantData.tables.length,
        available: restaurantData.tables.filter(t => t.status === 'available').length,
        occupied: restaurantData.tables.filter(t => t.status === 'occupied').length
      },
      popularDishes: popularDishes.length > 0 ? popularDishes : []
    };

    res.json(stats);
  } catch (error) {
    console.error('Error calculating dashboard stats:', error);
    res.status(500).json({ 
      error: 'Failed to calculate dashboard stats',
      details: error.message 
    });
  }
});

// Data reset endpoint
app.post('/api/admin/reset-all-data', (req, res) => {
  try {
    console.log('Resetting all restaurant data...');
    
    // Reset to default data structure with Pakistani settings
    const defaultData = {
      tables: [
        { _id: '1', number: 1, capacity: 4, status: 'available', location: 'main-hall', currentOrder: null },
        { _id: '2', number: 2, capacity: 6, status: 'available', location: 'main-hall', currentOrder: null },
        { _id: '3', number: 3, capacity: 2, status: 'available', location: 'terrace', currentOrder: null },
        { _id: '4', number: 4, capacity: 4, status: 'available', location: 'main-hall', currentOrder: null },
        { _id: '5', number: 5, capacity: 3, status: 'available', location: 'terrace', currentOrder: null },
        { _id: '6', number: 6, capacity: 4, status: 'available', location: 'main-hall', currentOrder: null },
        { _id: '7', number: 7, capacity: 8, status: 'available', location: 'private-room', currentOrder: null },
        { _id: '8', number: 8, capacity: 4, status: 'available', location: 'terrace', currentOrder: null }
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
          ingredients: ['Basmati Rice', 'Chicken', 'Spices', 'Yogurt', 'Onions'],
          spicyLevel: 'medium',
          image: '/images/chicken-biryani.jpg'
        },
        { 
          _id: '2', 
          title: 'Seekh Kebab', 
          price: 320, 
          category: '1',
          description: 'Minced meat kebabs with traditional spices',
          preparationTime: 20,
          isAvailable: true,
          ingredients: ['Minced Meat', 'Spices', 'Herbs', 'Onions'],
          spicyLevel: 'medium',
          image: '/images/seekh-kebab.jpg'
        }
      ],
      categories: [
        { _id: '1', name: 'Starters', color: 'bg-red-500', description: 'Appetizers and small bites' },
        { _id: '2', name: 'Main Course', color: 'bg-purple-500', description: 'Main dishes and entrees' },
        { _id: '3', name: 'Beverages', color: 'bg-blue-500', description: 'Drinks and refreshments' },
        { _id: '4', name: 'Desserts', color: 'bg-pink-500', description: 'Sweet treats and desserts' }
      ],
      orders: [],
      settings: {
        restaurantName: 'Termiz Restaurant',
        taxRate: 5.25,
        currency: 'PKR',
        address: '123 Food Street, Karachi, Pakistan',
        phone: '+92 300 1234567',
        gstin: 'PK-123456789',
        email: 'info@termizrestaurant.com',
        website: 'www.termizrestaurant.com'
      },
      orderCounter: 1
    };

    // Replace current data with default data
    restaurantData = defaultData;
    saveData(restaurantData);

    console.log('✅ All data reset successfully');
    
    res.json({ 
      success: true, 
      message: 'All restaurant data reset successfully',
      resetAt: new Date().toISOString(),
      data: {
        tables: restaurantData.tables.length,
        menuItems: restaurantData.menuItems.length,
        orders: restaurantData.orders.length,
        categories: restaurantData.categories.length
      }
    });

  } catch (error) {
    console.error('Reset error:', error);
    res.status(500).json({ 
      error: 'Failed to reset data',
      details: error.message 
    });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log('🍽️  ==========================================');
  console.log('✅ Termiz Restaurant POS SYSTEM - READY!');
  console.log('📍 Backend Server: http://localhost:' + PORT);
  console.log('🏠 Location: Karachi, Pakistan');
  console.log('👥 Tables Ready: ' + restaurantData.tables.length);
  console.log('🍕 Menu Items: ' + restaurantData.menuItems.length);
  console.log('💳 Payment System: ACTIVE');
  console.log('🖨️  Printing System: READY');
  console.log('💾 Data Persistence: ENABLED');
  console.log('🍽️  ==========================================');
});