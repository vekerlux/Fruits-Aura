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
    const [userVote, setUserVote] = useState(null);

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
                setComingSoon(mixesRes.products || []);

                // Check if user has already voted
                if (user) {
                    const statusRes = await client.get('/votes/my-vote');
                    if (statusRes.data.vote) {
                        setUserVote(statusRes.data.vote);
                    }
                }

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
    }, []); // Run only once on mount

    return (
        <PageTransition>
            <div className="home-container" style={{ paddingBottom: '90px' }}> {/* Padding for bottom nav */}



                {/* Main Hero Card */}
                <div className="hero-banner-container">
                    <div className="hero-banner brand-hero-card">
                        <div className="hero-bottle-pattern"></div>
                        <div className="banner-content">
                            <h2 className="banner-title-primary">Fruits Aura x You</h2>
                            <h3 className="banner-subtitle-white">Explore mixes</h3>
                            <button
                                className="explore-btn-premium"
                                onClick={() => navigate('/menu')}
                            >
                                EXPLORE MIXES
                            </button>
                        </div>
                    </div>
                </div>

                {/* Services Grid (2x2 Responsive) */}
                <div className="section-container">
                    <h2 className="section-title">Our Services</h2>
                    <div className="services-grid-responsive">
                        <ServiceCard
                            icon="🚚"
                            title="Fast Delivery"
                            subtitle="Speedy & Safe"
                            onClick={() => navigate('/track')}
                        />
                        <ServiceCard
                            icon="📍"
                            title="Find Us"
                            subtitle="Nearby Locations"
                            onClick={() => navigate('/locations')}
                        />
                        <ServiceCard
                            icon="💬"
                            title="Live Chat"
                            subtitle="24/7 Support"
                            onClick={handleWhatsApp}
                        />
                        <ServiceCard
                            icon="🕐"
                            title="History"
                            subtitle="Quick Reorder"
                            onClick={() => navigate('/history')}
                        />
                    </div>
                </div>
                {/* Voting Section */}
                <div className="vote-section">
                    <div className="glass-card vote-card" onClick={() => setIsVoteModalOpen(true)}>
                        <div>
                            <h3 className="vote-title">Vote for Next Mix</h3>
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
                                <p>{userVote ? 'Your aura is locked in! Stay tuned for launch.' : 'Which flavor should we launch next?'}</p>

                                {userVote ? (
                                    <div className="already-voted-msg">
                                        <span className="voted-icon">✅</span>
                                        <h3>You voted for: {userVote.mixName}</h3>
                                        <p>Results will be announced soon. Thank you for being intentional about your health!</p>
                                        <Button variant="primary" fullWidth onClick={() => setIsVoteModalOpen(false)} style={{ marginTop: '20px' }}>
                                            Great!
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="vote-options">
                                            {comingSoon.map(mix => (
                                                <div
                                                    key={mix._id}
                                                    className={`vote-option ${selectedMix?._id === mix._id ? 'selected' : ''}`}
                                                    onClick={() => setSelectedMix(mix)}
                                                >
                                                    {mix.image ? (
                                                        <img src={mix.image} alt={mix.name} className="mix-thumb-small" />
                                                    ) : (
                                                        <span style={{ fontSize: '24px' }}>{
                                                            mix.name.toLowerCase().includes('watermelon') ? '🍉' :
                                                                mix.name.toLowerCase().includes('citrus') ? '🍊' :
                                                                    mix.name.toLowerCase().includes('avocado') ? '🥑' :
                                                                        mix.name.toLowerCase().includes('pineapple') ? '🍍' : '🍌'
                                                        }</span>
                                                    )}
                                                    <div>
                                                        <h4>{mix.name}</h4>
                                                        <small>{mix.voteCount || 0} votes</small>
                                                    </div>
                                                </div>
                                            ))}
                                            {comingSoon.length === 0 && <p>Preparing next batch of mixes...</p>}
                                        </div>

                                        {selectedMix && (
                                            <div className="mix-detail-card">
                                                <div className="mix-detail-header">
                                                    <div className="mix-thumb-large">
                                                        {selectedMix.image ? (
                                                            <img src={selectedMix.image} alt={selectedMix.name} />
                                                        ) : (
                                                            selectedMix.name.toLowerCase().includes('watermelon') ? '🍉' :
                                                                selectedMix.name.toLowerCase().includes('citrus') ? '🍊' :
                                                                    selectedMix.name.toLowerCase().includes('avocado') ? '🥑' :
                                                                        selectedMix.name.toLowerCase().includes('pineapple') ? '🍍' : '🍌'
                                                        )}
                                                    </div>
                                                    <div className="mix-info-text">
                                                        <h4>{selectedMix.name}</h4>
                                                        <span className="timing-badge">{selectedMix.optimalTiming}</span>
                                                    </div>
                                                </div>

                                                <div className="mix-feature-section">
                                                    <h5>Nutrients</h5>
                                                    <div className="nutrient-badges">
                                                        {selectedMix.nutrients?.map((n, i) => (
                                                            <span key={i} className="nutrient-tag">
                                                                {n.label}: <strong>{n.value}</strong>
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="mix-feature-section">
                                                    <h5>Key Benefits</h5>
                                                    <ul className="benefits-list">
                                                        {selectedMix.benefits?.slice(0, 3).map((b, i) => (
                                                            <li key={i}>{b}</li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="mix-feature-section">
                                                    <h5>Fitness Edge</h5>
                                                    <p className="app-text">{selectedMix.fitnessApplication}</p>
                                                </div>

                                                <textarea
                                                    placeholder="Why do you want this mix? (optional)"
                                                    value={voteComment}
                                                    onChange={e => setVoteComment(e.target.value)}
                                                    className="vote-comment-box"
                                                />
                                            </div>
                                        )}

                                        <div className="modal-actions" style={{ marginTop: '20px' }}>
                                            <Button variant="secondary" onClick={() => setIsVoteModalOpen(false)}>Cancel</Button>
                                            <Button
                                                variant="primary"
                                                disabled={!selectedMix || isVoting}
                                                onClick={async () => {
                                                    setIsVoting(true);
                                                    try {
                                                        const res = await voteApi.voteForMix(selectedMix._id, voteComment);
                                                        setUserVote({ mixName: selectedMix.name });
                                                        showToast('Vote cast successfully!', 'success');
                                                        // Refresh rankings locally
                                                        const refresh = await voteApi.getComingSoonMixes();
                                                        setComingSoon(refresh.products || []);
                                                    } catch (err) {
                                                        showToast(err.response?.data?.message || 'Failed to cast vote', 'error');
                                                    } finally {
                                                        setIsVoting(false);
                                                    }
                                                }}
                                            >
                                                {isVoting ? 'Voting...' : 'Confirm Vote'}
                                            </Button>
                                        </div>
                                    </>
                                )}
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
