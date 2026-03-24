import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import api from '../api/client';
import { useCart } from '../context/CartContext';
import { getProducts } from '../api/products';
import type { Product } from '../api/products';
import SwipeCarousel from '../components/SwipeCarousel';
import { useTranslation } from 'react-i18next';
import { 
    User as UserIcon, 
    ShoppingBag, 
    Search, 
    ChevronRight, 
    Leaf, 
    Zap, 
    ShieldCheck, 
    Verified, 
    Star, 
    Quote, 
    ArrowRight 
} from 'lucide-react';

const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] } },
};

const testimonials = [
    { name: "Sarah K.", role: "Yoga Instructor", text: "The Detox Aura is my post-session ritual. Pure bliss.", rating: 5, avatar: "https://i.pravatar.cc/150?u=sarah" },
    { name: "James L.", role: "Tech Lead", text: "Energy Aura kept me focused through the hardest sprint.", rating: 5, avatar: "https://i.pravatar.cc/150?u=james" },
    { name: "Amaka R.", role: "Wellness Blogger", text: "The Glow Set is actual magic. My skin says thank you!", rating: 5, avatar: "https://i.pravatar.cc/150?u=amaka" },
];

const Home = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [subscribeStatus, setSubscribeStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        getProducts()
            .then((data) => {
                const vibrant = data.filter(p => p.isVibrant);
                setProducts(vibrant.slice(0, 2));
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
        <div className="min-h-screen pb-32 aurora-bg">
            {/* Header */}
            <motion.header
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="px-6 pt-14 pb-4 flex justify-between items-center sticky top-0 z-40 bg-background-dark/85 backdrop-blur-xl border-b border-white/[0.04]"
            >
                <div className="flex items-center gap-3">
                    <Link to="/profile">
                        <motion.div
                            whileTap={{ scale: 0.92 }}
                            whileHover={{ scale: 1.05 }}
                            className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center border-2 border-white/10 shadow-lg shadow-primary/25 cursor-pointer overflow-hidden"
                        >
                            <UserIcon className="text-white w-5 h-5" />
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
                        <Search className="text-white w-5 h-5" />
                    </motion.button>
                    <motion.div whileTap={{ scale: 0.9 }}>
                        <Link to="/cart">
                            <button className="w-11 h-11 rounded-2xl glass flex items-center justify-center cursor-pointer">
                                <ShoppingBag className="text-white w-5 h-5" />
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
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <SwipeCarousel />
                </motion.div>

                {/* Bento Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-4 gap-4"
                >
                    {/* Categories - Big Card 2x2 */}
                    <motion.div
                        variants={cardVariants}
                        className="col-span-2 row-span-2 liquid-glass p-6 cursor-pointer flex flex-col justify-between"
                        onClick={() => navigate('/menu')}
                        whileHover={{ scale: 1.02, y: -5 }}
                    >
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Verified className="text-primary w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Discover</span>
                            </div>
                            <h3 className="text-2xl font-black leading-tight italic">Find Your<br />Nature's Flow</h3>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mt-6">
                            <div className="liquid-glass-green bg-secondary/5 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border border-secondary/10">
                                <Leaf className="text-secondary w-6 h-6" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Pure Detox</span>
                            </div>
                            <div className="liquid-glass bg-primary/5 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border border-primary/10">
                                <Zap className="text-primary w-6 h-6" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Natural Zap</span>
                            </div>
                        </div>
                        
                        <div className="mt-4 flex items-center justify-between text-xs font-bold text-slate-500">
                            <span>Explore Menu</span>
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </motion.div>

                    {/* Aura Deal - 2x1 */}
                    <motion.div
                        variants={cardVariants}
                        className="col-span-2 h-44 rounded-[2rem] bg-gradient-to-br from-primary to-orange-600 p-6 flex flex-col justify-between cursor-pointer relative overflow-hidden group shadow-xl shadow-primary/20"
                        onClick={() => navigate('/menu')}
                        whileHover={{ scale: 1.02, y: -5 }}
                    >
                        <motion.div
                            className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-2xl group-hover:scale-150 transition-transform duration-1000"
                        />
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-1">
                                <Star className="text-white w-3 h-3 fill-white" />
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/80">Limited Vibe</span>
                            </div>
                            <h3 className="text-3xl font-black text-white italic tracking-tighter">25% OFF</h3>
                        </div>
                        <p className="text-[10px] font-black text-white/90 uppercase tracking-[.25em] relative z-10 mt-auto flex items-center gap-2">
                            Weekend Aura <ChevronRight className="w-3 h-3" />
                        </p>
                    </motion.div>

                    {/* Freshness Stats - 2x1 */}
                    <motion.div
                        variants={cardVariants}
                        className="col-span-2 h-44 liquid-glass border-secondary/20 p-6 flex flex-col justify-between"
                        whileHover={{ scale: 1.02, y: -5 }}
                    >
                        <div className="flex justify-between items-start">
                            <ShieldCheck className="text-secondary w-8 h-8" />
                            <div className="text-right">
                                <span className="text-[8px] font-black uppercase tracking-widest text-secondary block">Quality</span>
                                <span className="text-white font-black text-xs uppercase italic tracking-tighter">Pure 100%</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Cold Pressed Promise</p>
                            <h4 className="text-white font-black text-lg leading-tight uppercase tracking-tighter">Zero Additives</h4>
                        </div>
                    </motion.div>

                    {/* Featured Picks Header */}
                    <motion.div variants={cardVariants} className="col-span-4 flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                            <h3 className="text-2xl font-black tracking-tighter italic">VIBRANT PICKS</h3>
                            <div className="h-1px w-12 bg-primary/20" />
                        </div>
                        <Link to="/menu" className="group flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-[.2em]">
                            View All <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>

                    {/* Product Picks - 2x2 each (or 2x1 for dense feel) */}
                    {loading ? (
                        <>
                            {[1, 2].map((i) => (
                                <motion.div key={i} variants={cardVariants} className="col-span-2 h-80 shimmer rounded-[2rem]" />
                            ))}
                        </>
                    ) : (
                        products.map((product) => (
                            <motion.div
                                key={product.id}
                                variants={cardVariants}
                                className="col-span-2 cursor-pointer"
                                onClick={() => navigate(`/product/${product.id}`)}
                                whileHover={{ scale: 1.02, y: -5 }}
                            >
                                <div className="liquid-glass h-80 relative group overflow-hidden">
                                    <div className="absolute top-4 left-4 z-20 flex gap-2">
                                        <div className="px-2 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[8px] font-black uppercase tracking-widest text-white">
                                            {product.subtext}
                                        </div>
                                    </div>
                                    
                                    <img
                                        alt={product.name}
                                        loading="lazy"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                        src={product.image}
                                        style={{ filter: product.cssFilter }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                    
                                    <div className="absolute bottom-5 left-5 right-5 z-10">
                                        <h4 className="text-white font-black text-lg leading-tight tracking-tighter italic mb-1 uppercase">{product.name}</h4>
                                        <div className="flex items-center justify-between items-end">
                                            <span className="text-primary font-black text-2xl tracking-tighter">₦{product.price.toLocaleString()}</span>
                                            <motion.button
                                                whileTap={{ scale: 0.85 }}
                                                onClick={(e) => handleQuickAdd(product, e)}
                                                className="w-10 h-10 bg-white text-black rounded-2xl flex items-center justify-center cursor-pointer shadow-xl shadow-white/10 hover:bg-primary hover:text-white transition-colors"
                                            >
                                                <ShoppingBag size={18} fill="currentColor" />
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}

                    {/* Community Vibe Check - 4x1 */}
                    <motion.div
                        variants={cardVariants}
                        className="col-span-4 liquid-glass p-8 relative overflow-hidden group"
                    >
                        <div className="absolute -left-12 -top-12 w-48 h-48 bg-secondary/5 rounded-full blur-3xl" />
                        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <Quote className="text-primary w-6 h-6 opacity-30" />
                                <h3 className="text-xl font-black italic tracking-tighter">COMMUNITY VIBE</h3>
                            </div>
                            
                            <div className="flex overflow-x-auto hide-scrollbar snap-x gap-6">
                                {testimonials.map((t, i) => (
                                    <div key={i} className="min-w-[280px] snap-center p-6 rounded-3xl bg-white/5 border border-white/5">
                                        <div className="flex items-center gap-3 mb-4">
                                            <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full border border-primary/20 shadow-lg" />
                                            <div>
                                                <p className="text-xs font-black uppercase text-white tracking-widest">{t.name}</p>
                                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{t.role}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-300 italic font-medium leading-relaxed">"{t.text}"</p>
                                        <div className="flex gap-1 mt-4">
                                            {[...Array(t.rating)].map((_, i) => (
                                                <Star key={i} className="w-2.5 h-2.5 text-primary fill-primary" />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Newsletter Capture - 4x1 */}
                    <motion.div
                        variants={cardVariants}
                        className="col-span-4 rounded-[2.5rem] p-8 border border-white/10 bg-accent-dark/50 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                        
                        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Insider Access</span>
                                </div>
                                <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none">The Aura<br />Circle</h3>
                                <p className="text-xs text-slate-400 font-medium tracking-wide">Enter your sip-signature and stay ahead of the flow.</p>
                            </div>
                            
                            <div className="w-full flex flex-col gap-2 relative">
                                <AnimatePresence mode="wait">
                                    {subscribeStatus?.type === 'success' ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bg-secondary/20 border border-secondary/30 rounded-2xl p-6 flex items-center justify-center gap-3 text-secondary"
                                        >
                                            <Verified className="w-6 h-6" />
                                            <span className="text-sm font-black uppercase tracking-widest">You're in the Circle!</span>
                                        </motion.div>
                                    ) : (
                                        <form onSubmit={handleNewsletter} className="w-full space-y-3">
                                            <div className="relative group">
                                                <input
                                                    type="email"
                                                    value={newsletterEmail}
                                                    onChange={(e) => setNewsletterEmail(e.target.value)}
                                                    placeholder="Enter your email"
                                                    className="w-full bg-background-dark/50 border border-white/10 rounded-2xl py-5 px-6 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-300"
                                                    required
                                                />
                                                <motion.button
                                                    whileTap={{ scale: 0.95 }}
                                                    disabled={isSubscribing}
                                                    type="submit"
                                                    className="absolute right-2 top-2 bottom-2 bg-primary text-white font-black px-8 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50 hover:bg-orange-500 transition-colors"
                                                >
                                                    {isSubscribing ? 'Sipping...' : 'Join'}
                                                </motion.button>
                                            </div>
                                            {subscribeStatus?.type === 'error' && (
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 flex items-center gap-2 pl-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                                    {subscribeStatus.msg}
                                                </p>
                                            )}
                                        </form>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </main>
        </div>
    );
};

export default Home;
