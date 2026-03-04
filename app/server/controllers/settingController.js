const Setting = require('../models/Setting');

// @desc    Get all public settings
// @route   GET /api/settings
// @access  Public
const getPublicSettings = async (req, res, next) => {
    try {
        const settings = await Setting.find({ category: { $ne: 'payment' } });
        res.json(settings);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all settings (Admin)
// @route   GET /api/settings/admin
// @access  Private/Admin
const getAllSettings = async (req, res, next) => {
    try {
        const settings = await Setting.find({});
        res.json(settings);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a setting
// @route   PUT /api/settings/:id
// @access  Private/Admin
const updateSetting = async (req, res, next) => {
    try {
        const { value, description } = req.body;
        const setting = await Setting.findById(req.params.id);
        if (setting) {
            setting.value = value !== undefined ? value : setting.value;
            setting.description = description || setting.description;
            const updated = await setting.save();
            res.json(updated);
        } else {
            res.status(404);
            throw new Error('Setting not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Create a setting (Initial setup)
// @route   POST /api/settings
// @access  Private/Admin
const createSetting = async (req, res, next) => {
    try {
        const { key, value, description, category } = req.body;
        const setting = new Setting({
            key,
            value,
            description,
            category: category || 'general'
        });
        const created = await setting.save();
        res.status(201).json(created);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getPublicSettings,
    getAllSettings,
    updateSetting,
    createSetting
};
