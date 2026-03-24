const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Notification = require('./models/Notification');
const Location = require('./models/Location');
const Setting = require('./models/Setting');

dotenv.config();

connectDB();

const products = [
    {
        name: 'Apple Glow Aura',
        description: 'A crisp, refreshing blend of organic green apples, ginger, and lime designed to detoxify and revitalize your glow. Every sip brings a wave of antioxidant power.',
        price: 1500,
        image: '/assets/brand/bottle-base.png',
        cssFilter: 'hue-rotate(90deg) brightness(1.1)',
        category: 'glow',
        ingredients: ['Organic Apple', 'Ginger', 'Lime'],
        nutrition: {
            kcal: 120,
            sugar: '8g',
            vitC: 'High',
            hydration: 'Max'
        },
        isPopular: true,
        subtext: 'Bestseller Detox'
    },
    {
        name: 'Pineapple Zen Blend',
        description: 'Escape to a tropical mindset. Sweet pineapple, cooling mint, and hydrating coconut water combined into the ultimate refreshment.',
        price: 1500,
        image: '/assets/brand/bottle-base.png',
        cssFilter: 'sepia(0.5) hue-rotate(10deg) saturate(2) brightness(1.2)',
        category: 'energy',
        ingredients: ['Pineapple', 'Mint', 'Coconut Water'],
        nutrition: {
            kcal: 110,
            sugar: '10g',
            vitC: 'Medium',
            hydration: 'High'
        },
        subtext: 'Tropical Refresh'
    }
];

const users = [
    {
        name: 'Admin Chief',
        email: 'officialfruitsaura@gmail.com',
        password: 'Divisi0n',
        role: 'ADMIN',
        plan: 'Staff'
    },
    {
        name: 'Aura Enthusiast',
        email: 'user@fruitsaura.com',
        password: 'Aura123!',
        role: 'CONSUMER',
        plan: 'Auraset Subscriber'
    }
];

const settings = [
    {
        key: 'auraset_bundle_price',
        value: 9000,
        description: 'Price for the 6-bottle Auraset bundle',
        category: 'plan'
    },
    {
        key: 'auraset_bundle_quantity',
        value: 6,
        description: 'Number of bottles in the Auraset bundle',
        category: 'plan'
    },
    {
        key: 'maintenance_mode',
        value: false,
        description: 'Toggle app-wide maintenance mode',
        category: 'general'
    },
    {
        key: 'delivery_fee',
        value: 1500,
        description: 'Default flat rate delivery fee',
        category: 'payment'
    },
    {
        key: 'free_shipping_threshold',
        value: 10000,
        description: 'Minimum order amount for free shipping',
        category: 'payment'
    },
    {
        key: 'delivery_time_slots',
        value: 'Morning (9am - 12pm), Afternoon (12pm - 3pm), Evening (3pm - 6pm)',
        description: 'Available delivery time slots (comma separated)',
        category: 'general'
    }
];

const locations = [
    {
        name: 'Lekki Flagship Store',
        address: 'Plot 14, Admiralty Way, Lekki Phase 1',
        city: 'Lagos',
        coordinates: { lat: 6.4478, lng: 3.4723 },
        openingHours: 'Mon - Sat: 8AM - 10PM, Sun: 10AM - 8PM',
        phone: '+234 800 AURA FRESH',
        isActive: true
    },
    {
        name: 'Ikeja Gra Outlet',
        address: '22 Joel Ogunnaike St, Ikeja GRA',
        city: 'Lagos',
        coordinates: { lat: 6.5841, lng: 3.3582 },
        openingHours: 'Mon - Sun: 9AM - 9PM',
        phone: '+234 801 AURA GRA',
        isActive: true
    }
];

const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        await Notification.deleteMany();
        await Location.deleteMany();
        await Setting.deleteMany();

        const createdProducts = await Product.insertMany(products);
        const createdUsers = await User.create(users);
        await Setting.insertMany(settings);
        await Location.insertMany(locations);

        const adminUser = createdUsers.find(u => u.role === 'ADMIN');
        const consumerUser = createdUsers.find(u => u.email === 'user@fruitsaura.com');
        const sampleProduct = createdProducts[0];

        // Seed a default notification
        await Notification.create({
            title: 'Welcome to the New Aura!',
            message: 'We have updated our mobile experience for better hydration tracking.',
            type: 'info',
            isActive: true,
            createdBy: adminUser._id
        });

        const orderData = {
            user: consumerUser._id,
            orderItems: [
                {
                    name: sampleProduct.name,
                    qty: 2,
                    image: sampleProduct.image,
                    price: sampleProduct.price,
                    product: sampleProduct._id
                }
            ],
            shippingAddress: {
                street: '123 Aura Lane',
                city: 'Lagos',
                state: 'Lagos',
                zip: '100001'
            },
            paymentMethod: 'Paystack',
            paymentResult: {
                id: 'REF-123',
                status: 'success',
                update_time: '2026-02-26',
                email_address: 'user@fruitsaura.com'
            },
            itemsPrice: sampleProduct.price * 2,
            taxPrice: 0,
            shippingPrice: 500,
            totalPrice: (sampleProduct.price * 2) + 500,
            isPaid: true,
            paidAt: new Date()
        };

        await Order.create(orderData);

        console.log('Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        await Notification.deleteMany();
        await Location.deleteMany();
        await Setting.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
