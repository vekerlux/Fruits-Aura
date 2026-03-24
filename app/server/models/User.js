const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

console.log(`[MODEL_DEBUG] User Role Enum: ['CONSUMER', 'DISTRIBUTOR', 'ADMIN']`);

const userSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        avatar: { type: String, default: null },
        address: {
            street: { type: String },
            city: { type: String },
            state: { type: String },
            zip: { type: String },
        },
        role: { type: String, enum: ['CONSUMER', 'DISTRIBUTOR', 'ADMIN'], default: 'CONSUMER' },
        referralCode: { type: String, unique: true },
        referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        loyaltyPoints: { type: Number, default: 0 },
        plan: { 
            type: String, 
            default: 'Auraset Subscriber',
            enum: ['Auraset Subscriber', 'Auraset Explorer', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Staff']
        },
        hasEmailDiscount: { type: Boolean, default: false },
        isSpecialDistributor: { type: Boolean, default: false },
    },
    { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
module.exports = User;
