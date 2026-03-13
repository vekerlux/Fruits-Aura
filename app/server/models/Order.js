const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        orderItems: [
            {
                name: { type: String, required: true },
                qty: { type: Number, required: true },
                image: { type: String, required: true },
                price: { type: Number, required: true },
                isBundle: { type: Boolean, default: false },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product',
                },
            },
        ],
        shippingAddress: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zip: { type: String, required: true },
        },
        paymentMethod: { type: String, required: true, default: 'Paystack' },
        paymentResult: {
            id: { type: String },
            status: { type: String },
            update_time: { type: String },
            email_address: { type: String },
            reference: { type: String },
        },
        taxPrice: { type: Number, required: true, default: 0.0 },
        shippingPrice: { type: Number, required: true, default: 0.0 },
        totalPrice: { type: Number, required: true, default: 0.0 },
        isPaid: { type: Boolean, required: true, default: false },
        paidAt: { type: Date },
        isDelivered: { type: Boolean, required: true, default: false },
        deliveredAt: { type: Date },
        isSubscription: { type: Boolean, default: false },
        subscriptionFrequency: { type: String, enum: ['weekly', 'biweekly', 'monthly'] },
        deliveryTimeSlot: {
            type: String,
            enum: ['Morning (9am - 12pm)', 'Afternoon (12pm - 3pm)', 'Evening (3pm - 6pm)'],
            default: 'Morning (9am - 12pm)'
        },
        status: {
            type: String,
            required: true,
            enum: ['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
            default: 'PLACED'
        },
    },
    { timestamps: true }
);

orderSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
