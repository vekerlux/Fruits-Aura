import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/client';

interface Notification {
    _id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
}

const NotificationBanner = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);

    const fetchActiveNotifications = async () => {
        try {
            const { data } = await api.get('/notifications');
            const dismissed = JSON.parse(localStorage.getItem('dismissedNotifications') || '[]');
            setNotifications(data.filter((n: any) => n.isActive && !dismissed.includes(n._id)));
        } catch (error) {
            console.error('Error fetching banners', error);
        }
    };

    useEffect(() => {
        fetchActiveNotifications();
        const interval = setInterval(() => {
            fetchActiveNotifications();
        }, 60000); // Poll every minute
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (notifications.length > 0) {
            const cycle = setInterval(() => {
                setCurrentIdx(prev => (prev + 1) % notifications.length);
            }, 8000); // Cycle every 8 seconds

            // Auto-dismiss current notification after 10 seconds
            const autoDismiss = setTimeout(() => {
                const currentId = notifications[currentIdx]?._id;
                if (currentId) handleDismiss(currentId);
            }, 10000);

            return () => {
                clearInterval(cycle);
                clearTimeout(autoDismiss);
            };
        }
    }, [notifications, currentIdx]);

    const handleDismiss = (id: string) => {
        const dismissed = JSON.parse(localStorage.getItem('dismissedNotifications') || '[]');
        if (!dismissed.includes(id)) {
            dismissed.push(id);
            localStorage.setItem('dismissedNotifications', JSON.stringify(dismissed));
        }
        setNotifications(prev => prev.filter(n => n._id !== id));
        setCurrentIdx(0);
    };

    if (notifications.length === 0) return null;

    const current = notifications[currentIdx];

    const typeStyles = {
        info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        warning: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        success: 'bg-green-500/10 text-green-400 border-green-500/20',
        error: 'bg-red-500/10 text-red-500 border-red-500/20',
    };

    return (
        <div className="fixed top-24 left-0 right-0 z-[100] px-6 pointer-events-none">
            <AnimatePresence mode='wait'>
                <motion.div
                    key={current._id}
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.2 } }}
                    className={`max-w-md mx-auto bento-card p-4 border flex items-center gap-4 pointer-events-auto shadow-2xl backdrop-blur-xl ${typeStyles[current.type]}`}
                >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 flex-shrink-0 animate-pulse">
                        <span className="material-symbols-outlined text-sm">
                            {current.type === 'warning' ? 'warning' : 'campaign'}
                        </span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-[10px] font-black uppercase tracking-widest truncate">{current.title}</p>
                        <p className="text-[9px] font-medium opacity-80 leading-tight">{current.message}</p>
                    </div>
                    <button
                        onClick={() => handleDismiss(current._id)}
                        className="p-1 hover:bg-white/5 rounded-full transition-colors flex-shrink-0 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default NotificationBanner;
