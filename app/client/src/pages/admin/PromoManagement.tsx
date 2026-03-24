import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Tag, Plus, Trash2, Calendar, 
    Percent, BadgePercent, Zap, X,
    Ticket, Sparkles
} from 'lucide-react';
import api from '../../api/client';

const PromoManagement = () => {
    const [promos, setPromos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // Form state
    const [code, setCode] = useState('');
    const [discountAmount, setDiscountAmount] = useState('');
    const [discountType, setDiscountType] = useState('FIXED');
    const [expiryDate, setExpiryDate] = useState('');
    const [maxUses, setMaxUses] = useState('100');

    const fetchPromos = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/promos');
            setPromos(data);
        } catch (error) {
            console.error('Error fetching promos', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPromos();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const promoData = {
                code,
                discountType,
                discountAmount: Number(discountAmount),
                expiryDate: new Date(expiryDate).toISOString(),
                maxUses: Number(maxUses)
            };
            await api.post('/promos', promoData);
            setIsCreating(false);
            // reset form
            setCode(''); setDiscountAmount(''); setExpiryDate('');
            fetchPromos();
        } catch (error) {
            alert('Error creating promo code');
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Deactivate this promotion?')) return;
        try {
            await api.delete(`/promos/${id}`);
            fetchPromos();
        } catch (error) {
            alert('Error deleting promo');
        }
    };

    return (
        <div className="space-y-6 pb-40">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-xl font-black text-white flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                        <Ticket className="w-5 h-5 text-primary" />
                    </div>
                    Campaign Vault
                    <span className="text-[10px] bg-white/5 text-slate-500 px-2 py-1 rounded-md font-bold uppercase tracking-tighter">
                        {promos.length} active seeds
                    </span>
                </h2>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsCreating(!isCreating)}
                    className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2 transition-all ${isCreating ? 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-red-500/5' : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 shadow-primary/5'}`}
                >
                    {isCreating ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {isCreating ? 'Abort Sequence' : 'Seed New Code'}
                </motion.button>
            </div>

            <AnimatePresence>
                {isCreating && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="overflow-hidden"
                    >
                        <form onSubmit={handleCreate} className="bento-card p-10 space-y-6 border border-primary/20 bg-primary/[0.02] backdrop-blur-3xl shadow-2xl shadow-primary/5">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-5 h-5 text-primary" />
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Generate Aura Frequency</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest ml-1">Universal Code</label>
                                    <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="e.g. AURA2024" required className="aura-input font-mono tracking-widest" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest ml-1">Discount Magnitude</label>
                                    <div className="relative">
                                        <input value={discountAmount} onChange={e => setDiscountAmount(e.target.value)} type="number" placeholder="500" required className="aura-input pl-10" />
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-black">
                                            {discountType === 'FIXED' ? '₦' : '%'}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest ml-1">Modifier Type</label>
                                    <select value={discountType} onChange={e => setDiscountType(e.target.value)} className="aura-input appearance-none">
                                        <option value="FIXED">Flat Currency (₦)</option>
                                        <option value="PERCENTAGE">Relative Percentage (%)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest ml-1">Expiration Temporal Point</label>
                                    <div className="relative">
                                        <input value={expiryDate} onChange={e => setExpiryDate(e.target.value)} type="date" required className="aura-input appearance-none" />
                                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="pt-4 flex gap-4">
                                <button type="submit" className="flex-1 bg-gradient-to-r from-primary to-orange-600 text-white font-black py-4 rounded-xl shadow-2xl shadow-primary/20 uppercase tracking-[0.2em] text-[10px] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                                    <Zap className="w-4 h-4" />
                                    Formalize Promotion
                                </button>
                                <button type="button" onClick={() => setIsCreating(false)} className="px-8 border border-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-white hover:border-white/20 transition-all">Cancel</button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 shimmer opacity-20 rounded-2xl" />
                    ))}
                </div>
            ) : promos.length === 0 ? (
                <div className="bento-card p-20 text-center border border-white/5 flex flex-col items-center justify-center opacity-30">
                    <BadgePercent className="w-10 h-10 mb-4 opacity-50" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">No active economic shifts</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {promos.map((promo, i) => (
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={promo._id} 
                            className="bento-card p-5 flex justify-between items-center bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] transition-all group overflow-hidden"
                        >
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-primary/10 blur-xl group-hover:bg-primary/20 transition-colors" />
                                    <Tag className="w-5 h-5 text-primary relative z-10" />
                                </div>
                                <div>
                                    <h4 className="font-black text-sm text-white tracking-[0.2em]">{promo.code}</h4>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        <p className="text-[10px] text-primary font-black uppercase tracking-tighter">
                                            {promo.discountAmount}{promo.discountType === 'FIXED' ? ' ₦' : '%'} Off Essence
                                        </p>
                                        <span className="w-1 h-1 rounded-full bg-slate-700" />
                                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                            <Calendar className="w-3 h-3" />
                                            Fades: {new Date(promo.expiryDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleDelete(promo._id)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl text-red-500/30 hover:text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PromoManagement;
