const express = require('express');
const router = express.Router();
const {
    getPublicSettings,
    getAllSettings,
    updateSetting,
    createSetting
} = require('../controllers/settingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getPublicSettings).post(protect, admin, createSetting);
router.route('/admin').get(protect, admin, getAllSettings);
router.route('/:id').put(protect, admin, updateSetting);

module.exports = router;
