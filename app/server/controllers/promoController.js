const Promo = require('../models/Promo');

// @desc    Validate a promo code
// @route   POST /api/promos/validate
// @access  Public
const validatePromo = async (req, res, next) => {
    try {
        const { code } = req.body;
        const promo = await Promo.findOne({ code: code.toUpperCase(), isActive: true });

        if (!promo) {
            res.status(404);
            throw new Error('Invalid or inactive promo code');
        }

        if (promo.expiryDate < new Date()) {
            promo.isActive = false;
            await promo.save();
            res.status(400);
            throw new Error('Promo code has expired');
        }

        if (promo.usedCount >= promo.maxUses) {
            promo.isActive = false;
            await promo.save();
            res.status(400);
            throw new Error('Promo code has reached max uses');
        }

        res.json({
            code: promo.code,
            discountType: promo.discountType,
            discountAmount: promo.discountAmount
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create a new promo code
// @route   POST /api/promos
// @access  Private/Admin
const createPromo = async (req, res, next) => {
    try {
        const { code, discountType, discountAmount, expiryDate, maxUses } = req.body;

        const promoExists = await Promo.findOne({ code });

        if (promoExists) {
            res.status(400);
            throw new Error('Promo code already exists');
        }

        const promo = await Promo.create({
            code,
            discountType,
            discountAmount,
            expiryDate,
            maxUses
        });

        res.status(201).json(promo);
    } catch (error) {
        next(error);
    }
};

module.exports = { validatePromo, createPromo };
