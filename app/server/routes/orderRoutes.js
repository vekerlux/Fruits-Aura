const express = require('express');
const { addOrderItems, getMyOrders, getOrders, getOrderStats, paystackWebhook, updateOrderStatus, exportOrdersCSV, updateOrderToPaid } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/webhook').post(paystackWebhook); // Public for Paystack
router.route('/stats').get(protect, admin, getOrderStats);
router.route('/export').get(protect, admin, exportOrdersCSV);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id/status').put(protect, admin, updateOrderStatus);
router.route('/:id/pay').put(protect, admin, updateOrderToPaid);

module.exports = router;
