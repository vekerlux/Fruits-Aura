import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { ChevronLeft, Plus, Sparkles, Snowflake, CheckCircle2 } from 'lucide-react';
import { getProducts } from '../api/products';
import type { Product } from '../api/products';
import { useCart } from '../context/CartContext';

const containerVariants: Variants = {
    hidden: {},
    visible: { 
        transition: { 
            staggerChildren: 0.1,
            delayChildren: 0.2
        } 
    },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        transition: { 
            duration: 0.6, 
            ease: [0.22, 1, 0.36, 1] 
        } 
    },
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
        addToCart({ 
            id: product.id, 
            name: product.name, 
            price: product.price, 
            quantity: 1, 
            image: product.image, 
            isBundle: false, 
            subtext: product.subtext, 
            cssFilter: product.cssFilter 
        });
    };

    return (
        <div className="bg-background-dark text-white min-h-screen pb-32 relative overflow-hidden">
            {/* Aurora ambient */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    className="absolute top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(242,127,13,0.08) 0%, transparent 70%)' }}
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute bottom-20 right-[-10%] w-96 h-96 rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)' }}
                    animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                />
            </div>

            {/* Header */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="px-6 pt-14 pb-5 sticky top-0 z-50 bg-background-dark/80 backdrop-blur-xl border-b border-white/[0.05]"
            >
                <div className="flex items-center gap-5">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(-1)}
                        className="w-12 h-12 rounded-2xl glass flex items-center justify-center cursor-pointer border border-white/10"
                    >
                        <ChevronLeft className="w-6 h-6 text-white" />
                    </motion.button>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight leading-tight">
                            Featured <span className="text-primary glow-text-orange">Picks</span>
                        </h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Handcrafted Wellness</p>
                    </div>
                </div>
            </motion.header>

            <main className="px-6 pt-6 space-y-8 relative z-10">
                {/* Hero bento — full width */}
                {!loading && products[0] && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        whileHover={{ y: -8 }}
                        onClick={() => navigate(`/product/${products[0].id}`)}
                        className="relative h-72 rounded-[3.5rem] overflow-hidden cursor-pointer group shadow-2xl shadow-primary/10"
                    >
                        <img 
                            src={products[0].image} 
                            alt={products[0].name} 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                            style={{ filter: products[0].cssFilter }} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-black/40 to-transparent" />

                        {/* Floating Product Radiance */}
                        <motion.div
                            className="absolute right-6 bottom-4 w-44 h-44"
                            animate={{ y: [0, -12, 0], rotate: [0, 2, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <img 
                                src={products[0].image} 
                                alt="" 
                                className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(242,127,13,0.4)]" 
                                style={{ filter: products[0].cssFilter }} 
                            />
                        </motion.div>

                        <div className="absolute inset-0 p-8 flex flex-col justify-between">
                            <div className="space-y-2">
                                <motion.span 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="inline-flex items-center gap-1.5 bg-primary/20 backdrop-blur-md text-primary text-[10px] font-black px-4 py-1.5 rounded-full border border-primary/30 uppercase tracking-widest"
                                >
                                    <Sparkles className="w-3 h-3" />
                                    #1 Best Seller
                                </motion.span>
                                <h2 className="text-4xl font-black leading-tight text-white drop-shadow-md">{products[0].name}</h2>
                                <p className="text-xs text-white/60 font-medium max-w-[60%]">{products[0].subtext}</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-3xl font-black text-white">₦{products[0].price.toLocaleString()}</span>
                                <motion.button
                                    whileHover={{ scale: 1.05, backgroundColor: '#ff8c1a' }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => handleQuickAdd(products[0], e)}
                                    className="bg-primary text-white pl-5 pr-6 py-3 rounded-2xl text-sm font-black flex items-center gap-2 shadow-xl shadow-primary/30 cursor-pointer"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add to Bag
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Freshness stats (Branded Bento) */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { icon: Sparkles, label: '100% Organic', color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20', glow: 'shadow-secondary/20' },
                        { icon: Snowflake, label: 'Cold Pressed', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', glow: 'shadow-blue-400/20' },
                        { icon: CheckCircle2, label: 'NAFDAC Cert.', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', glow: 'shadow-primary/20' },
                    ].map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className={`${s.bg} border ${s.border} rounded-3xl p-4 flex flex-col items-center gap-3 text-center cursor-default shadow-lg ${s.glow}`}
                        >
                            <div className={`p-2 rounded-xl bg-white/5`}>
                                <s.icon className={`${s.color} w-6 h-6`} />
                            </div>
                            <span className={`text-[9px] font-black ${s.color} uppercase tracking-widest leading-none`}>{s.label}</span>
                        </motion.div>
                    ))}
                </div>

                {/* All Products Grid */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black tracking-tight">Full <span className="text-primary">Collection</span></h2>
                        <div className="h-[2px] flex-1 bg-white/5 mx-4" />
                    </div>
                    
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-2 gap-4"
                    >
                        {loading ? (
                            <>
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="shimmer h-64 rounded-[2.5rem] opacity-20" />
                                ))}
                            </>
                        ) : (
                            products.map((product) => (
                                <motion.div
                                    key={product.id}
                                    variants={cardVariants}
                                    whileHover={{ y: -10 }}
                                    className="cursor-pointer group"
                                    onClick={() => navigate(`/product/${product.id}`)}
                                >
                                    <div className="liquid-glass rounded-[2.5rem] overflow-hidden border border-white/5 h-full flex flex-col">
                                        <div className="relative h-44 bg-accent-dark/30 overflow-hidden">
                                            <motion.img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110 mt-2"
                                                style={{ filter: product.cssFilter }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                            {product.isPopular && (
                                                <div className="absolute top-4 left-4 bg-primary text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-primary/20 border border-primary/30">
                                                    Popular
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5 flex-1 flex flex-col justify-between">
                                            <div>
                                                <h4 className="font-black text-sm leading-tight text-white/90">{product.name}</h4>
                                                <p className="text-[10px] text-slate-500 mt-1 font-bold uppercase tracking-wide leading-none">{product.subtext}</p>
                                            </div>
                                            <div className="flex items-center justify-between mt-4">
                                                <span className="font-black text-lg text-white">₦{product.price.toLocaleString()}</span>
                                                <motion.button
                                                    whileHover={{ scale: 1.1, backgroundColor: '#f27f0d' }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={(e) => handleQuickAdd(product, e)}
                                                    className="w-10 h-10 bg-primary/10 hover:bg-primary rounded-2xl flex items-center justify-center text-primary hover:text-white border border-primary/20 transition-colors shadow-lg active:shadow-none cursor-pointer"
                                                >
                                                    <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
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
