import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import api from '../api/client';

const OrderSuccess = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                // We might need to retry a few times if the webhook is slightly slower than the redirect
                const { data } = await api.get(`/orders/myorders`);
                const currentOrder = data.find((o: any) => o._id === id || o.paymentResult?.reference === id);
                if (currentOrder) {
                    setOrder(currentOrder);
                }
            } catch (err) {
                console.error('Error fetching order for success page', err);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchOrder();
    }, [id]);

    return (
        <div className="bg-background-dark text-white min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
            </div>

            <main className="w-full max-w-md relative z-10 space-y-8">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto flex items-center justify-center mb-6">
                        <img src="/logo.png" alt="Fruits Aura" className="w-full h-full object-contain filter drop-shadow-xl" />
                    </div>

                    <motion.div
                        initial={{ scale: 0, rotate: -45 }}

                        animate={{ scale: 1, rotate: 0 }}
                        className="w-24 h-24 bg-green-500 rounded-[2.5rem] mx-auto flex items-center justify-center shadow-2xl shadow-green-500/40 relative"
                    >
                        <motion.span
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            className="material-symbols-outlined text-white text-6xl font-black"
                        >
                            verified
                        </motion.span>
                        {/* Orbiting particles */}
                        <div className="absolute inset-0 rounded-full border border-white/20 animate-spin-slow"></div>
                    </motion.div>

                    <div className="space-y-1">
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-black tracking-tighter"
                        >
                            Payment Verified!
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-slate-400 font-medium"
                        >
                            Your Aura is officially brewing.
                        </motion.p>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bento-card-orange p-6 space-y-4 border border-primary/20"
                >
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-primary">
                        <span>Receipt</span>
                        <span>#{id?.slice(-8).toUpperCase()}</span>
                    </div>

                    <div className="h-px w-full bg-white/10 border-t border-dashed border-white/20"></div>

                    <div className="space-y-3">
                        {order?.orderItems?.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between text-sm">
                                <span className="text-slate-400">{item.qty}x {item.name}</span>
                                <span className="font-bold">₦{(item.price * item.qty).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>

                    <div className="h-px w-full bg-white/10"></div>

                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase text-slate-500">Status</p>
                            <div className="flex items-center gap-2 text-green-500">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                                <span className="text-sm font-black uppercase italic">Processing</span>
                            </div>
                            {order?.deliveryTimeSlot && (
                                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wide mt-2">
                                    <span className="material-symbols-outlined text-[10px] align-middle mr-1">schedule</span>
                                    {order.deliveryTimeSlot}
                                </p>
                            )}
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase text-slate-500">Total Paid</p>
                            <p className="text-2xl font-black text-primary">₦{order?.totalPrice?.toLocaleString() || '...'}</p>
                        </div>
                    </div>
                </motion.div>

                <div className="space-y-3">
                    <button
                        onClick={() => navigate('/home')}
                        className="w-full bg-primary text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/30 active:scale-95 transition-transform"
                    >
                        <span>Back to Shop</span>
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </button>

                    <Link to="/profile">
                        <button className="w-full bg-white/5 border border-white/10 text-slate-300 font-bold py-4 rounded-2xl hover:bg-white/10 transition-colors">
                            View Order History
                        </button>
                    </Link>
                </div>

                <p className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                    Thank you for choosing Fruits Aura
                </p>
            </main>
        </div>
    );
};

export default OrderSuccess;
