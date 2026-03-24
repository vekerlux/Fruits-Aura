import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Award, X, Users, Shield, Plus, Minus } from 'lucide-react';
import api from '../../api/client';

interface User {
    _id: string;
    name: string;
    email: string;
    loyaltyPoints?: number;
    role: string;
    plan?: string;
    createdAt: string;
}

const UserManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [adjustPoints, setAdjustPoints] = useState<string>('');
    const [adjustReason, setAdjustReason] = useState<string>('');
    const [adjustName, setAdjustName] = useState<string>('');
    const [adjustPlan, setAdjustPlan] = useState<string>('');
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

    const toggleRole = async (user: User) => {
        if (!window.confirm(`Are you sure you want to change ${user.name}'s role?`)) return;
        try {
            const newRole = user.role.toUpperCase() === 'ADMIN' ? 'CONSUMER' : 'ADMIN';
            await api.put(`/users/${user._id}/role`, { role: newRole });
            fetchUsers();
        } catch (error) {
            alert('Error updating role');
        }
    };

    const deleteUser = async (userId: string, name: string) => {
        if (!window.confirm(`Are you sure you want to delete ${name}? This cannot be undone.`)) return;
        try {
            await api.delete(`/users/${userId}`);
            fetchUsers();
        } catch (error) {
            alert('Error deleting user');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getTier = (points: number = 0, plan?: string) => {
        if (plan && plan !== 'Auraset Explorer') {
             if (plan === 'Gold') return { name: 'Gold', color: 'text-secondary bg-secondary/10 border-secondary/20' };
             if (plan === 'Silver') return { name: 'Silver', color: 'text-slate-300 bg-slate-300/10 border-slate-300/20' };
             if (plan === 'Platinum') return { name: 'Platinum', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' };
             if (plan === 'Diamond') return { name: 'Diamond', color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20' };
        }
        if (points >= 5000) return { name: 'Gold', color: 'text-secondary bg-secondary/10 border-secondary/20' };
        if (points >= 1000) return { name: 'Silver', color: 'text-slate-300 bg-slate-300/10 border-slate-300/20' };
        return { name: 'Bronze', color: 'text-orange-400 bg-orange-400/10 border-orange-400/20' };
    };

    const handlePointsUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        setIsSubmitting(true);
        try {
            await api.put(`/users/${selectedUser._id}/admin-update`, {
                name: adjustName,
                plan: adjustPlan,
                points: adjustPoints ? Number(adjustPoints) : undefined,
                reason: adjustReason
            });
            fetchUsers();
            setSelectedUser(null);
            setAdjustPoints('');
            setAdjustReason('');
            setAdjustName('');
            setAdjustPlan('');
            alert('User successfully updated!');
        } catch (error) {
            alert('Error updating user details');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="space-y-6 pb-40">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-xl font-black text-white flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                        <Users className="w-5 h-5 text-blue-500" />
                    </div>
                    User Directory
                    <span className="text-[10px] bg-white/5 text-slate-500 px-2 py-1 rounded-md font-bold uppercase tracking-tighter">
                        {filteredUsers.length} total
                    </span>
                </h2>
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search identities..."
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
                    <div className="text-center py-20 opacity-30 text-[10px] font-black uppercase tracking-widest border border-white/5 rounded-3xl">No users matching search</div>
                ) : (
                    filteredUsers.map((u) => {
                        const tier = getTier(u.loyaltyPoints, u.plan);
                        return (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={u._id} 
                                className="bento-card p-4 flex items-center justify-between group hover:border-primary/20 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-transparent border border-white/5 flex items-center justify-center font-black text-primary text-sm">
                                        {u.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-xs text-white flex items-center gap-2">
                                            {u.name}
                                            {u.role.toUpperCase() === 'ADMIN' && (
                                                <span className="flex items-center gap-1 text-[8px] bg-red-400/10 text-red-500 px-2 py-0.5 rounded-full uppercase border border-red-500/20 font-black tracking-tighter">
                                                    <Shield className="w-2.5 h-2.5" />
                                                    Admin
                                                </span>
                                            )}
                                        </h4>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest opacity-60">{u.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right hidden sm:block mr-2">
                                        <p className="text-[9px] text-slate-600 uppercase font-black tracking-widest mb-1.5 opacity-60">Loyalty Matrix</p>
                                        <div className="flex items-center gap-2 justify-end">
                                            <span className={`text-[8px] px-2 py-0.5 rounded-full border ${tier.color} font-black uppercase tracking-widest shadow-sm`}>{tier.name}</span>
                                            <span className="font-black text-xs text-primary">{u.loyaltyPoints || 0}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-1.5">
                                        <button
                                            onClick={() => toggleRole(u)}
                                            title={u.role.toUpperCase() === 'ADMIN' ? 'Demote to User' : 'Promote to Admin'}
                                            className={`w-9 h-9 flex items-center justify-center transition-all rounded-xl border ${u.role.toUpperCase() === 'ADMIN' ? 'text-blue-400 bg-blue-400/10 border-blue-400/20 hover:bg-blue-400/20' : 'text-slate-500 hover:text-blue-400 bg-white/5 border-white/5 hover:border-blue-400/20'}`}
                                        >
                                            <Shield className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedUser(u);
                                                setAdjustName(u.name);
                                                setAdjustPlan(u.plan || 'Auraset Explorer');
                                                setAdjustPoints('');
                                                setAdjustReason('');
                                            }}
                                            title="Adjust Details & Points"
                                            className="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-primary transition-all hover:bg-primary/5 rounded-xl border border-transparent hover:border-primary/20 bg-white/5 bg-opacity-50"
                                        >
                                            <Award className="w-4 h-4" />
                                        </button>
                                        {u.role.toUpperCase() !== 'ADMIN' && (
                                            <button
                                                onClick={() => deleteUser(u._id, u.name)}
                                                title="Delete User"
                                                className="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-red-500 transition-all hover:bg-red-500/10 rounded-xl border border-transparent hover:border-red-500/20 bg-white/5 bg-opacity-50"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
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
                            className="absolute inset-0 bg-background-dark/95 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bento-card p-8 w-full max-w-md relative z-10 border border-primary/20 shadow-2xl shadow-primary/10 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-2">
                                <button onClick={() => setSelectedUser(null)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mb-8">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 border border-primary/20">
                                    <Award className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="text-2xl font-black text-white leading-none">Identity Editor</h3>
                                <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black mt-2">Target Identity: {selectedUser.name}</p>
                            </div>

                            <form onSubmit={handlePointsUpdate} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] ml-1">Identity Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Full Name"
                                        value={adjustName}
                                        onChange={e => setAdjustName(e.target.value)}
                                        className="aura-input w-full font-black"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] ml-1">Aura Tier</label>
                                    <select
                                        value={adjustPlan}
                                        onChange={e => setAdjustPlan(e.target.value)}
                                        className="aura-input w-full font-black text-sm"
                                    >
                                        <option value="Auraset Explorer">Auraset Explorer</option>
                                        <option value="Bronze">Bronze</option>
                                        <option value="Silver">Silver</option>
                                        <option value="Gold">Gold</option>
                                        <option value="Platinum">Platinum</option>
                                        <option value="Diamond">Diamond</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] ml-1">Points Delta (Optional)</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="number"
                                            placeholder="± Score"
                                            value={adjustPoints}
                                            onChange={e => setAdjustPoints(e.target.value)}
                                            className="aura-input w-full text-center text-lg font-black"
                                        />
                                    </div>
                                    <div className="flex justify-center gap-2">
                                        <button type="button" onClick={() => setAdjustPoints('100')} className="px-3 py-1 bg-white/5 rounded-lg text-[8px] font-black uppercase text-slate-400 hover:bg-primary/20 hover:text-primary transition-all">+100</button>
                                        <button type="button" onClick={() => setAdjustPoints('500')} className="px-3 py-1 bg-white/5 rounded-lg text-[8px] font-black uppercase text-slate-400 hover:bg-primary/20 hover:text-primary transition-all">+500</button>
                                        <button type="button" onClick={() => setAdjustPoints('-100')} className="px-3 py-1 bg-white/5 rounded-lg text-[8px] font-black uppercase text-slate-400 hover:bg-red-500/20 hover:text-red-500 transition-all">-100</button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] ml-1">Sync Memo</label>
                                    <input
                                        required
                                        placeholder="Reason for adjustment..."
                                        value={adjustReason}
                                        onChange={e => setAdjustReason(e.target.value)}
                                        className="aura-input w-full"
                                    />
                                </div>
                                <button
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-primary to-orange-600 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] text-white shadow-2xl shadow-primary/20 mt-4 disabled:opacity-50 transition-all active:scale-95"
                                >
                                    {isSubmitting ? 'Syncing...' : 'Confirm Matrix Sync'}
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
