import React from 'react';
import { motion } from 'framer-motion';
import './Button.css';

const Button = ({ children, variant = 'primary', onClick, className = '', ...props }) => {
  return (
    <motion.button
      className={`btn btn-${variant} ${className}`}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
