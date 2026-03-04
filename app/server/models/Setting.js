const mongoose = require('mongoose');

const settingSchema = mongoose.Schema(
    {
        key: { type: String, required: true, unique: true },
        value: { type: mongoose.Schema.Types.Mixed, required: true },
        description: { type: String },
        category: { type: String, required: true, enum: ['general', 'payment', 'ui', 'plan'] }
    },
    { timestamps: true }
);

const Setting = mongoose.model('Setting', settingSchema);
module.exports = Setting;
