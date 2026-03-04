const mongoose = require('mongoose');

const locationSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        coordinates: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true }
        },
        openingHours: { type: String, required: true },
        phone: { type: String },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
);

const Location = mongoose.model('Location', locationSchema);
module.exports = Location;
