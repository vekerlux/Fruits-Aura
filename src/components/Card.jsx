import React from 'react';
import { motion } from 'framer-motion';
import './Card.css';

const CardComponent = ({ children, className = '', onClick, ...props }) => {
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
};

// Memoize the Card component to prevent unnecessary re-renders.
// This is beneficial when Card is used in lists where parent components
// might re-render, but the Card's own props remain unchanged.
const Card = React.memo(CardComponent);

// Adding a display name for easier debugging in React DevTools
Card.displayName = 'Card';


export default Card;
