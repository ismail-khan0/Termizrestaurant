// backend/routes/tables.js
const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');

router.get('/', tableController.getTables);
router.get('/:number', tableController.getTableByNumber);
router.post('/', tableController.createTable);
router.patch('/:id/status', tableController.updateTableStatus);

module.exports = router;