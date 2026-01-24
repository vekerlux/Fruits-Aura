import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const { cart } = useCart();

    return (
        <header className="glass-header">
            <div className="header-logo-section">
                <img src="/images/fruits-aura-logo.png" alt="Fruits Aura" className="header-brand-logo" />
                <h1 className="brand-name">Fruits Aura</h1>
            </div>

            <div className="header-actions">
                <button className="icon-btn notification-btn">
                    <span className="emoji-icon">🔔</span>
                    <span className="badge">1</span>
                </button>
                <button
                    className="icon-btn cart-btn"
                    onClick={() => navigate('/checkout')}
                >
                    <span className="emoji-icon">🛒</span>
                    {cart.length > 0 && (
                        <span className="badge">{cart.length}</span>
                    )}
                </button>
            </div>
        </header>
    );
};

export default Header;
