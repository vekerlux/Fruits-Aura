const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const checkAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const admin = await User.findOne({ role: 'ADMIN' });
        if (admin) {
            console.log('Admin User Found:');
            console.log('Email:', admin.email);
            console.log('Role:', admin.role);
            // We can't see the raw password due to hashing, but we can verify email exists.
        } else {
            console.log('No Admin User found in database.');
        }
        
        const allUsers = await User.find({}, 'email role');
        const fs = require('fs');
        fs.writeFileSync('debug_users.json', JSON.stringify(allUsers, null, 2), 'utf8');
        console.log('JSON saved to debug_users.json');
        
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkAdmin();
