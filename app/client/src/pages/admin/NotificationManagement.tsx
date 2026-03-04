import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

interface Notification {
    _id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
    isActive: boolean;
    createdAt: string;
}

const NotificationManagement = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        type: 'info',
        isActive: true
    });

    const fetchNotifications = async () => {
        try {
            const { data } = await api.get('/notifications/admin');
            setNotifications(data);
        } catch (error) {
            console.error('Error fetching notifications', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/notifications', formData);
            setShowAddForm(false);
            fetchNotifications();
            setFormData({ title: '', message: '', type: 'info', isActive: true });
        } catch (error) {
            alert('Error creating notification');
        }
    };

    const handleToggleActive = async (id: string, currentStatus: boolean) => {
        try {
            await api.put(`/notifications/${id}`, { isActive: !currentStatus });
            fetchNotifications();
        } catch (error) {
            alert('Error updating notification');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this notification?')) return;
        try {
            await api.delete(`/notifications/${id}`);
            fetchNotifications();
        } catch (error) {
            alert('Error deleting notification');
        }
    };

    return (
        <section className="space-y-6 pb-40">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-white flex items-center gap-3">
                    <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                    Notifications
                </h2>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-primary/20 text-primary border border-primary/30 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-all"
                >
                    <span className="material-symbols-outlined text-sm">{showAddForm ? 'close' : 'add'}</span>
                    {showAddForm ? 'Cancel' : 'New Alert'}
                </button>
            </div>

            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <form onSubmit={handleCreate} className="bento-card p-6 space-y-4 border border-primary/20 bg-primary/5">
                            <div className="space-y-1">
                                <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Title</label>
                                <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all" placeholder="e.g. Flash Sale Live!" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Message</label>
                                <textarea required value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all h-20" placeholder="Details of the announcement..." />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Type</label>
                                    <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as any })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all appearance-none">
                                        <option value="info">Info (Blue)</option>
                                        <option value="success">Success (Green)</option>
                                        <option value="warning">Warning (Orange)</option>
                                        <option value="error">Critical (Red)</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-3 pt-6">
                                    <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} className="w-5 h-5 accent-primary bg-white/10 border-white/20 rounded" />
                                    <span className="text-xs font-bold text-slate-300">Set Active</span>
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-primary text-white font-black py-4 rounded-xl shadow-lg shadow-primary/20 uppercase tracking-widest text-xs mt-4">Broadcast Notification</button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-3">
                {loading ? (
                    <div className="text-center py-10 opacity-50 uppercase tracking-widest text-[10px] font-black">Syncing Alerts...</div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-10 opacity-30 uppercase tracking-widest text-[10px] font-black">No Active Broadcasts</div>
                ) : (
                    notifications.map((notif) => (
                        <div key={notif._id} className={`bento-card p-5 border border-white/5 ${notif.isActive ? 'bg-white/[0.03]' : 'bg-black/40 opacity-50'}`}>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 flex-shrink-0 ${notif.type === 'success' ? 'text-green-500' :
                                        notif.type === 'warning' ? 'text-orange-500' :
                                            notif.type === 'error' ? 'text-red-500' : 'text-blue-500'
                                        }`}>
                                        <span className="material-symbols-outlined text-lg">
                                            {notif.type === 'success' ? 'check_circle' :
                                                notif.type === 'warning' ? 'warning' :
                                                    notif.type === 'error' ? 'error' : 'info'}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-xs text-white uppercase tracking-tight">{notif.title}</h4>
                                        <p className="text-[10px] text-slate-400 leading-relaxed max-w-[200px]">{notif.message}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <button
                                        onClick={() => handleToggleActive(notif._id, notif.isActive)}
                                        className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all ${notif.isActive ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                                            }`}
                                    >
                                        {notif.isActive ? 'Live' : 'Hidden'}
                                    </button>
                                    <button onClick={() => handleDelete(notif._id)} className="text-red-500/50 hover:text-red-500 transition-colors">
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default NotificationManagement;
