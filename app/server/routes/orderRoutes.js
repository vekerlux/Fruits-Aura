const express = require('express');
const { addOrderItems, getMyOrders, getOrders, getOrderStats } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/stats').get(protect, admin, getOrderStats);
router.route('/myorders').get(protect, getMyOrders);

module.exports = router;
