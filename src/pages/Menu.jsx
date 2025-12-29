import React, { useState, useEffect } from 'react';
import { Plus, Heart, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import Button from '../components/Button';
import PageTransition from '../components/PageTransition';
import { useNavigate } from 'react-router-dom';
import { getAllProducts, voteForProduct } from '../api/productsApi';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useToast } from '../context/ToastContext';
import LoadingSkeleton from '../components/LoadingSkeleton';
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

    // Get unique categories from products
    const categories = ['All Drinks', ...new Set(products.map(p => p.category))];

    // Filter by category and search
    let filteredProducts = activeCategory === "All Drinks"
        ? products
        : products.filter(p => p.category === activeCategory);

    if (searchQuery) {
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        // Float Future products to top if needed, or sort separately
        return 0;
    });

    const handleQuickAdd = (e, product) => {
        e.stopPropagation();
        addToCart(product);
        showToast(`${product.name} added to cart!`, 'success');
    };

    const handleToggleFavorite = (e, productId) => {
        e.stopPropagation();
        toggleFavorite(productId);
        const favorite = isFavorite(productId);
        showToast(favorite ? 'Added to favorites!' : 'Removed from favorites', 'success');
    };

    const handleVote = async (e, productId) => {
        e.stopPropagation();
        try {
            const response = await voteForProduct(productId);
            if (response.success) {
                showToast('Vote recorded! Thanks for your feedback.', 'success');
                // Update local state to reflect new vote count
                setProducts(products.map(p =>
                    p._id === productId ? { ...p, voteCount: (p.voteCount || 0) + 1 } : p
                ));
            }
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to vote', 'error');
        }
    };

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
                    {sortedProducts.length === 0 ? (
                        <div className="empty-results">
                            <p>No drinks found matching "{searchQuery}"</p>
                            <Button variant="primary" onClick={() => setSearchQuery('')}>Clear Search</Button>
                        </div>
                    ) : (
                        sortedProducts.map((product, index) => {
                            const isFuture = product.category === 'Coming Soon' || product.isFuture;

                            return (
                                <motion.div
                                    key={product._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card
                                        className={`product-card ${isFuture ? 'future-card' : ''}`}
                                        onClick={() => !isFuture && navigate(`/product/${product._id}`)}
                                    >
                                        <div
                                            className="product-image"
                                            style={{ backgroundColor: product.image ? 'transparent' : product.color }}
                                        >
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className={isFuture ? 'blurred' : ''}
                                                />
                                            ) : (
                                                <div className="image-placeholder"></div>
                                            )}

                                            {isFuture && <div className="coming-soon-badge">Coming Soon</div>}

                                            {!isFuture && (
                                                <motion.button
                                                    className={`favorite-btn ${isFavorite(product._id) ? 'favorited' : ''}`}
                                                    onClick={(e) => handleToggleFavorite(e, product._id)}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <Heart size={16} fill={isFavorite(product._id) ? "#E91E63" : "none"} color={isFavorite(product._id) ? "#E91E63" : "currentColor"} />
                                                </motion.button>
                                            )}
                                        </div>
                                        <div className="product-info">
                                            <h3>{product.name}</h3>
                                            <p>{product.description}</p>
                                            <div className="product-footer">
                                                {isFuture ? (
                                                    <div className="vote-section">
                                                        <span className="price">Votes: {product.voteCount || 0}</span>
                                                        <motion.button
                                                            className="vote-btn"
                                                            onClick={(e) => handleVote(e, product._id)}
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            <ThamesUp size={16} /> Vote
                                                        </motion.button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span className="price" aria-label={`Price: $${typeof product.price === 'string' ? product.price : product.price.toFixed(2)}`}>
                                                            ${typeof product.price === 'string' ? product.price : product.price.toFixed(2)}
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
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>
        </PageTransition>
    );
};

export default Menu;
