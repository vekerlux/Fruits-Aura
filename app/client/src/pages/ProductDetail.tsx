import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { getProductById } from '../api/products';
import type { Product } from '../api/products';
import { getProductReviews, createReview } from '../api/reviews';
import type { Review } from '../api/reviews';
import { useAuth } from '../context/AuthContext';
import { 
    ArrowLeft, 
    Heart, 
    Star, 
    Minus, 
    Plus, 
    ShoppingBag, 
    CheckCircle2, 
    Info, 
    Sparkles,
    ShieldCheck,
    Zap,
    ChevronRight,
    Quote
} from 'lucide-react';

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
    const [size, setSize] = useState<'big' | 'small'>('big');
    const [quantity, setQuantity] = useState(1);
    const [addedFlash, setAddedFlash] = useState(false);

    // Review state
    const { isAuthenticated, user } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isReviewing, setIsReviewing] = useState(false);
    const [reviewLoading, setReviewLoading] = useState(false);

    useEffect(() => {
        if (!id) return;
        
        const fetchData = async () => {
            setLoading(true);
            try {
                const productData = await getProductById(id);
                if (productData) {
                    setProduct(productData);
                    getProductReviews(id).then(setReviews).catch(() => setReviews([]));
                } else {
                    navigate('/menu');
                }
            } catch (error) {
                navigate('/menu');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, navigate]);

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !comment) return;
        try {
            setReviewLoading(true);
            await createReview(id, rating, comment);
            const updatedReviews = await getProductReviews(id);
            setReviews(updatedReviews);
            setComment('');
            setIsReviewing(false);
        } catch (error) {
            alert('Could not post review.');
        } finally {
            setReviewLoading(false);
        }
    };

    if (loading || !product) {
        return (
            <div className="bg-background-dark text-white min-h-screen flex items-center justify-center">
                <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-primary font-black tracking-widest uppercase text-sm flex items-center gap-3"
                >
                    <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                    Focusing Your Aura...
                </motion.div>
            </div>
        );
    }

    const getPrice = () => {
        if (isBundle) {
            return size === 'big' ? 7999 : 6000;
        }
        return size === 'big' ? 2500 : 1500;
    };

    const price = getPrice();

    const handleAddToBag = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price,
            quantity,
            image: product.image,
            isBundle,
            size,
            subtext: isBundle ? `Aura-set (${size === 'big' ? '3+1' : '4+1'})` : `${size.toUpperCase()} BOTTLE`,
            cssFilter: product.cssFilter
        });
        setAddedFlash(true);
        setTimeout(() => navigate('/cart'), 600);
    };

    return (
        <div className="bg-background-dark text-white min-h-screen pb-48 aurora-bg">
            {/* Fixed Header */}
            <div className="px-6 pt-14 pb-4 flex justify-between items-center fixed top-0 w-full z-50 bg-background-dark/85 backdrop-blur-xl border-b border-white/[0.04]">
                <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={() => navigate(-1)}
                    className="w-11 h-11 rounded-2xl glass flex items-center justify-center cursor-pointer"
                >
                    <ArrowLeft className="text-white w-5 h-5" />
                </motion.button>
                <div className="flex gap-2">
                    <motion.button
                        whileTap={{ scale: 0.88 }}
                        whileHover={{ scale: 1.08 }}
                        className="w-11 h-11 rounded-2xl glass flex items-center justify-center cursor-pointer"
                    >
                        <Heart className="text-primary w-5 h-5" />
                    </motion.button>
                </div>
            </div>

            <main>
                {/* Product Hero */}
                <div className="h-[26rem] bg-accent-dark/30 rounded-b-[4rem] relative flex items-center justify-center pt-20 overflow-hidden border-b border-white/[0.05]">
                    {/* Dynamic Atmosphere Glow */}
                    <motion.div
                        className="absolute w-[80%] aspect-square rounded-full blur-[100px] opacity-20"
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                        style={{ background: `radial-gradient(circle, var(--primary) 0%, transparent 70%)` }}
                    />
                    
                    {/* Product Image with HSL Glow */}
                    <motion.div
                        className="relative z-10 w-[70%] h-[110%] flex items-center justify-center"
                        initial={{ y: 40, opacity: 0, rotate: -5 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] as const }}
                    >
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(242,127,13,0.3)] filter-glow-primary"
                            style={{ animation: 'float 6s ease-in-out infinite', filter: product.cssFilter }}
                        />
                    </motion.div>

                    {/* Rating badge */}
                    <div className="absolute bottom-10 right-8 glass px-4 py-2 rounded-2xl flex items-center gap-2 z-20 shadow-xl border-white/10">
                        <Star className="text-yellow-400 w-4 h-4 fill-yellow-400" />
                        <span className="font-black text-sm tracking-tighter">
                            {reviews.length > 0
                                ? (reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length).toFixed(1)
                                : '5.0'}
                        </span>
                        <div className="h-3 w-px bg-white/10" />
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{reviews.length} Checks</span>
                    </div>
                </div>

                <div className="px-6 pt-8 space-y-8 min-h-[500px]">
                    {/* Header Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="text-primary w-3 h-3" />
                            <span className="text-primary text-[10px] font-black tracking-[0.3em] uppercase">{product.subtext}</span>
                        </div>
                        <div className="flex justify-between items-start">
                            <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">{product.name}</h1>
                            <div className="text-right">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={price}
                                        initial={{ y: -10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: 10, opacity: 0 }}
                                        className="text-3xl font-black text-white leading-none tracking-tighter italic"
                                    >
                                        ₦{price.toLocaleString()}
                                    </motion.div>
                                </AnimatePresence>
                                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{isBundle ? 'PRO BUNDLE' : 'RETAIL UNIT'}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Aura-set Highlighted Badge (If not bundle) */}
                    {!isBundle && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                            className="bg-primary/10 border border-primary/20 rounded-[2rem] p-5 flex items-center justify-between group cursor-pointer"
                            onClick={() => setIsBundle(true)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                                    <Zap className="text-white w-6 h-6 fill-white" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black italic tracking-tight uppercase">Unlock Aura-set Savings</h4>
                                    <p className="text-[10px] text-primary font-bold">Save up to ₦1,500 by bundling</p>
                                </div>
                            </div>
                            <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <ChevronRight className="text-primary w-5 h-5" />
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Ingredients & Nutrition */}
                    <div className="grid grid-cols-2 gap-4">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="space-y-4">
                            <h3 className="font-black text-xs text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Info className="w-3 h-3" /> Earth Signature
                            </h3>
                            <div className="flex gap-2 flex-wrap">
                                {product.ingredients.map((item, i) => (
                                    <span key={i} className="bg-white/5 border border-white/5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                        
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="space-y-4">
                            <h3 className="font-black text-xs text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <ShieldCheck className="w-3 h-3" /> Aura Stats
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { label: 'Kcal', value: product.nutrition.kcal },
                                    { label: 'Sugar', value: product.nutrition.sugar },
                                ].map((stat) => (
                                    <div key={stat.label} className="bg-secondary/5 border border-secondary/10 rounded-2xl p-3 text-center">
                                        <p className="text-secondary font-black text-sm leading-none mb-1 tracking-tighter italic">{stat.value}</p>
                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Configuration Section */}
                    <div className="space-y-6 bg-card-dark/50 p-6 rounded-[2.5rem] border border-white/[0.03]">
                        {/* Size Selection */}
                        <div className="space-y-4">
                            <h3 className="font-black text-xs text-slate-400 uppercase tracking-widest">Atmosphere Select</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: 'big', label: 'Big Bottle', vol: '500ml', price: '₦2,500' },
                                    { id: 'small', label: 'Small Bottle', vol: '250ml', price: '₦1,500' }
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setSize(item.id as any)}
                                        className={`p-4 rounded-[2rem] border-2 transition-all flex flex-col gap-1 text-left relative overflow-hidden group ${size === item.id ? 'border-primary bg-primary/10' : 'border-white/5 bg-background-dark/50'}`}
                                    >
                                        {size === item.id && <motion.div layoutId="activeSize" className="absolute inset-0 bg-primary opacity-5" />}
                                        <span className={`font-black text-xs uppercase tracking-tight ${size === item.id ? 'text-white' : 'text-slate-500'}`}>{item.label}</span>
                                        <div className="flex items-center justify-between text-[10px] font-bold">
                                            <span className="opacity-60">{item.vol}</span>
                                            <span className={size === item.id ? 'text-primary' : 'text-slate-600'}>{item.price}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Bundle Control */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-black text-xs text-slate-400 uppercase tracking-widest">Aura-Set Configuration</h3>
                                <motion.button
                                    onClick={() => setIsBundle(!isBundle)}
                                    animate={{ backgroundColor: isBundle ? '#f27f0d' : 'rgba(255,255,255,0.05)' }}
                                    className="relative inline-flex h-8 w-14 items-center rounded-full cursor-pointer border border-white/5 shadow-inner"
                                >
                                    <motion.span
                                        animate={{ x: isBundle ? 28 : 4 }}
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        className="inline-block h-6 w-6 rounded-full bg-white shadow-xl"
                                    />
                                </motion.button>
                            </div>
                            
                            <AnimatePresence>
                                {isBundle && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden space-y-4"
                                    >
                                        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                                                <Sparkles className="text-primary w-4 h-4" />
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-tighter leading-tight italic">
                                                {size === 'big' 
                                                    ? '3 BIG + 1 SMALL FREE • SAVE ₦1,001' 
                                                    : '4 SMALL + 1 SMALL FREE • SAVE ₦1,500'}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex items-center justify-between pt-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Inventory Batch</span>
                                <div className="flex items-center bg-background-dark/80 rounded-2xl p-1 gap-2 border border-white/5">
                                    <motion.button 
                                        whileTap={{ scale: 0.9 }} 
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                                        className="w-10 h-10 flex items-center justify-center text-slate-400 bg-white/5 rounded-xl hover:text-white"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </motion.button>
                                    <span className="text-lg font-black w-8 text-center italic tracking-tighter">{quantity}</span>
                                    <motion.button 
                                        whileTap={{ scale: 0.9 }} 
                                        onClick={() => setQuantity(quantity + 1)} 
                                        className="w-10 h-10 flex items-center justify-center text-primary bg-primary/5 rounded-xl"
                                    >
                                        <Plus className="w-4 h-4 text-primary" />
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vibe Check (Reviews) Section */}
                    <section className="space-y-6 pb-20">
                        <div className="flex justify-between items-center group">
                            <h3 className="font-black text-xs text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 italic">
                                <Quote className="w-3 h-3 text-primary" /> The Global Vibe
                            </h3>
                            {isAuthenticated && !isReviewing && (
                                <button
                                    onClick={() => setIsReviewing(true)}
                                    className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white transition-colors"
                                >
                                    Log Signature
                                </button>
                            )}
                        </div>

                        <AnimatePresence>
                            {isReviewing && (
                                <motion.form
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    onSubmit={handleReviewSubmit}
                                    className="bg-card-dark rounded-3xl p-6 border border-primary/20 space-y-5 shadow-2xl shadow-primary/5"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    onClick={() => setRating(s)}
                                                    className="focus:outline-none group"
                                                >
                                                    <Star className={`w-6 h-6 ${rating >= s ? 'text-yellow-400 fill-yellow-400' : 'text-slate-700'}`} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Describe the atmosphere..."
                                        className="w-full bg-background-dark border border-white/5 rounded-2xl p-5 text-sm outline-none focus:border-primary transition-all shadow-inner"
                                        rows={4}
                                        required
                                    />
                                    <div className="flex gap-3">
                                        <button type="button" onClick={() => setIsReviewing(false)} className="flex-1 bg-white/5 text-white/60 font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest border border-white/5">Cancel</button>
                                        <button
                                            disabled={reviewLoading}
                                            className="flex-[2] bg-primary text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 disabled:opacity-50"
                                        >
                                            {reviewLoading ? 'Locking...' : 'Commit Sign-off'}
                                        </button>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>

                        <div className="grid grid-cols-1 gap-4">
                            {reviews.length === 0 ? (
                                <div className="text-center py-12 glass rounded-3xl border-dashed border-white/10">
                                    <p className="text-xs text-slate-500 font-black uppercase tracking-[0.2em]">Atmosphere Unlogged</p>
                                </div>
                            ) : (
                                reviews.map((rev) => (
                                    <motion.div 
                                        key={rev._id} 
                                        initial={{ opacity: 0 }} 
                                        whileInView={{ opacity: 1 }} 
                                        className="liquid-glass p-6 space-y-4"
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white italic">{rev.name}</span>
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-2.5 h-2.5 ${rev.rating > i ? 'text-primary fill-primary' : 'text-white/5'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-300 leading-relaxed font-medium italic">"{rev.comment}"</p>
                                        <p className="text-[8px] text-slate-600 font-black uppercase tracking-[.4em] text-right">{new Date(rev.createdAt).toLocaleDateString()}</p>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </section>
                </div>
            </main>

            {/* Sticky Action Plate */}
            <div className="fixed bottom-0 left-0 w-full px-6 pb-24 pt-10 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent z-40 pointer-events-none">
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    className="max-w-md mx-auto pointer-events-auto"
                >
                    <motion.button
                        whileTap={{ scale: 0.96 }}
                        animate={addedFlash ? { backgroundColor: '#4ade80', scale: [1, 1.05, 1] } : { backgroundColor: '#f27f0d' }}
                        onClick={handleAddToBag}
                        className="w-full text-white font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 shadow-2xl relative overflow-hidden group cursor-pointer"
                        style={{ boxShadow: '0 20px 50px rgba(242,127,13,0.4)' }}
                    >
                        {addedFlash ? <CheckCircle2 size={24} /> : <ShoppingBag size={24} fill="currentColor" />}
                        <span className="text-sm uppercase tracking-[.25em] italic font-black">
                            {addedFlash ? 'AURA SECURED' : `SECURE FLOW — ₦${(price * quantity).toLocaleString()}`}
                        </span>
                        
                        {/* Shimmer Effect */}
                        <motion.div
                            className="absolute bg-white/20 h-full w-20 skew-x-[-30deg]"
                            animate={{ left: ['-100%', '200%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        />
                    </motion.button>

                    <div className="mt-4 flex justify-center items-center gap-6 opacity-40">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            <span className="text-[8px] font-black tracking-widest uppercase">Verified Pure</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            <span className="text-[8px] font-black tracking-widest uppercase">SSL Protocol</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProductDetail;
