import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const navigate = useNavigate();
    const { cart, removeFromCart, updateQuantity, subtotal } = useCart();

    const deliveryFee = cart.length > 0 ? 1500 : 0;
    const discount = cart.length > 0 ? 500 : 0;
    const total = subtotal + deliveryFee - discount;

    return (
        <div className="bg-background-dark text-white min-h-screen pb-40">
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="px-6 pt-14 pb-4 sticky top-0 z-50 bg-background-dark/90 backdrop-blur-xl border-b border-white/[0.04]"
            >
                <div className="flex items-center justify-between">
                    <motion.button onClick={() => navigate(-1)} whileTap={{ scale: 0.88 }} className="w-11 h-11 rounded-full glass flex items-center justify-center cursor-pointer">
                        <span className="material-symbols-outlined text-white">arrow_back_ios_new</span>
                    </motion.button>
                    <h1 className="text-xl font-black">Your <span className="text-primary">Bag</span></h1>
                    <motion.button whileTap={{ scale: 0.88 }} className="w-11 h-11 rounded-full glass flex items-center justify-center cursor-pointer">
                        <span className="material-symbols-outlined text-white">more_vert</span>
                    </motion.button>
                </div>
            </motion.header>

            <main className="px-5 mt-4 space-y-3">
                <AnimatePresence>
                    {cart.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center justify-center h-64 text-center opacity-50 space-y-4"
                        >
                            <motion.span
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                                className="material-symbols-outlined text-6xl text-primary"
                            >
                                shopping_bag
                            </motion.span>
                            <p className="text-sm font-black tracking-widest uppercase">Your bag is empty</p>
                            <Link to="/menu">
                                <motion.button
                                    whileTap={{ scale: 0.94 }}
                                    className="bg-primary/20 text-primary px-6 py-2.5 rounded-full font-black text-sm border border-primary/20"
                                >
                                    Browse Menu
                                </motion.button>
                            </Link>
                        </motion.div>
                    ) : (
                        <motion.div key="items" className="space-y-3">
                            <AnimatePresence>
                                {cart.map((item) => (
                                    <motion.div
                                        key={`${item.id}-${item.isBundle}`}
                                        layout
                                        initial={{ opacity: 0, x: -20, height: 0 }}
                                        animate={{ opacity: 1, x: 0, height: 'auto' }}
                                        exit={{ opacity: 0, x: 20, height: 0 }}
                                        transition={{ duration: 0.35, ease: 'easeOut' }}
                                        className="liquid-glass"
                                    >
                                        <div className="p-4 flex gap-4">
                                            <div className="w-24 h-24 bg-accent-dark rounded-3xl flex items-center justify-center p-2 shrink-0 overflow-hidden">
                                                <img alt={item.name} className="w-full h-full object-contain" src={item.image} style={{ filter: item.cssFilter }} />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-black text-base leading-tight">{item.name}</h4>
                                                        {item.subtext && (
                                                            <p className="text-[10px] text-primary font-black uppercase tracking-wider mt-0.5">{item.subtext}</p>
                                                        )}
                                                    </div>
                                                    <motion.button
                                                        whileTap={{ scale: 0.8 }}
                                                        onClick={() => removeFromCart(item.id, item.isBundle)}
                                                        className="text-slate-600 hover:text-red-400 transition-colors cursor-pointer ml-2"
                                                    >
                                                        <span className="material-symbols-outlined text-xl">delete</span>
                                                    </motion.button>
                                                </div>
                                                <div className="flex items-center justify-between mt-3">
                                                    <AnimatePresence mode="wait">
                                                        <motion.span
                                                            key={item.price * item.quantity}
                                                            initial={{ opacity: 0, y: -8 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: 8 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="text-lg font-black"
                                                        >
                                                            ₦{(item.price * item.quantity).toLocaleString()}
                                                        </motion.span>
                                                    </AnimatePresence>
                                                    <div className="flex items-center bg-background-dark rounded-xl px-2 py-1.5 gap-3 border border-white/5">
                                                        <motion.button whileTap={{ scale: 0.8 }} onClick={() => updateQuantity(item.id, item.isBundle, -1)} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer">
                                                            <span className="material-symbols-outlined text-sm">remove</span>
                                                        </motion.button>
                                                        <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                                                        <motion.button whileTap={{ scale: 0.8 }} onClick={() => updateQuantity(item.id, item.isBundle, 1)} className="w-7 h-7 flex items-center justify-center text-primary cursor-pointer">
                                                            <span className="material-symbols-outlined text-sm font-bold">add</span>
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Promo code */}
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bento-card p-4 border-dashed border-primary/30 bg-primary/5"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/15 rounded-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-primary">confirmation_number</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-black">AURAFRESH24</p>
                                            <p className="text-[10px] text-slate-500 font-medium">Promo code applied</p>
                                        </div>
                                    </div>
                                    <span className="text-secondary font-black text-sm">−₦{discount.toLocaleString()}</span>
                                </div>
                            </motion.div>

                            {/* Summary */}
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bento-card-orange space-y-4 mb-8"
                            >
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Order Summary</h3>
                                <div className="space-y-2">
                                    {[
                                        { label: 'Subtotal', value: `₦${subtotal.toLocaleString()}`, color: '' },
                                        { label: 'Delivery Fee', value: `₦${deliveryFee.toLocaleString()}`, color: '' },
                                        { label: 'Discount', value: `−₦${discount.toLocaleString()}`, color: 'text-secondary' },
                                    ].map((row) => (
                                        <div key={row.label} className="flex justify-between items-center text-sm">
                                            <span className="text-slate-400">{row.label}</span>
                                            <span className={`font-black ${row.color}`}>{row.value}</span>
                                        </div>
                                    ))}
                                    <div className="h-px bg-white/5 my-2" />
                                    <div className="flex justify-between items-center">
                                        <span className="text-base font-black">Total Amount</span>
                                        <motion.span
                                            key={total}
                                            initial={{ scale: 0.85, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="text-2xl font-black text-primary"
                                        >
                                            ₦{Math.max(0, total).toLocaleString()}
                                        </motion.span>
                                    </div>
                                </div>
                                <Link to="/checkout" className="block w-full">
                                    <motion.button
                                        whileTap={{ scale: 0.96 }}
                                        whileHover={{ boxShadow: '0 12px 40px rgba(255,107,0,0.45)' }}
                                        className="w-full bg-primary text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/25 cursor-pointer transition-all"
                                    >
                                        Checkout Now
                                        <span className="material-symbols-outlined">arrow_forward</span>
                                    </motion.button>
                                </Link>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default Cart;
