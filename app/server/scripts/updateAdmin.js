const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const updateAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        const email = 'officialfruitsaura@gmail.com';
        const password = 'Divisi0n';

        let user = await User.findOne({ role: 'ADMIN' });

        if (user) {
            user.email = email;
            user.password = password;
            await user.save();
            console.log('Admin user updated successfully!');
        } else {
            user = new User({
                name: 'Admin Chief',
                email,
                password,
                role: 'ADMIN'
            });
            await user.save();
            console.log('Admin user created successfully!');
        }

        process.exit();
    } catch (error) {
        console.error('Error updating admin:', error);
        process.exit(1);
    }
};

updateAdmin();
