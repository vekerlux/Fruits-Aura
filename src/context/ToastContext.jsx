import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, AlertCircle, Info } from 'lucide-react';
import './Toast.css';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 3000);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="toast-container">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

const Toast = ({ toast, onClose }) => {
    const icons = {
        success: <CheckCircle size={20} />,
        error: <AlertCircle size={20} />,
        info: <Info size={20} />
    };

    return (
        <motion.div
            className={`toast toast-${toast.type}`}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
            <div className="toast-icon">{icons[toast.type]}</div>
            <span className="toast-message">{toast.message}</span>
            <button className="toast-close" onClick={onClose}>
                <X size={16} />
            </button>
        </motion.div>
    );
};
