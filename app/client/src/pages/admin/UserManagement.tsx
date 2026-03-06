import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/client';

interface User {
    _id: string;
    name: string;
    email: string;
    loyaltyPoints?: number;
    role: string;
    createdAt: string;
}

const UserManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [adjustPoints, setAdjustPoints] = useState<string>('');
    const [adjustReason, setAdjustReason] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/users');
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getTier = (points: number = 0) => {
        if (points >= 5000) return { name: 'Gold', color: 'text-secondary bg-secondary/10 border-secondary/20' };
        if (points >= 1000) return { name: 'Silver', color: 'text-slate-300 bg-slate-300/10 border-slate-300/20' };
        return { name: 'Bronze', color: 'text-orange-400 bg-orange-400/10 border-orange-400/20' };
    };

    const handlePointsUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser || !adjustPoints) return;

        setIsSubmitting(true);
        try {
            await api.put(`/users/${selectedUser._id}/points`, {
                points: Number(adjustPoints),
                reason: adjustReason
            });
            fetchUsers();
            setSelectedUser(null);
            setAdjustPoints('');
            setAdjustReason('');
        } catch (error) {
            alert('Error updating points');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="space-y-6 pb-40">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-xl font-black text-white flex items-center gap-3">
                    <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                    User Directory
                </h2>
                <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">search</span>
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="aura-input pl-12 w-full md:w-80"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-20 shimmer opacity-20 rounded-2xl"></div>
                        ))}
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-20 opacity-30 text-[10px] font-black uppercase tracking-widest">No users matching search</div>
                ) : (
                    filteredUsers.map((u) => {
                        const tier = getTier(u.loyaltyPoints);
                        return (
                            <div key={u._id} className="bento-card p-5 border border-white/5 bg-white/[0.02] flex items-center justify-between group hover:bg-white/[0.04] transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 flex items-center justify-center font-black text-primary">
                                        {u.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xs text-white flex items-center gap-2">
                                            {u.name}
                                            {u.role === 'admin' && <span className="text-[8px] bg-red-400/20 text-red-500 px-1.5 py-0.5 rounded uppercase border border-red-500/10">Admin</span>}
                                        </h4>
                                        <p className="text-[10px] text-slate-500 font-mono">{u.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest leading-none mb-1">Loyalty Points</p>
                                        <div className="flex items-center gap-2 justify-end">
                                            <span className={`text-[8px] px-1.5 py-0.5 rounded-full border ${tier.color} font-black uppercase`}>{tier.name}</span>
                                            <span className="font-black text-xs text-primary">{u.loyaltyPoints || 0}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedUser(u)}
                                        className="p-2 text-slate-600 hover:text-primary transition-colors hover:bg-primary/5 rounded-lg"
                                    >
                                        <span className="material-symbols-outlined text-lg">military_tech</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Loyalty Adjustment Modal */}
            <AnimatePresence>
                {selectedUser && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedUser(null)}
                            className="absolute inset-0 bg-background-dark/95 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bento-card p-6 w-full max-w-md relative z-10 border border-primary/20 shadow-2xl shadow-primary/10"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-lg font-black text-white">Reward Adjustment</h3>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">For: {selectedUser.name}</p>
                                </div>
                                <button onClick={() => setSelectedUser(null)} className="text-slate-500 hover:text-white"><span className="material-symbols-outlined">close</span></button>
                            </div>

                            <form onSubmit={handlePointsUpdate} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Points Change</label>
                                    <input
                                        required
                                        type="number"
                                        placeholder="e.g. 500 or -200"
                                        value={adjustPoints}
                                        onChange={e => setAdjustPoints(e.target.value)}
                                        className="aura-input w-full"
                                    />
                                    <p className="text-[8px] text-slate-600 font-medium">Use negative values to deduct points.</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Reason / Memo</label>
                                    <input
                                        required
                                        placeholder="Service recovery, bonus, etc."
                                        value={adjustReason}
                                        onChange={e => setAdjustReason(e.target.value)}
                                        className="aura-input w-full"
                                    />
                                </div>
                                <button
                                    disabled={isSubmitting}
                                    className="w-full btn-primary py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 mt-4 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Updating Aura Circle...' : 'Confirm Adjustment'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default UserManagement;
