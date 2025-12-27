import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Button from './Button';
import './Onboarding.css';

const slides = [
    {
        id: 1,
        title: "Welcome to Fruits Aura",
        description: "Experience the freshest, 100% natural fruit drinks that refresh your body and soul.",
        icon: "🍊",
        color: "var(--color-primary-green)"
    },
    {
        id: 2,
        title: "Track Your Order Live",
        description: "Watch your drink travel from our kitchen to your doorstep in real-time.",
        icon: "🚚",
        color: "var(--color-vibrant-orange)"
    },
    {
        id: 3,
        title: "Find Us Nearby",
        description: "Locate the nearest Fruits Aura shop or kiosk for a quick refreshment.",
        icon: "📍",
        color: "var(--color-soft-yellow)"
    }
];

const Onboarding = ({ onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        if (currentIndex < slides.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            onComplete();
        }
    };

    return (
        <div className="onboarding-container">
            <div className="skip-btn-container">
                <button className="skip-btn" onClick={onComplete}>Skip</button>
            </div>

            <div className="slides-wrapper">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentIndex}
                        className="slide"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="slide-icon-wrapper" style={{ backgroundColor: slides[currentIndex].color }}>
                            <span className="slide-icon">{slides[currentIndex].icon}</span>
                        </div>
                        <h2>{slides[currentIndex].title}</h2>
                        <p>{slides[currentIndex].description}</p>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="onboarding-footer">
                <div className="dots">
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            className={`dot ${index === currentIndex ? 'active' : ''}`}
                        />
                    ))}
                </div>
                <Button
                    variant="primary"
                    className="next-btn"
                    onClick={nextSlide}
                >
                    {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
                    {currentIndex < slides.length - 1 && <ChevronRight size={20} />}
                </Button>
            </div>
        </div>
    );
};

export default Onboarding;
