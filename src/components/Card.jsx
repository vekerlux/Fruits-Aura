import React from 'react';
import { motion } from 'framer-motion';
import './Card.css';

// The Card component is wrapped in React.memo to prevent unnecessary re-renders.
// This is a performance optimization for cases where the Card's props are unchanged,
// but the parent component re-renders.
const Card = React.memo(({ children, className = '', onClick, ...props }) => {
    return (
        <motion.div
            className={`card ${className}`}
            onClick={onClick}
            whileHover={{ y: -2, boxShadow: "0 6px 12px rgba(0,0,0,0.1)" }}
            transition={{ type: "spring", stiffness: 300 }}
            {...props}
        >
            {children}
        </motion.div>
    );
});

export default Card;
