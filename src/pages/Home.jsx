import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Truck, MapPin, Clock, ChevronRight, ChevronLeft, Phone, Navigation, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import CartBadge from '../components/CartBadge';
import CartModal from '../components/CartModal';
import PageTransition from '../components/PageTransition';
import { useNavigate } from 'react-router-dom';
import * as voteApi from '../api/voteApi';
import * as notificationApi from '../api/notificationApi';
import client from '../api/client';
import { useToast } from '../context/ToastContext';
import './Home.css';

// Hardcoded items removed - now fetching from backend

const Home = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [direction, setDirection] = useState(0);

    // Voting State
    const [comingSoon, setComingSoon] = useState([]);
    const [userVote, setUserVote] = useState(null);
    const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
    const [selectedMix, setSelectedMix] = useState(null);
    const [voteComment, setVoteComment] = useState('');
    const [isVoting, setIsVoting] = useState(false);

    // Notification State
    const [unreadCount, setUnreadCount] = useState(0);

    // Dynamic Carousel State
    const [dynamicSlides, setDynamicSlides] = useState([]);
    const [isLoadingSlides, setIsLoadingSlides] = useState(true);

    const handleCall = () => {
        window.location.href = 'tel:+2349139110078';
    };

    const handleWhatsApp = () => {
        window.open('https://wa.me/message/LFA2LUMSBCYAL1', '_blank');
    };

    const handleLocation = () => {
        // Open Google Maps with shop coordinates (Abakaliki placeholder)
        window.open('https://www.google.com/maps/search/?api=1&query=Abakaliki,Ebonyi+State,Nigeria', '_blank');
    };

    const nextSlide = useCallback(() => {
        if (dynamicSlides.length <= 1) return;
        setDirection(1);
        setCurrentSlide((prev) => (prev + 1) % dynamicSlides.length);
    }, [dynamicSlides.length]);

    const prevSlide = useCallback(() => {
        if (dynamicSlides.length <= 1) return;
        setDirection(-1);
        setCurrentSlide((prev) => (prev - 1 + dynamicSlides.length) % dynamicSlides.length);
    }, [dynamicSlides.length]);

    useEffect(() => {
        if (currentSlide >= dynamicSlides.length && dynamicSlides.length > 0) {
            setCurrentSlide(0);
        }
    }, [currentSlide, dynamicSlides.length]);

    // ⚡ Bolt: Separate fetch from timer to prevent memory leaks and unnecessary re-renders.
    // Fetch data when the user authenticates
    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                setIsLoadingSlides(true);
                const slidesRes = await client.get('/admin/carousel');
                setDynamicSlides(slidesRes.data.slides || []);

                const mixesRes = await voteApi.getComingSoonMixes();
                setComingSoon(mixesRes.data?.products || []);

                if (user) {
                    const voteRes = await voteApi.getMyVote();
                    setUserVote(voteRes.data?.vote);

                    const notifyRes = await notificationApi.getNotifications();
                    setUnreadCount(notifyRes.data?.unreadCount || 0);
                }
            } catch (error) {
                console.error('Error fetching home data:', error);
            } finally {
                setIsLoadingSlides(false);
            }
        };
        fetchHomeData();
    }, [user]);

    // ⚡ Bolt: useEffect for carousel timer, depends only on slide changes.
    // This resolves the exhaustive-deps lint warning and is more efficient.
    useEffect(() => {
        if (dynamicSlides.length <= 1) return;

        const timer = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(timer);
    }, [dynamicSlides.length, nextSlide]);

    const handleVoteInitiate = (mix) => {
        if (userVote) return;
        setSelectedMix(mix);
        setIsVoteModalOpen(true);
    };

    const handleVoteConfirm = async () => {
        if (!selectedMix) return;
        setIsVoting(true);
        try {
            const res = await voteApi.submitVote({
                mixId: selectedMix._id,
                mixName: selectedMix.name,
                comment: voteComment
            });
            setUserVote(res.data.vote);
            showToast('Vote locked in! Refresh your Aura.', 'success');
            setIsVoteModalOpen(false);
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to record vote', 'error');
        } finally {
            setIsVoting(false);
        }
    };

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? -1000 : 1000,
            opacity: 0,
            rotateY: direction > 0 ? -45 : 45,
            scale: 0.8
        }),
        center: {
            x: 0,
            opacity: 1,
            rotateY: 0,
            scale: 1,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.4 },
                rotateY: { duration: 0.5 },
                scale: { duration: 0.5 }
            }
        },
        exit: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
            rotateY: direction > 0 ? 45 : -45,
            scale: 0.8,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.4 },
                rotateY: { duration: 0.5 },
                scale: { duration: 0.5 }
            }
        })
    };

    return (
        <PageTransition>
            <div className="home-container">
                {/* Header */}
                <header className="home-header">
                    <div className="brand-logo">
                        <img src="/images/fruits-aura-logo.png" alt="Fruits Aura" className="header-logo" />
                        <span className="brand-text">Fruits Aura</span>
                    </div>
                    <div className="header-actions">
                        <motion.button
                            className="notification-btn"
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigate('/notifications')}
                        >
                            <Bell size={24} />
                            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
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
                    <h1>Hi {user?.name?.split(' ')[0] || 'Guest'}! 🍊</h1>
                    <p>Ready to refresh your Aura?</p>
                </motion.div>

                {/* Hero Carousel */}
                <div className="hero-carousel-container">
                    <div className="carousel-wrapper">
                        <AnimatePresence initial={false} custom={direction}>
                            {!isLoadingSlides && dynamicSlides.length > 0 && dynamicSlides[currentSlide] ? (
                                <motion.div
                                    key={currentSlide}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.2 }
                                    }}
                                    className="hero-section"
                                    style={{ background: dynamicSlides[currentSlide].color || 'var(--color-primary-green)' }}
                                >
                                    <div className="hero-content">
                                        <h2>{dynamicSlides[currentSlide].title}</h2>
                                        <p>{dynamicSlides[currentSlide].description}</p>
                                        <Button className="hero-btn" onClick={() => navigate('/menu')}>
                                            Order Now
                                        </Button>
                                    </div>
                                    <div className="hero-image-placeholder">
                                        <div className="fruit-circle"></div>
                                        {dynamicSlides[currentSlide].image && (
                                            <img
                                                src={dynamicSlides[currentSlide].image}
                                                alt={dynamicSlides[currentSlide].title}
                                                style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute', top: 0, left: 0 }}
                                            />
                                        )}
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="hero-section loading-hero">
                                    <div className="hero-content">
                                        <h2>Refreshing...</h2>
                                    </div>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    {dynamicSlides.length > 1 && (
                        <>
                            <button className="carousel-control prev" onClick={prevSlide}>
                                <ChevronLeft size={24} />
                            </button>
                            <button className="carousel-control next" onClick={nextSlide}>
                                <ChevronRight size={24} />
                            </button>

                            <div className="carousel-dots">
                                {dynamicSlides.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`carousel-dot ${currentSlide === idx ? 'active' : ''}`}
                                        onClick={() => setCurrentSlide(idx)}
                                    />
                                ))}
                            </div>
                        </>
                    )}
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
                            <Card className="action-card" onClick={handleLocation}>
                                <div className="icon-wrapper orange">
                                    <MapPin size={24} />
                                </div>
                                <div className="action-text">
                                    <h4>Shop Location</h4>
                                    <p>Find us in Abakaliki</p>
                                </div>
                                <Navigation size={20} className="chevron" />
                            </Card>
                        </motion.div>

                        <motion.div whileTap={{ scale: 0.98 }}>
                            <Card className="action-card" onClick={handleCall}>
                                <div className="icon-wrapper yellow">
                                    <Phone size={24} />
                                </div>
                                <div className="action-text">
                                    <h4>Call Us Now</h4>
                                    <p>09139110078</p>
                                </div>
                                <ChevronRight size={20} className="chevron" />
                            </Card>
                        </motion.div>

                        <motion.div whileTap={{ scale: 0.98 }}>
                            <Card className="action-card" onClick={handleWhatsApp}>
                                <div className="icon-wrapper green">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" style={{ width: 24, height: 24 }} />
                                </div>
                                <div className="action-text">
                                    <h4>WhatsApp Us</h4>
                                    <p>Direct connect</p>
                                </div>
                                <ChevronRight size={20} className="chevron" />
                            </Card>
                        </motion.div>

                        <motion.div whileTap={{ scale: 0.98 }}>
                            <Card className="action-card" onClick={() => navigate('/history')}>
                                <div className="icon-wrapper blue">
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

                {/* Volt (Voting) Section */}
                <section className="volt-section">
                    <div className="section-header">
                        <h3>Volt for Next Mix</h3>
                        <p>Tell us what to launch next!</p>
                    </div>

                    <div className="volt-grid">
                        {comingSoon.map((mix) => {
                            const isSelected = userVote?.mixId === mix._id;
                            return (
                                <motion.div
                                    key={mix._id}
                                    whileTap={!userVote ? { scale: 0.98 } : {}}
                                    className={`volt-card ${isSelected ? 'selected' : ''} ${userVote ? 'disabled' : ''}`}
                                    onClick={() => handleVoteInitiate(mix)}
                                >
                                    <div className="volt-color" style={{ backgroundColor: mix.color }}></div>
                                    <div className="volt-info">
                                        <h4>{mix.name}</h4>
                                        <div className="volt-status">
                                            {isSelected ? (
                                                <span className="voted-badge">
                                                    <Clock size={14} /> Voted
                                                </span>
                                            ) : (
                                                <span className="vote-label">{mix.voteCount || 0} Volts</span>
                                            )}
                                        </div>
                                    </div>
                                    {isSelected && <div className="selected-lock">🔒</div>}
                                </motion.div>
                            );
                        })}
                    </div>

                    {userVote && (
                        <div className="user-vote-confirmation active">
                            <p>You voted for <strong>{userVote.mixName}</strong></p>
                            {userVote.comment && <p className="user-comment-preview">"{userVote.comment}"</p>}
                        </div>
                    )}
                </section>

                {/* Vote Confirmation Modal */}
                <AnimatePresence>
                    {isVoteModalOpen && (
                        <div className="modal-overlay">
                            <motion.div
                                className="vote-modal"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                            >
                                <h3>Confirm Your Volt</h3>
                                <p>Are you sure you want to vote for <strong>{selectedMix?.name}</strong>? This cannot be changed.</p>

                                <textarea
                                    placeholder="Why this mix? (Optional)"
                                    value={voteComment}
                                    onChange={(e) => setVoteComment(e.target.value)}
                                    maxLength={500}
                                />

                                <div className="modal-actions">
                                    <Button variant="outline" onClick={() => setIsVoteModalOpen(false)} disabled={isVoting}>
                                        Cancel
                                    </Button>
                                    <Button variant="primary" onClick={handleVoteConfirm} isLoading={isVoting}>
                                        Lock In Volt
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            </div>
        </PageTransition>
    );
};

export default Home;
