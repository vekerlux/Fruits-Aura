import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Bell, X, Plus, CheckCircle2, AlertTriangle, 
    AlertOctagon, Info, Trash2, Send, 
    Zap, Radio
} from 'lucide-react';
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
        if (!window.confirm('Erase this broadcast from history?')) return;
        try {
            await api.delete(`/notifications/${id}`);
            fetchNotifications();
        } catch (error) {
            alert('Error deleting notification');
        }
    };

    return (
        <section className="space-y-6 pb-40">
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-black text-white flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                        <Radio className="w-5 h-5 text-blue-500" />
                    </div>
                    Broadcast Center
                    <span className="text-[10px] bg-white/5 text-slate-500 px-2 py-1 rounded-md font-bold uppercase tracking-tighter">
                        {notifications.filter(n => n.isActive).length} active
                    </span>
                </h2>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2 transition-all active:scale-95 ${showAddForm ? 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-red-500/5' : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 shadow-primary/5'}`}
                >
                    {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {showAddForm ? 'Abort Signal' : 'Initiate Broadcast'}
                </button>
            </div>

            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="overflow-hidden"
                    >
                        <form onSubmit={handleCreate} className="bento-card p-10 space-y-6 border border-primary/20 bg-primary/[0.02] backdrop-blur-3xl shadow-2xl shadow-primary/5">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-5 h-5 text-primary" />
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">New Aura Ping</h3>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest ml-1">Broadcast Title</label>
                                <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full aura-input" placeholder="e.g. Flash Frequency Shift" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest ml-1">Encoded Message</label>
                                <textarea required value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="w-full aura-input h-28 pt-4" placeholder="Transmission details..." />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest ml-1">Alert Hierarchy</label>
                                    <div className="relative">
                                        <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as any })} className="w-full aura-input appearance-none">
                                            <option value="info">Info (Azure)</option>
                                            <option value="success">Success (Emerald)</option>
                                            <option value="warning">Warning (Amber)</option>
                                            <option value="error">Critical (Ruby)</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                                            <Radio className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 py-4 px-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${formData.isActive ? 'bg-green-500/20 border-green-500/40' : 'bg-white/5 border-white/10'} border`}>
                                        <Radio className={`w-4 h-4 ${formData.isActive ? 'text-green-500' : 'text-slate-700'}`} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[9px] text-white font-black uppercase tracking-widest leading-none">Immediate Transmission</p>
                                    </div>
                                    <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} className="w-5 h-5 accent-primary rounded" />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-gradient-to-r from-primary to-orange-600 text-white font-black py-5 rounded-2xl shadow-2xl shadow-primary/20 uppercase tracking-[0.2em] text-[10px] mt-4 flex items-center justify-center gap-3 active:scale-[0.98] transition-all">
                                <Send className="w-4 h-4" />
                                Materialize Broadcast
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-4">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 shimmer opacity-20 rounded-3xl" />
                        ))}
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="bento-card p-20 text-center border border-white/5 flex flex-col items-center justify-center opacity-30">
                        <Radio className="w-10 h-10 mb-4 opacity-50" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Silence across the frequencies</p>
                    </div>
                ) : (
                    notifications.map((notif, i) => (
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={notif._id} 
                            className={`bento-card p-6 border transition-all relative overflow-hidden group ${notif.isActive ? 'border-white/10 bg-white/[0.03]' : 'border-white/5 bg-black/40 opacity-40 grayscale'}`}
                        >
                            <div className="flex items-start justify-between gap-6 relative z-10">
                                <div className="flex gap-5">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm flex-shrink-0 transition-colors ${notif.type === 'success' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                        notif.type === 'warning' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                            notif.type === 'error' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                        }`}>
                                        {notif.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> :
                                            notif.type === 'warning' ? <AlertTriangle className="w-5 h-5 animate-pulse" /> :
                                                notif.type === 'error' ? <AlertOctagon className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-black text-xs text-white uppercase tracking-[0.1em]">{notif.title}</h4>
                                        <p className="text-[11px] text-slate-400 leading-relaxed max-w-lg font-medium opacity-80">{notif.message}</p>
                                        <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">{new Date(notif.createdAt).toLocaleDateString()} Portal Stamp</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-4">
                                    <button
                                        onClick={() => handleToggleActive(notif._id, notif.isActive)}
                                        className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border transition-all shadow-sm ${notif.isActive ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20 hover:bg-slate-500/20'
                                            }`}
                                    >
                                        {notif.isActive ? 'Live Beam' : 'Offline'}
                                    </button>
                                    <button onClick={() => handleDelete(notif._id)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-500/5 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </section>
    );
};

export default NotificationManagement;
