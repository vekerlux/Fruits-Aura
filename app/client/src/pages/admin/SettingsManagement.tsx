import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

    return (
        <section className="space-y-6 pb-40">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-white flex items-center gap-3">
                    <span className="w-2 h-8 bg-slate-500 rounded-full"></span>
                    System Settings
                </h2>
            </div>

            <div className="space-y-8">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                    </div>
                ) : categories.map((cat) => (
                    <div key={cat} className="space-y-4">
                        <h3 className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] px-2">{cat}</h3>
                        <div className="space-y-3">
                            {settings.filter(s => s.category === cat).map((s) => (
                                <div key={s._id} className="bento-card p-5 border border-white/5 bg-white/[0.02] flex items-center justify-between gap-6 transition-all hover:border-white/10">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-xs text-white capitalize">{s.key.replace(/_/g, ' ')}</h4>
                                        <p className="text-[10px] text-slate-500 leading-tight mt-1">{s.description}</p>
                                    </div>
                                    <div className="flex-shrink-0 min-w-[120px]">
                                        {typeof s.value === 'boolean' ? (
                                            <button
                                                onClick={() => handleUpdate(s._id, !s.value)}
                                                className={`w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${s.value ? 'bg-primary/20 text-primary border-primary/30' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                                                    }`}
                                            >
                                                {s.value ? 'Enabled' : 'Disabled'}
                                            </button>
                                        ) : (
                                            <input
                                                type={typeof s.value === 'number' ? 'number' : 'text'}
                                                defaultValue={s.value}
                                                onBlur={(e) => handleUpdate(s._id, typeof s.value === 'number' ? Number(e.target.value) : e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-[10px] font-bold outline-none focus:border-primary transition-all text-center"
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="liquid-glass p-6 border border-white/5 bg-white/[0.01]">
                    <div className="flex gap-4">
                        <span className="material-symbols-outlined text-slate-500">terminal</span>
                        <div className="space-y-1">
                            <p className="font-black text-[10px] text-slate-400 uppercase tracking-widest">Internal Control</p>
                            <p className="text-[10px] text-slate-600 leading-relaxed italic">Changes here directly modify runtime variables. High impact settings require server-side cache invalidation to reflect instantly everywhere.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SettingsManagement;
