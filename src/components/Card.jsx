import React from 'react';
import { motion } from 'framer-motion';
import './Card.css';

// Using React.memo to prevent unnecessary re-renders of the card component
// if its props do not change. This is a performance optimization, especially
// when the component is used in a list.
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

Card.displayName = 'Card'; // Adding displayName for better debugging in React DevTools.

export default Card;
