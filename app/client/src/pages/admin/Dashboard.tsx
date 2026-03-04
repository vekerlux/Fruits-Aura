import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import ProductManagement from './ProductManagement';
import NotificationManagement from './NotificationManagement';
import LocationManagement from './LocationManagement';
import PlanManagement from './PlanManagement';
import SettingsManagement from './SettingsManagement';
import CarouselManagement from './CarouselManagement';

interface Order {
    id: string;
    totalPrice: number;
    isPaid: boolean;
    createdAt: string;
    user: { name: string };
}

interface StatsData {
    totals: {
        totalRevenue: number;
        totalOrders: number;
        avgOrderValue: number;
    };
    dailyRevenue: Array<{ _id: string, revenue: number, orders: number }>;
    popularItems: Array<{ _id: string, count: number, revenue: number }>;
}

const Dashboard = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [statsData, setStatsData] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'notifications' | 'locations' | 'plans' | 'settings' | 'carousel'>('orders');

    const config = {
        headers: { Authorization: `Bearer ${(user as any)?.token}` },
    };

    const fetchData = async () => {
        try {
            const [ordersRes, statsRes] = await Promise.all([
                api.get('/orders'),
                api.get('/orders/stats')
            ]);
            setOrders(ordersRes.data);
            setStatsData(statsRes.data);
        } catch (error) {
            console.error('Error fetching dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const statCards = [
        { label: 'Total Revenue', value: `₦${statsData?.totals.totalRevenue.toLocaleString() || 0}`, icon: 'payments', color: 'primary' },
        { label: 'Total Orders', value: statsData?.totals.totalOrders || 0, icon: 'shopping_bag', color: 'amber-400' },
        { label: 'Avg Order', value: `₦${Math.round(statsData?.totals.avgOrderValue || 0).toLocaleString()}`, icon: 'analytics', color: 'green-400' },
    ];

    const maxDaily = Math.max(...(statsData?.dailyRevenue.map(d => d.revenue) || [1]));

    return (
        <div className="bg-background-dark text-white min-h-screen pb-32">
            <header className="px-6 pt-14 pb-8 sticky top-0 z-40 bg-background-dark/80 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight">Admin Console</h1>
                        <p className="text-[10px] text-primary uppercase tracking-[0.2em] font-black">Business Intelligence</p>
                    </div>
                    <div className="w-10 h-10 rounded-full glass border border-primary/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-xl font-black">admin_panel_settings</span>
                    </div>
                </div>
            </header>

            <main className="px-6 pt-5 space-y-8">
                {/* Tab Switcher */}
                <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
                    {[
                        { id: 'orders', label: 'Overview', icon: 'grid_view' },
                        { id: 'inventory', label: 'Inventory', icon: 'inventory_2' },
                        { id: 'notifications', label: 'Broadcasts', icon: 'campaign' },
                        { id: 'locations', label: 'Outlets', icon: 'storefront' },
                        { id: 'carousel', label: 'Feats', icon: 'magic_button' },
                        { id: 'plans', label: 'Plans', icon: 'loyalty' },
                        { id: 'settings', label: 'Settings', icon: 'settings' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeTab === tab.id
                                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105'
                                : 'bg-white/5 text-slate-500 border-white/5 hover:border-white/10'
                                }`}
                        >
                            <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === 'orders' && (
                    <div className="space-y-8">
                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {statCards.map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bento-card p-6 space-y-2 relative overflow-hidden bg-white/[0.02] border border-white/5 group"
                                >
                                    <span className="material-symbols-outlined text-white/5 text-6xl absolute -right-2 -bottom-2 group-hover:scale-110 transition-transform duration-500">{stat.icon}</span>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">{stat.label}</p>
                                    <h3 className="text-3xl font-black text-white">{stat.value}</h3>
                                </motion.div>
                            ))}
                        </div>

                        {/* Revenue Trends and Popular Items */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Revenue Chart */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bento-card p-6 border border-white/5 space-y-6"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                        7-Day Revenue Trend
                                    </h3>
                                </div>
                                <div className="h-40 flex items-end gap-3 px-2">
                                    {(statsData?.dailyRevenue || []).map((day, i) => (
                                        <div key={day._id} className="flex-1 flex flex-col items-center gap-2 group">
                                            <div className="w-full relative flex items-end justify-center h-full">
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${(day.revenue / maxDaily) * 100}%` }}
                                                    className="w-full bg-primary/20 hover:bg-primary transition-colors rounded-t-lg relative"
                                                >
                                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[8px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                        ₦{day.revenue.toLocaleString()}
                                                    </div>
                                                </motion.div>
                                            </div>
                                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">
                                                {new Date(day._id).toLocaleDateString('en-US', { weekday: 'short' })}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Popular Items */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bento-card p-6 border border-white/5"
                            >
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Market Popularity</h3>
                                <div className="space-y-4">
                                    {(statsData?.popularItems || []).map((item, i) => (
                                        <div key={item._id} className="space-y-2">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[10px] font-black text-white uppercase italic">{item._id}</span>
                                                <span className="text-[9px] font-black text-primary uppercase">{item.count} Sold</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(item.count / (statsData?.popularItems[0].count || 1)) * 100}%` }}
                                                    className="h-full bg-gradient-to-r from-primary/50 to-primary"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Recent Orders List */}
                        <section className="space-y-6">
                            <h2 className="text-xl font-black text-white flex items-center gap-3">
                                <span className="w-2 h-8 bg-green-500 rounded-full"></span>
                                Order Activity
                            </h2>

                            <div className="space-y-3">
                                {loading ? (
                                    <div className="py-20 flex justify-center"><div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" /></div>
                                ) : orders.length === 0 ? (
                                    <div className="bento-card p-12 text-center text-slate-500 italic">No orders yet</div>
                                ) : (
                                    orders.slice(0, 5).map((order, i) => (
                                        <motion.div
                                            key={order.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="bento-card p-5 flex items-center justify-between border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all cursor-crosshair"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-xs text-primary">
                                                    #{order.id.slice(-4).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm text-white">{order.user?.name || 'Guest'}</h4>
                                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-sm text-white">₦{order.totalPrice.toLocaleString()}</p>
                                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${order.isPaid ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                                    {order.isPaid ? 'Settled' : 'Unpaid'}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'inventory' && <ProductManagement />}
                {activeTab === 'notifications' && <NotificationManagement />}
                {activeTab === 'locations' && <LocationManagement />}
                {activeTab === 'carousel' && <CarouselManagement />}
                {activeTab === 'plans' && <PlanManagement />}
                {activeTab === 'settings' && <SettingsManagement />}
            </main>
        </div>
    );
};

export default Dashboard;
