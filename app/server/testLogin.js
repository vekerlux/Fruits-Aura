const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const testLogin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const email = 'officialfruitsaura@gmail.com';
        const password = 'Divisi0n';
        
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            process.exit(1);
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`Password Match Test (bcrypt.compare): ${isMatch}`);
        console.log(`User Plan: ${user.plan}`);
        
        const isMatchMethod = await user.matchPassword(password);
        console.log(`Password Match Test (u.matchPassword): ${isMatchMethod}`);
        
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

testLogin();
