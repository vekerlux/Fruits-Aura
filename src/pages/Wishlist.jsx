import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Plus, ShoppingBag } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import PageTransition from '../components/PageTransition';
import { productsData } from '../data/products';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './Wishlist.css';

const Wishlist = () => {
    const navigate = useNavigate();
    const { favorites, toggleFavorite } = useFavorites();
    const { addToCart } = useCart();
    const { showToast } = useToast();

    // Get favorite products
    const favoriteProducts = productsData.filter(p => favorites.includes(p.id));

    const handleRemoveFavorite = (e, productId, productName) => {
        e.stopPropagation();
        toggleFavorite(productId);
        showToast(`${productName} removed from wishlist`, 'success');
    };

    const handleQuickAdd = (e, product) => {
        e.stopPropagation();
        addToCart(product);
        showToast(`${product.name} added to cart!`, 'success');
    };

    return (
        <PageTransition>
            <div className="wishlist-container">
                <div className="wishlist-header">
                    <h2>My Wishlist</h2>
                    <span className="wishlist-count">{favoriteProducts.length} items</span>
                </div>

                {favoriteProducts.length === 0 ? (
                    <motion.div
                        className="wishlist-empty"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="empty-icon">
                            <Heart size={64} />
                        </div>
                        <h3>Your Wishlist is Empty</h3>
                        <p>Start adding your favorite drinks to see them here!</p>
                        <Button variant="primary" onClick={() => navigate('/menu')}>
                            Browse Menu
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        className="wishlist-grid"
                        layout
                    >
                        {favoriteProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card
                                    className="wishlist-card"
                                    onClick={() => navigate(`/product/${product.id}`)}
                                >
                                    <div
                                        className="product-image"
                                        style={{ backgroundColor: product.image ? 'transparent' : product.color }}
                                    >
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} />
                                        ) : (
                                            <div className="image-placeholder"></div>
                                        )}
                                        <motion.button
                                            className="remove-btn"
                                            onClick={(e) => handleRemoveFavorite(e, product.id, product.name)}
                                            whileTap={{ scale: 0.9 }}
                                            aria-label={`Remove ${product.name} from wishlist`}
                                        >
                                            <Heart size={16} fill="#E91E63" color="#E91E63" />
                                        </motion.button>
                                    </div>
                                    <div className="product-info">
                                        <h3>{product.name}</h3>
                                        <p>{product.description}</p>
                                        <div className="product-footer">
                                            <span className="price">
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
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {favoriteProducts.length > 0 && (
                    <div className="wishlist-actions">
                        <Button
                            variant="primary"
                            className="add-all-btn"
                            onClick={() => {
                                favoriteProducts.forEach(product => addToCart(product));
                                showToast(`Added ${favoriteProducts.length} items to cart!`, 'success');
                            }}
                        >
                            <ShoppingBag size={20} />
                            Add All to Cart
                        </Button>
                    </div>
                )}
            </div>
        </PageTransition>
    );
};

export default Wishlist;
