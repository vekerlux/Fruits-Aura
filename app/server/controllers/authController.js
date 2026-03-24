const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(`[LOGIN_DEBUG] Attempt for email: "${email}" (length: ${email?.length})`);

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            console.log(`[LOGIN_DEBUG] User NOT found for email: "${email}"`);
            res.status(401);
            throw new Error('Invalid email or password');
        }

        console.log(`[LOGIN_DEBUG] User found: ${user.email}. Stored hash (short): ${user.password.substring(0, 10)}...`);

        const isMatch = await user.matchPassword(password);
        console.log(`[LOGIN_DEBUG] Password match for ${email}: ${isMatch}`);

        if (isMatch) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                address: user.address,
                role: user.role,
                plan: user.plan,
                hasEmailDiscount: user.hasEmailDiscount,
                isSpecialDistributor: user.isSpecialDistributor,
                token: generateToken(user._id),
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, referralCode } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        // Check if referred by someone
        let referredBy = null;
        if (referralCode) {
            const referrer = await User.findOne({ referralCode });
            if (referrer) {
                referredBy = referrer._id;
            }
        }

        // Generate unique referral code for the new user
        const myReferralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        const user = await User.create({
            name,
            email,
            password,
            referredBy,
            referralCode: myReferralCode
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                address: user.address,
                role: user.role,
                plan: user.plan,
                referralCode: user.referralCode,
                hasEmailDiscount: user.hasEmailDiscount,
                isSpecialDistributor: user.isSpecialDistributor,
                token: generateToken(user._id),
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                address: user.address,
                role: user.role,
                plan: user.plan,
                hasEmailDiscount: user.hasEmailDiscount,
                isSpecialDistributor: user.isSpecialDistributor,
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.avatar = req.body.avatar || user.avatar;
            user.address = req.body.address || user.address;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                avatar: updatedUser.avatar,
                address: updatedUser.address,
                role: updatedUser.role,
                plan: updatedUser.plan,
                hasEmailDiscount: updatedUser.hasEmailDiscount,
                isSpecialDistributor: updatedUser.isSpecialDistributor,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { authUser, registerUser, getUserProfile, updateUserProfile };
