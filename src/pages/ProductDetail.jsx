import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Minus, Plus, ShoppingBag, Star, MessageSquarePlus, Info } from 'lucide-react';
import Button from '../components/Button';
import ReviewSection from '../components/ReviewSection';
import AddReview from '../components/AddReview';
import PageTransition from '../components/PageTransition';
import LoadingMix from '../components/LoadingMix';
import { getProductById } from '../api/productsApi';
import { formatNairaWithoutDecimals } from '../utils/currency';
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

    if (loading) {
        return (
            <div className="product-detail-container">
                <LoadingMix message="Mixing fresh details..." />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-detail-container" style={{ textAlign: 'center', padding: '4rem' }}>
                <h2>Product Not Found</h2>
                <p>The mix you are looking for is unavailable.</p>
                <Button onClick={() => navigate('/menu')} style={{ marginTop: '1rem' }}>
                    Back to Menu
                </Button>
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
                <div className="product-header" style={{ backgroundColor: product.color || 'var(--color-bg-elevated)' }}>
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
                            <Heart size={24} fill={favorite ? "var(--color-primary)" : "none"} stroke={favorite ? "var(--color-primary)" : "currentColor"} />
                        </button>
                    </div>
                    <motion.div
                        className="product-hero-image"
                        initial={{ scale: 0.8, opacity: 0, rotate: -15 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20
                        }}
                    >
                        {product.image ? (
                            <img src={product.image} alt={product.name} className="hero-product-img" />
                        ) : (
                            <div className="hero-circle glass"></div>
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
                                <Star size={18} fill="var(--color-primary)" color="var(--color-primary)" />
                                <span className="rating-text text-glow">{currentRating} ({reviews.length} reviews)</span>
                            </div>
                        </motion.div>
                        <span className="price-tag">{formatNairaWithoutDecimals(currentPrice || 0)}</span>
                    </div>

                    {/* Auraset Toggle - Premium Experience */}
                    {product.bundlePrice && (
                        <div className="bundle-toggle-container premium-aura">
                            <motion.div
                                whileTap={{ scale: 0.98 }}
                                className={`toggle-option ${!isBundle ? 'active' : ''}`}
                                onClick={() => setIsBundle(false)}
                            >
                                <span className="option-name">Standard</span>
                                <span className="option-price">{formatNairaWithoutDecimals(product.price)}</span>
                            </motion.div>

                            <motion.div
                                whileTap={{ scale: 0.98 }}
                                className={`toggle-option ${isBundle ? 'active' : ''}`}
                                onClick={() => setIsBundle(true)}
                            >
                                <div className="auraset-premium-badge shadow-neon">🔥 SAVINGS</div>
                                <span className="option-name">Auraset ({product.bundleSize || 5} Pack)</span>
                                <span className="option-price">{formatNairaWithoutDecimals(product.bundlePrice)}</span>
                            </motion.div>
                        </div>
                    )}

                    <p className="description">{product.description}</p>

                    <div className="detail-sections">
                        {product.ingredients && product.ingredients.length > 0 && (
                            <div className="section">
                                <div className="section-header flex items-center gap-sm">
                                    <Info size={18} className="text-primary" />
                                    <h3>Composition</h3>
                                </div>
                                <div className="ingredients-list">
                                    {product.ingredients.map((ing, i) => (
                                        <motion.span
                                            key={i}
                                            className="ingredient-chip glass"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            {ing}
                                        </motion.span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {product.nutrition && (
                            <div className="section">
                                <div className="section-header flex items-center gap-sm">
                                    <Star size={18} className="text-primary" />
                                    <h3>Aura Profile</h3>
                                </div>
                                <div className="nutrition-grid">
                                    <div className="nutrition-item glass">
                                        <span className="label">Energy</span>
                                        <span className="value">{product.nutrition.calories || '-'}</span>
                                    </div>
                                    <div className="nutrition-item glass">
                                        <span className="label">Natural Sugars</span>
                                        <span className="value">{product.nutrition.sugar || '-'}</span>
                                    </div>
                                    <div className="nutrition-item glass">
                                        <span className="label">Vitality (Vit C)</span>
                                        <span className="value">{product.nutrition.vitaminC || '-'}</span>
                                    </div>
                                    <div className="nutrition-item glass">
                                        <span className="label">Essence (Protein)</span>
                                        <span className="value">{product.nutrition.protein || '-'}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="write-review-section">
                        <Button
                            variant="secondary"
                            className="write-review-btn glass"
                            onClick={() => setShowAddReview(true)}
                        >
                            <MessageSquarePlus size={20} />
                            Share Your Experience
                        </Button>
                    </div>

                    <ReviewSection
                        reviews={reviews}
                        rating={currentRating}
                        reviewCount={reviews.length}
                    />
                </div>

                <div className="product-footer-action glass">
                    <div className="quantity-selector glass">
                        <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                            <Minus size={20} />
                        </button>
                        <span className="qty">{quantity}</span>
                        <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}>
                            <Plus size={20} />
                        </button>
                    </div>
                    <Button variant="primary" className="add-to-cart-btn shadow-neon" onClick={handleAddToCart}>
                        <ShoppingBag size={22} /> {isBundle ? 'Add Auraset' : 'Add to Bag'}
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
