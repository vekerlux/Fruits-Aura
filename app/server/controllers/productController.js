const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
    try {
        const keyword = req.query.keyword
            ? {
                name: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};

        const category = req.query.category ? { category: req.query.category } : {};

        const products = await Product.find({ ...keyword, ...category });
        res.json(products);
    } catch (error) {
        next(error);
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
    try {
        const {
            name,
            price,
            description,
            image,
            category,
            ingredients,
            nutrition,
            subtext,
            cssFilter,
            isPopular
        } = req.body;

        const product = new Product({
            name: name || 'Sample name',
            price: price || 0,
            user: req.user._id,
            image: image || '/images/sample.jpg',
            category: category || 'detox',
            ingredients: ingredients || [],
            nutrition: nutrition || { kcal: 0, sugar: '0g', vitC: 'Low', hydration: 'Low' },
            description: description || 'Sample description',
            subtext: subtext || 'New Juice',
            cssFilter: cssFilter || '',
            isPopular: isPopular || false
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
    try {
        const {
            name,
            price,
            description,
            image,
            category,
            ingredients,
            nutrition,
            subtext,
            cssFilter,
            isPopular
        } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.price = price || product.price;
            product.description = description || product.description;
            product.image = image || product.image;
            product.category = category || product.category;
            product.ingredients = ingredients || product.ingredients;
            product.nutrition = nutrition || product.nutrition;
            product.subtext = subtext || product.subtext;
            product.cssFilter = cssFilter || product.cssFilter;
            product.isPopular = isPopular !== undefined ? isPopular : product.isPopular;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { getProducts, getProductById, deleteProduct, createProduct, updateProduct };
