import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Star, Sparkles, Lightbulb, Activity, 
    Eye, EyeOff, LayoutPanelTop, Play,
    RotateCw, Info
} from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

interface Product {
    id: string;
    name: string;
    image: string;
    cssFilter: string;
    isPopular: boolean;
    category: string;
}

const CarouselManagement = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/products');
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleToggleFeature = async (product: Product) => {
        try {
            await api.put(`/products/${product.id}`, {
                isPopular: !product.isPopular
            });
            fetchProducts();
        } catch (error) {
            alert('Error updating feature status');
        }
    };

    const popularCount = products.filter(p => p.isPopular).length;

    return (
        <section className="space-y-6 pb-40">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-black text-white flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-400/10 rounded-xl flex items-center justify-center border border-amber-400/20">
                            <LayoutPanelTop className="w-5 h-5 text-amber-400" />
                        </div>
                        Spotlight Registry
                    </h2>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-2 ml-1">
                        {popularCount} Entities Currently Materialized in Home Stream
                    </p>
                </div>
                <button 
                    onClick={fetchProducts}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 active:rotate-180 transition-all"
                >
                    <RotateCw className="w-4 h-4 text-slate-400" />
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="aspect-[4/5] shimmer opacity-10 rounded-3xl" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product, i) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.03 }}
                            className={`bento-card p-6 border transition-all relative group overflow-hidden ${product.isPopular
                                ? 'bg-primary/10 border-primary/30 shadow-2xl shadow-primary/5'
                                : 'bg-white/[0.01] border-white/5 opacity-50 hover:opacity-100 grayscale hover:grayscale-0'
                                }`}
                        >
                            <div className="relative aspect-square rounded-3xl bg-black/40 mb-5 overflow-hidden flex items-center justify-center p-6 border border-white/5">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                                <img
                                    src={product.image}
                                    style={{ filter: product.cssFilter }}
                                    className="w-full h-full object-contain relative z-10 transition-transform duration-700 group-hover:scale-110"
                                    alt={product.name}
                                />
                                {product.isPopular && (
                                    <div className="absolute top-3 right-3 bg-primary text-white p-2 rounded-xl shadow-2xl flex items-center justify-center ring-4 ring-primary/20">
                                        <Sparkles className="w-3 h-3" />
                                    </div>
                                )}
                            </div>
                            
                            <div className="space-y-4 relative z-10">
                                <div>
                                    <p className="text-[8px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">{product.category}</p>
                                    <h4 className="font-black text-xs text-white truncate px-1">{product.name}</h4>
                                </div>
                                
                                <button
                                    onClick={() => handleToggleFeature(product)}
                                    className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-3 ${product.isPopular
                                        ? 'bg-primary text-white shadow-xl shadow-primary/30 active:scale-95'
                                        : 'bg-white/5 text-slate-500 border border-white/10 hover:border-white/20 hover:bg-white/10'
                                        }`}
                                >
                                    {product.isPopular ? (
                                        <>
                                            <Eye className="w-3.5 h-3.5" />
                                            Featured
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-3.5 h-3.5" />
                                            Illuminate
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bento-card p-8 border border-amber-500/10 bg-amber-500/[0.02] backdrop-blur-3xl"
            >
                <div className="flex gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 flex-shrink-0">
                        <Lightbulb className="w-7 h-7 text-amber-500 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        <p className="font-black text-[10px] text-amber-500 uppercase tracking-[0.25em] flex items-center gap-2">
                            <Activity className="w-3.5 h-3.5" />
                            Engagement Optimization
                        </p>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                            Featured items are materialized in the primary swiper carousel and highlighted "Strategic Selections" on the home interface.
                            Maintaining <span className="text-white font-bold underline decoration-amber-500/50 underline-offset-4">3 to 5 entities</span> ensures peak visual equilibrium and interaction velocity.
                        </p>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default CarouselManagement;
