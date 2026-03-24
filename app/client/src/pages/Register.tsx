import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, Mail, Lock, Gift, UserPlus, 
    Truck, UserCircle, Sparkles, ArrowRight,
    ShieldCheck
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'CONSUMER' | 'DISTRIBUTOR'>('CONSUMER');
    const [referralCode, setReferralCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const { data } = await api.post('/auth/register', {
                name,
                email,
                password,
                role,
                referralCode: referralCode || undefined,
            });

            login({
                id: data._id,
                name: data.name,
                email: data.email,
                role: data.role,
                plan: data.plan || 'Auraset Subscriber',
                avatar: data.avatar,
                address: data.address,
                loyaltyPoints: data.loyaltyPoints ?? 0,
            }, data.token);

            navigate('/home');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-background-dark text-white min-h-screen pb-32 flex flex-col items-center justify-center px-6 relative overflow-hidden">
            {/* Background Radiance */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[140px] pointer-events-none"
            />
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.05, 0.1, 0.05]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none"
            />

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-sm space-y-10 relative z-10 pt-16"
            >
                <div className="text-center space-y-4">
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="w-24 h-24 mx-auto relative group"
                    >
                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/40 transition-colors" />
                        <img src="/logo.png" alt="Fruits Aura Logo" className="w-full h-full object-contain relative z-10" />
                    </motion.div>
                    
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black tracking-tight leading-none">Forge <span className="text-primary glow-text-orange">Identity</span></h1>
                        <div className="flex items-center justify-center gap-2 text-slate-500 uppercase tracking-[0.2em] text-[10px] font-black">
                            <ShieldCheck className="w-3 h-3" />
                            Aura Ecosystem Initialization
                        </div>
                    </div>
                </div>

                <form className="space-y-5" onSubmit={handleRegister}>
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-black uppercase tracking-widest py-3 px-4 rounded-2xl text-center backdrop-blur-md shadow-xl"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Entity Base Name</label>
                        <div className="relative group">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Neural Full Name"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-4 pl-14 pr-6 text-sm focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none backdrop-blur-xl shadow-inner-light"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Communication Port</label>
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-primary transition-colors" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="aura@port.com"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-4 pl-14 pr-6 text-sm focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none backdrop-blur-xl shadow-inner-light"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Genetic Cipher</label>
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-primary transition-colors" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Min 6 characters"
                                required
                                minLength={6}
                                className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-4 pl-14 pr-6 text-sm focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none backdrop-blur-xl shadow-inner-light"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Affiliate Node <span className="text-slate-700 normal-case font-medium lowercase tracking-normal">(optional)</span></label>
                        <div className="relative group">
                            <Gift className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                value={referralCode}
                                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                                placeholder="AURA-CORE"
                                className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-4 pl-14 pr-6 text-sm focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none backdrop-blur-xl shadow-inner-light"
                            />
                        </div>
                    </div>

                    <div className="space-y-3 pt-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Ecosystem Role</label>
                        <div className="grid grid-cols-2 gap-4">
                            <motion.button
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={() => setRole('CONSUMER')}
                                className={`relative overflow-hidden rounded-2xl py-4 flex flex-col items-center gap-2 transition-all border ${role === 'CONSUMER' ? 'border-primary bg-primary/10 text-white shadow-xl shadow-primary/10' : 'border-white/5 bg-white/[0.02] text-slate-500 hover:border-white/20'}`}
                            >
                                <UserCircle className="w-6 h-6" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Consumer</span>
                                {role === 'CONSUMER' && <motion.div layoutId="active-role" className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />}
                            </motion.button>
                            <motion.button
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={() => setRole('DISTRIBUTOR')}
                                className={`relative overflow-hidden rounded-2xl py-4 flex flex-col items-center gap-2 transition-all border ${role === 'DISTRIBUTOR' ? 'border-primary bg-primary/10 text-white shadow-xl shadow-primary/10' : 'border-white/5 bg-white/[0.02] text-slate-500 hover:border-white/20'}`}
                            >
                                <Truck className="w-6 h-6" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Partner</span>
                                {role === 'DISTRIBUTOR' && <motion.div layoutId="active-role" className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />}
                            </motion.button>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ y: -4, boxShadow: "0 20px 40px -10px rgba(242,127,13,0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-primary to-orange-600 text-white font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 mt-10 transition-all disabled:opacity-50 disabled:active:scale-100 group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        {isLoading ? (
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span className="uppercase tracking-[0.2em] text-xs">Transmitting...</span>
                            </div>
                        ) : (
                            <>
                                <span className="uppercase tracking-[0.15em] text-xs">Join Neural Grid</span>
                                <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </>
                        )}
                    </motion.button>
                </form>

                <div className="text-center pt-8">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.1em]">
                        Already Identified? <Link to="/login" className="text-primary hover:text-orange-400 transition-colors ml-1 font-black underline underline-offset-4">Authenticate Session</Link>
                    </p>
                </div>

                <div className="pt-8 flex items-center justify-center gap-4 text-slate-800">
                    <div className="h-px w-8 bg-white/5" />
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <div className="h-px w-8 bg-white/5" />
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
