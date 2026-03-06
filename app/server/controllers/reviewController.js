const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Create new review
// @route   POST /api/reviews/:productId
// @access  Private
const createProductReview = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;
        const productId = req.params.productId;

        const product = await Product.findById(productId);

        if (product) {
            const alreadyReviewed = await Review.findOne({
                user: req.user._id,
                product: productId
            });

            if (alreadyReviewed) {
                res.status(400);
                throw new Error('Product already reviewed');
            }

            const review = new Review({
                name: req.user.name,
                rating: Number(rating),
                comment,
                user: req.user._id,
                product: productId,
            });

            await review.save();
            res.status(201).json({ message: 'Review added' });
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
const getProductReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        next(error);
    }
};

module.exports = { createProductReview, getProductReviews };
