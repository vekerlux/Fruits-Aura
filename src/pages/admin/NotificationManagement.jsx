import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useToast } from '../../context/ToastContext';
import client from '../../api/client';
import { motion } from 'framer-motion';

const NotificationManagement = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [form, setForm] = useState({ title: '', message: '', type: 'promo' });
    const { showToast } = useToast();

    const fetchNotifications = async () => {
        try {
            const { data } = await client.get('/admin/notifications');
            if (data.success) {
                setNotifications(data.data.notifications);
            }
        } catch (error) {
            showToast('Failed to load notifications', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await client.post('/admin/notifications', form);
            showToast('Notification created', 'success');
            setIsAdding(false);
            setForm({ title: '', message: '', type: 'promo' });
            fetchNotifications();
        } catch (error) {
            showToast('Failed to create notification', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await client.delete(`/admin/notifications/${id}`);
            showToast('Notification deleted', 'success');
            fetchNotifications();
        } catch (error) {
            showToast('Failed to delete', 'error');
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div>
                    <h2>Notification Management</h2>
                    <p>Create and manage promotional alerts</p>
                </div>
                <Button onClick={() => setIsAdding(!isAdding)}>
                    {isAdding ? 'Cancel' : <><Plus size={18} /> New Notification</>}
                </Button>
            </div>

            {isAdding && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="notification-form-card">
                        <h3>Create New Alert</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={e => setForm({ ...form, title: e.target.value })}
                                    required
                                    placeholder="e.g., Weekend Flash Sale!"
                                />
                            </div>
                            <div className="form-group">
                                <label>Message</label>
                                <textarea
                                    value={form.message}
                                    onChange={e => setForm({ ...form, message: e.target.value })}
                                    required
                                    placeholder="Enter your promotional message here..."
                                />
                            </div>
                            <div className="form-group">
                                <label>Type</label>
                                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                                    <option value="promo">Promotional</option>
                                    <option value="alert">System Alert</option>
                                    <option value="info">Information</option>
                                </select>
                            </div>
                            <Button type="submit" variant="primary">Broadcast Notification</Button>
                        </form>
                    </Card>
                </motion.div>
            )}

            <div className="notifications-list">
                {notifications.map(note => (
                    <Card key={note._id} className="notification-item">
                        <div className="note-icon">
                            <Bell size={24} color={note.type === 'alert' ? '#ef4444' : '#00A676'} />
                        </div>
                        <div className="note-content">
                            <h4>{note.title} <span className={`badge ${note.type}`}>{note.type}</span></h4>
                            <p>{note.message}</p>
                            <span className="note-date">{new Date(note.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="note-actions">
                            <button className="icon-btn delete" onClick={() => handleDelete(note._id)}>
                                <Trash size={18} />
                            </button>
                        </div>
                    </Card>
                ))}
                {notifications.length === 0 && !loading && (
                    <p className="empty-state">No active notifications</p>
                )}
            </div>
        </div>
    );
};

export default NotificationManagement;
