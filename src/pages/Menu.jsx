import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Heart, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import Button from '../components/Button';
import PageTransition from '../components/PageTransition';
import { useNavigate } from 'react-router-dom';
import { getAllProducts } from '../api/productsApi';
import { voteForProduct, getVotingRankings } from '../api/votingApi';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useToast } from '../context/ToastContext';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { formatNairaWithoutDecimals } from '../utils/currency';
import './Menu.css';

const Menu = () => {
    const [activeCategory, setActiveCategory] = useState("All Drinks");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { toggleFavorite, isFavorite } = useFavorites();
    const { showToast } = useToast();

    // Load products from API
    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                const response = await getAllProducts();
                setProducts(response.data?.products || []);
            } catch (error) {
                showToast('Failed to load products', 'error');
                console.error('Error loading products:', error);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [showToast]);

    // Filter and split products using useMemo for optimization
    const activeProducts = useMemo(() => products.filter(p => !p.isComingSoon), [products]);

    const comingSoonProducts = useMemo(() =>
        products.filter(p => p.isComingSoon)
        .sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0)),
    [products]);

    // Get unique categories from active products, memoized
    const categories = useMemo(() =>
        ['All Drinks', ...new Set(activeProducts.map(p => p.category))],
    [activeProducts]);

    // Filter active products by category and search, memoized
    const filteredActive = useMemo(() => {
        let filtered = activeCategory === "All Drinks"
            ? activeProducts
            : activeProducts.filter(p => p.category === activeCategory);

        if (searchQuery) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return filtered;
    }, [activeProducts, activeCategory, searchQuery]);

    // Sort active products, memoized
    const sortedActive = useMemo(() =>
        [...filteredActive].sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'price-low') return a.price - b.price;
            if (sortBy === 'price-high') return b.price - a.price;
            if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
            return 0;
        }),
    [filteredActive, sortBy]);

    // Memoize event handlers to prevent re-creation on each render
    const handleQuickAdd = useCallback((e, product) => {
        e.stopPropagation();
        addToCart(product);
        showToast(`${product.name} added to cart!`, 'success');
    }, [addToCart, showToast]);

    const handleToggleFavorite = useCallback((e, productId) => {
        e.stopPropagation();
        toggleFavorite(productId);
        const favorite = isFavorite(productId);
        showToast(favorite ? 'Added to favorites!' : 'Removed from favorites', 'success');
    }, [toggleFavorite, isFavorite, showToast]);

    const handleVote = useCallback(async (e, productId) => {
        e.stopPropagation();
        try {
            const response = await voteForProduct(productId);
            if (response.success) {
                showToast('Vote recorded! Thanks for your interest.', 'success');
                // Update local state to reflect new vote count
                setProducts(prevProducts =>
                    prevProducts.map(p =>
                        p._id === productId ? { ...p, voteCount: (p.voteCount || 0) + 1 } : p
                    )
                );
            }
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to vote', 'error');
        }
    }, [showToast]);

    if (loading) {
        return (
            <PageTransition>
                <div className="menu-container">
                    <div className="menu-header">
                        <h2>Menu</h2>
                    </div>
                    <LoadingSkeleton count={6} />
                </div>
            </PageTransition>
        );
    }

    return (
        <PageTransition>
            <div className="menu-container">
                <div className="menu-header">
                    <h2>Menu</h2>

                    <div className="search-sort-row">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search drinks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Search drinks"
                            role="searchbox"
                        />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="sort-select"
                            aria-label="Sort products"
                        >
                            <option value="name">Name</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="rating">Highest Rated</option>
                        </select>
                    </div>

                    <div className="category-scroll">
                        {categories.map(cat => (
                            <motion.button
                                key={cat}
                                className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat)}
                                whileTap={{ scale: 0.95 }}
                            >
                                {cat}
                            </motion.button>
                        ))}
                    </div>
                </div>

                <div className="product-grid" layout>
                    {sortedActive.length === 0 ? (
                        <div className="empty-results">
                            <p>No drinks found matching "{searchQuery}"</p>
                            <Button variant="primary" onClick={() => setSearchQuery('')}>Clear Search</Button>
                        </div>
                    ) : (
                        sortedActive.map((product, index) => (
                            <motion.div
                                key={product._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card
                                    className="product-card"
                                    onClick={() => navigate(`/product/${product._id}`)}
                                >
                                    <div
                                        className="product-image"
                                        style={{ backgroundColor: product.color || 'var(--color-primary-green)' }}
                                    >
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                            />
                                        ) : (
                                            <div className="image-placeholder"></div>
                                        )}

                                        <motion.button
                                            className={`favorite-btn ${isFavorite(product._id) ? 'favorited' : ''}`}
                                            onClick={(e) => handleToggleFavorite(e, product._id)}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <Heart size={16} fill={isFavorite(product._id) ? "#E91E63" : "none"} color={isFavorite(product._id) ? "#E91E63" : "currentColor"} />
                                        </motion.button>
                                    </div>
                                    <div className="product-info">
                                        <h3>{product.name}</h3>
                                        <p>{product.description}</p>
                                        <div className="product-footer">
                                            <span className="price" aria-label={`Price: ${formatNairaWithoutDecimals(product.price)}`}>
                                                {formatNairaWithoutDecimals(product.price)}
                                            </span>
                                            <motion.button
                                                className="add-btn"
                                                onClick={(e) => handleQuickAdd(e, product)}
                                                whileTap={{ scale: 0.9 }}
                                                whileHover={{ rotate: 90 }}
                                                aria-label={`Add ${product.name} to cart`}
                                            >
                                                <Plus size={20} />
                                            </motion.button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Coming Soon Section */}
                {comingSoonProducts.length > 0 && (
                    <div className="coming-soon-section">
                        <div className="section-header">
                            <h3>Next Aura Mix</h3>
                            <p>Based on your votes</p>
                        </div>
                        <div className="coming-soon-grid">
                            {comingSoonProducts.map((product, index) => (
                                <Card key={product._id} className="future-card">
                                    <div className="future-image-container">
                                        <div
                                            className="future-placeholder"
                                            style={{ backgroundColor: product.color || '#ddd' }}
                                        >
                                            <div className="loading-badge">Coming Soon</div>
                                            {product.image && <img src={product.image} alt={product.name} className="blurred" />}
                                        </div>
                                    </div>
                                    <div className="future-info">
                                        <div className="future-header">
                                            <h4>{product.name}</h4>
                                            <div className="rank-badge">#{index + 1}</div>
                                        </div>
                                        <p>{product.description}</p>
                                        <div className="vote-action-row">
                                            <div className="vote-count">
                                                <ThumbsUp size={14} />
                                                <span>{product.voteCount || 0} votes</span>
                                            </div>
                                            <motion.button
                                                className="vote-button"
                                                onClick={(e) => handleVote(e, product._id)}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Vote Now
                                            </motion.button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </PageTransition>
    );
};

export default Menu;
