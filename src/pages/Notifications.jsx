import React, { useState, useEffect } from 'react';
import { Bell, ChevronLeft, CheckCircle2, Info, Tag, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as notificationApi from '../api/notificationApi';
import PageTransition from '../components/PageTransition';
import Button from '../components/Button';
import './Notifications.css';

const Notifications = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await notificationApi.getNotifications();
            setNotifications(res.data.notifications || []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await notificationApi.markAsRead(id);
            setNotifications(prev => prev.map(n =>
                n._id === id ? { ...n, isRead: true } : n
            ));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationApi.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'promo': return <Tag className="note-icon promo" size={20} />;
            case 'alert': return <CheckCircle2 className="note-icon alert" size={20} />;
            default: return <Info className="note-icon info" size={20} />;
        }
    };

    return (
        <PageTransition>
            <div className="notifications-page">
                <header className="page-header">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        <ChevronLeft size={24} />
                    </button>
                    <h1>Notifications</h1>
                    <button className="clear-all-btn" onClick={handleMarkAllAsRead}>
                        Mark All Read
                    </button>
                </header>

                <div className="notifications-list">
                    {isLoading ? (
                        <div className="loading-state">Refreshing Aura...</div>
                    ) : notifications.length > 0 ? (
                        <AnimatePresence>
                            {notifications.map((note) => (
                                <motion.div
                                    key={note._id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className={`notification-item ${note.isRead ? 'read' : 'unread'}`}
                                    onClick={() => !note.isRead && handleMarkAsRead(note._id)}
                                >
                                    <div className="note-header">
                                        {getIcon(note.type)}
                                        <div className="note-content">
                                            <h3>{note.title}</h3>
                                            <p>{note.message}</p>
                                            <span className="note-time">
                                                {new Date(note.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {!note.isRead && <div className="unread-indicator" />}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    ) : (
                        <div className="empty-state">
                            <Bell size={48} opacity={0.3} />
                            <p>All caught up!</p>
                            <span>No new notifications at the moment.</span>
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    );
};

export default Notifications;
