import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Camera, Check, X, Edit2, LogOut, Gift, User, Copy, 
    ChevronRight, Moon, Sun, MessageSquare, ShoppingBag, 
    Box, History, MapPin, CreditCard, Sparkles, CheckCircle2,
    Shield, Heart, HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import OrderTimeline from '../components/OrderTimeline';

const Profile = () => {
    const { user, logout, updateUser, isAuthenticated } = useAuth();
    const navigate = useNavigate();

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

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setAvatarPreview(url);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const uploadRes = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const { data } = await api.put('/auth/profile', { avatar: uploadRes.data.url });
            updateUser(data);
            showToast();
        } catch (error) {
            console.error('Failed to upload avatar:', error);
        }
    };

    const saveName = async () => {
        if (nameInput.trim()) {
            try {
                const { data } = await api.put('/auth/profile', { name: nameInput.trim() });
                updateUser(data);
                showToast();
            } catch (error) {
                console.error('Failed to save name:', error);
            }
        }
        setIsEditingName(false);
    };

    const saveAddress = async () => {
        try {
            const { data } = await api.put('/auth/profile', {
                address: addressInput,
                phone: phoneInput
            });
            updateUser(data);
            setIsEditingAddress(false);
            showToast();
        } catch (error) {
            console.error('Failed to save address:', error);
        }
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
        { icon: History, label: 'Order History', sub: `${orders.length} orders found`, action: () => setShowOrders(true) },
        { icon: Gift, label: 'Promo Codes', sub: 'AURAFRESH24 active', action: () => { } },
        { icon: Heart, label: 'Wishlist', sub: 'Saved products', action: () => { } },
        { icon: HelpCircle, label: 'Help & Support', sub: 'Chat with us', action: () => window.open('https://wa.me/message/LFA2LUMSBCYAL1', '_blank') },
        { icon: ShoppingBag, label: 'Visit Paystack Shop', sub: 'Buy via external link', action: () => window.open('https://paystack.shop/pay/fruits-aura', '_blank') },
    ];

    return (
        <div className="bg-background-dark text-white min-h-screen pb-32 relative overflow-hidden">
             {/* Background Radiance */}
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
             <div className="absolute bottom-40 left-0 w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[80px] -ml-24 pointer-events-none" />

            <AnimatePresence>
                {savedToast && (
                    <motion.div
                        initial={{ y: -60, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: -60, opacity: 0, scale: 0.9 }}
                        className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-secondary text-black font-black text-xs px-6 py-4 rounded-[2rem] shadow-2xl shadow-secondary/30 flex items-center gap-3 border border-white/20"
                    >
                        <CheckCircle2 className="w-5 h-5" />
                        Aura Profile Updated!
                    </motion.div>
                )}
            </AnimatePresence>

            <header className="px-6 pt-14 pb-5 flex items-center justify-between sticky top-0 z-50 bg-background-dark/80 backdrop-blur-xl border-b border-white/[0.05]">
                <h1 className="text-2xl font-black tracking-tight leading-none">Your <span className="text-primary glow-text-orange">Profile</span></h1>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 rounded-2xl glass flex items-center justify-center cursor-pointer border border-white/10"
                >
                    <Moon className="w-5 h-5 text-primary" />
                </motion.button>
            </header>

            <main className="px-6 pt-8 space-y-6 relative z-10">
                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="liquid-glass p-8 flex flex-col items-center gap-6 rounded-[3.5rem] border border-white/10 shadow-2xl"
                >
                    <div className="relative group">
                        <motion.button
                            whileTap={{ scale: 0.93 }}
                            whileHover={{ scale: 1.04 }}
                            onClick={handleAvatarClick}
                            className="relative w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-white/10 shadow-2xl cursor-pointer"
                        >
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center">
                                    <span className="text-white text-4xl font-black drop-shadow-lg">{initials}</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                <Camera className="w-8 h-8 text-white" />
                            </div>
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.8 }}
                            onClick={handleAvatarClick}
                            className="absolute -bottom-2 -right-2 w-10 h-10 bg-white text-primary rounded-2xl flex items-center justify-center shadow-xl cursor-pointer border-4 border-[#0c0c0c] z-10"
                        >
                            <Camera className="w-5 h-5" />
                        </motion.button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleAvatarChange}
                        />
                    </div>

                    <div className="text-center w-full space-y-3">
                        <AnimatePresence mode="wait">
                            {isEditingName ? (
                                <motion.div
                                    key="editing"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex items-center gap-2 justify-center"
                                >
                                    <input
                                        autoFocus
                                        value={nameInput}
                                        onChange={(e) => setNameInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && saveName()}
                                        className="bg-white/5 border border-primary/30 rounded-2xl py-3 px-6 text-center font-black text-xl outline-none w-full max-w-[280px] backdrop-blur-md shadow-inner"
                                    />
                                    <div className="flex flex-col gap-1">
                                        <motion.button whileTap={{ scale: 0.85 }} onClick={saveName} className="w-10 h-10 bg-secondary text-black rounded-xl flex items-center justify-center cursor-pointer shadow-lg border border-white/20">
                                            <Check className="w-5 h-5 stroke-[3px]" />
                                        </motion.button>
                                        <motion.button whileTap={{ scale: 0.85 }} onClick={() => setIsEditingName(false)} className="w-10 h-10 bg-white/5 text-slate-400 rounded-xl flex items-center justify-center cursor-pointer border border-white/10">
                                            <X className="w-5 h-5" />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.button
                                    key="display"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={() => { setNameInput(user?.name ?? ''); setIsEditingName(true); }}
                                    className="flex flex-col items-center gap-2 cursor-pointer group w-full"
                                >
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-3xl font-black tracking-tight group-hover:text-primary transition-colors">{user?.name ?? 'Aura User'}</h2>
                                        <Edit2 className="w-5 h-5 text-slate-700 group-hover:text-primary transition-colors" />
                                    </div>
                                    <motion.span 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border border-primary/20 shadow-lg shadow-primary/5"
                                    >
                                        <Shield className="w-3 h-3" />
                                        {user?.plan ?? 'Auraset Explorer'}
                                    </motion.span>
                                </motion.button>
                            )}
                        </AnimatePresence>

                        <div className="pt-4 flex flex-col items-center gap-3">
                            <div className="w-full max-w-[200px] h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min((((user as any)?.loyaltyPoints || 0) % 1000) / 10, 100)}%` }}
                                    className="h-full bg-gradient-to-r from-primary to-orange-400 rounded-full shadow-[0_0_12px_rgba(242,127,13,0.5)]"
                                />
                            </div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                {1000 - (((user as any)?.loyaltyPoints || 0) % 1000)} pts to next aura boost
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Rewards Grid */}
                <div className="grid grid-cols-2 gap-4 w-full">
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-[2.5rem] p-6 flex flex-col items-center justify-center gap-2 shadow-xl"
                    >
                        <span className="text-primary font-black text-3xl tracking-tight glow-text-orange">{(user as any)?.loyaltyPoints || 0}</span>
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-3 h-3 text-primary" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Aura Points</span>
                        </div>
                    </motion.div>
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-gradient-to-br from-secondary/10 to-transparent border border-secondary/20 rounded-[2.5rem] p-6 flex flex-col items-center justify-center gap-2 shadow-xl"
                    >
                        <span className="text-secondary font-black text-lg tracking-widest uppercase">
                            {((user as any)?.loyaltyPoints || 0) >= 5000 ? 'Gold' : ((user as any)?.loyaltyPoints || 0) >= 2000 ? 'Silver' : 'Bronze'}
                        </span>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3 text-secondary" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Tier Status</span>
                        </div>
                    </motion.div>
                </div>

                {/* Referral Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                    className="bento-card-orange p-8 rounded-[3rem] relative overflow-hidden group shadow-2xl"
                >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[80px] pointer-events-none -mr-16 -mt-16" />
                    <div className="relative z-10 flex flex-col gap-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-[10px] text-white/60 font-black uppercase tracking-[0.2em]">Referral Program</p>
                                <h3 className="text-2xl font-black text-white tracking-tight">Invite Friends</h3>
                            </div>
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center shadow-2xl border border-white/30">
                                <Gift className="w-7 h-7" />
                            </div>
                        </div>
                        <p className="text-sm text-white/80 leading-relaxed font-medium">Your friends get 10% off their first order, and you earn ₦500 Aura credit!</p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 bg-black/30 backdrop-blur-xl rounded-2xl px-6 py-4 flex items-center justify-between border border-white/10 group/code">
                                <span className="text-lg font-black tracking-[0.3em] uppercase text-white">{(user as any)?.referralCode || 'AURA500'}</span>
                                <motion.button
                                    whileTap={{ scale: 0.8 }}
                                    whileHover={{ scale: 1.1, color: '#f27f0d' }}
                                    onClick={() => {
                                        navigator.clipboard.writeText((user as any)?.referralCode || 'AURA500');
                                        showToast();
                                    }}
                                    className="text-white/60 transition-colors cursor-pointer p-2"
                                >
                                    <Copy className="w-5 h-5" />
                                </motion.button>
                            </div>
                            <motion.button
                                whileTap={{ scale: 0.94 }}
                                whileHover={{ y: -2, backgroundColor: '#fff', color: '#f27f0d' }}
                                className="bg-white/90 backdrop-blur-md text-primary font-black px-8 py-4 rounded-2xl text-xs uppercase tracking-[0.2em] shadow-2xl transition-all cursor-pointer border border-transparent"
                            >
                                Send Invite
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Delivery Info */}
                <div className="space-y-6 pt-4">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg">
                                <MapPin className="text-primary w-6 h-6" />
                            </div>
                            <div className="min-w-0">
                                <p className="font-black text-sm tracking-tight uppercase">Delivery Address</p>
                                <p className="text-xs text-slate-500 truncate max-w-[220px] font-medium mt-0.5">
                                    {typeof user?.address === 'object' && user.address !== null
                                        ? Object.values(user.address).filter(v => typeof v === 'string').join(', ')
                                        : (user?.address as any) || 'Set your aura destination'}
                                </p>
                            </div>
                        </div>
                        <motion.button
                            whileTap={{ scale: 0.88 }}
                            whileHover={{ color: '#f27f0d' }}
                            onClick={() => setIsEditingAddress(!isEditingAddress)}
                            className="text-primary text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer bg-primary/5 px-4 py-2 rounded-xl transition-colors"
                        >
                            {isEditingAddress ? 'Cancel' : 'Update'}
                        </motion.button>
                    </div>

                    <AnimatePresence>
                        {isEditingAddress && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                className="overflow-hidden"
                            >
                                <div className="pb-6 space-y-4 px-2">
                                    <div className="h-px bg-white/5" />
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                            <input
                                                placeholder="Street address, City, State..."
                                                value={addressInput}
                                                onChange={(e) => setAddressInput(e.target.value)}
                                                className="aura-input pl-12"
                                            />
                                        </div>
                                        <div className="relative">
                                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                            <input
                                                placeholder="Phone number (+234...)"
                                                value={phoneInput}
                                                onChange={(e) => setPhoneInput(e.target.value)}
                                                className="aura-input pl-12"
                                            />
                                        </div>
                                    </div>
                                    <motion.button
                                        whileTap={{ scale: 0.96 }}
                                        onClick={saveAddress}
                                        className="w-full bg-primary text-white font-black py-4 rounded-2xl text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 border border-primary/30"
                                    >
                                        Save Address
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* WhatsApp Support */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bento-card-green p-7 rounded-[2.5rem] flex items-center justify-between cursor-pointer border border-secondary/20 shadow-xl overflow-hidden group"
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => window.open('https://wa.me/message/LFA2LUMSBCYAL1', '_blank')}
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[40px] pointer-events-none -mr-16 -mt-16" />
                    <div className="flex items-center gap-5 relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-secondary/20 border border-secondary/30 flex items-center justify-center shadow-lg group-hover:bg-secondary group-hover:text-black transition-colors duration-500">
                            <MessageSquare className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-[9px] text-secondary font-black uppercase tracking-[0.25em] mb-1">Instant Flux</p>
                            <p className="font-black text-lg tracking-tight">Order via WhatsApp</p>
                            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest mt-0.5">Concierge Support Available</p>
                        </div>
                    </div>
                    <div className="w-12 h-12 bg-secondary/10 group-hover:bg-secondary rounded-2xl flex items-center justify-center transition-all border border-secondary/20 text-secondary group-hover:text-black">
                        <ChevronRight className="w-6 h-6" />
                    </div>
                </motion.div>

                {/* Account Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="liquid-glass rounded-[3rem] border border-white/5 overflow-hidden divide-y divide-white/5 shadow-2xl"
                >
                    {menuItems.map((item, i) => (
                        <motion.button
                            key={item.label}
                            whileTap={{ scale: 0.98 }}
                            onClick={item.action}
                            className="w-full flex items-center gap-5 px-8 py-5 hover:bg-white/[0.03] transition-colors cursor-pointer text-left group"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.35 + i * 0.08 }}
                        >
                            <div className="w-12 h-12 rounded-2xl bg-accent-dark/50 border border-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all">
                                <item.icon className="w-5 h-5 text-slate-500 group-hover:text-primary transition-colors" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-black text-base text-white tracking-tight">{item.label}</p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium mt-0.5">{item.sub}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                        </motion.button>
                    ))}
                </motion.div>

                {/* Logout */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="pt-4 pb-12"
                >
                    <motion.button
                        whileTap={{ scale: 0.96 }}
                        whileHover={{ borderColor: 'rgba(239,68,68,0.5)', backgroundColor: 'rgba(239,68,68,0.05)' }}
                        onClick={handleLogout}
                        className="w-full border border-white/10 text-red-500 font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 cursor-pointer transition-all shadow-xl group"
                    >
                        <LogOut className="w-5 h-5 transition-transform group-hover:scale-110" />
                        <span className="uppercase tracking-[0.2em] text-sm">Logout</span>
                    </motion.button>
                </motion.div>
            </main>

            {/* Orders Overlay */}
            <AnimatePresence>
                {showOrders && (
                    <motion.div
                        initial={{ opacity: 0, y: '100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[100] bg-background-dark/98 backdrop-blur-3xl px-6 pt-20 pb-10 overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-3xl font-black tracking-tight">Order <span className="text-primary glow-text-orange">History</span></h2>
                                <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black mt-1">Viewing past purchases</p>
                            </div>
                            <motion.button 
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setShowOrders(false)} 
                                className="w-12 h-12 glass rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl"
                            >
                                <X className="w-6 h-6" />
                            </motion.button>
                        </div>

                        {loadingOrders ? (
                            <div className="flex flex-col items-center justify-center py-32 gap-6">
                                <div className="w-16 h-16 border-[5px] border-primary/20 border-t-primary rounded-full animate-spin shadow-2xl shadow-primary/20" />
                                <p className="text-slate-500 font-black uppercase tracking-[0.25em] text-[10px] animate-pulse">Scanning Neural Archives...</p>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-24 space-y-8 flex flex-col items-center">
                                <div className="w-28 h-28 bg-white/5 rounded-[2.5rem] flex items-center justify-center border border-white/10 shadow-inner group">
                                    <Box className="w-12 h-12 text-slate-700 group-hover:text-primary transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black tracking-tight uppercase">Archives Empty</h3>
                                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.15em] max-w-[220px] mx-auto leading-relaxed">Your journey begins with the first drop. Initialize your aura today.</p>
                                </div>
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate('/menu')} 
                                    className="bg-primary px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] shadow-2xl transition-all"
                                >
                                    Browse Menu
                                </motion.button>
                            </div>
                        ) : (
                            <motion.div 
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: { staggerChildren: 0.1 }
                                    }
                                }}
                                className="space-y-6"
                            >
                                {orders.map((order) => (
                                    <motion.div 
                                        key={order._id}
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            visible: { opacity: 1, y: 0 }
                                        }}
                                        className="liquid-glass p-6 rounded-[2.5rem] border border-white/10 bg-white/[0.02] shadow-2xl relative overflow-hidden group"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] pointer-events-none -mr-16 -mt-16" />
                                        
                                        <div className="flex items-center justify-between mb-6 relative z-10">
                                            <div className="space-y-1">
                                                <p className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em]">Order ID</p>
                                                <p className="font-black text-sm tracking-widest text-primary drop-shadow-md">#{order._id.slice(-8).toUpperCase()}</p>
                                            </div>
                                            <div className="text-right space-y-1">
                                                <p className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em]">Date</p>
                                                <div className="flex items-center gap-1.5 justify-end">
                                                    <History className="w-3 h-3 text-slate-600" />
                                                    <p className="font-bold text-xs tabular-nums text-slate-300">{new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4 mb-6 relative z-10">
                                            {order.orderItems.map((item: any) => (
                                                <div key={item._id} className="flex items-center gap-4 group/item">
                                                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 overflow-hidden p-2 shadow-inner group-hover/item:border-primary/40 transition-colors">
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain transition-transform group-hover/item:scale-110" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-black text-sm truncate tracking-tight">{item.name}</p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Qty: {item.qty}</span>
                                                            <div className="w-1 h-1 rounded-full bg-slate-800" />
                                                            <span className="text-[10px] font-black text-primary">₦{item.price.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-6 pt-6 border-t border-white/5 space-y-6 relative z-10">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/10 shadow-inner">
                                                    <span className={`w-2 h-2 rounded-full ${order.isPaid ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'}`} />
                                                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white/70">
                                                        {order.isPaid ? 'Node Verified' : 'Payment Required'}
                                                    </span>
                                                </div>
                                                <p className="text-2xl font-black text-white glow-text-orange tracking-tighter">₦{order.totalPrice.toLocaleString()}</p>
                                            </div>

                                            <div className="bg-white/[0.03] p-6 rounded-[2rem] border border-white/10 shadow-inner">
                                                <OrderTimeline status={order.status || 'PLACED'} date={order.createdAt} />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;
