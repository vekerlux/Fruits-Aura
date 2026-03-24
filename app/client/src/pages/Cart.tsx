import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, MoreVertical, ShoppingBag, Trash2, Minus, Plus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';

const Cart = () => {
    const navigate = useNavigate();
    const { cart, removeFromCart, updateQuantity, subtotal } = useCart();
    const { t } = useTranslation();

    const deliveryFee = cart.length > 0 ? 1500 : 0;
    const total = subtotal + deliveryFee;

    return (
        <div className="bg-background-dark text-white min-h-screen pb-40 relative overflow-hidden">
             {/* Background Radiance */}
             <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="px-6 pt-14 pb-5 sticky top-0 z-50 bg-background-dark/80 backdrop-blur-xl border-b border-white/[0.05]"
            >
                <div className="flex items-center justify-between">
                    <motion.button 
                        onClick={() => navigate(-1)} 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }} 
                        className="w-12 h-12 rounded-2xl glass flex items-center justify-center cursor-pointer border border-white/10"
                    >
                        <ChevronLeft className="w-6 h-6 text-white" />
                    </motion.button>
                    <h1 className="text-2xl font-black tracking-tight leading-none">
                        {t('cart.title1', 'Your')} <span className="text-primary glow-text-orange">{t('cart.title2', 'Bag')}</span>
                    </h1>
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }} 
                        className="w-12 h-12 rounded-2xl glass flex items-center justify-center cursor-pointer border border-white/10"
                    >
                        <MoreVertical className="w-5 h-5 text-white" />
                    </motion.button>
                </div>
            </motion.header>

            <main className="px-6 mt-8 space-y-4 relative z-10">
                <AnimatePresence mode="popLayout">
                    {cart.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="flex flex-col items-center justify-center py-24 text-center space-y-6 bg-card-dark/30 rounded-[3rem] border border-dashed border-white/5"
                        >
                            <motion.div
                                animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shadow-inner"
                            >
                                <ShoppingBag className="w-10 h-10 text-primary animate-pulse" />
                            </motion.div>
                            <div>
                                <p className="text-base font-black tracking-widest uppercase text-slate-400">{t('cart.empty', 'Your bag is empty')}</p>
                                <p className="text-[10px] text-slate-600 mt-2 font-black uppercase tracking-widest px-8 leading-relaxed">Discover Nigeria's most vibrant cold-pressed aura</p>
                            </div>
                            <Link to="/menu">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-primary hover:bg-orange-600 text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 transition-all border border-primary/30"
                                >
                                    {t('cart.browse', 'Browse Menu')}
                                </motion.button>
                            </Link>
                        </motion.div>
                    ) : (
                        <motion.div key="items" className="space-y-4">
                            <AnimatePresence mode="popLayout">
                                {cart.map((item) => (
                                    <motion.div
                                        key={`${item.id}-${item.isBundle}-${item.size}`}
                                        layout
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 100, scale: 0.8 }}
                                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                        className="liquid-glass rounded-[2rem] border border-white/5 overflow-hidden group"
                                    >
                                        <div className="p-5 flex gap-5">
                                            <div className="w-28 h-28 bg-accent-dark/40 rounded-[1.75rem] flex items-center justify-center p-3 shrink-0 overflow-hidden border border-white/5 shadow-inner">
                                                <img alt={item.name} className="w-full h-full object-contain drop-shadow-xl" src={item.image} style={{ filter: item.cssFilter }} />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between min-w-0 py-1">
                                                <div className="flex justify-between items-start">
                                                    <div className="min-w-0">
                                                        <h4 className="font-black text-lg leading-tight truncate">{item.name}</h4>
                                                        {item.subtext && (
                                                            <p className="text-[9px] text-primary/70 font-black uppercase tracking-[0.15em] mt-1.5 leading-none">{item.subtext}</p>
                                                        )}
                                                    </div>
                                                    <motion.button
                                                        whileHover={{ scale: 1.2, color: '#ff4d4d' }}
                                                        whileTap={{ scale: 0.8 }}
                                                        onClick={() => removeFromCart(item.id, item.isBundle, item.size)}
                                                        className="text-slate-700 hover:text-red-500 transition-colors cursor-pointer p-1"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </motion.button>
                                                </div>
                                                <div className="flex items-center justify-between mt-5">
                                                    <AnimatePresence mode="wait">
                                                        <motion.span
                                                            key={item.price * item.quantity}
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: 10 }}
                                                            transition={{ duration: 0.3 }}
                                                            className="text-xl font-black tracking-tight"
                                                        >
                                                            ₦{(item.price * item.quantity).toLocaleString()}
                                                        </motion.span>
                                                    </AnimatePresence>
                                                    <div className="flex items-center bg-background-dark/80 backdrop-blur-sm rounded-2xl px-2 py-1.5 gap-4 border border-white/10 shadow-inner">
                                                        <motion.button 
                                                            whileHover={{ scale: 1.2, color: '#fff' }}
                                                            whileTap={{ scale: 0.8 }} 
                                                            onClick={() => updateQuantity(item.id, item.isBundle, -1, item.size)} 
                                                            className="w-8 h-8 flex items-center justify-center text-slate-500 cursor-pointer"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </motion.button>
                                                        <span className="text-sm font-black w-3 text-center tabular-nums">{item.quantity}</span>
                                                        <motion.button 
                                                            whileHover={{ scale: 1.2, color: '#f27f0d' }}
                                                            whileTap={{ scale: 0.8 }} 
                                                            onClick={() => updateQuantity(item.id, item.isBundle, 1, item.size)} 
                                                            className="w-8 h-8 flex items-center justify-center text-primary cursor-pointer"
                                                        >
                                                            <Plus className="w-4 h-4 stroke-[3px]" />
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bento-card-orange space-y-6 mt-10 mb-8 p-8"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-1 h-1 rounded-full bg-white/40" />
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">{t('cart.summary', 'Aura Summary')}</h3>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { label: t('cart.subtotal', 'Liquid Asset'), value: `₦${subtotal.toLocaleString()}`, color: '' },
                                        { label: t('cart.delivery', 'Delivery Flux'), value: `₦${deliveryFee.toLocaleString()}`, color: '' },
                                    ].map((row) => (
                                        <div key={row.label} className="flex justify-between items-center text-sm">
                                            <span className="text-white/60 font-medium">{row.label}</span>
                                            <span className={`font-black tracking-tight ${row.color}`}>{row.value}</span>
                                        </div>
                                    ))}
                                    <div className="h-px bg-white/10 my-4" />
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-black">{t('cart.total', 'Total Investment')}</span>
                                        <motion.span
                                            key={total}
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="text-3xl font-black text-white drop-shadow-md"
                                        >
                                            ₦{Math.max(0, total).toLocaleString()}
                                        </motion.span>
                                    </div>
                                </div>
                            </motion.div>
                            
                            <Link to="/checkout" className="block w-full pb-10">
                                <motion.button
                                    whileHover={{ scale: 1.02, y: -4, backgroundColor: '#f27f0d' }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-primary text-white font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 cursor-pointer border border-primary/20"
                                >
                                    <span className="uppercase tracking-widest text-sm">{t('cart.checkout', 'Commit to Aura')}</span>
                                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </motion.button>
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default Cart;
 Cart;
