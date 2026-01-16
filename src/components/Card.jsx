import React from 'react';
import { motion } from 'framer-motion';
import './Card.css';

// ⚡ Bolt: Memoized Card component to prevent unnecessary re-renders.
// This is a common performance optimization for components that are rendered in lists
// or are children of components that re-render frequently. By memoizing the component,
// we ensure it only re-renders when its props have actually changed.
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

Card.displayName = 'Card';

export default Card;
