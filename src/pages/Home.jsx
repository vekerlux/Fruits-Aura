import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import PageTransition from '../components/PageTransition';
import { useNavigate } from 'react-router-dom';
import * as voteApi from '../api/voteApi';
import client from '../api/client';
import { useToast } from '../context/ToastContext';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState(0);

    // Voting State
    const [comingSoon, setComingSoon] = useState([]);
    const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
    const [selectedMix, setSelectedMix] = useState(null);
    const [voteComment, setVoteComment] = useState('');
    const [isVoting, setIsVoting] = useState(false);

    // Dynamic Carousel State
    const [dynamicSlides, setDynamicSlides] = useState([]);
    const [isLoadingSlides, setIsLoadingSlides] = useState(true);

    const handleWhatsApp = () => {
        window.open('https://wa.me/message/LFA2LUMSBCYAL1', '_blank');
    };

    const nextSlide = () => {
        if (dynamicSlides.length <= 1) return;
        setDirection(1);
        setCurrentSlide((prev) => (prev + 1) % dynamicSlides.length);
    };

    const prevSlide = () => {
        if (dynamicSlides.length <= 1) return;
        setDirection(-1);
        setCurrentSlide((prev) => (prev - 1 + dynamicSlides.length) % dynamicSlides.length);
    };

    useEffect(() => {
        if (currentSlide >= dynamicSlides.length && dynamicSlides.length > 0) {
            setCurrentSlide(0);
        }
    }, [dynamicSlides.length]);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                // Fetch dynamic slides
                const slidesRes = await client.get('/admin/carousel');
                const slides = slidesRes.data.slides || [];
                setDynamicSlides(slides);
                setIsLoadingSlides(false);

                const mixesRes = await voteApi.getComingSoonMixes();
                setComingSoon(mixesRes.data?.products || []);

            } catch (error) {
                console.error('Error fetching home data:', error);
                setIsLoadingSlides(false);
            }
        };

        fetchHomeData();

        const timer = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(timer);
    }, [dynamicSlides]);

    return (
        <PageTransition>
            <div className="home-container" style={{ paddingBottom: '90px' }}> {/* Padding for bottom nav */}

                {/* Welcome Section */}
                <div className="welcome-section">
                    <h1 className="welcome-title">Welcome back, {user?.name?.split(' ')[0] || 'Mis'}! 👋</h1>
                    <p className="welcome-subtitle">Refresh Your Aura</p>
                </div>

                {/* Hero Banner Carousel */}
                <div className="hero-banner-container">
                    {dynamicSlides.length > 0 ? (
                        <div className="hero-banner" style={{ background: dynamicSlides[currentSlide].color || 'linear-gradient(135deg, #ff6b35, #f7931e)' }}>
                            <div className="banner-content">
                                <h2 className="banner-title">{dynamicSlides[currentSlide].title || 'SUMMER'}</h2>
                                <h3 className="banner-heading">{dynamicSlides[currentSlide].description || 'ME AND YOU'}</h3>
                                <p className="banner-subtext">fresh all round</p>
                                <button className="explore-btn" onClick={() => navigate('/menu')}>EXPLORE MIXES</button>
                            </div>
                            {dynamicSlides[currentSlide].image && (
                                <img src={dynamicSlides[currentSlide].image} alt="Slide" className="banner-image" />
                            )}

                            {/* Navigation Buttons (Hover visible) */}
                            <button className="carousel-nav prev" onClick={(e) => { e.stopPropagation(); prevSlide(); }}>‹</button>
                            <button className="carousel-nav next" onClick={(e) => { e.stopPropagation(); nextSlide(); }}>›</button>
                        </div>
                    ) : (
                        // Fallback/Default Banner
                        <div className="hero-banner" style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}>
                            <div className="banner-content">
                                <h2 className="banner-title">SUMMER</h2>
                                <h3 className="banner-heading">ME AND YOU</h3>
                                <p className="banner-subtext">fresh all round</p>
                                <button className="explore-btn" onClick={() => navigate('/menu')}>EXPLORE MIXES</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Services Grid */}
                <div className="section-container">
                    <h3 className="section-title">Services</h3>
                    <div className="services-grid">
                        <ServiceCard icon="🚚" title="Track Order" subtitle="Live status" onClick={() => navigate('/track')} />
                        <ServiceCard icon="📍" title="Find Us" subtitle="Our locations" onClick={() => navigate('/locations')} />
                        <ServiceCard icon="💬" title="Chat Now" subtitle="WhatsApp help" onClick={handleWhatsApp} />
                        <ServiceCard icon="🕐" title="History" subtitle="Past orders" onClick={() => navigate('/history')} />
                    </div>
                </div>

                {/* Voting Section */}
                <div className="vote-section">
                    <div className="glass-card vote-card" onClick={() => setIsVoteModalOpen(true)}>
                        <div>
                            <h3 className="vote-title">Volt for Next Mix</h3>
                            <p className="vote-text">Your aura, your choice. Vote now.</p>
                        </div>
                        <div className="vote-icon">🗳️</div>
                    </div>
                </div>

                {/* Vote Modal */}
                <AnimatePresence>
                    {isVoteModalOpen && (
                        <motion.div
                            className="modal-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsVoteModalOpen(false)}
                        >
                            <motion.div
                                className="modal-content glass-modal"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={e => e.stopPropagation()}
                            >
                                <h2>Vote for Next Mix</h2>
                                <p>Which flavor should we launch next?</p>

                                <div className="vote-options">
                                    {comingSoon.map(mix => (
                                        <div
                                            key={mix._id}
                                            className={`vote-option ${selectedMix?._id === mix._id ? 'selected' : ''}`}
                                            onClick={() => setSelectedMix(mix)}
                                        >
                                            <span style={{ fontSize: '24px' }}>🥤</span>
                                            <div>
                                                <h4>{mix.name}</h4>
                                                <small>{mix.voteCount || 0} votes</small>
                                            </div>
                                        </div>
                                    ))}
                                    {comingSoon.length === 0 && <p>No mixes available for voting right now.</p>}
                                </div>

                                {selectedMix && (
                                    <textarea
                                        placeholder="Add a comment (optional)..."
                                        value={voteComment}
                                        onChange={e => setVoteComment(e.target.value)}
                                        className="vote-comment-box"
                                    />
                                )}

                                <div className="modal-actions">
                                    <Button variant="secondary" onClick={() => setIsVoteModalOpen(false)}>Cancel</Button>
                                    <Button
                                        variant="primary"
                                        disabled={!selectedMix || isVoting}
                                        onClick={async () => {
                                            setIsVoting(true);
                                            try {
                                                const res = await client.post('/votes', {
                                                    mixId: selectedMix._id,
                                                    mixName: selectedMix.name,
                                                    comment: voteComment
                                                });
                                                setUserVote(res.data.vote);
                                                showToast('Vote cast successfully!', 'success');
                                                setIsVoteModalOpen(false);
                                            } catch (err) {
                                                showToast(err.userMessage || 'Failed to cast vote', 'error');
                                            } finally {
                                                setIsVoting(false);
                                            }
                                        }}
                                    >
                                        {isVoting ? 'Voting...' : 'Confirm Vote'}
                                    </Button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </PageTransition>
    );
};

const ServiceCard = ({ icon, title, subtitle, onClick }) => (
    <motion.div
        className="glass-card service-card"
        onClick={onClick}
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.95 }}
    >
        <div className="service-icon">{icon}</div>
        <h4>{title}</h4>
        <p>{subtitle}</p>
    </motion.div>
);

export default Home;
