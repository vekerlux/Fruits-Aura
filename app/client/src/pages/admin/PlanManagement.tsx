import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-white flex items-center gap-3">
                    <span className="w-2 h-8 bg-amber-500 rounded-full"></span>
                    Aura Plans & Pricing
                </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="text-center py-20 opacity-20 uppercase tracking-[0.3em] font-black text-xs">Accessing Pricing Vault...</div>
                ) : settings.length === 0 ? (
                    <div className="bento-card p-10 text-center border border-white/5 bg-white/[0.01]">
                        <span className="material-symbols-outlined text-slate-700 text-4xl mb-4">settings_heart</span>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">No individual plan settings found.</p>
                        <p className="text-[10px] text-slate-600 mt-2">Initialize default settings in the database to manage plans here.</p>
                    </div>
                ) : (
                    settings.map((s) => (
                        <div key={s._id} className="bento-card p-6 border border-white/5 bg-white/[0.03] space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h4 className="font-black text-sm text-white uppercase tracking-tight">{s.key.replace(/_/g, ' ')}</h4>
                                    <p className="text-[10px] text-slate-500">{s.description}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-1 rounded-full border border-amber-500/20 font-black uppercase tracking-widest">Live</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex-1 relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-black text-xs">₦</span>
                                    <input
                                        type="number"
                                        defaultValue={s.value}
                                        onBlur={(e) => handleUpdate(s._id, Number(e.target.value))}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-sm font-black focus:border-primary outline-none transition-all"
                                    />
                                </div>
                                <button className="btn-primary px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">Update</button>
                            </div>
                        </div>
                    ))
                )}

                {/* Info Card */}
                <div className="bento-card-orange p-6 border border-primary/20 bg-primary/5">
                    <div className="flex gap-4">
                        <span className="material-symbols-outlined text-primary">info</span>
                        <div className="space-y-1">
                            <p className="font-black text-[10px] text-primary uppercase tracking-widest">Business Tip</p>
                            <p className="text-xs text-slate-400 leading-relaxed">Changes to Aura Plans affect all future subscriptions. Active Auraset bundles will retain their purchase-time pricing until their next renewal cycle.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PlanManagement;
