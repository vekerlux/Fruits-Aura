import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

interface Location {
    _id: string;
    name: string;
    address: string;
    city: string;
    coordinates: { lat: number; lng: number };
    openingHours: string;
    phone: string;
    isActive: boolean;
}

const LocationManagement = () => {
    const { user } = useAuth();
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: 'Lagos',
        lat: '',
        lng: '',
        openingHours: 'Mon - Sun: 9AM - 9PM',
        phone: '',
        isActive: true
    });

    const fetchLocations = async () => {
        try {
            const { data } = await api.get('/locations/admin');
            setLocations(data);
        } catch (error) {
            console.error('Error fetching locations', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                coordinates: { lat: Number(formData.lat), lng: Number(formData.lng) }
            };
            await api.post('/locations', payload);
            setShowAddForm(false);
            fetchLocations();
            setFormData({ name: '', address: '', city: 'Lagos', lat: '', lng: '', openingHours: 'Mon - Sun: 9AM - 9PM', phone: '', isActive: true });
        } catch (error) {
            alert('Error creating location');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Remove this store location?')) return;
        try {
            await api.delete(`/locations/${id}`);
            fetchLocations();
        } catch (error) {
            alert('Error deleting location');
        }
    };

    return (
        <section className="space-y-6 pb-40">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-white flex items-center gap-3">
                    <span className="w-2 h-8 bg-purple-500 rounded-full"></span>
                    Store Locations
                </h2>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-primary/20 text-primary border border-primary/30 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-all"
                >
                    <span className="material-symbols-outlined text-sm">{showAddForm ? 'close' : 'add_location'}</span>
                    {showAddForm ? 'Cancel' : 'Add Store'}
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
                                <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Store Name</label>
                                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full aura-input" placeholder="e.g. Lekki Phase 1 Outlet" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Address</label>
                                <input required value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full aura-input" placeholder="Detailed street address..." />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Lat</label>
                                    <input required type="number" step="any" value={formData.lat} onChange={e => setFormData({ ...formData, lat: e.target.value })} className="w-full aura-input" placeholder="6.45..." />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Lng</label>
                                    <input required type="number" step="any" value={formData.lng} onChange={e => setFormData({ ...formData, lng: e.target.value })} className="w-full aura-input" placeholder="3.60..." />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Hours</label>
                                <input required value={formData.openingHours} onChange={e => setFormData({ ...formData, openingHours: e.target.value })} className="w-full aura-input" />
                            </div>
                            <button type="submit" className="w-full btn-primary py-4 rounded-xl font-black uppercase tracking-widest text-[10px] mt-4 shadow-xl shadow-primary/20">Register Location</button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-3">
                {loading ? (
                    <div className="text-center py-10 shimmer opacity-20 h-32 rounded-3xl"></div>
                ) : locations.length === 0 ? (
                    <div className="text-center py-10 opacity-30 text-[10px] font-black uppercase tracking-widest">No Registered Outlets</div>
                ) : (
                    locations.map((loc) => (
                        <div key={loc._id} className="bento-card p-5 border border-white/5 bg-white/[0.02] flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-purple-400">pin_drop</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-xs text-white">{loc.name}</h4>
                                    <p className="text-[10px] text-slate-500 leading-tight max-w-[180px]">{loc.address}</p>
                                </div>
                            </div>
                            <button onClick={() => handleDelete(loc._id)} className="text-slate-600 hover:text-red-500 transition-colors">
                                <span className="material-symbols-outlined text-xl">delete</span>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default LocationManagement;
