import React from 'react';
import { motion } from 'framer-motion';
import './LoadingMix.css';

const LoadingMix = ({ message = "Mixing your aura..." }) => {
    return (
        <div className="loading-mix-container">
            <div className="blender-container">
                <motion.div
                    className="blender-body"
                    animate={{ rotate: [0, -2, 2, -2, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                >
                    <div className="liquid">
                        <motion.div
                            className="bubble b1"
                            animate={{ y: [-10, -30], opacity: [0, 1, 0] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                            className="bubble b2"
                            animate={{ y: [-5, -25], opacity: [0, 1, 0] }}
                            transition={{ duration: 1.2, repeat: Infinity, delay: 0.5 }}
                        />
                    </div>
                </motion.div>
                <motion.div
                    className="blender-blade"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.2, repeat: Infinity, ease: "linear" }}
                />
            </div>
            <motion.p
                className="loading-text"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
            >
                {message}
            </motion.p>
        </div>
    );
};

export default LoadingMix;
