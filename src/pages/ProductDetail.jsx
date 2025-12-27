import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Minus, Plus, ShoppingBag, Star, MessageSquarePlus, Info } from 'lucide-react';
import Button from '../components/Button';
import ReviewSection from '../components/ReviewSection';
import AddReview from '../components/AddReview';
import PageTransition from '../components/PageTransition';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { getProductById } from '../api/productsApi';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useToast } from '../context/ToastContext';
import { getProductReviews, createReview } from '../api/reviewsApi';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { toggleFavorite, isFavorite } = useFavorites();
    const { showToast } = useToast();
    const [quantity, setQuantity] = useState(1);
    const [showAddReview, setShowAddReview] = useState(false);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [isBundle, setIsBundle] = useState(false);

    // Load product and reviews
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const productData = await getProductById(id);
                setProduct(productData.product);

                // Reviews
                try {
                    setReviewsLoading(true);
                    const reviewsData = await getProductReviews(id);
                    setReviews(reviewsData.reviews || []);
                } catch (reviewError) {
                    console.error('Failed to load reviews:', reviewError);
                    setReviews([]);
                } finally {
                    setReviewsLoading(false);
                }
            } catch (error) {
                console.error('Failed to load product:', error);
                showToast('Failed to load product details', 'error');
                navigate('/menu');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id, navigate, showToast]);

    if (loading || !product) {
        return (
            <div className="product-detail-container">
                <LoadingSkeleton count={1} height={400} />
            </div>
        );
    }

    const favorite = isFavorite(product._id);

    // Calculate dynamic rating
    const currentRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : product.rating;

    const currentPrice = isBundle ? product.bundlePrice : product.price;

    const handleAddToCart = () => {
        const itemToAdd = isBundle
            ? { ...product, id: `${product._id}-bundle`, name: `${product.name} (Auraset)`, price: product.bundlePrice, isBundle: true }
            : product;

        addToCart(itemToAdd, quantity);
        showToast(`${quantity} × ${itemToAdd.name} added to cart!`, 'success');
        setQuantity(1);
    };

    const handleToggleFavorite = () => {
        toggleFavorite(product._id);
        showToast(favorite ? 'Removed from favorites' : 'Added to favorites!', 'success');
    };

    const handleSubmitReview = async (reviewData) => {
        try {
            const response = await createReview(product._id, reviewData);

            if (response.review) {
                const newReview = {
                    ...response.review,
                    date: response.review.createdAt || new Date().toISOString()
                };
                setReviews([newReview, ...reviews]);
                setShowAddReview(false);
                showToast('Thank you for your review!', 'success');
            }
        } catch (error) {
            console.error('Failed to submit review:', error);
            showToast(error.response?.data?.message || 'Failed to submit review. Please try again.', 'error');
        }
    };

    return (
        <PageTransition>
            <div className="product-detail-container">
                <div className="product-header" style={{ backgroundColor: product.color || '#4CAF50' }}>
                    <div className="header-actions">
                        <button
                            className="icon-btn white"
                            onClick={() => navigate(-1)}
                            aria-label="Go back"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <button
                            className="icon-btn white"
                            onClick={handleToggleFavorite}
                            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
                        >
                            <Heart size={24} fill={favorite ? "white" : "none"} />
                        </button>
                    </div>
                    <motion.div
                        className="product-hero-image"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {product.image ? (
                            <img src={product.image} alt={product.name} className="hero-product-img" />
                        ) : (
                            <div className="hero-circle"></div>
                        )}
                    </motion.div>
                </div>

                <div className="product-content">
                    <div className="title-row">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                        >
                            <h1>{product.name}</h1>
                            <div className="rating-row">
                                <Star size={16} fill="#FDD835" color="#FDD835" />
                                <span className="rating-text">{currentRating} ({reviews.length} reviews)</span>
                            </div>
                        </motion.div>
                        <span className="price-tag">${currentPrice ? currentPrice.toFixed(2) : '0.00'}</span>
                    </div>

                    {/* Auraset Toggle */}
                    {product.bundlePrice && (
                        <div className="bundle-toggle-container">
                            <div className="toggle-label">
                                <span className={!isBundle ? 'active' : ''}>Single Bottle</span>
                            </div>
                            <div
                                className={`toggle-switch large ${isBundle ? 'active' : ''}`}
                                onClick={() => setIsBundle(!isBundle)}
                            >
                                <div className="toggle-knob"></div>
                            </div>
                            <div className="toggle-label">
                                <span className={isBundle ? 'active' : ''}>
                                    Auraset (5 Pack)
                                    <span className="save-badge">Save!</span>
                                </span>
                            </div>
                        </div>
                    )}

                    <p className="description">{product.description}</p>

                    {product.ingredients && product.ingredients.length > 0 && (
                        <div className="section">
                            <h3>Ingredients</h3>
                            <div className="ingredients-list">
                                {product.ingredients.map((ing, i) => (
                                    <span key={i} className="ingredient-chip">{ing}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {product.nutrition && (
                        <div className="section">
                            <h3>Nutrition Facts</h3>
                            <div className="nutrition-grid">
                                <div className="nutrition-item">
                                    <span className="label">Calories</span>
                                    <span className="value">{product.nutrition.calories || '-'}</span>
                                </div>
                                <div className="nutrition-item">
                                    <span className="label">Sugar</span>
                                    <span className="value">{product.nutrition.sugar || '-'}</span>
                                </div>
                                <div className="nutrition-item">
                                    <span className="label">Vit C</span>
                                    <span className="value">{product.nutrition.vitaminC || '-'}</span>
                                </div>
                                <div className="nutrition-item">
                                    <span className="label">Protein</span>
                                    <span className="value">{product.nutrition.protein || '-'}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="write-review-section">
                        <Button
                            variant="secondary"
                            className="write-review-btn"
                            onClick={() => setShowAddReview(true)}
                        >
                            <MessageSquarePlus size={20} />
                            Write a Review
                        </Button>
                    </div>

                    <ReviewSection
                        reviews={reviews}
                        rating={currentRating}
                        reviewCount={reviews.length}
                    />
                </div>

                <div className="product-footer-action">
                    <div className="quantity-selector">
                        <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                            <Minus size={18} />
                        </button>
                        <span className="qty">{quantity}</span>
                        <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}>
                            <Plus size={18} />
                        </button>
                    </div>
                    <Button variant="primary" className="add-to-cart-btn" onClick={handleAddToCart}>
                        <ShoppingBag size={20} /> Add {isBundle ? 'Auraset' : 'Item'}
                    </Button>
                </div>

                <AnimatePresence>
                    {showAddReview && (
                        <AddReview
                            productName={product.name}
                            onSubmit={handleSubmitReview}
                            onClose={() => setShowAddReview(false)}
                        />
                    )}
                </AnimatePresence>
            </div>
        </PageTransition>
    );
};

export default ProductDetail;
