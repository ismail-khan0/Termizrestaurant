// backend/routes/orders.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/', orderController.getOrders);
router.get('/today', orderController.getTodaysOrders);
router.get('/:id', orderController.getOrder);
router.post('/', orderController.createOrder);
router.patch('/:id/status', orderController.updateOrderstatus);
router.patch('/:id/payment', orderController.updateOrderPayment);

module.exports = router;