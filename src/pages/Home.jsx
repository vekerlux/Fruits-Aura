import React, { useState, useEffect } from 'react';
import { Bell, Truck, MapPin, Clock, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/Card';
import Button from '../components/Button';
import CartBadge from '../components/CartBadge';
import CartModal from '../components/CartModal';
import PageTransition from '../components/PageTransition';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const carouselItems = [
    {
        id: 1,
        title: "New Summer Blends",
        subtitle: "Try our refreshing Citrus Burst!",
        color: "var(--gradient-hero)"
    },
    {
        id: 2,
        title: "Green Detox Special",
        subtitle: "Start your day with a healthy glow.",
        color: "linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)"
    },
    {
        id: 3,
        title: "Tropical Paradise",
        subtitle: "Escape with every sip.",
        color: "linear-gradient(135deg, #FF9800 0%, #FFC107 100%)"
    }
];

const Home = () => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <PageTransition>
            <div className="home-container">
                {/* Header */}
                <header className="home-header">
                    <div className="brand-logo">
                        <img src="/logo.png" alt="Fruits Aura" className="header-logo" />
                        <span className="brand-text">Fruits Aura</span>
                    </div>
                    <div className="header-actions">
                        <motion.button
                            className="notification-btn"
                            whileTap={{ scale: 0.9 }}
                        >
                            <Bell size={24} />
                            <span className="notification-badge"></span>
                        </motion.button>
                        <CartBadge onClick={() => setIsCartOpen(true)} />
                    </div>
                </header>

                {/* Greeting */}
                <motion.div
                    className="greeting-section"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1>Hi User! 🍊</h1>
                    <p>Ready to refresh your aura?</p>
                </motion.div>

                {/* Hero Carousel */}
                <div className="hero-carousel-container">
                    <AnimatePresence mode='wait'>
                        <motion.section
                            key={currentSlide}
                            className="hero-section"
                            style={{ background: carouselItems[currentSlide].color }}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="hero-content">
                                <motion.h2
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    {carouselItems[currentSlide].title}
                                </motion.h2>
                                <motion.p
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    {carouselItems[currentSlide].subtitle}
                                </motion.p>
                                <Button variant="primary" className="hero-btn" onClick={() => navigate('/menu')}>
                                    Order Now
                                </Button>
                            </div>
                            <div className="hero-image-placeholder">
                                <div className="fruit-circle"></div>
                            </div>
                        </motion.section>
                    </AnimatePresence>
                    <div className="carousel-dots">
                        {carouselItems.map((_, index) => (
                            <div
                                key={index}
                                className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <section className="quick-actions">
                    <h3>Quick Actions</h3>
                    <div className="action-grid">
                        <motion.div whileTap={{ scale: 0.98 }}>
                            <Card className="action-card" onClick={() => navigate('/track')}>
                                <div className="icon-wrapper green">
                                    <Truck size={24} />
                                </div>
                                <div className="action-text">
                                    <h4>Track Order</h4>
                                    <p>No active orders</p>
                                </div>
                                <ChevronRight size={20} className="chevron" />
                            </Card>
                        </motion.div>

                        <motion.div whileTap={{ scale: 0.98 }}>
                            <Card className="action-card" onClick={() => navigate('/locations')}>
                                <div className="icon-wrapper orange">
                                    <MapPin size={24} />
                                </div>
                                <div className="action-text">
                                    <h4>Find Nearby</h4>
                                    <p>Locate a shop</p>
                                </div>
                                <ChevronRight size={20} className="chevron" />
                            </Card>
                        </motion.div>

                        <motion.div whileTap={{ scale: 0.98 }}>
                            <Card className="action-card" onClick={() => navigate('/history')}>
                                <div className="icon-wrapper yellow">
                                    <Clock size={24} />
                                </div>
                                <div className="action-text">
                                    <h4>Order History</h4>
                                    <p>Reorder favorites</p>
                                </div>
                                <ChevronRight size={20} className="chevron" />
                            </Card>
                        </motion.div>
                    </div>
                </section>

                <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            </div>
        </PageTransition>
    );
};

export default Home;
