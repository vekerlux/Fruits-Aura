import React, { useState, useEffect } from 'react';
import { Clock, RefreshCw, ChevronRight, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import Button from '../components/Button';
import PageTransition from '../components/PageTransition';
import { getUserOrders } from '../api/ordersApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import LoadingSkeleton from '../components/LoadingSkeleton';
import './OrderHistory.css';

const OrderHistory = () => {
    const [filter, setFilter] = useState('All');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const loadOrders = async () => {
            try {
                const response = await getUserOrders();
                setOrders(response.orders || []);
            } catch (error) {
                showToast('Failed to load order history', 'error');
                console.error('Error loading orders:', error);
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, [isAuthenticated, navigate, showToast]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'green';
            case 'processing': return 'orange';
            case 'pending': return 'blue';
            case 'cancelled': return 'red';
            default: return 'gray';
        }
    };

    if (loading) {
        return (
            <PageTransition>
                <div className="history-container">
                    <div className="history-header">
                        <h2>Order History</h2>
                    </div>
                    <LoadingSkeleton count={3} />
                </div>
            </PageTransition>
        );
    }

    return (
        <PageTransition>
            <div className="history-container">
                <div className="history-header">
                    <h2>Order History</h2>
                    <div className="filter-tabs">
                        {['All', 'Delivered', 'Cancelled'].map(tab => (
                            <button
                                key={tab}
                                className={`filter-tab ${filter === tab ? 'active' : ''}`}
                                onClick={() => setFilter(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="orders-list">
                    {orders.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                            <Clock size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                            <h3>No orders yet</h3>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                Your order history will appear here
                            </p>
                            <Button onClick={() => navigate('/menu')} style={{ marginTop: '1rem' }}>
                                Browse Menu
                            </Button>
                        </div>
                    ) : (
                        orders.map((order, index) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="order-card">
                                    <div className="order-header">
                                        <span className="order-date">{formatDate(order.createdAt)}</span>
                                        <span className={`status-badge ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="order-body">
                                        <div className="order-info">
                                            <h4>Order #{order._id.slice(-8)}</h4>
                                            <p>{order.items?.length || 0} items</p>
                                            <span className="order-total">${order.totalAmount?.toFixed(2)}</span>
                                        </div>
                                        <div className="order-actions">
                                            <Button variant="primary" className="reorder-btn">
                                                <RefreshCw size={16} /> Reorder
                                            </Button>
                                            <motion.button
                                                className="receipt-btn"
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <FileText size={18} />
                                            </motion.button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </PageTransition>
    );
};

export default OrderHistory;
