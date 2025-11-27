// backend/controllers/orderController.js
const Order = require('../models/Order');
const Table = require('../models/Table');

// Get all orders with filtering
exports.getOrders = async (req, res) => {
  try {
    const { status, date, type } = req.query;
    
    let filter = {};
    if (status && status !== 'all') filter.status = status;
    if (type && type !== 'all') filter.type = type;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.createdAt = { $gte: startDate, $lt: endDate };
    }
    
    const orders = await Order.find(filter)
      .populate('items.menuItem', 'title price')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.menuItem', 'title price category')
      .populate('servedBy', 'name');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    
    // Update table status if it's a dine-in order
    if (order.type === 'dine-in') {
      await Table.findOneAndUpdate(
        { number: order.tableNumber },
        { 
          status: 'occupied',
          customerName: order.customerName,
          customerInitials: order.customerName.split(' ').map(n => n[0]).join('').toUpperCase(),
          currentOrder: order._id
        }
      );
    }
    
    await order.save();
    await order.populate('items.menuItem', 'title price');
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update order status
exports.updateOrderstatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('items.menuItem', 'title price');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // If order is completed and it's a dine-in order, free the table
    if (status === 'completed' && order.type === 'dine-in') {
      await Table.findOneAndUpdate(
        { number: order.tableNumber },
        { 
          status: 'available',
          customerName: '',
          customerInitials: '',
          currentOrder: null
        }
      );
    }
    
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update order payment
exports.updateOrderPayment = async (req, res) => {
  try {
    const { paymentMethod, paymentStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentMethod, paymentStatus },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get today's orders summary
exports.getTodaysOrders = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const orders = await Order.find({
      createdAt: { $gte: today, $lt: tomorrow }
    });
    
    const summary = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
      pending: orders.filter(o => o.status === 'pending').length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      ready: orders.filter(o => o.status === 'ready').length,
      completed: orders.filter(o => o.status === 'completed').length
    };
    
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};