// backend/controllers/dashboardController.js
const Order = require('../models/Order');
const Table = require('../models/Table');
const MenuItem = require('../models/MenuItem');

exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Today's orders
    const todaysOrders = await Order.find({
      createdAt: { $gte: today, $lt: tomorrow }
    });
    
    // Table status
    const tables = await Table.find();
    
    // Popular dishes (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const popularDishes = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.menuItem',
          totalOrders: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalOrders: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'menuitems',
          localField: '_id',
          foreignField: '_id',
          as: 'menuItem'
        }
      },
      { $unwind: '$menuItem' },
      {
        $project: {
          name: '$menuItem.title',
          orders: '$totalOrders',
          revenue: '$totalRevenue'
        }
      }
    ]);
    
    const stats = {
      revenue: {
        today: todaysOrders.reduce((sum, order) => sum + order.total, 0),
        weekly: 0 // You can implement weekly calculation
      },
      orders: {
        today: todaysOrders.length,
        pending: todaysOrders.filter(o => ['pending', 'confirmed'].includes(o.status)).length,
        completed: todaysOrders.filter(o => o.status === 'completed').length
      },
      tables: {
        total: tables.length,
        available: tables.filter(t => t.status === 'available').length,
        occupied: tables.filter(t => t.status === 'occupied').length,
        reserved: tables.filter(t => t.status === 'reserved').length
      },
      popularDishes
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};