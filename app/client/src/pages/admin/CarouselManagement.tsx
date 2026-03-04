import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-white flex items-center gap-3">
                        <span className="w-2 h-8 bg-amber-400 rounded-full"></span>
                        Carousel Control
                    </h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                        {popularCount} Items Currently Featured on Home Page
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="py-20 flex justify-center">
                    <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    {products.map((product) => (
                        <motion.div
                            key={product.id}
                            layout
                            className={`bento-card p-4 border transition-all ${product.isPopular
                                ? 'bg-primary/5 border-primary/30'
                                : 'bg-white/[0.02] border-white/5 opacity-60'
                                }`}
                        >
                            <div className="relative aspect-square rounded-2xl bg-black/20 mb-4 overflow-hidden flex items-center justify-center p-4">
                                <img
                                    src={product.image}
                                    style={{ filter: product.cssFilter }}
                                    className="w-full h-full object-contain"
                                    alt={product.name}
                                />
                                {product.isPopular && (
                                    <div className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full shadow-lg">
                                        <span className="material-symbols-outlined text-xs">star</span>
                                    </div>
                                )}
                            </div>
                            <h4 className="font-bold text-xs text-white truncate mb-4">{product.name}</h4>
                            <button
                                onClick={() => handleToggleFeature(product)}
                                className={`w-full py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${product.isPopular
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                    }`}
                            >
                                {product.isPopular ? 'Featured' : 'Promote to Home'}
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}

            <div className="liquid-glass p-5 border border-amber-500/20 bg-amber-500/5">
                <div className="flex gap-4">
                    <span className="material-symbols-outlined text-amber-500">lightbulb</span>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                        Featured items appear in the top swiper carousel and highlighted "Picks" on the home page.
                        Aim for <span className="text-white font-bold">3-5 items</span> for the best user experience.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default CarouselManagement;
