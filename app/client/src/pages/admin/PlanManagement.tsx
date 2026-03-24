import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Gem, Activity, ShieldCheck, TrendingUp, 
    Info, Save, RefreshCw, AlertCircle,
    BarChart3
} from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

interface Setting {
    _id: string;
    key: string;
    value: any;
    description: string;
    category: string;
}

const PlanManagement = () => {
    const { user } = useAuth();
    const [settings, setSettings] = useState<Setting[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/settings/admin');
            setSettings(data.filter((s: Setting) => s.category === 'plan' || s.key.includes('price')));
        } catch (error) {
            console.error('Error fetching plan settings', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleUpdate = async (id: string, value: any) => {
        try {
            await api.put(`/settings/${id}`, { value });
            fetchSettings();
        } catch (error) {
            alert('Error updating plan');
        }
    };

    return (
        <section className="space-y-6 pb-40">
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-black text-white flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
                        <Gem className="w-5 h-5 text-amber-500" />
                    </div>
                    Value Architecture
                    <span className="text-[10px] bg-white/5 text-slate-500 px-2 py-1 rounded-md font-bold uppercase tracking-tighter">
                        {settings.length} parameters
                    </span>
                </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-32 shimmer opacity-20 rounded-3xl" />
                        ))}
                    </div>
                ) : settings.length === 0 ? (
                    <div className="bento-card p-20 text-center border border-white/5 flex flex-col items-center justify-center opacity-30">
                        <AlertCircle className="w-10 h-10 mb-4 opacity-50" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Financial blueprints undetected</p>
                    </div>
                ) : (
                    settings.map((s, i) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={s._id} 
                            className="bento-card p-8 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all space-y-6 relative overflow-hidden group"
                        >
                            <div className="flex items-start justify-between relative z-10">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="w-3.5 h-3.5 text-primary opacity-50" />
                                        <h4 className="font-black text-sm text-white uppercase tracking-[0.1em]">{s.key.replace(/_/g, ' ')}</h4>
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-medium max-w-md leading-relaxed">{s.description}</p>
                                </div>
                                <div className="text-right">
                                    <span className="flex items-center gap-1.5 text-[8px] bg-green-500/10 text-green-500 px-3 py-1 rounded-full border border-green-500/20 font-black uppercase tracking-[0.2em] shadow-sm">
                                        <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                                        Operational
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
                                <div className="flex-1 w-full relative group/input">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-primary font-black text-xs group-focus-within/input:scale-110 transition-transform">₦</span>
                                    <input
                                        type="number"
                                        defaultValue={s.value}
                                        onBlur={(e) => handleUpdate(s._id, Number(e.target.value))}
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl pl-10 pr-6 py-4 text-sm font-black text-white focus:border-primary focus:bg-black/60 outline-none transition-all shadow-inner"
                                    />
                                </div>
                                <button 
                                    onClick={(e) => {
                                        const input = e.currentTarget.previousElementSibling?.querySelector('input');
                                        if (input) handleUpdate(s._id, Number(input.value));
                                    }}
                                    className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary hover:to-orange-600 text-primary hover:text-white border border-primary/20 hover:border-transparent rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/5"
                                >
                                    <Save className="w-4 h-4" />
                                    Sync Data
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}

                {/* Info Card */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bento-card p-8 border border-primary/10 bg-primary/[0.02] backdrop-blur-3xl"
                >
                    <div className="flex gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 flex-shrink-0">
                            <Info className="w-6 h-6 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <p className="font-black text-[10px] text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                <BarChart3 className="w-3 h-3" />
                                Strategic Protocol
                            </p>
                            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">Changes to Aura Plans affect all future subscriptions. Active Auraset bundles will retain their purchase-time pricing until their next renewal cycle for client consistency.</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default PlanManagement;
