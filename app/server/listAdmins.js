const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const listAdmins = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const admins = await User.find({ role: 'ADMIN' });
        console.log('Admins found:');
        console.log(JSON.stringify(admins.map(a => ({ email: a.email, role: a.role })), null, 2));
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

listAdmins();
