import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProducts } from '../api/products';
import type { Product } from '../api/products';
import { useCart } from '../context/CartContext';

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};
const cardVariants = {
    hidden: { opacity: 0, y: 28, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

const Featured = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProducts()
            .then(setProducts)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image, isBundle: false, subtext: product.subtext, cssFilter: product.cssFilter });
    };

    return (
        <div className="bg-background-dark text-white min-h-screen pb-32 relative overflow-hidden">
            {/* Aurora ambient */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    className="absolute top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(255,107,0,0.12) 0%, transparent 65%)' }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute bottom-20 right-0 w-72 h-72 rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.1) 0%, transparent 65%)' }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                />
            </div>

            {/* Header */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="px-5 pt-14 pb-5 sticky top-0 z-50 bg-background-dark/85 backdrop-blur-xl border-b border-white/[0.04]"
            >
                <div className="flex items-center gap-4">
                    <motion.button
                        whileTap={{ scale: 0.88 }}
                        onClick={() => navigate(-1)}
                        className="w-11 h-11 rounded-full glass flex items-center justify-center cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-white">arrow_back_ios_new</span>
                    </motion.button>
                    <div>
                        <h1 className="text-2xl font-black leading-tight">Featured <span className="text-primary">Picks</span></h1>
                        <p className="text-xs text-slate-500 font-medium">Handcrafted by Nigeria's finest</p>
                    </div>
                </div>
            </motion.header>

            <main className="px-5 pt-5 space-y-6 relative z-10">
                {/* Hero bento — full width */}
                {!loading && products[0] && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, ease: 'easeOut' }}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(`/product/${products[0].id}`)}
                        className="relative h-64 rounded-[2.5rem] overflow-hidden cursor-pointer"
                    >
                        <img src={products[0].image} alt={products[0].name} className="w-full h-full object-cover" style={{ filter: products[0].cssFilter }} />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />

                        {/* Floating product image */}
                        <motion.div
                            className="absolute right-4 bottom-0 w-36 h-36"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <img src={products[0].image} alt="" className="w-full h-full object-contain drop-shadow-xl" style={{ filter: products[0].cssFilter }} />
                        </motion.div>

                        <div className="absolute inset-0 p-6 flex flex-col justify-between">
                            <div className="space-y-1">
                                <span className="inline-block bg-primary text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider">
                                    #1 Best Seller
                                </span>
                                <h2 className="text-3xl font-black leading-tight text-white">{products[0].name}</h2>
                                <p className="text-xs text-white/70">{products[0].subtext}</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-2xl font-black text-white">₦{products[0].price.toLocaleString()}</span>
                                <motion.button
                                    whileTap={{ scale: 0.85 }}
                                    onClick={(e) => handleQuickAdd(products[0], e)}
                                    className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-black flex items-center gap-2 shadow-lg shadow-primary/30 cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-sm">add</span>
                                    Add to Bag
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Freshness stats (green bento) */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { icon: 'spa', label: '100% Organic', color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20' },
                        { icon: 'ac_unit', label: 'Cold Pressed', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
                        { icon: 'verified', label: 'NAFDAC Cert.', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
                    ].map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.15 + i * 0.08 }}
                            whileHover={{ y: -4 }}
                            className={`${s.bg} border ${s.border} rounded-2xl p-3 flex flex-col items-center gap-2 text-center cursor-default`}
                        >
                            <motion.div
                                animate={{ y: [0, -4, 0] }}
                                transition={{ duration: 2.5 + i, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <span className={`material-symbols-outlined ${s.color} text-2xl`}>{s.icon}</span>
                            </motion.div>
                            <span className={`text-[10px] font-black ${s.color} uppercase tracking-wide`}>{s.label}</span>
                        </motion.div>
                    ))}
                </div>

                {/* All Products Grid */}
                <div>
                    <h2 className="text-lg font-black mb-4">All Products</h2>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-2 gap-3"
                    >
                        {loading ? (
                            <>
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="shimmer h-56 rounded-bento" />
                                ))}
                            </>
                        ) : (
                            products.map((product) => (
                                <motion.div
                                    key={product.id}
                                    variants={cardVariants}
                                    whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(255,107,0,0.15)' }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => navigate(`/product/${product.id}`)}
                                    className="cursor-pointer"
                                >
                                    <div className="liquid-glass overflow-hidden">
                                        <div className="relative h-40 bg-accent-dark overflow-hidden">
                                            <motion.img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                style={{ animation: 'float-slow 6s ease-in-out infinite', filter: product.cssFilter }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                            {product.isPopular && (
                                                <span className="absolute top-3 left-3 bg-primary text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                                                    Popular
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h4 className="font-black text-sm leading-tight">{product.name}</h4>
                                            <p className="text-xs text-slate-500 mt-0.5">{product.subtext}</p>
                                            <div className="flex items-center justify-between mt-3">
                                                <span className="font-black text-base">₦{product.price.toLocaleString()}</span>
                                                <motion.button
                                                    whileTap={{ scale: 0.8 }}
                                                    onClick={(e) => handleQuickAdd(product, e)}
                                                    className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-md shadow-primary/30 cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined text-sm">add</span>
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default Featured;
