import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from './Button';
import { useNavigate } from 'react-router-dom';
import './CartModal.css';

const CartModal = ({ isOpen, onClose }) => {
    const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        onClose();
        navigate('/checkout');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="cart-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="cart-modal"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        <div className="cart-header">
                            <h2>Your Cart ({cart.length})</h2>
                            <button className="cart-close-btn" onClick={onClose}>
                                <X size={24} />
                            </button>
                        </div>

                        {cart.length === 0 ? (
                            <div className="cart-empty">
                                <ShoppingBag size={64} className="empty-icon" />
                                <p>Your cart is empty</p>
                                <Button variant="primary" onClick={onClose}>
                                    Start Shopping
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="cart-items">
                                    {cart.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            className="cart-item"
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -100 }}
                                        >
                                            <div
                                                className="cart-item-image"
                                                style={{
                                                    backgroundColor: item.image ? 'transparent' : item.color
                                                }}
                                            >
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} />
                                                ) : (
                                                    <div className="image-placeholder"></div>
                                                )}
                                            </div>
                                            <div className="cart-item-info">
                                                <h4>{item.name}</h4>
                                                <p className="cart-item-price">
                                                    ${typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')).toFixed(2) : item.price.toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="cart-item-actions">
                                                <div className="quantity-controls">
                                                    <button
                                                        className="qty-control-btn"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="qty-display">{item.quantity}</span>
                                                    <button
                                                        className="qty-control-btn"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <button
                                                    className="remove-btn"
                                                    onClick={() => removeFromCart(item.id)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="cart-footer">
                                    <div className="cart-total">
                                        <span>Total</span>
                                        <span className="total-amount">${getCartTotal().toFixed(2)}</span>
                                    </div>
                                    <Button variant="primary" className="checkout-btn" onClick={handleCheckout}>
                                        Proceed to Checkout
                                    </Button>
                                </div>
                            </>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartModal;
