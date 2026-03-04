const Notification = require('../models/Notification');

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Public
const getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all notifications (Admin)
// @route   GET /api/notifications/admin
// @access  Private/Admin
const getAllNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({}).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a notification
// @route   POST /api/notifications
// @access  Private/Admin
const createNotification = async (req, res, next) => {
    try {
        const { title, message, type, isActive } = req.body;
        const notification = new Notification({
            title,
            message,
            type: type || 'info',
            isActive: isActive !== undefined ? isActive : true,
            createdBy: req.user._id
        });
        const created = await notification.save();
        res.status(201).json(created);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a notification
// @route   PUT /api/notifications/:id
// @access  Private/Admin
const updateNotification = async (req, res, next) => {
    try {
        const { title, message, type, isActive } = req.body;
        const notification = await Notification.findById(req.params.id);
        if (notification) {
            notification.title = title || notification.title;
            notification.message = message || notification.message;
            notification.type = type || notification.type;
            notification.isActive = isActive !== undefined ? isActive : notification.isActive;
            const updated = await notification.save();
            res.json(updated);
        } else {
            res.status(404);
            throw new Error('Notification not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private/Admin
const deleteNotification = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (notification) {
            await notification.deleteOne();
            res.json({ message: 'Notification removed' });
        } else {
            res.status(404);
            throw new Error('Notification not found');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getNotifications,
    getAllNotifications,
    createNotification,
    updateNotification,
    deleteNotification
};
