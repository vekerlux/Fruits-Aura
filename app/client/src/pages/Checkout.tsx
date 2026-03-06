import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import api from '../api/client';

const Checkout = () => {
    const { cart, subtotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Subscription State
    const [isSubscription, setIsSubscription] = useState(false);
    const [subscriptionFrequency, setSubscriptionFrequency] = useState<'weekly' | 'biweekly' | 'monthly'>('monthly');

    // Loyalty Points State
    const userPoints = user?.loyaltyPoints || 0;
    const [usePoints, setUsePoints] = useState(false);
    const pointsValue = Math.min(Math.floor(userPoints / 1000) * 500, Math.floor(subtotal * 0.5)); // Max 50% of subtotal
    const pointsToDeduct = usePoints ? (pointsValue / 500) * 1000 : 0;
    const redemptionDiscount = usePoints ? pointsValue : 0;

    // Hardcoded fees matching Cart.tsx
    const deliveryFee = 1500;
    const discount = 500;
    const subscriptionDiscount = isSubscription ? Math.round(subtotal * 0.05) : 0;
    const total = subtotal + deliveryFee - discount - subscriptionDiscount - redemptionDiscount;

    const config = {
        reference: (new Date()).getTime().toString(),
        email: user ? user.email : 'guest@fruitsaura.com',
        amount: total * 100, // Paystack is in kobo normally, so multiply by 100
        publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_live_829d29b8ccebf36434f26197cce00b3a5c5423f0',
    };

    const initializePayment = usePaystackPayment(config);

    const onSuccess = async (reference: any) => {
        try {
            setIsProcessing(true);
            const orderData = {
                orderItems: cart.map(item => ({
                    name: item.name,
                    qty: item.quantity,
                    image: item.image,
                    price: item.price,
                    isBundle: item.isBundle,
                    product: item.id
                })),
                shippingAddress: {
                    street: user?.address && typeof user.address === 'object' ? (user.address as any).street : 'No 15, Waterworks Road',
                    city: user?.address && typeof user.address === 'object' ? (user.address as any).city : 'Abakaliki',
                    state: user?.address && typeof user.address === 'object' ? (user.address as any).state : 'Ebonyi State',
                    zip: user?.address && typeof user.address === 'object' ? (user.address as any).zip || '000000' : '000000'
                },
                paymentMethod: 'Paystack',
                itemsPrice: subtotal,
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
                pointsUsed: pointsToDeduct
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
            <div className="bg-background-dark text-white min-h-screen flex flex-col items-center justify-center p-6 space-y-6 text-center">
                <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                <h1 className="text-2xl font-black">Fulfilling Your Aura...</h1>
                <p className="text-slate-400">Payment confirmed! We are now recording your order and preparing your shipment. Please do not close this page.</p>
            </div>
        );
    }



    if (cart.length === 0) {
        return (
            <div className="bg-background-dark text-white min-h-screen flex flex-col items-center justify-center p-6 space-y-4">
                <span className="material-symbols-outlined text-border-dark text-6xl">shopping_cart_off</span>
                <p className="text-slate-400 font-medium">Your cart is empty.</p>
                <Link to="/home">
                    <button className="bg-primary/20 text-primary px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-widest">Shop Now</button>
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-background-dark text-white min-h-screen pb-32">
            <header className="px-6 pt-14 pb-4 sticky top-0 z-50 bg-background-dark/90 backdrop-blur-lg border-b border-white/5">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full glass flex items-center justify-center active:scale-95 transition-transform">
                        <span className="material-symbols-outlined text-white">arrow_back_ios_new</span>
                    </button>
                    <div>
                        <h1 className="text-xl font-extrabold tracking-tight">Checkout</h1>
                        <p className="text-[10px] text-primary uppercase tracking-widest font-bold">Secure Payment</p>
                    </div>
                </div>
            </header>

            <main className="px-6 pt-6 space-y-6">
                {/* Delivery Details Section */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">Delivery Details</h2>
                        <button className="text-primary text-xs font-bold uppercase tracking-widest">Edit</button>
                    </div>

                    <div className="bento-card p-5 space-y-4">
                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-full bg-accent-dark flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-slate-400">location_on</span>
                            </div>
                            <div className="space-y-1 flex-1">
                                <h4 className="font-bold text-sm">Home Address</h4>
                                <p className="text-xs text-slate-400 leading-relaxed">No 15, Waterworks Road,<br />Abakaliki, Ebonyi State</p>
                            </div>
                        </div>
                        <div className="h-px w-full bg-white/5"></div>
                        <div className="flex gap-4 items-center">
                            <div className="w-10 h-10 rounded-full bg-accent-dark flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-slate-400">call</span>
                            </div>
                            <div className="space-y-0.5">
                                <h4 className="font-bold text-sm">{user ? user.name : 'Aura Drinker'}</h4>
                                <p className="text-xs text-slate-400">{user ? user.email : 'guest@example.com'}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Aura Rewards / Loyalty Points */}
                {userPoints >= 1000 && (
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold">Aura Rewards</h2>
                            <div className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">{userPoints.toLocaleString()} Pts Available</span>
                            </div>
                        </div>
                        <div
                            className={`liquid-glass p-5 border-2 transition-all cursor-pointer ${usePoints ? 'border-primary bg-primary/5' : 'border-transparent'}`}
                            onClick={() => setUsePoints(!usePoints)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${usePoints ? 'bg-primary text-white' : 'bg-white/10 text-slate-500'}`}>
                                        <span className="material-symbols-outlined">{usePoints ? 'redeem' : 'stars'}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">Redeem Points</h4>
                                        <p className="text-xs text-slate-400">Used {pointsToDeduct} pts for ₦{pointsValue.toLocaleString()} off</p>
                                    </div>
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${usePoints ? 'border-primary bg-primary' : 'border-white/10'}`}>
                                    {usePoints && <span className="material-symbols-outlined text-white text-sm font-black">check</span>}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Aura Auto-Ship */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">Aura Auto-Ship</h2>
                        <div className="flex items-center gap-2 bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
                            <span className="material-symbols-outlined text-secondary text-xs">savings</span>
                            <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Save 5%</span>
                        </div>
                    </div>
                    <div className={`bento-card-green p-5 border-2 transition-all cursor-pointer ${isSubscription ? 'border-secondary bg-secondary/5' : 'border-transparent opacity-60'}`} onClick={() => setIsSubscription(!isSubscription)}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSubscription ? 'bg-secondary text-white' : 'bg-white/10 text-slate-500'}`}>
                                    <span className="material-symbols-outlined">{isSubscription ? 'check_circle' : 'autorenew'}</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">Subscribe & Save</h4>
                                    <p className="text-xs text-slate-400">Regular delivery, better price.</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-secondary font-black uppercase tracking-widest">Extra Off</p>
                                <p className="font-black text-white">-₦{Math.round(subtotal * 0.05).toLocaleString()}</p>
                            </div>
                        </div>

                        {isSubscription && (
                            <div className="mt-5 pt-5 border-t border-white/5 flex gap-2">
                                {['weekly', 'biweekly', 'monthly'].map((freq) => (
                                    <button
                                        key={freq}
                                        onClick={(e) => { e.stopPropagation(); setSubscriptionFrequency(freq as any); }}
                                        className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${subscriptionFrequency === freq ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'bg-white/5 text-slate-500'}`}
                                    >
                                        {freq}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Payment Method */}
                <section className="space-y-4">
                    <h2 className="text-lg font-bold">Payment Method</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <button className="bento-card-orange border-primary flex flex-col items-center justify-center p-4 gap-2 shadow-lg shadow-primary/10">
                            <span className="material-symbols-outlined text-primary text-3xl">credit_card</span>
                            <span className="text-xs font-bold uppercase tracking-widest">Paystack</span>
                        </button>
                        <button className="bento-card border-white/5 flex flex-col items-center justify-center p-4 gap-2 opacity-50 cursor-not-allowed">
                            <span className="material-symbols-outlined text-slate-400 text-3xl">account_balance</span>
                            <span className="text-xs font-bold text-slate-400">Transfer</span>
                        </button>
                    </div>
                </section>

                {/* Final Order Summary */}
                <section className="bento-card-orange mt-8 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-primary text-center">Final Summary</h3>
                    <div className="space-y-3">
                        {cart.map((item) => (
                            <div key={`${item.id}-${item.isBundle}`} className="flex justify-between items-center text-sm">
                                <span className="text-slate-400 truncate max-w-[65%]">{item.quantity}x {item.name} {item.isBundle && '(Bundle)'}</span>
                                <span className="font-bold whitespace-nowrap">₦{(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                        ))}

                        <div className="h-px bg-white/5 my-2"></div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">Subtotal</span>
                            <span className="font-bold">₦{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">Delivery Fee (Abakaliki)</span>
                            <span className="font-bold">₦{deliveryFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">AURAFRESH24</span>
                            <span className="font-bold text-green-500">-₦{discount.toLocaleString()}</span>
                        </div>
                        {isSubscription && (
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400 uppercase font-black text-[10px] tracking-widest flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[10px]">autorenew</span> Auto-Ship Savings
                                </span>
                                <span className="font-bold text-secondary">-₦{subscriptionDiscount.toLocaleString()}</span>
                            </div>
                        )}
                        {usePoints && (
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400 uppercase font-black text-[10px] tracking-widest flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[10px]">stars</span> Points Redeemed
                                </span>
                                <span className="font-bold text-red-400">-₦{redemptionDiscount.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="h-px border-t border-dashed border-primary/30 my-2"></div>
                        <div className="flex justify-between items-end">
                            <span className="text-sm text-slate-400 uppercase tracking-widest font-bold">To Pay</span>
                            <span className="text-3xl font-black text-primary">₦{total.toLocaleString()}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => handlePayment()}
                        disabled={isProcessing}
                        className={`w-full ${isProcessing ? 'bg-slate-700' : 'bg-[#f27f0d]'} text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-[#f27f0d]/30 active:scale-[0.98] transition-all mt-4`}
                    >
                        {isProcessing ? (
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <span className="material-symbols-outlined">lock</span>
                        )}
                        <span>{isProcessing ? 'Verifying...' : `Pay ₦${total.toLocaleString()} Now`}</span>
                    </button>
                </section>

            </main>
        </div>
    );
};

export default Checkout;
