const mongoose = require('mongoose');

const promoSchema = mongoose.Schema(
    {
        code: { type: String, required: true, unique: true, uppercase: true },
        discountType: { type: String, enum: ['PERCENTAGE', 'FIXED'], default: 'FIXED' },
        discountAmount: { type: Number, required: true },
        expiryDate: { type: Date, required: true },
        isActive: { type: Boolean, default: true },
        maxUses: { type: Number, default: 100 },
        usedCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const Promo = mongoose.model('Promo', promoSchema);
module.exports = Promo;
