import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { usePaystackPayment } from 'react-paystack';
import api from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MapPin, 
    Phone, 
    Clock, 
    CreditCard, 
    Lock, 
    CheckCircle2, 
    AlertCircle, 
    Truck, 
    Gift, 
    Box, 
    ArrowLeft,
    ShieldCheck,
    Zap,
    Mail,
    Star,
    ChevronRight
} from 'lucide-react';

const Checkout = () => {
    const { cart, subtotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [isProcessing, setIsProcessing] = useState(false);

    // Delivery Time Slot & Fee Settings
    const [timeSlots, setTimeSlots] = useState(['Morning (9am - 12pm)', 'Afternoon (12pm - 3pm)', 'Evening (3pm - 6pm)']);
    const [deliveryTimeSlot, setDeliveryTimeSlot] = useState(timeSlots[0]);
    const [baseDeliveryFee, setBaseDeliveryFee] = useState(1500);
    const [freeShippingThreshold, setFreeShippingThreshold] = useState(10000);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await api.get('/settings');
                const feeSetting = data.find((s: any) => s.key === 'delivery_fee');
                if (feeSetting) setBaseDeliveryFee(Number(feeSetting.value));
                
                const thresholdSetting = data.find((s: any) => s.key === 'free_shipping_threshold');
                if (thresholdSetting) setFreeShippingThreshold(Number(thresholdSetting.value));
                
                const slotsSetting = data.find((s: any) => s.key === 'delivery_time_slots');
                if (slotsSetting && slotsSetting.value) {
                    const parsedSlots = String(slotsSetting.value).split(',').map((s: string) => s.trim());
                    setTimeSlots(parsedSlots);
                    setDeliveryTimeSlot(parsedSlots[0]);
                }
            } catch (error) {
                console.error('Error fetching settings', error);
            }
        };
        fetchSettings();
    }, []);

    // Subscription State
    const [isSubscription, setIsSubscription] = useState(false);
    const [subscriptionFrequency, setSubscriptionFrequency] = useState<'weekly' | 'biweekly' | 'monthly'>('monthly');

    // Bulk Order State
    const [isBulkOrder, setIsBulkOrder] = useState(false);
    const totalSingleBottles = cart.filter(item => !item.isBundle).reduce((acc, item) => acc + item.quantity, 0);

    // Loyalty Points State
    const userPoints = user?.loyaltyPoints || 0;
    const [usePoints, setUsePoints] = useState(false);
    
    // Calculate Dynamic Pricing based on Role and Bulk Order status
    const getAdjustedItemPrice = (item: any) => {
        let itemPrice = item.price;
        const canGetBulkPrice = isBulkOrder && totalSingleBottles >= 10 && (user?.role === 'DISTRIBUTOR' || user?.role === 'ADMIN');

        if (!item.isBundle && canGetBulkPrice) {
            const isSpecial = (user as any).isSpecialDistributor;
            if (item.size === 'big') {
                itemPrice = isSpecial ? 2000 : 2200;
            } else if (item.size === 'small') {
                itemPrice = isSpecial ? 1200 : 1300;
            }
        }
        return itemPrice;
    };

    const calculateAdjustedSubtotal = () => {
        return cart.reduce((acc, item) => acc + (getAdjustedItemPrice(item) * item.quantity), 0);
    };

    const adjustedSubtotal = calculateAdjustedSubtotal();
    const pointsValue = Math.min(Math.floor(userPoints / 1000) * 500, Math.floor(adjustedSubtotal * 0.5));
    const pointsToDeduct = usePoints ? Math.floor(userPoints / 1000) * 1000 : 0;
    const redemptionDiscount = usePoints ? pointsValue : 0;
    const emailDiscountAmount = (user as any)?.hasEmailDiscount ? Math.round(adjustedSubtotal * 0.1) : 0;

    // Dynamic delivery rules from settings
    const deliveryFee = (cart.length > 0 && adjustedSubtotal < freeShippingThreshold) ? baseDeliveryFee : 0;
    const subscriptionDiscount = isSubscription ? Math.round(adjustedSubtotal * 0.05) : 0;
    const total = adjustedSubtotal + deliveryFee - subscriptionDiscount - redemptionDiscount - emailDiscountAmount;

    const config = {
        reference: (new Date()).getTime().toString(),
        email: user ? user.email : 'guest@fruitsaura.com',
        amount: Math.max(0, total) * 100, // Paystack is in kobo
        publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_live_829d29b8ccebf36434f26197cce00b3a5c5423f0',
    };

    const initializePayment = usePaystackPayment(config);

    const onSuccess = async (reference: any) => {
        try {
            setIsProcessing(true);
            const orderItems = cart.map(item => ({
                name: item.name,
                qty: item.quantity,
                image: item.image,
                price: getAdjustedItemPrice(item),
                isBundle: item.isBundle,
                product: item.id
            }));

            const orderData = {
                orderItems,
                shippingAddress: {
                    street: user?.address && typeof user.address === 'object' ? (user.address as any).street : 'No 15, Waterworks Road',
                    city: user?.address && typeof user.address === 'object' ? (user.address as any).city : 'Abakaliki',
                    state: user?.address && typeof user.address === 'object' ? (user.address as any).state : 'Ebonyi State',
                    zip: user?.address && typeof user.address === 'object' ? (user.address as any).zip || '000000' : '000000'
                },
                paymentMethod: 'Paystack',
                itemsPrice: adjustedSubtotal,
                taxPrice: 0,
                shippingPrice: deliveryFee,
                totalPrice: total,
                paymentResult: {
                    id: reference.reference,
                    status: reference.status,
                    update_time: new Date().toISOString(),
                    email_address: user ? user.email : 'guest@fruitsaura.com',
                    reference: reference.reference
                },
                isSubscription,
                subscriptionFrequency: isSubscription ? subscriptionFrequency : undefined,
                pointsUsed: pointsToDeduct,
                deliveryTimeSlot
            };

            await api.post('/orders', orderData);
            clearCart();
            navigate(`/order-success/${reference.reference}`);
        } catch (error: any) {
            console.error('Error saving order', error);
            const errorMsg = error.response?.data?.message || 'Payment succeeded but we had an error saving your order.';
            alert(`${errorMsg} Please screenshot your Paystack Reference (${reference.reference}) and contact support.`);
        } finally {
            setIsProcessing(false);
        }
    };

    const onClose = () => {
        console.log('Payment modal closed');
    };

    const handlePayment = () => {
        initializePayment({ onSuccess, onClose });
    };

    if (isProcessing) {
        return (
            <div className="bg-background-dark text-white min-h-screen flex flex-col items-center justify-center p-8 space-y-8 text-center aurora-bg">
                <div className="relative">
                    <motion.div 
                        className="w-32 h-32 border-4 border-primary/20 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.div 
                        className="absolute inset-0 w-32 h-32 border-4 border-t-primary rounded-full shadow-[0_0_30px_rgba(242,127,13,0.3)]"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="text-primary w-10 h-10 animate-pulse" />
                    </div>
                </div>
                <div className="space-y-4">
                    <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Securing Payment...</h1>
                    <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">Payment confirmed. We are processing your order securely.</p>
                </div>
                <div className="flex gap-2">
                    {[0, 1, 2].map(i => (
                        <motion.div 
                            key={i}
                            className="w-2 h-2 rounded-full bg-primary/40"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="bg-background-dark text-white min-h-screen flex flex-col items-center justify-center p-6 space-y-6 text-center">
                <Box className="text-border-dark w-20 h-20 opacity-20" />
                <div>
                    <h2 className="text-xl font-black uppercase italic tracking-tighter">Your Bag is Empty</h2>
                    <p className="text-slate-500 text-sm mt-2">Add some items and come back.</p>
                </div>
                <Link to="/home">
                    <button className="bg-primary/10 text-primary border border-primary/20 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary hover:text-white transition-all">
                        Go to Shop
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-background-dark text-white min-h-screen pb-48 aurora-bg">
            <header className="px-6 pt-14 pb-4 sticky top-0 z-50 bg-background-dark/85 backdrop-blur-xl border-b border-white/[0.04]">
                <div className="flex items-center gap-5">
                    <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(-1)} 
                        className="w-11 h-11 rounded-2xl glass flex items-center justify-center cursor-pointer"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </motion.button>
                    <div>
                        <h1 className="text-2xl font-black italic tracking-tighter leading-none uppercase">Checkout</h1>
                        <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mt-1">Complete Purchase</p>
                    </div>
                </div>
            </header>

            <main className="px-6 pt-8 space-y-10">
                {/* Delivery Protocol */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 italic">Delivery Details</h2>
                        <button className="text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl bg-primary/5">Update</button>
                    </div>

                    <div className="liquid-glass p-6 space-y-6 border border-white/[0.04]">
                        <div className="flex gap-5 items-start">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 shadow-lg">
                                <MapPin className="text-primary w-6 h-6" />
                            </div>
                            <div className="space-y-1.5 flex-1 pt-1">
                                <h4 className="font-black text-[10px] uppercase tracking-widest text-white italic">Delivery Address</h4>
                                <p className="text-sm text-slate-400 font-medium leading-relaxed">No 15, Waterworks Road, Abakaliki, Ebonyi</p>
                            </div>
                        </div>
                        <div className="h-px w-full bg-white/[0.05]"></div>
                        <div className="flex gap-5 items-center">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 shadow-lg">
                                <Phone className="text-slate-400 w-5 h-5" />
                            </div>
                            <div className="space-y-0.5 flex-1">
                                <h4 className="font-black text-[10px] uppercase tracking-widest text-white italic">Contact Person</h4>
                                <p className="text-sm text-slate-400 font-medium">{user ? user.name : 'Aura Drinker'}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Atmosphere Window (Time Slots) */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 italic">Delivery Time</h2>
                        <div className="flex items-center gap-1.5 opacity-60">
                            <Clock className="w-3 h-3" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Select Slot</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        {timeSlots.map((slot) => (
                            <button
                                key={slot}
                                onClick={() => setDeliveryTimeSlot(slot)}
                                className={`p-5 rounded-3xl flex items-center justify-between transition-all border-2 relative overflow-hidden group ${deliveryTimeSlot === slot ? 'border-primary bg-primary/10 shadow-xl shadow-primary/5' : 'border-white/[0.05] bg-white/[0.03]'}`}
                            >
                                <span className={`text-sm font-black italic tracking-tight ${deliveryTimeSlot === slot ? 'text-white' : 'text-slate-500'}`}>{slot}</span>
                                <div className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-colors ${deliveryTimeSlot === slot ? 'border-primary bg-primary shadow-[0_0_15px_rgba(242,127,13,0.4)]' : 'border-white/10'}`}>
                                    {deliveryTimeSlot === slot && <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} />}
                                </div>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Rewards / Credits */}
                {userPoints >= 1000 && (
                    <section className="space-y-6">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 italic">Credits Optimization</h2>
                        <button
                            className={`w-full liquid-glass p-6 border-2 transition-all text-left group ${usePoints ? 'border-secondary bg-secondary/10 shadow-xl shadow-secondary/5' : 'border-white/[0.05] bg-white/[0.03]'}`}
                            onClick={() => setUsePoints(!usePoints)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${usePoints ? 'bg-secondary text-white border-secondary shadow-[0_0_20px_rgba(74,222,128,0.3)]' : 'bg-white/5 text-slate-500 border-white/10'}`}>
                                        <Star className={`w-6 h-6 ${usePoints ? 'fill-white' : ''}`} />
                                    </div>
                                    <div>
                                        <h4 className={`font-black text-sm italic uppercase tracking-tight ${usePoints ? 'text-white' : 'text-slate-300'}`}>Redeem Points</h4>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Burn {pointsToDeduct} Pts for -₦{pointsValue.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-colors ${usePoints ? 'border-secondary bg-secondary shadow-[0_0_15px_rgba(74,222,128,0.4)]' : 'border-white/10'}`}>
                                    {usePoints && <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} />}
                                </div>
                            </div>
                        </button>
                    </section>
                )}

                {/* Distributor Protocol */}
                {(user?.role === 'DISTRIBUTOR' || user?.role === 'ADMIN') && (
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 italic">Distributor Protocol</h2>
                            <div className={`px-4 py-2 rounded-2xl border flex items-center gap-2 shadow-lg transition-all ${totalSingleBottles >= 10 ? 'bg-secondary/10 border-secondary/20 shadow-secondary/5' : 'bg-red-500/10 border-red-500/20 shadow-red-500/5'}`}>
                                <Zap className={`w-3 h-3 ${totalSingleBottles >= 10 ? 'text-secondary fill-secondary' : 'text-red-400'}`} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${totalSingleBottles >= 10 ? 'text-secondary' : 'text-red-400'}`}>
                                    {totalSingleBottles}/10 Bottles Refill
                                </span>
                            </div>
                        </div>
                        
                        <div 
                            className={`w-full liquid-glass p-6 border-2 transition-all text-left relative overflow-hidden group ${isBulkOrder ? 'border-primary bg-primary/10 shadow-xl shadow-primary/5' : 'border-white/[0.05] bg-white/[0.03]'}`}
                            onClick={() => setIsBulkOrder(!isBulkOrder)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${isBulkOrder ? 'bg-primary text-white border-primary shadow-[0_0_20px_rgba(242,127,13,0.3)]' : 'bg-white/5 text-slate-500 border-white/10'}`}>
                                        <Box className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className={`font-black text-sm italic uppercase tracking-tight ${isBulkOrder ? 'text-white' : 'text-slate-300'}`}>Refractive Wholesale</h4>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Manual Discount Trigger</p>
                                    </div>
                                </div>
                                <div className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-colors ${isBulkOrder ? 'border-primary bg-primary shadow-[0_0_15px_rgba(242,127,13,0.4)]' : 'border-white/10'}`}>
                                    {isBulkOrder && <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} />}
                                </div>
                            </div>
                            
                            <AnimatePresence>
                                {isBulkOrder && totalSingleBottles < 10 && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-6 pt-6 border-t border-white/5 space-y-3"
                                    >
                                        <div className="flex items-center gap-2 p-3 rounded-2xl bg-red-500/10 border border-red-500/20">
                                            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                                            <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest leading-tight">
                                                Flow Blocked: Add {(10 - totalSingleBottles)} more bottles to bag to unlock wholesale pricing.
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </section>
                )}

                {/* Gateway Plate */}
                <section className="space-y-6">
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 italic">Payment Gateway</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="liquid-glass border-primary border-2 flex flex-col items-center justify-center p-6 gap-3 shadow-xl shadow-primary/10 relative overflow-hidden group">
                            <motion.div 
                                className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" 
                                animate={{ opacity: [0, 0.2, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <CreditCard className="text-primary w-8 h-8" />
                            <span className="text-[10px] font-black uppercase tracking-[.25em] text-white">Paystack</span>
                        </button>
                        <button className="liquid-glass border-white/5 flex flex-col items-center justify-center p-6 gap-3 opacity-30 cursor-not-allowed grayscale">
                            <ShieldCheck className="text-slate-400 w-8 h-8" />
                            <span className="text-[10px] font-black uppercase tracking-[.25em] text-slate-400">Escrow</span>
                        </button>
                    </div>
                </section>

                {/* Receipt Card */}
                <section className="bg-card-dark/40 rounded-[3rem] p-8 border border-white/[0.04] space-y-6 relative overflow-hidden">
                    {/* Shimmer line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                    
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-primary text-center italic">Order Summary</h3>
                    
                    <div className="space-y-4">
                        {cart.map((item) => (
                            <div key={`${item.id}-${item.isBundle}-${item.size}`} className="flex justify-between items-center text-xs">
                                <div className="space-y-0.5 max-w-[70%]">
                                    <p className="text-white font-black italic tracking-tight">{item.quantity}x {item.name}</p>
                                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{item.isBundle ? 'Aura-set Pro' : `Refracted ${item.size}`}</p>
                                </div>
                                <span className="font-black text-white italic">
                                    ₦{(getAdjustedItemPrice(item) * item.quantity).toLocaleString()}
                                </span>
                            </div>
                        ))}

                        <div className="h-px bg-white/5 my-4"></div>
                        
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500 italic">
                                <span>Subtotal</span>
                                <span className="text-white">₦{adjustedSubtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500 italic">
                                <span>Delivery Fee</span>
                                <span className="text-white">₦{deliveryFee.toLocaleString()}</span>
                            </div>
                            
                            <AnimatePresence>
                                {emailDiscountAmount > 0 && (
                                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-secondary italic">
                                        <div className="flex items-center gap-1.5">
                                            <Mail className="w-3 h-3" /> Email Signature
                                        </div>
                                        <span>-₦{emailDiscountAmount.toLocaleString()}</span>
                                    </motion.div>
                                )}
                                {isSubscription && (
                                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3 h-3" /> Recursive Discount
                                        </div>
                                        <span>-₦{subscriptionDiscount.toLocaleString()}</span>
                                    </motion.div>
                                )}
                                {usePoints && (
                                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-red-400 italic">
                                        <div className="flex items-center gap-1.5">
                                            <Gift className="w-3 h-3" /> Credits Burned
                                        </div>
                                        <span>-₦{redemptionDiscount.toLocaleString()}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="h-px border-t border-dashed border-white/10 my-6"></div>
                        
                        <div className="flex justify-between items-end">
                            <div className="space-y-1">
                                <span className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-black italic">Final Total</span>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="text-primary w-4 h-4" />
                                    <span className="text-primary text-[10px] font-black uppercase tracking-widest italic">Encrypted</span>
                                </div>
                            </div>
                            <span className="text-4xl font-black text-primary italic tracking-tighter shadow-glow-primary">₦{total.toLocaleString()}</span>
                        </div>
                    </div>
                </section>
            </main>

            {/* Final Commitment Plate */}
            <div className="fixed bottom-0 left-0 w-full px-6 pb-24 pt-10 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent z-40">
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="max-w-md mx-auto"
                >
                    <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handlePayment()}
                        disabled={isProcessing}
                        className="w-full bg-[#f27f0d] text-white font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 shadow-2xl relative overflow-hidden group cursor-pointer"
                        style={{ boxShadow: '0 20px 50px rgba(242,127,13,0.4)' }}
                    >
                        <Lock className="w-5 h-5 fill-white" />
                        <span className="text-sm uppercase tracking-[.25em] italic font-black">
                            Confirm Payment — ₦{total.toLocaleString()}
                        </span>
                        
                        <motion.div
                            className="absolute bg-white/20 h-full w-20 skew-x-[-30deg]"
                            animate={{ left: ['-100%', '200%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        />
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
};

export default Checkout;
