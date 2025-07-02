const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// All routes below are already protected by verifyToken middleware
router.get('/', cartController.getCart);
router.post('/', cartController.saveCart);
router.delete('/', cartController.clearCart);

module.exports = router;
