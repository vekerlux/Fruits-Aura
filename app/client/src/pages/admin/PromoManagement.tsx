import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
            const { data } = await api.get('/promos'); // Note: Need to add this route to backend
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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-black uppercase tracking-widest text-primary italic">Promotional Suite</h2>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsCreating(true)}
                    className="bg-primary text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-sm">add_circle</span>
                    New Code
                </motion.button>
            </div>

            <AnimatePresence>
                {isCreating && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bento-card p-6 border border-primary/30 space-y-4"
                    >
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Generate New Promo</h3>
                        <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 md:col-span-1 space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Code Name</label>
                                <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="e.g. AURA50" required className="aura-input" />
                            </div>
                            <div className="col-span-2 md:col-span-1 space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Discount Amount</label>
                                <input value={discountAmount} onChange={e => setDiscountAmount(e.target.value)} type="number" placeholder="500" required className="aura-input" />
                            </div>
                            <div className="col-span-2 md:col-span-1 space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Type</label>
                                <select value={discountType} onChange={e => setDiscountType(e.target.value)} className="aura-input bg-accent-dark">
                                    <option value="FIXED">Flat Naira (₦)</option>
                                    <option value="PERCENTAGE">Percentage (%)</option>
                                </select>
                            </div>
                            <div className="col-span-2 md:col-span-1 space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Expiry Date</label>
                                <input value={expiryDate} onChange={e => setExpiryDate(e.target.value)} type="date" required className="aura-input" />
                            </div>
                            <div className="col-span-2 flex gap-3 pt-2">
                                <button type="submit" className="flex-1 bg-primary text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest">Create Promo</button>
                                <button type="button" onClick={() => setIsCreating(false)} className="px-6 border border-white/10 rounded-xl font-black text-xs uppercase tracking-widest">Cancel</button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {loading ? (
                <div className="py-20 flex justify-center"><div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" /></div>
            ) : promos.length === 0 ? (
                <div className="bento-card p-12 text-center text-slate-500 italic border-dashed border-white/5 uppercase text-[10px] tracking-widest font-black">
                    No active campaigns
                </div>
            ) : (
                <div className="grid gap-3">
                    {promos.map(promo => (
                        <div key={promo._id} className="bento-card p-4 flex justify-between items-center bg-white/[0.02] border border-white/5">
                            <div>
                                <h4 className="font-black text-primary tracking-widest">{promo.code}</h4>
                                <p className="text-[10px] text-slate-500 uppercase font-bold">
                                    {promo.discountAmount}{promo.discountType === 'FIXED' ? ' ₦' : '%'} OFF • Exp: {new Date(promo.expiryDate).toLocaleDateString()}
                                </p>
                            </div>
                            <button className="text-red-400 p-2"><span className="material-symbols-outlined text-sm">delete</span></button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PromoManagement;
