const crypto = require('crypto');
const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res, next) => {
    try {
        console.log(`[ORDER_DEBUG] Creating order for user: ${req.user._id}`);
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
            console.log(`[ORDER_DEBUG] Failed: No order items`);
            res.status(400);
            throw new Error('No order items');
        }

        console.log(`[ORDER_DEBUG] Items count: ${orderItems.length}, Total: ${totalPrice}`);

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
            isPaid: true, // If we're here, Paystack succeeded
            paidAt: Date.now(),
        });

        const createdOrder = await order.save();
        console.log(`[ORDER_DEBUG] Success: Order created with ID ${createdOrder._id}`);

        res.status(201).json(createdOrder);
    } catch (error) {
        console.error(`[ORDER_DEBUG] ERROR during order creation:`, error);
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
        console.error(`[ORDER_DEBUG] ERROR during order stats retrieval:`, error);
        next(error);
    }
};

// @desc    Handle Paystack Webhook
// @route   POST /api/orders/webhook
// @access  Public
const paystackWebhook = async (req, res, next) => {
    try {
        const secret = process.env.PAYSTACK_SECRET_KEY;

        if (!secret) {
            console.error('[WEBHOOK_ERROR] PAYSTACK_SECRET_KEY is missing');
            return res.status(500).send('Configuration Error');
        }

        const hash = crypto.createHmac('sha256', secret).update(JSON.stringify(req.body)).digest('hex');
        if (hash !== req.headers['x-paystack-signature']) {
            console.error('[WEBHOOK_ERROR] Invalid signature');
            return res.status(401).send('Invalid signature');
        }

        const event = req.body;
        console.log(`[WEBHOOK_DEBUG] Received event: ${event.event}`);

        if (event.event === 'charge.success') {
            const { reference, amount, customer, paid_at } = event.data;

            // 1. Try to find existing order by reference
            let order = await Order.findOne({
                $or: [
                    { 'paymentResult.reference': reference },
                    { 'paymentResult.id': reference }
                ]
            });

            if (order) {
                console.log(`[WEBHOOK_DEBUG] Order found: ${order._id}. Updating to PAID.`);
                order.isPaid = true;
                order.paidAt = paid_at || Date.now();
                await order.save();
            } else {
                console.log(`[WEBHOOK_DEBUG] No order found with reference ${reference}. Creating recovery record.`);

                const user = await User.findOne({ email: customer.email });

                // Minimal order for recovery
                const recoveryOrder = new Order({
                    user: user ? user._id : '000000000000000000000000', // Use a zeroed ID if no user found
                    orderItems: [{
                        name: 'Paystack Order (Recovered)',
                        qty: 1,
                        image: 'https://res.cloudinary.com/dlbv776ga/image/upload/v1705300000/placeholder.jpg',
                        price: amount / 100,
                        product: '65a54446c596328905307999' // Use an existing product ID or a dummy one
                    }],
                    shippingAddress: {
                        street: 'Contact Customer (Recovered Order)',
                        city: 'N/A',
                        state: 'N/A',
                        zip: '000000'
                    },
                    paymentMethod: 'Paystack Webhook',
                    itemsPrice: amount / 100,
                    totalPrice: amount / 100,
                    paymentResult: {
                        reference: reference,
                        status: 'success',
                        email_address: customer.email
                    },
                    isPaid: true,
                    paidAt: paid_at || Date.now()
                });

                await recoveryOrder.save();
                console.log(`[WEBHOOK_DEBUG] Recovery order created ID: ${recoveryOrder._id}`);
            }
        }

        res.status(200).send('Webhook Handled');
    } catch (error) {
        console.error(`[WEBHOOK_ERROR]`, error);
        res.status(500).send('Webhook Error');
    }
};

module.exports = { addOrderItems, getMyOrders, getOrders, getOrderStats, paystackWebhook };
