const express = require('express');
const router = express.Router();
const { validatePromo, createPromo } = require('../controllers/promoController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/validate', validatePromo);
router.get('/', protect, admin, async (req, res, next) => {
    try {
        const Promo = require('../models/Promo');
        const promos = await Promo.find({}).sort({ createdAt: -1 });
        res.json(promos);
    } catch (error) {
        next(error);
    }
});
router.post('/', protect, admin, createPromo);

module.exports = router;
