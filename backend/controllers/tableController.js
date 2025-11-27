// backend/controllers/tableController.js
const Table = require('../models/Table');
const Order = require('../models/Order');

// Get all tables
exports.getTables = async (req, res) => {
  try {
    const tables = await Table.find().sort({ number: 1 });
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update table status
exports.updateTableStatus = async (req, res) => {
  try {
    const { status, customerName } = req.body;
    
    const updateData = { status };
    if (customerName) {
      updateData.customerName = customerName;
      updateData.customerInitials = customerName.split(' ').map(n => n[0]).join('').toUpperCase();
    } else {
      updateData.customerName = '';
      updateData.customerInitials = '';
      updateData.currentOrder = null;
    }
    
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.json(table);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create new table
exports.createTable = async (req, res) => {
  try {
    const table = new Table(req.body);
    await table.save();
    res.status(201).json(table);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get table by number
exports.getTableByNumber = async (req, res) => {
  try {
    const table = await Table.findOne({ number: req.params.number });
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.json(table);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};