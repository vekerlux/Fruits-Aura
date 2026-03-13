import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api/client';
import { useCart } from '../context/CartContext';
import { getProducts } from '../api/products';
import type { Product } from '../api/products';
import SwipeCarousel from '../components/SwipeCarousel';

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
};

const Home = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [subscribeStatus, setSubscribeStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

    useEffect(() => {
        getProducts()
            .then((data) => {
                // Prioritize popular items, then take a few
                const popular = data.filter(p => p.isPopular);
                const regular = data.filter(p => !p.isPopular);
                setProducts([...popular, ...regular].slice(0, 4));
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image, isBundle: false, subtext: product.subtext });
    };

    const handleNewsletter = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newsletterEmail) return;
        try {
            setIsSubscribing(true);
            setSubscribeStatus(null);
            await api.post('/newsletter/subscribe', { email: newsletterEmail });
            setSubscribeStatus({ type: 'success', msg: 'Welcome to the circle!' });
            setNewsletterEmail('');
        } catch (error: any) {
            setSubscribeStatus({ type: 'error', msg: error.response?.data?.message || 'Something went wrong.' });
        } finally {
            setIsSubscribing(false);
        }
    };

    return (
        <div className="min-h-screen pb-32">
            {/* Header */}
            <motion.header
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="px-6 pt-14 pb-4 flex justify-between items-center sticky top-0 z-40 bg-background-dark/85 backdrop-blur-xl border-b border-white/[0.04]"
            >
                <div className="flex items-center gap-3">
                    <Link to="/profile">
                        <motion.div
                            whileTap={{ scale: 0.92 }}
                            whileHover={{ scale: 1.05 }}
                            className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center border-2 border-white/10 shadow-lg shadow-primary/25 cursor-pointer overflow-hidden"
                        >
                            {/* We can grab avatar from AuthContext later if needed, fallback to icon */}
                            <span className="material-symbols-outlined text-white text-lg">person</span>
                        </motion.div>
                    </Link>
                    <div>
                        <img src="/logo.png" alt="Fruits Aura" className="h-9 w-auto object-contain filter drop-shadow-lg" />
                    </div>
                </div>

                <div className="flex gap-2">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate('/menu')}
                        className="w-11 h-11 rounded-2xl glass flex items-center justify-center cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-white text-xl">search</span>
                    </motion.button>
                    <motion.div whileTap={{ scale: 0.9 }}>
                        <Link to="/cart">
                            <button className="w-11 h-11 rounded-2xl glass flex items-center justify-center cursor-pointer">
                                <span className="material-symbols-outlined text-white text-xl">shopping_bag</span>
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </motion.header>

            <main className="px-5 pt-5 space-y-5">
                {/* Swipeable Hero Carousel */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                    <SwipeCarousel />
                </motion.div>

                {/* Bento Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-4 gap-3"
                >
                    {/* Categories Card */}
                    <motion.div
                        variants={cardVariants}
                        className="col-span-2 liquid-glass p-4 cursor-pointer"
                        onClick={() => navigate('/menu')}
                        whileHover={{ y: -4, borderColor: 'rgba(255,107,0,0.4)' }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-sm">Categories</h3>
                            <span className="material-symbols-outlined text-primary text-base">arrow_forward_ios</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col items-center gap-2">
                                <motion.div
                                    animate={{ y: [0, -3, 0] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                                    className="w-full aspect-square rounded-xl bg-primary flex items-center justify-center"
                                >
                                    <span className="material-symbols-outlined text-white text-3xl">eco</span>
                                </motion.div>
                                <span className="text-[9px] font-black uppercase tracking-wide text-center text-slate-400">Organic</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <motion.div
                                    animate={{ y: [0, -3, 0] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
                                    className="w-full aspect-square rounded-xl glass flex items-center justify-center"
                                >
                                    <span className="material-symbols-outlined text-primary text-3xl">bolt</span>
                                </motion.div>
                                <span className="text-[9px] font-black uppercase tracking-wide text-center text-slate-400">Energy</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Deal Card */}
                    <motion.div
                        variants={cardVariants}
                        className="col-span-2 rounded-bento bg-primary p-5 flex flex-col justify-between cursor-pointer relative overflow-hidden"
                        onClick={() => navigate('/menu')}
                        whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(255,107,0,0.35)' }}
                        whileTap={{ scale: 0.97 }}
                    >
                        {/* Animated BG orb */}
                        <motion.div
                            className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-orange-400/30 blur-xl"
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <motion.img
                            src="/assets/brand/bottle-base.png"
                            alt="Aura Deal"
                            className="absolute -right-6 top-1/2 -translate-y-1/2 w-32 h-32 object-contain drop-shadow-xl z-10 opacity-60"
                            style={{ filter: 'sepia(1) hue-rotate(330deg) saturate(3) brightness(1.2)' }}
                            animate={{ y: ['-50%', '-56%', '-50%'] }}
                            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <span className="material-symbols-outlined text-white text-4xl z-10">loyalty</span>
                        <div className="text-white z-10">
                            <p className="text-2xl font-black">25% OFF</p>
                            <p className="text-[10px] font-bold uppercase opacity-80 tracking-widest">Weekend Aura Deal</p>
                        </div>
                    </motion.div>

                    {/* Section header */}
                    <motion.div variants={cardVariants} className="col-span-4 flex items-center justify-between mt-2">
                        <h3 className="text-xl font-black uppercase tracking-tighter italic">Vibrant Aura Picks</h3>
                        <Link to="/menu" className="text-primary text-xs font-black uppercase tracking-widest hover:underline">View All</Link>
                    </motion.div>

                    {/* Product picks */}
                    {loading ? (
                        <>
                            {[1, 2].map((i) => (
                                <motion.div key={i} variants={cardVariants} className="col-span-2 h-80 shimmer rounded-bento" />
                            ))}
                        </>
                    ) : (
                        products.map((product) => (
                            <motion.div
                                key={product.id}
                                variants={cardVariants}
                                className="col-span-2 cursor-pointer"
                                onClick={() => navigate(`/product/${product.id}`)}
                                whileHover={{ y: -5 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <div className="bento-card vibrant-border h-80 relative group overflow-hidden">
                                    <img
                                        alt={product.name}
                                        loading="lazy"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        src={product.image}
                                        style={{ filter: product.cssFilter }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                    <div className="absolute bottom-3 left-3 right-3 ghost-card rounded-2xl p-3 z-10">
                                        <h4 className="text-white font-bold text-[13px] leading-tight line-clamp-2">{product.name}</h4>
                                        <p className="text-white/60 text-[8px] font-black uppercase tracking-tighter">{product.subtext}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-white font-black text-sm">₦{product.price.toLocaleString()}</span>
                                            <motion.button
                                                whileTap={{ scale: 0.85 }}
                                                onClick={(e) => handleQuickAdd(product, e)}
                                                className="bg-primary text-white p-2 rounded-xl flex items-center justify-center cursor-pointer shadow-lg shadow-primary/30"
                                            >
                                                <span className="material-symbols-outlined text-sm font-bold">add</span>
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}

                    {/* Freshness stat bento (Green accent) */}
                    <motion.div
                        variants={cardVariants}
                        className="col-span-4 bento-card-green p-5 flex items-center gap-5"
                    >
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-14 h-14 rounded-2xl bg-secondary/15 flex items-center justify-center flex-shrink-0 border border-secondary/20"
                        >
                            <span className="material-symbols-outlined text-secondary text-3xl">verified</span>
                        </motion.div>
                        <div>
                            <p className="text-xs text-secondary font-black uppercase tracking-widest">Freshness Promise</p>
                            <h4 className="text-white font-black text-lg leading-tight">100% Cold Pressed<br />Zero Additives</h4>
                        </div>
                    </motion.div>

                    {/* Newsletter Capture */}
                    <motion.div
                        variants={cardVariants}
                        className="col-span-4 bento-card p-6 border-dashed border-primary/30 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                            <div className="text-center md:text-left space-y-1">
                                <h3 className="text-xl font-black italic tracking-tighter">Join the Aura Circle</h3>
                                <p className="text-xs text-slate-400 font-medium">Get exclusive deals and first sip access.</p>
                            </div>
                            <form onSubmit={handleNewsletter} className="w-full flex flex-col gap-2">
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        value={newsletterEmail}
                                        onChange={(e) => setNewsletterEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="flex-1 bg-accent-dark border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-all"
                                        required
                                    />
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        disabled={isSubscribing}
                                        type="submit"
                                        className="bg-primary text-white font-black px-6 py-3 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50"
                                    >
                                        {isSubscribing ? '...' : 'Join'}
                                    </motion.button>
                                </div>
                                {subscribeStatus && (
                                    <p className={`text-[10px] font-bold uppercase tracking-widest ${subscribeStatus.type === 'success' ? 'text-secondary' : 'text-red-400'}`}>
                                        {subscribeStatus.msg}
                                    </p>
                                )}
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            </main>
        </div>
    );
};

export default Home;
