import React from 'react';
import { motion } from 'framer-motion';
import './Card.css';

const Card = ({ children, className = '', onClick, ...props }) => {
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

export default Card;
