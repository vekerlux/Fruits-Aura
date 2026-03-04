const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res, next) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paymentResult,
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            res.status(400);
            throw new Error('No order items');
            return;
        }

        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paymentResult,
            isPaid: Object.keys(paymentResult || {}).length > 0,
            paidAt: Object.keys(paymentResult || {}).length > 0 ? Date.now() : null,
        });

        const createdOrder = await order.save();

        res.status(201).json(createdOrder);
    } catch (error) {
        next(error);
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ _id: -1 });
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name').sort({ _id: -1 });
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private/Admin
const getOrderStats = async (req, res, next) => {
    try {
        const stats = await Order.aggregate([
            {
                $facet: {
                    totals: [
                        { $match: { isPaid: true } },
                        {
                            $group: {
                                _id: null,
                                totalRevenue: { $sum: '$totalPrice' },
                                totalOrders: { $sum: 1 },
                                avgOrderValue: { $avg: '$totalPrice' }
                            }
                        }
                    ],
                    dailyRevenue: [
                        { $match: { isPaid: true } },
                        {
                            $group: {
                                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                                revenue: { $sum: '$totalPrice' },
                                orders: { $sum: 1 }
                            }
                        },
                        { $sort: { _id: 1 } },
                        { $limit: 7 }
                    ],
                    popularItems: [
                        { $unwind: '$orderItems' },
                        {
                            $group: {
                                _id: '$orderItems.name',
                                count: { $sum: '$orderItems.qty' },
                                revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.qty'] } }
                            }
                        },
                        { $sort: { count: -1 } },
                        { $limit: 5 }
                    ]
                }
            }
        ]);

        const result = stats[0];
        res.json({
            totals: result.totals[0] || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 },
            dailyRevenue: result.dailyRevenue,
            popularItems: result.popularItems
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { addOrderItems, getMyOrders, getOrders, getOrderStats };
