const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        next(error);
    }
};

// @desc    Update user loyalty points
// @route   PUT /api/users/:id/points
// @access  Private/Admin
const updateUserPoints = async (req, res, next) => {
    try {
        const { points, reason } = req.body;
        const user = await User.findById(req.params.id);

        if (user) {
            user.loyaltyPoints = (user.loyaltyPoints || 0) + Number(points);
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                loyaltyPoints: updatedUser.loyaltyPoints,
                message: `Points updated successfully (${points > 0 ? '+' : ''}${points} for ${reason || 'Admin adjustment'})`
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { getUsers, updateUserPoints };
