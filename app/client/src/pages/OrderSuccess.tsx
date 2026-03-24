import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import api from '../api/client';
import { 
    CheckCircle2, 
    Package, 
    Clock, 
    ArrowRight, 
    Share2, 
    Home, 
    History,
    Sparkles,
    ShieldCheck,
    Zap,
    MapPin,
    Smartphone
} from 'lucide-react';

const OrderSuccess = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await api.get(`/orders/myorders`);
                const currentOrder = data.find((o: any) => o._id === id || o.paymentResult?.reference === id);
                if (currentOrder) {
                    setOrder(currentOrder);
                }
            } catch (err) {
                console.error('Error fetching order for success page', err);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchOrder();
    }, [id]);

    const trackingSteps = [
        { icon: Zap, label: 'Brewing Aura', desc: 'Preparing your organic extraction', status: 'completed' },
        { icon: ShieldCheck, label: 'Quality Protocol', desc: 'Vibe check & purity validation', status: 'current' },
        { icon: MapPin, label: 'Departure', desc: 'Heading to your coordinates', status: 'pending' },
    ];

    return (
        <div className="bg-background-dark text-white min-h-screen flex flex-col p-6 aurora-bg">
            <header className="pt-10 pb-6 text-center space-y-2">
                <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                    className="w-20 h-20 bg-secondary rounded-[2rem] mx-auto flex items-center justify-center shadow-[0_0_40px_rgba(74,222,128,0.3)] relative"
                >
                    <CheckCircle2 className="text-white w-10 h-10" strokeWidth={3} />
                    <motion.div 
                        className="absolute inset-0 rounded-[2rem] border-2 border-secondary/50"
                        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </motion.div>
                
                <div className="pt-6 space-y-1">
                    <motion.h1 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-black italic tracking-tighter uppercase leading-none"
                    >
                        Aura Locked.
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-[10px] text-primary font-black uppercase tracking-[0.3em]"
                    >
                        Transaction Protocol Finalized
                    </motion.p>
                </div>
            </header>

            <main className="flex-1 space-y-8 max-w-md mx-auto w-full pb-32">
                {/* Earth Signature Message */}
                <motion.section 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="liquid-glass p-8 border border-white/[0.04] text-center space-y-4"
                >
                    <Sparkles className="text-primary w-6 h-6 mx-auto animate-pulse" />
                    <p className="text-sm font-medium leading-relaxed italic text-slate-300">
                        "Your choice to nourish with Fruits Aura sends ripples of vitality through the ecosystem. We're hand-selecting your bottles right now."
                    </p>
                    <div className="pt-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">— The Earth Signature</p>
                    </div>
                </motion.section>

                {/* Package Logic (Summary) */}
                <section className="space-y-6">
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 italic">Package Logic</h2>
                    <div className="bg-card-dark/40 rounded-[2.5rem] p-7 border border-white/[0.04] space-y-6">
                        <div className="flex justify-between items-center">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-none">Order ID</p>
                                <p className="text-sm font-black italic text-white uppercase tracking-tight">#{id?.slice(-8).toUpperCase()}</p>
                            </div>
                            <div className="text-right space-y-1">
                                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-none">Total Net</p>
                                <p className="text-xl font-black text-primary italic">₦{order?.totalPrice?.toLocaleString() || '...'}</p>
                            </div>
                        </div>

                        <div className="h-px bg-white/[0.05]"></div>

                        <div className="space-y-4">
                            {order?.orderItems?.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center text-xs">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                            <Package className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="font-black italic text-white tracking-tight">{item.qty}x {item.name}</p>
                                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{item.isBundle ? 'Aura-set' : 'Refracted Bottle'}</p>
                                        </div>
                                    </div>
                                    <span className="font-black text-slate-400">₦{(item.price * item.qty).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Tracking Protocol */}
                <section className="space-y-6">
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 italic">Tracking Protocol</h2>
                    <div className="space-y-4">
                        {trackingSteps.map((step, idx) => (
                            <div key={idx} className={`liquid-glass p-5 flex gap-5 items-center border transition-all ${step.status === 'current' ? 'border-primary/30 bg-primary/5' : 'border-white/[0.02] opacity-50'}`}>
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${step.status === 'completed' ? 'bg-secondary border-secondary text-white' : step.status === 'current' ? 'bg-primary border-primary text-white shadow-[0_0_20px_rgba(242,127,13,0.3)]' : 'bg-white/5 border-white/10 text-slate-500'}`}>
                                    {step.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : <step.icon className="w-6 h-6" />}
                                </div>
                                <div className="space-y-1 flex-1">
                                    <h4 className={`text-xs font-black uppercase tracking-widest italic ${step.status === 'pending' ? 'text-slate-500' : 'text-white'}`}>{step.label}</h4>
                                    <p className="text-[10px] text-slate-400 font-bold tracking-tight">{step.desc}</p>
                                </div>
                                {step.status === 'current' && (
                                    <motion.div 
                                        className="w-2 h-2 rounded-full bg-primary"
                                        animate={{ opacity: [1, 0.4, 1], scale: [1, 1.3, 1] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Social Radiance */}
                <section className="space-y-6">
                    <div className="liquid-glass p-6 text-center space-y-4 border border-white/[0.04]">
                        <Share2 className="text-slate-400 w-5 h-5 mx-auto" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Broadcast Your Radiance</h3>
                        <p className="text-[10px] text-slate-500 font-medium">Show the community your Aura is on the way.</p>
                        <div className="flex justify-center gap-4">
                            <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 active:scale-90 transition-transform">
                                <Smartphone className="w-4 h-4 text-primary" />
                            </button>
                            <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 active:scale-90 transition-transform">
                                <History className="w-4 h-4 text-secondary" />
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Navigation Overlay */}
            <div className="fixed bottom-0 left-0 w-full px-6 pb-12 pt-10 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent z-40">
                <div className="flex gap-3 max-w-md mx-auto">
                    <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/home')}
                        className="flex-[2] bg-primary text-white font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(242,127,13,0.3)] group"
                    >
                        <Home className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                        <span className="text-xs uppercase tracking-[0.2em] italic">Back to Aura</span>
                    </motion.button>
                    <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/profile')}
                        className="flex-1 glass text-white font-black py-5 rounded-[2rem] flex items-center justify-center border border-white/10"
                    >
                        <History className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
