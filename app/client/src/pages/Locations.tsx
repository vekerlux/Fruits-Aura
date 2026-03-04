import { useNavigate } from 'react-router-dom';

const Locations = () => {
    const navigate = useNavigate();
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

                {/* Flagship Store Card */}
                <div className="bento-card-orange p-5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

                    <div className="space-y-4 relative z-10">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="bg-black/20 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded backdrop-blur-sm border border-white/20">Flagship</span>
                                <h2 className="text-2xl font-black text-white mt-1">Waterworks HQ</h2>
                            </div>
                            <div className="w-10 h-10 bg-white text-primary rounded-full flex items-center justify-center shadow-lg shadow-black/20 font-black">
                                #01
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-start gap-2">
                                <span className="material-symbols-outlined text-white/70 text-base mt-0.5">location_on</span>
                                <p className="text-sm font-medium leading-tight">Shop 15, Waterworks Road,<br />Beside Old Kpirikpiri Market,<br />Abakaliki, Ebonyi</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-white/70 text-base">call</span>
                                <p className="text-sm font-bold font-mono">+234 812 345 6789</p>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button className="flex-1 bg-white text-primary font-black py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform">
                                <span className="material-symbols-outlined text-lg">directions</span>
                                Directions
                            </button>
                            <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 active:scale-95 transition-transform">
                                <span className="material-symbols-outlined text-white">share</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Branch Card */}
                <div className="bento-card p-5 group">
                    <div className="space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-black text-white mt-1">Presco Campus</h2>
                            </div>
                            <div className="w-10 h-10 bg-accent-dark text-slate-400 rounded-full flex items-center justify-center border border-white/5 font-black">
                                #02
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-start gap-2">
                                <span className="material-symbols-outlined text-primary text-base mt-0.5">location_on</span>
                                <p className="text-sm text-slate-400 leading-tight">EBSU Presco Campus Gate,<br />Enugu Express Way,<br />Abakaliki</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-base">call</span>
                                <p className="text-sm font-bold font-mono text-slate-300">+234 908 765 4321</p>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button className="flex-1 bg-accent-dark text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 border border-white/5 active:scale-95 transition-transform hover:border-primary/50">
                                <span className="material-symbols-outlined text-lg text-primary">directions</span>
                                Directions
                            </button>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default Locations;
