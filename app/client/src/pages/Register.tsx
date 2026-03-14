import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    // Form state
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

            // Auto-login after successful registration
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
            {/* Background Decor */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/20 rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"></div>

            <div className="w-full max-w-sm space-y-8 relative z-10 pt-10">
                <div className="text-center space-y-2">
                    <div className="w-20 h-20 mx-auto flex items-center justify-center mb-2">
                        <img src="/logo.png" alt="Fruits Aura Logo" className="w-full h-full object-contain filter drop-shadow-xl" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter">Get the Aura</h1>
                    <p className="text-sm text-slate-400">Join the Fruits Aura community today.</p>
                </div>

                <form className="space-y-4" onSubmit={handleRegister}>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs p-3 rounded-xl text-center">
                            {error}
                        </div>
                    )}

                    {/* Full Name */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">badge</span>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                required
                                className="w-full bg-card-dark border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none"
                            />
                        </div>
                    </div>

                    {/* Email */}
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

                    {/* Password */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Password</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">lock</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Create a strong password"
                                required
                                minLength={6}
                                className="w-full bg-card-dark border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none"
                            />
                        </div>
                    </div>

                    {/* Referral Code (Optional) */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Referral Code <span className="text-slate-600 normal-case font-normal">(optional)</span></label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">confirmation_number</span>
                            <input
                                type="text"
                                value={referralCode}
                                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                                placeholder="AURA1234"
                                className="w-full bg-card-dark border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none"
                            />
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-2 pt-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Account Type</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setRole('CONSUMER')}
                                className={`bento-card py-3 flex items-center justify-center gap-2 transition-all ${role === 'CONSUMER' ? 'border-primary bg-primary/10 text-white' : 'border-white/5 text-slate-400'}`}
                            >
                                <span className="material-symbols-outlined text-primary text-lg">sentiment_satisfied</span>
                                <span className="text-sm font-bold">Consumer</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('DISTRIBUTOR')}
                                className={`bento-card py-3 flex items-center justify-center gap-2 transition-all ${role === 'DISTRIBUTOR' ? 'border-primary bg-primary/10 text-white' : 'border-white/5 text-slate-400'}`}
                            >
                                <span className="material-symbols-outlined text-lg">local_shipping</span>
                                <span className="text-sm font-bold">Distributor</span>
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-primary/30 active:scale-[0.98] transition-all mt-6 disabled:opacity-50 disabled:active:scale-100"
                    >
                        {isLoading ? (
                            <span className="animate-pulse">Creating Account...</span>
                        ) : (
                            <>
                                Create Account
                                <span className="material-symbols-outlined">person_add</span>
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-400">
                    Already have an account? <Link to="/login" className="text-primary font-bold">Log in here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
