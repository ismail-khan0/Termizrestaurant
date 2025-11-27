// backend/models/Table.js
const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
    unique: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'reserved', 'cleaning'],
    default: 'available'
  },
  location: {
    type: String,
    enum: ['main-hall', 'terrace', 'private-room', 'bar'],
    default: 'main-hall'
  },
  currentOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  customerName: {
    type: String,
    default: ''
  },
  customerInitials: {
    type: String,
    default: ''
  },
  reservationTime: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Table', tableSchema);