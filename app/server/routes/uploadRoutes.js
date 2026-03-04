const express = require('express');
const router = express.Router();
const { upload, uploadImage } = require('../controllers/uploadController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, admin, upload.single('image'), uploadImage);

module.exports = router;
