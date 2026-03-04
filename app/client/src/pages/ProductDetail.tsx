import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { getProductById } from '../api/products';
import type { Product } from '../api/products';

const nutVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: (i: number) => ({ opacity: 1, scale: 1, y: 0, transition: { delay: i * 0.07, duration: 0.35, ease: 'easeOut' as const } }),
};

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [isBundle, setIsBundle] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [addedFlash, setAddedFlash] = useState(false);

    useEffect(() => {
        if (!id) return;
        getProductById(id)
            .then((data) => { if (data) setProduct(data); else navigate('/menu'); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id, navigate]);

    if (loading || !product) {
        return (
            <div className="bg-background-dark text-white min-h-screen flex items-center justify-center">
                <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-primary font-black tracking-widest uppercase text-sm"
                >
                    Brewing your aura...
                </motion.div>
            </div>
        );
    }

    const price = isBundle ? product.price * 5 : product.price;

    const handleAddToBag = () => {
        addToCart({ id: product.id, name: product.name, price, quantity, image: product.image, isBundle, subtext: isBundle ? 'Auraset Bundle' : product.subtext, cssFilter: product.cssFilter });
        setAddedFlash(true);
        setTimeout(() => navigate('/cart'), 600);
    };

    return (
        <div className="bg-background-dark text-white min-h-screen pb-40">
            {/* Fixed Header */}
            <div className="px-6 pt-14 pb-4 flex justify-between items-center fixed top-0 w-full z-50 bg-background-dark/85 backdrop-blur-xl">
                <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={() => navigate(-1)}
                    className="w-11 h-11 rounded-full glass flex items-center justify-center cursor-pointer"
                >
                    <span className="material-symbols-outlined text-white">arrow_back_ios_new</span>
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.88 }}
                    whileHover={{ scale: 1.08 }}
                    className="w-11 h-11 rounded-full glass flex items-center justify-center cursor-pointer"
                >
                    <span className="material-symbols-outlined text-primary">favorite</span>
                </motion.button>
            </div>

            <main>
                {/* Product Hero — floating image */}
                <div className="h-[22rem] bg-accent-dark rounded-b-[3rem] relative flex items-center justify-center pt-12 overflow-hidden">
                    {/* Looped aurora glow */}
                    <motion.div
                        className="absolute inset-0 rounded-full blur-3xl"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        style={{ background: 'radial-gradient(circle, rgba(255,107,0,0.4) 0%, transparent 65%)' }}
                    />
                    {/* Floating fruit image */}
                    <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-[75%] h-[105%] object-contain relative z-10 drop-shadow-2xl"
                        initial={{ y: 20, opacity: 0, scale: 0.92 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        style={{ animation: 'float 4s ease-in-out infinite', filter: product.cssFilter }}
                    />
                    {/* Rating badge */}
                    <div className="absolute bottom-5 right-5 bg-black/55 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1 z-20">
                        <span className="material-symbols-outlined text-yellow-400 text-sm filled">star</span>
                        <span className="font-black text-sm">4.9</span>
                        <span className="text-xs text-slate-400">(128)</span>
                    </div>
                </div>

                <div className="px-5 pt-6 space-y-7">
                    {/* Name + Price */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.15 }}
                        className="flex justify-between items-start"
                    >
                        <div>
                            <p className="text-primary text-[10px] font-black tracking-widest uppercase mb-1">{product.subtext}</p>
                            <h1 className="text-3xl font-black leading-tight">{product.name}</h1>
                        </div>
                        <div className="text-right">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={price}
                                    initial={{ y: -10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 10, opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="text-2xl font-black text-white block"
                                >
                                    ₦{price.toLocaleString()}
                                </motion.span>
                            </AnimatePresence>
                            <p className="text-xs text-slate-500 font-medium">per {isBundle ? 'set' : 'bottle'}</p>
                        </div>
                    </motion.div>

                    {/* Ingredients */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-3"
                    >
                        <h3 className="font-black text-sm text-slate-300 uppercase tracking-widest">Fresh Ingredients</h3>
                        <div className="flex gap-2 flex-wrap">
                            {product.ingredients.map((item, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.25 + i * 0.06, type: 'spring', stiffness: 300 }}
                                    className="bg-card-dark border border-white/8 px-4 py-2 rounded-full text-xs font-bold text-slate-300 cursor-default"
                                    whileHover={{ borderColor: 'rgba(255,107,0,0.4)', color: '#fff' }}
                                >
                                    {item}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Nutrition bento — Green accent */}
                    <div className="grid grid-cols-4 gap-2">
                        {[
                            { label: 'Kcal', value: product.nutrition.kcal },
                            { label: 'Sugar', value: product.nutrition.sugar },
                            { label: 'Vit C', value: product.nutrition.vitC },
                            { label: 'H₂O', value: product.nutrition.hydration },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                custom={i}
                                variants={nutVariants}
                                initial="hidden"
                                animate="visible"
                                whileHover={{ y: -3, borderColor: 'rgba(74,222,128,0.4)' }}
                                className="stat-card-green col-span-1 flex flex-col items-center justify-center text-center gap-1 py-3 cursor-default"
                            >
                                <span className="text-secondary font-black text-lg">{stat.value}</span>
                                <span className="text-[9px] font-bold text-slate-500 uppercase">{stat.label}</span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Auraset toggle */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="bento-card-orange"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <span className="text-sm font-black tracking-widest uppercase text-primary">
                                    {isBundle ? 'AURASET (6 BOTTLES)' : 'SINGLE BOTTLE'}
                                </span>
                                {isBundle && (
                                    <p className="text-xs text-secondary font-bold mt-0.5">Pay for 5, get 6!</p>
                                )}
                            </div>
                            <motion.button
                                onClick={() => setIsBundle(!isBundle)}
                                animate={{ backgroundColor: isBundle ? '#FF6B00' : '#374151' }}
                                transition={{ duration: 0.3 }}
                                className="relative inline-flex h-7 w-12 items-center rounded-full cursor-pointer"
                            >
                                <motion.span
                                    animate={{ x: isBundle ? 22 : 4 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                                    className="inline-block h-5 w-5 rounded-full bg-white shadow-md"
                                />
                            </motion.button>
                        </div>
                        <div className="h-px bg-white/8 w-full mb-4" />
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400 font-medium text-sm">Quantity</span>
                            <div className="flex items-center bg-background-dark rounded-xl px-2 py-1.5 gap-4 border border-white/5">
                                <motion.button whileTap={{ scale: 0.8 }} onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer">
                                    <span className="material-symbols-outlined text-sm">remove</span>
                                </motion.button>
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={quantity}
                                        initial={{ y: -8, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: 8, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-base font-black w-5 text-center"
                                    >
                                        {quantity.toString().padStart(2, '0')}
                                    </motion.span>
                                </AnimatePresence>
                                <motion.button whileTap={{ scale: 0.8 }} onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 flex items-center justify-center text-primary cursor-pointer">
                                    <span className="material-symbols-outlined text-sm font-bold">add</span>
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Sticky Add to Bag */}
            <div className="fixed bottom-0 left-0 w-full px-5 pb-28 pt-4 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent z-40">
                <motion.button
                    whileTap={{ scale: 0.96 }}
                    animate={addedFlash ? { backgroundColor: '#4ade80' } : { backgroundColor: '#FF6B00' }}
                    onClick={handleAddToBag}
                    className="w-full text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl cursor-pointer"
                    style={{ boxShadow: '0 8px 32px rgba(255,107,0,0.35)' }}
                >
                    <span className="material-symbols-outlined">shopping_bag</span>
                    <span>Add {(isBundle ? 6 : 1) * quantity} to Bag — ₦{(price * quantity).toLocaleString()}</span>
                </motion.button>
            </div>
        </div>
    );
};

export default ProductDetail;
