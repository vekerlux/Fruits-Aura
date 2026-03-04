import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    // Form State
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

            navigate('/home');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid email or password. Try the demo credentials below.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-background-dark text-white min-h-screen pb-32 flex flex-col items-center justify-center px-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/20 rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"></div>

            <div className="w-full max-w-sm space-y-8 relative z-10">
                <div className="text-center space-y-2">
                    <div className="w-20 h-20 bg-primary rounded-[2rem] mx-auto flex items-center justify-center rotate-12 mb-6 shadow-2xl shadow-primary/40 border border-white/20">
                        <span className="material-symbols-outlined text-white text-5xl font-black -rotate-12">person_filled</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter">Welcome Back</h1>
                    <p className="text-sm text-slate-400">Refresh your aura. Log in to your account.</p>
                </div>

                <form className="space-y-4" onSubmit={handleLogin}>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs p-3 rounded-xl text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Email</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">mail</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="aura@example.com"
                                required
                                className="w-full bg-card-dark border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Password</label>
                            <button type="button" className="text-[10px] font-bold text-primary">FORGOT?</button>
                        </div>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">lock</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full bg-card-dark border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-primary/30 active:scale-[0.98] transition-all mt-6 disabled:opacity-50 disabled:active:scale-100"
                    >
                        {isLoading ? (
                            <span className="animate-pulse">Authenticating...</span>
                        ) : (
                            <>
                                Log In
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-400">
                    New to Fruits Aura? <Link to="/register" className="text-primary font-bold">Create an account</Link>
                </p>

                {/* Demo Credentials Hint */}
                <div onClick={() => { setEmail('user@fruitsaura.com'); setPassword('Aura123!'); }} className="mt-8 p-4 bento-card border-dashed border-white/20 text-center space-y-2 relative cursor-pointer hover:border-primary/50 transition-colors">
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-card-dark px-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">Demo (Click to Fill)</span>
                    <p className="text-xs font-mono text-slate-400">user@fruitsaura.com / Aura123!</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
