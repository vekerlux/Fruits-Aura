import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { ChevronLeft, MapPin, Phone, Clock, Navigation2, Copy, Check, Sliders, Store, Map as MapIcon, Sparkles } from 'lucide-react';
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

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1]
        }
    }
};

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
        <div className="bg-background-dark text-white min-h-screen pb-32 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] -ml-24 -mb-24" />
            </div>

            <header className="px-6 pt-14 pb-5 sticky top-0 z-50 bg-background-dark/80 backdrop-blur-xl border-b border-white/[0.05]">
                <div className="flex items-center gap-5">
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(-1)} 
                        className="w-12 h-12 rounded-2xl glass flex items-center justify-center border border-white/10"
                    >
                        <ChevronLeft className="w-6 h-6 text-white" />
                    </motion.button>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight leading-tight">Store <span className="text-primary glow-text-orange">Locations</span></h1>
                        <p className="text-[10px] text-primary uppercase tracking-[0.2em] font-black">Find an Aura Spot</p>
                    </div>
                </div>
            </header>

            <main className="px-6 pt-8 flex flex-col gap-8 relative z-10">
                <AnimatePresence>
                    {copyToast && (
                        <motion.div
                            initial={{ y: -30, opacity: 0, scale: 0.9 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: -30, opacity: 0, scale: 0.9 }}
                            className="fixed top-28 left-1/2 -translate-x-1/2 z-[100] bg-secondary text-black font-black text-[10px] px-6 py-2.5 rounded-full shadow-2xl shadow-secondary/30 uppercase tracking-[0.2em] border border-white/20"
                        >
                            Address Copied to Aura Clipboard!
                        </motion.div>
                    )}
                </AnimatePresence>

                {loading ? (
                    <div className="space-y-6">
                        {[1, 2].map((i) => (
                            <div key={i} className="h-64 shimmer rounded-[3rem] opacity-20"></div>
                        ))}
                    </div>
                ) : locations.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20 bg-card-dark/30 rounded-[3.5rem] border border-dashed border-white/5"
                    >
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-inner">
                            <MapIcon className="w-10 h-10 text-slate-600" />
                        </div>
                        <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-xs">No physical stores identified.</p>
                        <p className="text-[10px] text-slate-600 mt-2 font-medium">Try our digital shop for home delivery</p>
                    </motion.div>
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-6"
                    >
                        {locations.map((loc, idx) => (
                            <motion.div
                                key={loc._id}
                                variants={cardVariants}
                                whileHover={{ y: -8 }}
                                className={`rounded-[3rem] p-7 pt-8 relative overflow-hidden group shadow-2xl ${
                                    idx === 0 
                                    ? 'bg-gradient-to-br from-primary/95 to-orange-600 shadow-primary/25 border-t border-white/20' 
                                    : 'liquid-glass border border-white/5 shadow-black/40'
                                }`}
                            >
                                {/* Decorative elements */}
                                <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16 ${
                                    idx === 0 ? 'bg-white/20' : 'bg-primary/5'
                                }`} />

                                <div className="space-y-6 relative z-10">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            {idx === 0 && (
                                                <motion.span 
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.3 }}
                                                    className="inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-md text-white text-[9px] font-black uppercase px-3 py-1 rounded-full border border-white/20 tracking-widest shadow-lg"
                                                >
                                                    <Sparkles className="w-3 h-3 text-secondary" />
                                                    Flagship Aura
                                                </motion.span>
                                            )}
                                            <h2 className={`text-3xl font-black tracking-tight ${idx === 0 ? 'text-white drop-shadow-md' : 'text-white'}`}>{loc.name}</h2>
                                        </div>
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm border ${
                                            idx === 0 
                                            ? 'bg-white/20 text-white border-white/30 shadow-lg backdrop-blur-sm' 
                                            : 'bg-white/5 text-slate-500 border-white/5'
                                        }`}>
                                            #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4">
                                            <div className={`p-2.5 rounded-xl ${idx === 0 ? 'bg-white/20' : 'bg-white/5'}`}>
                                                <MapPin className={`w-5 h-5 ${idx === 0 ? 'text-white' : 'text-primary'}`} />
                                            </div>
                                            <div>
                                                <p className={`text-sm leading-relaxed ${idx === 0 ? 'text-white/90 font-medium' : 'text-slate-400'}`}>
                                                    {loc.address}
                                                </p>
                                                <p className={`text-xs font-black uppercase tracking-widest mt-0.5 ${idx === 0 ? 'text-white' : 'text-slate-500'}`}>
                                                    {loc.city}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-4">
                                            {loc.phone && (
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${idx === 0 ? 'bg-white/10' : 'bg-white/5'}`}>
                                                        <Phone className={`w-4 h-4 ${idx === 0 ? 'text-white' : 'text-primary'}`} />
                                                    </div>
                                                    <p className={`text-sm font-black tracking-tight ${idx === 0 ? 'text-white' : 'text-slate-300'}`}>{loc.phone}</p>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${idx === 0 ? 'bg-white/10' : 'bg-white/5'}`}>
                                                    <Clock className={`w-4 h-4 ${idx === 0 ? 'text-white' : 'text-primary'}`} />
                                                </div>
                                                <p className={`text-[10px] font-black uppercase tracking-[0.15em] ${idx === 0 ? 'text-white/80' : 'text-slate-500'}`}>{loc.openingHours}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => openDirections(loc.coordinates.lat, loc.coordinates.lng)}
                                            className={`flex-1 font-black py-4 rounded-2xl flex items-center justify-center gap-2.5 shadow-xl transition-all border ${
                                                idx === 0
                                                ? 'bg-white text-primary border-transparent hover:bg-slate-50'
                                                : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary hover:text-white hover:border-transparent'
                                            }`}
                                        >
                                            <Navigation2 className="w-5 h-5" />
                                            Directions
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => copyAddress(loc.address, loc._id)}
                                            className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${
                                                idx === 0
                                                ? 'bg-white/20 backdrop-blur-sm border-white/40 text-white hover:bg-white/30'
                                                : 'bg-card-dark/50 border-white/5 text-slate-500 hover:text-white hover:border-white/20'
                                            }`}
                                        >
                                            {copyToast === loc._id ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default Locations;
