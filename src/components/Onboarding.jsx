import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import './Onboarding.css';

const slides = [
    {
        id: 1,
        title: "WATERMELON MIX",
        subtitle: "Pure natural refreshment",
        description: "100% Natural • No Added Sugar",
        icon: "🍉",
        color: "#FF6B6B", // Watermelon Red
        action: "ORDER NOW",
        link: "https://wa.me/message/LFA2LUMSBCYAL1?text=Hi%20Fruits%20Aura!%20I%20want%20to%20order%20the%20Watermelon%20Mix%20%F0%9F%8D%89",
        isPremium: true
    },
    {
        id: 2,
        title: "LOADING MIX – VOTE!",
        subtitle: "Strawberry • Orange • Cucumber",
        description: "Vote for your next flavor!",
        icon: "🔥",
        color: "#FF9800", // Orange
        action: "VOTE NOW",
        link: "https://wa.me/message/LFA2LUMSBCYAL1?text=I%20vote%20for%20the%20next%20Loading%20Mix!%20%F0%9F%94%A5",
        isPremium: true
    },
    {
        id: 3,
        title: "UPCOMING EVENT",
        subtitle: "Ebonyi's biggest refreshment experience",
        description: "Don't miss the aura wave.",
        icon: "🎉",
        color: "#9C27B0", // Purple
        action: "MORE INFO",
        link: "https://whatsapp.com/channel/0029VaN3xQQE50Uca92g0513", // Hypothetical Channel Link or fallback to main number
        isPremium: true
    }
];

const Onboarding = ({ onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { user } = useAuth();
    const userName = user?.name?.split(' ')[0] || "Friend";

    const nextSlide = () => {
        if (currentIndex < slides.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            onComplete();
        }
    };

    const handleAction = (link) => {
        window.open(link, '_blank');
    };

    return (
        <div className="onboarding-container premium-bg">
            <div className="progress-bar-container">
                <motion.div
                    className="progress-bar-fill"
                    initial={{ width: "0%" }}
                    animate={{ width: `${((currentIndex + 1) / slides.length) * 100}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />
            </div>

            <div className="skip-btn-container">
                <button className="skip-btn" onClick={onComplete}>Skip</button>
            </div>

            <motion.div
                className="welcome-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h1>Welcome {userName}!</h1>
                <p>Refresh Your Aura with Fruits Aura ✨</p>
            </motion.div>

            <div className="slides-wrapper premium">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentIndex}
                        className="slide premium-card"
                        initial={{ opacity: 0, x: 100, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -100, scale: 0.9 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            opacity: { duration: 0.2 }
                        }}
                        style={{ borderTop: `4px solid ${slides[currentIndex].color}` }}
                    >
                        <motion.div
                            className="premium-icon"
                            style={{ background: slides[currentIndex].color }}
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        >
                            {slides[currentIndex].icon}
                        </motion.div>
                        <h2 style={{ color: slides[currentIndex].color }}>{slides[currentIndex].title}</h2>
                        <h3 className="premium-subtitle">{slides[currentIndex].subtitle}</h3>
                        <p className="premium-desc">{slides[currentIndex].description}</p>

                        <Button
                            className="premium-action-btn"
                            style={{ backgroundColor: slides[currentIndex].color }}
                            onClick={() => handleAction(slides[currentIndex].link)}
                        >
                            {slides[currentIndex].action} <ExternalLink size={16} />
                        </Button>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="onboarding-footer">
                <div className="dots">
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            className={`dot ${index === currentIndex ? 'active' : ''}`}
                            style={{ backgroundColor: index === currentIndex ? slides[index].color : '#444' }}
                        />
                    ))}
                </div>
                <Button
                    variant="ghost"
                    className="next-btn-text"
                    onClick={nextSlide}
                >
                    {currentIndex === slides.length - 1 ? "Start Refreshing" : "Next"}
                    <ChevronRight size={20} />
                </Button>
            </div>
        </div>
    );
};

export default Onboarding;
