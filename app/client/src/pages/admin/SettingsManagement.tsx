import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Settings, Sliders, Shield, CreditCard, 
    ToggleLeft, ToggleRight, Check, AlertCircle,
    Terminal, Lock, Eye, Cpu, RotateCcw
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

const SettingsManagement = () => {
    const { user } = useAuth();
    const [settings, setSettings] = useState<Setting[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/settings/admin');
            setSettings(data.filter((s: Setting) => s.category !== 'plan'));
        } catch (error) {
            console.error('Error fetching settings', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleUpdate = async (id: string, value: any) => {
        setSaving(id);
        try {
            await api.put(`/settings/${id}`, { value });
            fetchSettings();
        } catch (error) {
            alert('Error updating setting');
        } finally {
            setSaving(null);
        }
    };

    const categories = ['general', 'ui', 'payment'];

    const getCategoryIcon = (cat: string) => {
        switch(cat) {
            case 'general': return <Settings className="w-3 h-3" />;
            case 'ui': return <Eye className="w-3 h-3" />;
            case 'payment': return <CreditCard className="w-3 h-3" />;
            default: return <Sliders className="w-3 h-3" />;
        }
    };

    return (
        <section className="space-y-8 pb-40">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-xl font-black text-white flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-500/10 rounded-xl flex items-center justify-center border border-slate-500/20">
                        <Cpu className="w-5 h-5 text-slate-500" />
                    </div>
                    System Architecture
                </h2>
                <button 
                    onClick={fetchSettings}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 active:rotate-180 transition-all"
                >
                    <RotateCcw className="w-4 h-4 text-slate-500" />
                </button>
            </div>

            <div className="space-y-12">
                {loading ? (
                    <div className="space-y-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="space-y-4">
                                <div className="h-4 w-20 bg-white/5 rounded-md shimmer" />
                                <div className="space-y-3">
                                    {[1, 2].map(j => (
                                        <div key={j} className="h-20 bg-white/[0.02] rounded-2xl shimmer" />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : categories.map((cat) => (
                    <div key={cat} className="space-y-5">
                        <div className="flex items-center gap-3 px-2">
                            <div className="text-slate-600">
                                {getCategoryIcon(cat)}
                            </div>
                            <h3 className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">{cat}</h3>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {settings.filter(s => s.category === cat).map((s) => (
                                <motion.div 
                                    layout
                                    key={s._id} 
                                    className="bento-card p-6 border border-white/5 bg-white/[0.01] flex items-center justify-between gap-8 transition-all hover:border-white/10 group"
                                >
                                    <div className="flex-1 space-y-1.5">
                                        <h4 className="font-black text-[11px] text-white uppercase tracking-wider flex items-center gap-2">
                                            {s.key.replace(/_/g, ' ')}
                                            {saving === s._id && <div className="w-1 h-1 bg-primary rounded-full animate-ping" />}
                                        </h4>
                                        <p className="text-[10px] text-slate-500 leading-relaxed font-medium line-clamp-2">{s.description}</p>
                                    </div>
                                    <div className="flex-shrink-0 min-w-[140px]">
                                        {typeof s.value === 'boolean' ? (
                                            <button
                                                onClick={() => handleUpdate(s._id, !s.value)}
                                                className={`w-full py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-2.5 active:scale-95 ${s.value 
                                                    ? 'bg-primary/20 text-primary border-primary/30 shadow-lg shadow-primary/5' 
                                                    : 'bg-black/40 text-slate-500 border-white/5'
                                                }`}
                                            >
                                                {s.value ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                                                {s.value ? 'Online' : 'Offline'}
                                            </button>
                                        ) : (
                                            <div className="relative group/input">
                                                <input
                                                    type={typeof s.value === 'number' ? 'number' : 'text'}
                                                    defaultValue={s.value}
                                                    onBlur={(e) => handleUpdate(s._id, typeof s.value === 'number' ? Number(e.target.value) : e.target.value)}
                                                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-3 text-[11px] font-black outline-none focus:border-primary/50 transition-all text-center group-hover:bg-black/60 font-mono tracking-tighter"
                                                />
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-focus-within/input:opacity-100 transition-opacity">
                                                    <Check className="w-3 h-3 text-primary" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="liquid-glass p-8 border border-white/5 bg-white/[0.01] relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Lock className="w-20 h-20 text-white" />
                    </div>
                    <div className="flex gap-6 relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 flex-shrink-0">
                            <Terminal className="w-7 h-7 text-slate-500" />
                        </div>
                        <div className="space-y-2">
                            <p className="font-black text-[10px] text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2">
                                <Shield className="w-3.5 h-3.5" />
                                Core Directives
                            </p>
                            <p className="text-[11px] text-slate-600 leading-relaxed font-medium italic">
                                Modifying these parameters affects low-level runtime execution. High-volatility changes require environment resynchronization to propagate across all peripheral nodes.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default SettingsManagement;
