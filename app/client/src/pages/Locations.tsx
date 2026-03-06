import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/client';

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

const Locations = () => {
    const navigate = useNavigate();
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [copyToast, setCopyToast] = useState<string | null>(null);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const { data } = await api.get('/locations');
                setLocations(data);
            } catch (error) {
                console.error('Error fetching locations', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLocations();
    }, []);

    const openDirections = (lat: number, lng: number) => {
        window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
    };

    const copyAddress = (address: string, id: string) => {
        navigator.clipboard.writeText(address);
        setCopyToast(id);
        setTimeout(() => setCopyToast(null), 2000);
    };

    return (
        <div className="bg-background-dark text-white min-h-screen pb-32">
            <header className="px-6 pt-14 pb-4 sticky top-0 z-50 bg-background-dark/90 backdrop-blur-lg border-b border-white/5">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full glass flex items-center justify-center active:scale-95 transition-transform">
                        <span className="material-symbols-outlined text-white">arrow_back_ios_new</span>
                    </button>
                    <div>
                        <h1 className="text-xl font-extrabold tracking-tight">Store Locations</h1>
                        <p className="text-[10px] text-primary uppercase tracking-widest font-bold">Find an Aura Spot</p>
                    </div>
                </div>
            </header>

            <main className="px-6 pt-6 flex flex-col gap-6">
                <AnimatePresence>
                    {copyToast && (
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-secondary text-black font-black text-[10px] px-4 py-2 rounded-full shadow-xl shadow-secondary/20 uppercase tracking-widest"
                        >
                            Address Copied!
                        </motion.div>
                    )}
                </AnimatePresence>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="h-48 shimmer rounded-bento opacity-20"></div>
                        ))}
                    </div>
                ) : locations.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                            <span className="material-symbols-outlined text-slate-500 text-3xl">location_off</span>
                        </div>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">No physical stores found currently.</p>
                    </div>
                ) : (
                    locations.map((loc, idx) => (
                        <motion.div
                            key={loc._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`${idx === 0 ? 'bento-card-orange' : 'bento-card'} p-5 relative overflow-hidden group`}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

                            <div className="space-y-4 relative z-10">
                                <div className="flex justify-between items-start">
                                    <div>
                                        {idx === 0 && <span className="bg-black/20 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded backdrop-blur-sm border border-white/20">Flagship</span>}
                                        <h2 className={`text-2xl font-black mt-1 ${idx === 0 ? 'text-white' : 'text-primary'}`}>{loc.name}</h2>
                                    </div>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${idx === 0 ? 'bg-white text-primary shadow-lg shadow-black/20' : 'bg-accent-dark text-slate-400 border border-white/5'}`}>
                                        #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-start gap-2">
                                        <span className={`material-symbols-outlined text-base mt-0.5 ${idx === 0 ? 'text-white/70' : 'text-primary'}`}>location_on</span>
                                        <p className={`text-sm leading-tight ${idx === 0 ? 'text-white font-medium' : 'text-slate-400'}`}>
                                            {loc.address}<br />{loc.city}
                                        </p>
                                    </div>
                                    {loc.phone && (
                                        <div className="flex items-center gap-2">
                                            <span className={`material-symbols-outlined text-base ${idx === 0 ? 'text-white/70' : 'text-primary'}`}>call</span>
                                            <p className={`text-sm font-bold font-mono ${idx === 0 ? 'text-white' : 'text-slate-300'}`}>{loc.phone}</p>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <span className={`material-symbols-outlined text-base ${idx === 0 ? 'text-white/70' : 'text-primary'}`}>schedule</span>
                                        <p className={`text-[10px] font-black uppercase tracking-widest ${idx === 0 ? 'text-white/80' : 'text-slate-500'}`}>{loc.openingHours}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <button
                                        onClick={() => openDirections(loc.coordinates.lat, loc.coordinates.lng)}
                                        className={`flex-1 font-black py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all ${idx === 0
                                                ? 'bg-white text-primary'
                                                : 'bg-accent-dark text-white border border-white/5 hover:border-primary/50'
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-lg">directions</span>
                                        Directions
                                    </button>
                                    <button
                                        onClick={() => copyAddress(loc.address, loc._id)}
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center border active:scale-95 transition-all ${idx === 0
                                                ? 'bg-white/20 backdrop-blur-sm border-white/30 text-white'
                                                : 'bg-accent-dark border-white/5 text-slate-400'
                                            }`}
                                    >
                                        <span className="material-symbols-outlined">{copyToast === loc._id ? 'check' : 'content_copy'}</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </main>
        </div>
    );
};

export default Locations;
