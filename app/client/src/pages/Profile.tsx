import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import OrderTimeline from '../components/OrderTimeline';

const Profile = () => {
    const { user, logout, updateUser, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Local editing state
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameInput, setNameInput] = useState(user?.name ?? '');
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [addressInput, setAddressInput] = useState(() => {
        if (typeof user?.address === 'object' && user.address !== null) {
            const { street, city, state } = user.address as any;
            return [street, city, state].filter(Boolean).join(', ');
        }
        return (user?.address as any) ?? '';
    });
    const [phoneInput, setPhoneInput] = useState(user?.phone ?? '');
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar ?? null);
    const [savedToast, setSavedToast] = useState(false);
    const [orders, setOrders] = useState<any[]>([]);
    const [showOrders, setShowOrders] = useState(false);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else {
            fetchMyOrders();
        }
    }, [isAuthenticated, navigate]);

    const fetchMyOrders = async () => {
        try {
            setLoadingOrders(true);
            const { data } = await api.get('/orders/myorders');
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders', error);
        } finally {
            setLoadingOrders(false);
        }
    };

    const initials = (user?.name ?? 'A').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

    const handleAvatarClick = () => fileInputRef.current?.click();

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setAvatarPreview(url);
        updateUser({ avatar: url });
    };

    const saveName = () => {
        if (nameInput.trim()) {
            updateUser({ name: nameInput.trim() });
            showToast();
        }
        setIsEditingName(false);
    };

    const saveAddress = () => {
        updateUser({ address: addressInput, phone: phoneInput });
        setIsEditingAddress(false);
        showToast();
    };

    const showToast = () => {
        setSavedToast(true);
        setTimeout(() => setSavedToast(false), 2200);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { icon: 'receipt_long', label: 'Order History', sub: `${orders.length} orders found`, action: () => setShowOrders(true) },
        { icon: 'local_offer', label: 'Promo Codes', sub: 'AURAFRESH24 active', action: () => { } },
        { icon: 'favorite', label: 'Wishlist', sub: 'Saved products', action: () => { } },
        { icon: 'help_outline', label: 'Help & Support', sub: 'Chat with us', action: () => window.open('https://wa.me/message/LFA2LUMSBCYAL1', '_blank') },
        { icon: 'shopping_bag', label: 'Visit Paystack Shop', sub: 'Buy via external link', action: () => window.open('https://paystack.shop/pay/fruits-aura', '_blank') },
    ];

    return (
        <div className="bg-background-dark text-white min-h-screen pb-32 relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/8 rounded-full blur-[100px] pointer-events-none" />

            {/* Saved toast */}
            <AnimatePresence>
                {savedToast && (
                    <motion.div
                        initial={{ y: -60, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -60, opacity: 0 }}
                        className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] bg-secondary text-black font-black text-sm px-5 py-3 rounded-2xl shadow-xl shadow-secondary/30 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg filled">check_circle</span>
                        Profile saved!
                    </motion.div>
                )}
            </AnimatePresence>

            <header className="px-6 pt-14 pb-4 flex items-center justify-between sticky top-0 z-50 bg-background-dark/85 backdrop-blur-xl border-b border-white/[0.04]">
                <h1 className="text-xl font-black">Profile</h1>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-full glass flex items-center justify-center cursor-pointer"
                >
                    <span className="material-symbols-outlined text-primary">dark_mode</span>
                </motion.button>
            </header>

            <main className="px-5 pt-5 space-y-5">
                {/* Avatar card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="liquid-glass p-6 flex flex-col items-center gap-4"
                >
                    {/* Tappable avatar */}
                    <div className="relative">
                        <motion.button
                            whileTap={{ scale: 0.93 }}
                            whileHover={{ scale: 1.04 }}
                            onClick={handleAvatarClick}
                            className="relative w-24 h-24 rounded-3xl overflow-hidden border-2 border-primary/40 shadow-xl shadow-primary/20 cursor-pointer"
                        >
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-primary flex items-center justify-center">
                                    <span className="text-white text-2xl font-black">{initials}</span>
                                </div>
                            )}
                        </motion.button>
                        <motion.div
                            whileTap={{ scale: 0.85 }}
                            onClick={handleAvatarClick}
                            className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-lg cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-white text-sm">photo_camera</span>
                        </motion.div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                        />
                    </div>

                    {/* Inline name edit */}
                    <div className="text-center w-full">
                        <AnimatePresence mode="wait">
                            {isEditingName ? (
                                <motion.div
                                    key="editing"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="flex items-center gap-2 justify-center"
                                >
                                    <input
                                        autoFocus
                                        value={nameInput}
                                        onChange={(e) => setNameInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && saveName()}
                                        className="bg-accent-dark border border-primary/40 rounded-xl py-2 px-4 text-center font-black text-lg outline-none w-full max-w-[220px]"
                                    />
                                    <motion.button whileTap={{ scale: 0.85 }} onClick={saveName} className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center cursor-pointer flex-shrink-0">
                                        <span className="material-symbols-outlined text-black text-sm filled">check</span>
                                    </motion.button>
                                    <motion.button whileTap={{ scale: 0.85 }} onClick={() => setIsEditingName(false)} className="w-9 h-9 glass rounded-xl flex items-center justify-center cursor-pointer flex-shrink-0">
                                        <span className="material-symbols-outlined text-slate-400 text-sm">close</span>
                                    </motion.button>
                                </motion.div>
                            ) : (
                                <motion.button
                                    key="display"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={() => { setNameInput(user?.name ?? ''); setIsEditingName(true); }}
                                    className="flex items-center gap-2 justify-center cursor-pointer group"
                                >
                                    <h2 className="text-2xl font-black group-hover:text-primary transition-colors">{user?.name ?? 'Aura User'}</h2>
                                    <span className="material-symbols-outlined text-slate-600 group-hover:text-primary transition-colors text-sm">edit</span>
                                </motion.button>
                            )}
                        </AnimatePresence>
                        <span className="inline-block bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mt-1 border border-primary/20">
                            {user?.plan ?? 'Auraset Subscriber'}
                        </span>
                        <div className="mt-3 flex items-center justify-center gap-2">
                            <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min((((user as any)?.loyaltyPoints || 0) % 1000) / 10, 100)}%` }}
                                    className="h-full bg-primary"
                                />
                            </div>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">
                                {1000 - (((user as any)?.loyaltyPoints || 0) % 1000)} pts to next reward
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Loyalty Points / Aura Rewards Card */}
                <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="bg-primary/5 border border-primary/20 rounded-3xl p-4 flex flex-col items-center justify-center gap-1">
                        <span className="text-primary font-black text-2xl">{(user as any)?.loyaltyPoints || 0}</span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Aura Points</span>
                    </div>
                    <div className="bg-secondary/5 border border-secondary/20 rounded-3xl p-4 flex flex-col items-center justify-center gap-1">
                        <span className="text-secondary font-black text-2xl">
                            {((user as any)?.loyaltyPoints || 0) >= 5000 ? 'Gold' : ((user as any)?.loyaltyPoints || 0) >= 2000 ? 'Silver' : 'Bronze'}
                        </span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Tier Status</span>
                    </div>
                </div>

                {/* Invite Friends / Referral Card */}
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="bento-card-orange p-5 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="relative z-10 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs text-white/70 font-black uppercase tracking-widest">Share the Aura</p>
                                <h3 className="text-xl font-black text-white">Invite Friends</h3>
                            </div>
                            <div className="w-10 h-10 bg-white text-primary rounded-full flex items-center justify-center shadow-lg">
                                <span className="material-symbols-outlined font-black">celebration</span>
                            </div>
                        </div>
                        <p className="text-xs text-white/80 leading-relaxed font-medium">Your friends get 10% off their first order, and you earn Aura credit!</p>

                        <div className="flex gap-2">
                            <div className="flex-1 bg-black/20 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center justify-between border border-white/20">
                                <span className="text-sm font-black tracking-widest uppercase">{(user as any)?.referralCode || 'AURA500'}</span>
                                <motion.button
                                    whileTap={{ scale: 0.8 }}
                                    onClick={() => navigator.clipboard.writeText((user as any)?.referralCode || 'AURA500')}
                                    className="text-white hover:text-secondary transition-colors cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-sm">content_copy</span>
                                </motion.button>
                            </div>
                            <motion.button
                                whileTap={{ scale: 0.94 }}
                                className="bg-white text-primary font-black px-6 py-3 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-black/10 cursor-pointer"
                            >
                                Share
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between px-0 pt-2 pb-1">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                            </div>
                            <div>
                                <p className="font-black text-sm">Delivery Address</p>
                                <p className="text-xs text-slate-500 truncate max-w-[200px]">
                                    {typeof user?.address === 'object' && user.address !== null
                                        ? Object.values(user.address).filter(v => typeof v === 'string').join(', ')
                                        : (user?.address as any) || 'Tap to add address'}
                                </p>
                            </div>
                        </div>
                        <motion.button
                            whileTap={{ scale: 0.88 }}
                            onClick={() => setIsEditingAddress(!isEditingAddress)}
                            className="text-primary text-xs font-black uppercase tracking-widest cursor-pointer"
                        >
                            {isEditingAddress ? 'Cancel' : 'Edit'}
                        </motion.button>
                    </div>

                    <AnimatePresence>
                        {isEditingAddress && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                className="overflow-hidden"
                            >
                                <div className="pb-5 space-y-3">
                                    <div className="h-px bg-white/5" />
                                    <input
                                        placeholder="Street address, City, State..."
                                        value={addressInput}
                                        onChange={(e) => setAddressInput(e.target.value)}
                                        className="aura-input"
                                    />
                                    <input
                                        placeholder="Phone number (+234...)"
                                        value={phoneInput}
                                        onChange={(e) => setPhoneInput(e.target.value)}
                                        className="aura-input"
                                    />
                                    <motion.button
                                        whileTap={{ scale: 0.96 }}
                                        onClick={saveAddress}
                                        className="w-full btn-primary py-3 rounded-xl text-sm"
                                    >
                                        Save Address
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* WhatsApp Order */}
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 }}
                    className="bento-card-green p-5 flex items-center justify-between cursor-pointer"
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => window.open('https://wa.me/message/LFA2LUMSBCYAL1', '_blank')}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-secondary/15 border border-secondary/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-secondary">chat</span>
                        </div>
                        <div>
                            <p className="text-xs text-secondary font-black uppercase tracking-widest">Fast Response</p>
                            <p className="font-black text-sm">Order via WhatsApp</p>
                            <p className="text-xs text-slate-500">Chat directly with our team</p>
                        </div>
                    </div>
                    <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-black text-lg">arrow_forward</span>
                    </div>
                </motion.div>

                {/* Menu Items */}
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.16 }}
                    className="liquid-glass overflow-hidden divide-y divide-white/5"
                >
                    {menuItems.map((item, i) => (
                        <motion.button
                            key={item.label}
                            whileTap={{ scale: 0.98 }}
                            onClick={item.action}
                            className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors cursor-pointer text-left"
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.18 + i * 0.05 }}
                        >
                            <div className="w-10 h-10 rounded-xl bg-accent-dark border border-white/5 flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-slate-400 text-lg">{item.icon}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-black text-sm text-white">{item.label}</p>
                                <p className="text-xs text-slate-500">{item.sub}</p>
                            </div>
                            <span className="material-symbols-outlined text-slate-600 text-sm">chevron_right</span>
                        </motion.button>
                    ))}
                </motion.div>

                {/* Logout */}
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <motion.button
                        whileTap={{ scale: 0.96 }}
                        whileHover={{ borderColor: 'rgba(239,68,68,0.5)' }}
                        onClick={handleLogout}
                        className="w-full border border-white/8 text-red-400 font-black py-4 rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        Log Out
                    </motion.button>
                </motion.div>
            </main>

            {/* Orders Overlay */}
            <AnimatePresence>
                {showOrders && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-background-dark/95 backdrop-blur-2xl px-6 pt-20 pb-10 overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black">Order History</h2>
                            <button onClick={() => setShowOrders(false)} className="w-10 h-10 glass rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {loadingOrders ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Fetching Auras...</p>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-20 space-y-4">
                                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                                    <span className="material-symbols-outlined text-slate-600 text-4xl">inventory_2</span>
                                </div>
                                <h3 className="text-lg font-bold">No orders yet</h3>
                                <p className="text-slate-500 text-sm max-w-[240px] mx-auto">Your aura journey begins with your first sip. Visit the menu to start!</p>
                                <button onClick={() => navigate('/menu')} className="btn-primary px-8 py-3 rounded-xl text-sm mt-4">Browse Menu</button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <div key={order._id} className="bento-card p-5 border border-white/5 bg-white/[0.03]">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Order ID</p>
                                                <p className="font-bold text-xs">#{order._id.slice(-8).toUpperCase()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Date</p>
                                                <p className="font-bold text-xs">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3 mb-4">
                                            {order.orderItems.map((item: any) => (
                                                <div key={item._id} className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 overflow-hidden">
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-bold text-xs">{item.name}</p>
                                                        <p className="text-[10px] text-slate-500">Qty: {item.qty} × ₦{item.price.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-white/5 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${order.isPaid ? 'bg-green-500' : 'bg-red-500'}`} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                        {order.isPaid ? 'Paid' : 'Pending'}
                                                    </span>
                                                </div>
                                                <p className="text-xl font-black text-primary">₦{order.totalPrice.toLocaleString()}</p>
                                            </div>

                                            {/* New Order Lifecycle Timeline */}
                                            <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                                                <OrderTimeline status={order.status || 'PLACED'} date={order.createdAt} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;
