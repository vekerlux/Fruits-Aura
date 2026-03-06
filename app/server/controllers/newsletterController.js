const Newsletter = require('../models/Newsletter');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
const subscribeNewsletter = async (req, res, next) => {
    try {
        const { email } = req.body;

        const subscriberExists = await Newsletter.findOne({ email });

        if (subscriberExists) {
            if (subscriberExists.isSubscribed) {
                res.status(400);
                throw new Error('Already subscribed');
            } else {
                subscriberExists.isSubscribed = true;
                await subscriberExists.save();
                return res.json({ message: 'Welcome back! Subscribed successfully' });
            }
        }

        await Newsletter.create({ email });

        res.status(201).json({ message: 'Subscribed successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = { subscribeNewsletter };
