import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const { data } = await api.post('/auth/login', {
                email,
                password,
            });

            login({
                id: data._id,
                name: data.name,
                email: data.email,
                role: data.role,
                plan: data.plan || 'Auraset Subscriber',
                address: data.address,
                phone: data.phone
            }, data.token);

            // The user's instruction was to add this line.
            // It's placed here as per the provided snippet,
            // but note that it's an incomplete if statement
            // and will cause a syntax error if not completed.
            // Assuming this is a placeholder for future logic.
            if (data.role?.toLowerCase() === 'admin') { /* Add admin-specific logic here */ }

            navigate('/home');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-background-dark text-white min-h-screen pb-32 flex flex-col items-center justify-center px-6 relative overflow-hidden">
            {/* Liquid Background Radiance */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"
            />
            <motion.div 
                animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.05, 0.15, 0.05]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[140px] pointer-events-none"
            />

            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-sm space-y-10 relative z-10"
            >
                <div className="text-center space-y-4">
                    <motion.div 
                        whileHover={{ scale: 1.05, rotate: 2 }}
                        className="w-28 h-28 mx-auto relative"
                    >
                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
                        <img src="/logo.png" alt="Fruits Aura Logo" className="w-full h-full object-contain relative z-10" />
                    </motion.div>
                    
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black tracking-tight leading-none uppercase italic">Login</h1>
                        <div className="flex items-center justify-center gap-2 text-slate-500 uppercase tracking-[0.2em] text-[10px] font-black">
                            <ShieldCheck className="w-3 h-3" />
                            Access Your Account
                        </div>
                    </div>
                </div>

                <form className="space-y-6" onSubmit={handleLogin}>
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
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-primary transition-colors" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@aura.com"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-5 pl-14 pr-6 text-sm focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none backdrop-blur-xl shadow-inner-light"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Password</label>
                            <button type="button" className="text-[10px] font-black text-primary uppercase tracking-widest hover:text-orange-400 transition-colors">Forgot Password?</button>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-primary transition-colors" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-5 pl-14 pr-6 text-sm focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none backdrop-blur-xl shadow-inner-light"
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ y: -4, boxShadow: "0 20px 40px -10px rgba(242,127,13,0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-primary to-orange-600 text-white font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 mt-10 transition-all disabled:opacity-50 disabled:active:scale-100 group overflow-hidden relative"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        {isLoading ? (
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span className="uppercase tracking-[0.2em] text-xs">Logging in...</span>
                            </div>
                        ) : (
                            <>
                                <span className="uppercase tracking-[0.2em] text-xs">Login</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </motion.button>
                </form>

                <div className="text-center pt-8">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.1em]">
                        Don't have an account? <Link to="/register" className="text-primary hover:text-orange-400 transition-colors ml-1 font-black underline underline-offset-4">Register Now</Link>
                    </p>
                </div>

                <div className="pt-10 flex items-center justify-center gap-4 text-slate-700">
                    <div className="h-px w-8 bg-white/5" />
                    <Sparkles className="w-4 h-4" />
                    <div className="h-px w-8 bg-white/5" />
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
