import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import './CartBadge.css';

const CartBadge = ({ onClick }) => {
    const { getCartCount } = useCart();
    const count = getCartCount();

    return (
        <motion.button
            className="cart-badge-btn"
            onClick={onClick}
            whileTap={{ scale: 0.95 }}
        >
            <ShoppingCart size={24} />
            {count > 0 && (
                <motion.span
                    className="cart-badge-count"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    key={count}
                >
                    {count}
                </motion.span>
            )}
        </motion.button>
    );
};

export default CartBadge;
