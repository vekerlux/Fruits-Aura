import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MapPin, MapPinPlus, X, Edit2, 
    Trash2, Clock, Phone, Navigation,
    Globe, ShieldCheck, Map
} from 'lucide-react';
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
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: 'Abakaliki',
        lat: '',
        lng: '',
        openingHours: 'Mon - Sun: 9AM - 9PM',
        phone: '',
        isActive: true
    });

    const fetchLocations = async () => {
        try {
            setLoading(true);
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

    const resetForm = () => {
        setFormData({ name: '', address: '', city: 'Abakaliki', lat: '', lng: '', openingHours: 'Mon - Sun: 9AM - 9PM', phone: '', isActive: true });
        setShowAddForm(false);
        setEditingId(null);
    };

    const handleEdit = (loc: Location) => {
        setFormData({
            name: loc.name,
            address: loc.address,
            city: loc.city,
            lat: loc.coordinates.lat.toString(),
            lng: loc.coordinates.lng.toString(),
            openingHours: loc.openingHours,
            phone: loc.phone || '',
            isActive: loc.isActive
        });
        setEditingId(loc._id);
        setShowAddForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                coordinates: { lat: Number(formData.lat), lng: Number(formData.lng) }
            };

            if (editingId) {
                await api.put(`/locations/${editingId}`, payload);
            } else {
                await api.post('/locations', payload);
            }

            resetForm();
            fetchLocations();
        } catch (error) {
            alert('Error saving location');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Decommission this portal location?')) return;
        try {
            await api.delete(`/locations/${id}`);
            fetchLocations();
        } catch (error) {
            alert('Error deleting location');
        }
    };

    return (
        <section className="space-y-6 pb-40">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-xl font-black text-white flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
                        <Map className="w-5 h-5 text-purple-500" />
                    </div>
                    Presence Matrix
                    <span className="text-[10px] bg-white/5 text-slate-500 px-2 py-1 rounded-md font-bold uppercase tracking-tighter">
                        {locations.length} active portals
                    </span>
                </h2>
                <button
                    onClick={() => {
                        if (showAddForm) resetForm();
                        else setShowAddForm(true);
                    }}
                    className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2 transition-all active:scale-95 ${showAddForm ? 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-red-500/5' : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 shadow-primary/5'}`}
                >
                    {showAddForm ? <X className="w-4 h-4" /> : <MapPinPlus className="w-4 h-4" />}
                    {showAddForm ? 'Abort Registration' : 'Register New Hub'}
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
                        <form onSubmit={handleSubmit} className="bento-card p-10 space-y-6 border border-primary/20 bg-primary/[0.02] backdrop-blur-3xl shadow-2xl shadow-primary/5">
                            <div className="flex items-center gap-2 mb-2">
                                <Navigation className="w-5 h-5 text-primary" />
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">
                                    {editingId ? 'Recalibrate Coordinates' : 'Initialize Location Data'}
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest ml-1">Portal Name</label>
                                    <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="aura-input" placeholder="e.g. Abakaliki Central Nexus" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest ml-1">Street Architecture</label>
                                    <input required value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="aura-input" placeholder="Detailed physical address..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest ml-1">Latitude</label>
                                    <input required type="number" step="any" value={formData.lat} onChange={e => setFormData({ ...formData, lat: e.target.value })} className="aura-input font-mono" placeholder="6.45..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest ml-1">Longitude</label>
                                    <input required type="number" step="any" value={formData.lng} onChange={e => setFormData({ ...formData, lng: e.target.value })} className="aura-input font-mono" placeholder="3.60..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest ml-1">Temporal Windows</label>
                                    <div className="relative">
                                        <input required value={formData.openingHours} onChange={e => setFormData({ ...formData, openingHours: e.target.value })} className="aura-input pl-10" />
                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest ml-1">Audio Line</label>
                                    <div className="relative">
                                        <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="aura-input pl-10" placeholder="+234..." />
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="pt-4 flex gap-4">
                                <button type="submit" className="flex-1 bg-gradient-to-r from-primary to-orange-600 text-white font-black py-4 rounded-xl shadow-2xl shadow-primary/20 uppercase tracking-[0.2em] text-[10px] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                                    {editingId ? <Edit2 className="w-4 h-4" /> : <MapPinPlus className="w-4 h-4" />}
                                    {editingId ? 'Commit Changes' : 'Formalize Registry'}
                                </button>
                                <button type="button" onClick={resetForm} className="px-8 border border-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-white hover:border-white/20 transition-all">Cancel</button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading ? (
                    <>
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-28 shimmer opacity-20 rounded-3xl" />
                        ))}
                    </>
                ) : locations.length === 0 ? (
                    <div className="col-span-full bento-card p-20 text-center border border-white/5 flex flex-col items-center justify-center opacity-30">
                        <MapPin className="w-10 h-10 mb-4 opacity-50" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">No physical anchors established</p>
                    </div>
                ) : (
                    locations.map((loc, i) => (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            key={loc._id} 
                            className={`bento-card p-6 border transition-all relative overflow-hidden group ${loc.isActive ? 'border-white/10 bg-white/[0.01]' : 'border-white/5 bg-black/40 opacity-40 grayscale'}`}
                        >
                            <div className="flex items-start justify-between relative z-10">
                                <div className="flex gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center relative overflow-hidden group/order shrink-0">
                                        <div className="absolute inset-0 bg-purple-500/5 blur-xl group-hover:bg-purple-500/10 transition-colors" />
                                        <MapPin className="w-6 h-6 text-purple-400 relative z-10" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-xs text-white uppercase tracking-[0.1em] flex items-center gap-2">
                                            {loc.name}
                                            {loc.isActive ? (
                                                <span className="flex items-center gap-1 text-[7px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full border border-green-500/20 font-black uppercase tracking-widest">
                                                    Live
                                                </span>
                                            ) : (
                                                <span className="text-[7px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full border border-red-500/20 uppercase">Deactivated</span>
                                            )}
                                        </h4>
                                        <p className="text-[10px] text-slate-500 leading-relaxed mt-1 font-medium max-w-[220px]">{loc.address}</p>
                                        <div className="flex items-center gap-3 mt-3">
                                            <div className="flex items-center gap-1.5 opacity-60">
                                                <Clock className="w-2.5 h-2.5 text-slate-400" />
                                                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">{loc.openingHours}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 opacity-60">
                                                <Phone className="w-2.5 h-2.5 text-slate-400" />
                                                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">{loc.phone || 'No Line'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2 shrink-0">
                                    <button 
                                        onClick={() => handleEdit(loc)} 
                                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary/5 text-primary/40 hover:text-primary hover:bg-primary/10 transition-all border border-transparent hover:border-primary/20"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(loc._id)} 
                                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-500/5 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
                                    >
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

export default LocationManagement;
