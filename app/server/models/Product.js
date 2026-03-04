const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        category: {
            type: String,
            required: true,
            enum: ['detox', 'energy', 'immunity', 'glow'],
        },
        ingredients: [{ type: String }],
        nutrition: {
            kcal: { type: Number },
            sugar: { type: String },
            vitC: { type: String },
            hydration: { type: String },
        },
        isPopular: { type: Boolean, default: false },
        subtext: { type: String },
        cssFilter: { type: String },
    },
    { timestamps: true }
);

// Helper to match the frontend `id` instead of `_id`
productSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
