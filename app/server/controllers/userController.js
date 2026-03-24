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

// @desc    Update user details (name, points, plan)
// @route   PUT /api/users/:id/admin-update
// @access  Private/Admin
const updateUserAdmin = async (req, res, next) => {
    try {
        const { name, points, reason, plan } = req.body;
        const user = await User.findById(req.params.id);

        if (user) {
            if (name) user.name = name;
            if (plan) user.plan = plan;
            if (points !== undefined && points !== null && points !== '') {
                user.loyaltyPoints = (user.loyaltyPoints || 0) + Number(points);
            }
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                plan: updatedUser.plan,
                loyaltyPoints: updatedUser.loyaltyPoints,
                message: `User updated successfully (Points: ${updatedUser.loyaltyPoints})`
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.role = req.body.role || user.role;
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                role: updatedUser.role,
                message: `User role updated successfully to ${user.role}`
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            if (user.role === 'admin') {
                res.status(400);
                throw new Error('Cannot delete admin user via this endpoint');
            }
            await user.deleteOne();
            res.json({ message: 'User removed successfully' });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { getUsers, updateUserAdmin, updateUserRole, deleteUser };
