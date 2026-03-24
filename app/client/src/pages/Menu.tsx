import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, type Variants, AnimatePresence } from 'framer-motion';
import { ShoppingBasket, Search, SlidersHorizontal, Heart, Plus, LayoutGrid, Leaf, Zap, ShieldCheck, Sparkles } from 'lucide-react';
import { getProducts } from '../api/products';
import type { Product } from '../api/products';
import { useCart } from '../context/CartContext';

const containerVariants: Variants = {
    hidden: {},
    visible: { 
        transition: { 
            staggerChildren: 0.05,
            delayChildren: 0.1
        } 
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        transition: { 
            duration: 0.5, 
            ease: [0.22, 1, 0.36, 1] 
        } 
    },
};

const categories = [
    { label: 'All', icon: LayoutGrid, value: undefined },
    { label: 'Detox', icon: Leaf, value: 'detox' },
    { label: 'Energy', icon: Zap, value: 'energy' },
    { label: 'Immunity', icon: ShieldCheck, value: 'immunity' },
    { label: 'Glow', icon: Sparkles, value: 'glow' },
];

const Menu = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        setLoading(true);
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
        <div className="bg-background-dark text-white min-h-screen pb-32 relative">
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="px-6 pt-14 pb-5 sticky top-0 z-50 bg-background-dark/80 backdrop-blur-xl border-b border-white/[0.05]"
            >
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-black tracking-tight leading-none">
                        Our <span className="text-primary glow-text-orange">Menu</span>
                    </h1>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link to="/cart">
                            <button className="w-11 h-11 rounded-2xl glass flex items-center justify-center cursor-pointer border border-white/10 shadow-lg">
                                <ShoppingBasket className="w-5 h-5 text-white" />
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </motion.header>

            <main className="px-6 pt-6">
                <div className="flex items-center justify-between mb-6 px-1">
                    <h3 className="text-xl font-black tracking-tight">Today's <span className="text-primary/80">Freshness</span></h3>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                >
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            <motion.div key="loading" exit={{ opacity: 0 }} className="space-y-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-32 shimmer rounded-[2rem] opacity-20" />
                                ))}
                            </motion.div>
                        ) : products.length === 0 ? (
                            <motion.div 
                                key="empty"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-20 bg-card-dark/30 rounded-[3rem] border border-dashed border-white/5"
                            >
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                                    <ShoppingBasket className="w-8 h-8 text-slate-600" />
                                </div>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">No aura discovered</p>
                                <p className="text-[10px] text-slate-600 mt-2">Check back soon for fresh mixes</p>
                            </motion.div>
                        ) : (
                            products.map((product) => (
                                <motion.div
                                    key={product.id}
                                    variants={itemVariants}
                                    layout
                                    whileHover={{ y: -5 }}
                                    className="group"
                                >
                                    <Link
                                        to={`/product/${product.id}`}
                                        className="bg-card-dark/40 backdrop-blur-md p-5 rounded-[2.5rem] flex items-center gap-5 border border-white/5 hover:border-primary/20 transition-colors block relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                        
                                        <motion.div
                                            className="w-32 h-32 rounded-[2rem] bg-accent-dark/50 flex items-center justify-center p-3 shrink-0 overflow-hidden border border-white/5"
                                            whileHover={{ scale: 1.05, rotate: 2 }}
                                        >
                                            <img
                                                alt={product.name}
                                                loading="lazy"
                                                className="w-full h-full object-contain drop-shadow-xl"
                                                src={product.image}
                                                style={{ filter: product.cssFilter }}
                                            />
                                        </motion.div>
                                        <div className="flex-1 min-w-0 py-1">
                                            <div className="flex justify-between items-start">
                                                <div className="min-w-0">
                                                    <h4 className="font-black text-lg text-white leading-tight truncate">{product.name}</h4>
                                                    <p className="text-[10px] text-slate-500 mt-1 font-bold uppercase tracking-widest leading-none">{product.subtext}</p>
                                                </div>
                                                <motion.button
                                                    whileHover={{ scale: 1.15 }}
                                                    whileTap={{ scale: 0.85 }}
                                                    className={`cursor-pointer transition-colors p-1 ${product.isPopular ? 'text-primary drop-shadow-[0_0_8px_rgba(242,127,13,0.4)]' : 'text-slate-800 hover:text-slate-600'}`}
                                                >
                                                    <Heart className={`w-5 h-5 ${product.isPopular ? 'fill-current' : ''}`} />
                                                </motion.button>
                                            </div>
                                            <div className="flex items-center justify-between mt-5">
                                                <span className="text-2xl font-black text-white tracking-tight">₦{product.price.toLocaleString()}</span>
                                                <motion.button
                                                    whileHover={{ scale: 1.1, backgroundColor: '#f27f0d' }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={(e) => handleQuickAdd(product, e)}
                                                    className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20 cursor-pointer border border-primary/20"
                                                >
                                                    <Plus className="w-6 h-6" />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </motion.div>
            </main>
        </div>
    );
};

export default Menu;
