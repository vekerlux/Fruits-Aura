const express = require('express');
const { getUsers, updateUserPoints } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, admin, getUsers);
router.route('/:id/points').put(protect, admin, updateUserPoints);

module.exports = router;
