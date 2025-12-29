import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import './Splash.css';

const Splash = ({ onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="splash-container">
            <motion.div
                className="logo-wrapper"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "backOut" }}
            >
                <div className="splash-logo">
                    <img src="/images/fruits-aura-logo.png" alt="Fruits Aura Logo" className="logo-image" />
                </div>
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    Fruits Aura
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                >
                    Refresh your Aura
                </motion.p>
            </motion.div>
        </div>
    );
};

export default Splash;
