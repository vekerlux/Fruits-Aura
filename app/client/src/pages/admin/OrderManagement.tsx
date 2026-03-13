import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/client';

interface Order {
    id: string;
    user: { name: string; email: string };
    totalPrice: number;
    isPaid: boolean;
    status: string;
    createdAt: string;
    deliveryTimeSlot?: string;
}

const OrderManagement = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('ALL');

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/orders');
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (orderId: string, newStatus: string) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const statuses = ['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

    const filteredOrders = filterStatus === 'ALL'
        ? orders
        : orders.filter(o => o.status === filterStatus);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-black">Fulfillment Dashboard</h2>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-accent-dark border border-white/5 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none"
                >
                    <option value="ALL">All Statuses</option>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            <div className="space-y-3">
                {loading ? (
                    <div className="py-20 flex justify-center"><div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" /></div>
                ) : filteredOrders.length === 0 ? (
                    <div className="bento-card p-12 text-center text-slate-500 italic font-bold">No orders found for this filter</div>
                ) : (
                    filteredOrders.map((order, i) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bento-card p-5 border border-white/5 bg-white/[0.01] flex flex-col gap-4"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-xs text-primary">
                                        #{order.id.slice(-4).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-white flex items-center gap-2">
                                            {order.user?.name || 'Guest'}
                                            {order.deliveryTimeSlot && (
                                                <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded text-[8px] uppercase tracking-widest flex items-center gap-0.5">
                                                    <span className="material-symbols-outlined text-[10px]">schedule</span>
                                                    {order.deliveryTimeSlot.split(' ')[0]}
                                                </span>
                                            )}
                                        </h4>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                                            ₦{order.totalPrice.toLocaleString()} • {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.1em] border ${order.status === 'DELIVERED' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                    order.status === 'CANCELLED' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                        order.status === 'SHIPPED' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                            'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                    }`}>
                                    {order.status || 'PLACED'}
                                </div>
                            </div>

                            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                {statuses.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => updateStatus(order.id, s)}
                                        className={`px-3 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${order.status === s
                                            ? 'bg-primary text-white border-primary cursor-default'
                                            : 'bg-white/5 text-slate-500 border-white/5 hover:border-white/10'
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default OrderManagement;
