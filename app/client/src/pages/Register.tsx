import { Link } from 'react-router-dom';

const Register = () => {
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


                <form className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">badge</span>
                            <input
                                type="text"
                                placeholder="John Doe"
                                className="w-full bg-card-dark border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Email</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">mail</span>
                            <input
                                type="email"
                                placeholder="aura@example.com"
                                className="w-full bg-card-dark border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Password</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">lock</span>
                            <input
                                type="password"
                                placeholder="Create a strong password"
                                className="w-full bg-card-dark border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none"
                            />
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-2 pt-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Account Type</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button type="button" className="bento-card-orange border-primary py-3 flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-primary text-lg">sentiment_satisfied</span>
                                <span className="text-sm font-bold">Consumer</span>
                            </button>
                            <button type="button" className="bento-card border-white/5 py-3 flex items-center justify-center gap-2 text-slate-400">
                                <span className="material-symbols-outlined text-lg">local_shipping</span>
                                <span className="text-sm font-bold">Distributor</span>
                            </button>
                        </div>
                    </div>

                    <Link to="/">
                        <button type="button" className="w-full bg-primary text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-primary/30 active:scale-[0.98] transition-all mt-6">
                            Create Account
                            <span className="material-symbols-outlined">person_add</span>
                        </button>
                    </Link>
                </form>

                <p className="text-center text-sm text-slate-400">
                    Already have an account? <Link to="/login" className="text-primary font-bold">Log in here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
