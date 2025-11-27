// backend/routes/menu.js
const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Menu items routes
router.get('/items', menuController.getMenuItems);
router.get('/items/:id', menuController.getMenuItem);
router.post('/items', menuController.createMenuItem);
router.put('/items/:id', menuController.updateMenuItem);
router.delete('/items/:id', menuController.deleteMenuItem);

// Categories routes
router.get('/categories', menuController.getCategories);
router.post('/categories', menuController.createCategory);

module.exports = router;