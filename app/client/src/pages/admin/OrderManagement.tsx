import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Clock, Package, CheckCircle2, Truck, 
    XCircle, AlertCircle, LayoutDashboard,
    Search, Filter, ExternalLink, RefreshCw, Wallet
} from 'lucide-react';
import api from '../../api/client';

interface Order {
    _id: string;
    id?: string;
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
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const markAsPaid = async (orderId: string) => {
        if (!window.confirm('Are you sure you want to mark this order as paid offline?')) return;
        try {
            await api.put(`/orders/${orderId}/pay`);
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, isPaid: true } : o));
        } catch (error) {
            alert('Failed to mark as paid');
        }
    };

    const statuses = ['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

    const filteredOrders = filterStatus === 'ALL'
        ? orders
        : orders.filter(o => o.status === filterStatus);

    return (
        <div className="space-y-6 pb-40">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-xl font-black text-white flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                        <LayoutDashboard className="w-5 h-5 text-indigo-500" />
                    </div>
                    Fulfillment Port
                    <span className="text-[10px] bg-white/5 text-slate-500 px-2 py-1 rounded-md font-bold uppercase tracking-tighter">
                        {filteredOrders.length} active logs
                    </span>
                </h2>
                
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 group-focus-within:text-primary transition-colors" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="aura-input pl-10 pr-4 py-2 w-full md:w-48 appearance-none"
                        >
                            <option value="ALL">Complete Stream</option>
                            {statuses.map(s => <option key={s} value={s}>{s} Filter</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-28 shimmer opacity-20 rounded-3xl" />
                        ))}
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="bento-card p-20 text-center border border-white/5 flex flex-col items-center justify-center opacity-30">
                        <AlertCircle className="w-10 h-10 mb-4 opacity-50" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Void detected in synchronization</p>
                    </div>
                ) : (
                    filteredOrders.map((order, i) => (
                        <motion.div
                            key={order._id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bento-card p-6 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group relative overflow-hidden"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 flex items-center justify-center relative overflow-hidden group/order">
                                        <div className="absolute inset-0 bg-primary/5 blur-xl opacity-0 group-hover/order:opacity-100 transition-opacity" />
                                        <span className="font-black text-[10px] text-primary relative z-10">#{order._id.slice(-4).toUpperCase()}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-black text-sm text-white flex items-center gap-2">
                                            {order.user?.name || 'Unidentified Entity'}
                                            {order.deliveryTimeSlot && (
                                                <span className="bg-primary/10 text-primary px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border border-primary/20 flex items-center gap-1.5 shadow-sm">
                                                    <Clock className="w-2.5 h-2.5" />
                                                    {order.deliveryTimeSlot.split(' ')[0]} Frame
                                                </span>
                                            )}
                                        </h4>
                                        <div className="flex items-center gap-3 mt-1.5 opacity-60">
                                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
                                                ₦{order.totalPrice.toLocaleString()} Essence 
                                            </p>
                                            <span className="w-1 h-1 rounded-full bg-slate-700" />
                                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">
                                                Timestamped: {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-3">
                                    <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${order.status === 'DELIVERED' ? 'bg-green-500/10 text-green-500 border-green-500/20 shadow-green-500/5' :
                                        order.status === 'CANCELLED' ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-red-500/5' :
                                            order.status === 'SHIPPED' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-blue-500/5' :
                                                'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-amber-500/5'
                                        }`}>
                                        {order.status || 'PLACED'}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {!order.isPaid && (
                                            <button
                                                onClick={() => markAsPaid(order._id)}
                                                className="px-3 py-1 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/20 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors"
                                            >
                                                <Wallet className="w-3 h-3" /> Mark Paid
                                            </button>
                                        )}
                                        {order.isPaid && (
                                            <span className="px-3 py-1 bg-white/5 text-slate-400 border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                                <CheckCircle2 className="w-3 h-3 text-green-500" /> Paid
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 mt-1">
                                        {statuses.map(s => {
                                            const isCurrent = order.status === s;
                                            return (
                                                <button
                                                    key={s}
                                                    onClick={() => updateStatus(order._id, s)}
                                                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all border group/btn relative ${isCurrent
                                                        ? 'bg-primary border-primary shadow-lg shadow-primary/20 cursor-default'
                                                        : 'bg-white/5 border-white/5 text-slate-600 hover:border-white/20 hover:text-white'
                                                        }`}
                                                >
                                                    {s === 'PLACED' && <Package className={`w-3 h-3 ${isCurrent ? 'text-white' : ''}`} />}
                                                    {s === 'PROCESSING' && <RefreshCw className={`w-3 h-3 ${isCurrent ? 'text-white animate-spin' : ''}`} />}
                                                    {s === 'SHIPPED' && <Truck className={`w-3 h-3 ${isCurrent ? 'text-white' : ''}`} />}
                                                    {s === 'DELIVERED' && <CheckCircle2 className={`w-3 h-3 ${isCurrent ? 'text-white' : ''}`} />}
                                                    {s === 'CANCELLED' && <XCircle className={`w-3 h-3 ${isCurrent ? 'text-white' : ''}`} />}
                                                    
                                                    {/* Tooltip on hover */}
                                                    {!isCurrent && (
                                                        <span className="absolute -top-8 bg-black border border-white/10 px-2 py-1 rounded text-[70%] font-black uppercase tracking-tighter text-white opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                                                            Shift to {s}
                                                        </span>
                                                    )}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default OrderManagement;
