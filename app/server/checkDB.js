const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const user = await User.findOne({ email: 'officialfruitsaura@gmail.com' });
        if (user) {
            console.log('User found:');
            console.log(JSON.stringify({
                _id: user._id,
                email: user.email,
                role: user.role,
                plan: user.plan,
                passwordHashPrefix: user.password.substring(0, 10)
            }, null, 2));
        } else {
            console.log('User not found!');
        }
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkDB();
