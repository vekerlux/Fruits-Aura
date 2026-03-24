const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Setting = require('./models/Setting');

dotenv.config();

connectDB();

const addSettings = async () => {
    try {
        const settings = [
            {
                key: 'delivery_fee',
                value: 1500,
                description: 'Default flat rate delivery fee',
                category: 'payment'
            },
            {
                key: 'delivery_time_slots',
                value: 'Morning (9am - 12pm), Afternoon (12pm - 3pm), Evening (3pm - 6pm)',
                description: 'Available delivery time slots (comma separated)',
                category: 'general'
            }
        ];

        for (const s of settings) {
            const exists = await Setting.findOne({ key: s.key });
            if (!exists) {
                await Setting.create(s);
                console.log(`Setting ${s.key} created.`);
            } else {
                console.log(`Setting ${s.key} already exists.`);
            }
        }
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

addSettings();
