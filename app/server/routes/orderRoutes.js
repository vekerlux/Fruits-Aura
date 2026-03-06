const express = require('express');
const { addOrderItems, getMyOrders, getOrders, getOrderStats, paystackWebhook, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/webhook').post(paystackWebhook); // Public for Paystack
router.route('/stats').get(protect, admin, getOrderStats);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

module.exports = router;
