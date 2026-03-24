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
import PromoManagement from './PromoManagement';
import OrderManagement from './OrderManagement';
import UserManagement from './UserManagement';
import Skeleton from '../../components/ui/Skeleton';
import { toast } from 'sonner';
import { 
    LayoutDashboard, 
    ShoppingBag, 
    Box, 
    Megaphone, 
    Store, 
    Sparkles, 
    Tag, 
    Star, 
    Users, 
    Settings, 
    Download, 
    BarChart3,
    TrendingUp,
    ShieldCheck,
    Calendar,
    Zap,
    Activity,
    Globe,
    Clock
} from 'lucide-react';

interface Order {
    id: string;
    totalPrice: number;
    isPaid: boolean;
    status: string;
    createdAt: string;
    user: { name: string };
    deliveryTimeSlot?: string;
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
    const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'inventory' | 'notifications' | 'locations' | 'plans' | 'settings' | 'carousel' | 'promos' | 'users'>('overview');

    // Analytics states
    const [dateRange, setDateRange] = useState({
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [ordersRes, statsRes] = await Promise.all([
                api.get('/orders'),
                api.get(`/orders/stats?startDate=${dateRange.start}&endDate=${dateRange.end}`)
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

        // Simulate Real-time Order Alert (Integration Bridge)
        const checkNewOrders = setInterval(async () => {
            try {
                const res = await api.get('/orders');
                if (res.data.length > orders.length && orders.length > 0) {
                    const newOrder = res.data[0];
                    toast.success(`New Order: ₦${newOrder.totalPrice.toLocaleString()}`, {
                        description: `From ${newOrder.user?.name || 'Anonymous'}`,
                        icon: <ShoppingBag className="w-4 h-4 text-primary" />
                    });
                    setOrders(res.data);
                }
            } catch (e) {}
        }, 30000); // Check every 30s

        return () => clearInterval(checkNewOrders);
    }, [user, dateRange, orders.length]);

    const handleExportCSV = async () => {
        try {
            const response = await api.get(`/orders/export?startDate=${dateRange.start}&endDate=${dateRange.end}`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `aura-intelligence-${dateRange.start}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Export failed', error);
        }
    };

    const statCards = [
        { label: 'Ecosystem Revenue', value: statsData?.totals.totalRevenue || 0, icon: TrendingUp, color: 'primary', suffix: '₦' },
        { label: 'Total Extractions', value: statsData?.totals.totalOrders || 0, icon: ShoppingBag, color: 'secondary', suffix: '' },
        { label: 'Aura Capacity', value: Math.round(statsData?.totals.avgOrderValue || 0), icon: Activity, color: 'primary', suffix: '₦' },
    ];

    const maxDaily = Math.max(...(statsData?.dailyRevenue.map(d => d.revenue) || [1]));

    return (
        <div className="bg-background-dark text-white min-h-screen flex aurora-bg overflow-hidden">
            {/* Left Sidebar */}
            <aside className="w-64 flex-shrink-0 border-r border-white/[0.04] bg-background-dark/85 backdrop-blur-xl flex flex-col h-screen z-50">
                <div className="p-6 border-b border-white/[0.04]">
                    <h1 className="text-xl font-black italic tracking-tighter leading-none uppercase">Fruits Aura Admin</h1>
                    <p className="text-[9px] text-primary font-black uppercase tracking-[0.3em] mt-1">Management Protocol</p>
                </div>
                
                <div className="flex-1 overflow-y-auto px-4 py-8 space-y-2 no-scrollbar">
                    {[
                        { id: 'overview', label: 'Stats', icon: BarChart3 },
                        { id: 'orders', label: 'Orders', icon: Zap },
                        { id: 'inventory', label: 'Inventory', icon: Box },
                        { id: 'notifications', label: 'Broadcast', icon: Megaphone },
                        { id: 'locations', label: 'Outlets', icon: Store },
                        { id: 'carousel', label: 'Feat', icon: Sparkles },
                        { id: 'promos', label: 'Promos', icon: Tag },
                        { id: 'plans', label: 'Subsets', icon: Star },
                        { id: 'users', label: 'Units', icon: Users },
                        { id: 'settings', label: 'Config', icon: Settings },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border italic ${activeTab === tab.id
                                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.02] z-10'
                                : 'bg-transparent text-slate-500 border-transparent hover:bg-white/[0.03] hover:text-white'
                            }`}
                        >
                            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : 'text-slate-600'}`} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Return button */}
                <div className="p-4 border-t border-white/[0.04]">
                    <a href="/home" className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all italic border border-white/5 disabled:opacity-50">
                        <ShoppingBag className="w-4 h-4 text-primary" />
                        Return to Store
                    </a>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="px-8 pt-6 pb-6 sticky top-0 z-40 bg-background-dark/80 backdrop-blur-xl border-b border-white/[0.04]">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-black italic tracking-tighter uppercase text-white">{activeTab} Dashboard</h2>
                        </div>
                        <div className="w-10 h-10 rounded-xl glass border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/5">
                            <LayoutDashboard className="text-primary w-5 h-5" />
                        </div>
                    </div>
                </header>

                <main className="flex-1 px-8 pt-8 pb-32 overflow-y-auto w-full relative">

                {activeTab === 'overview' && (
                    <div className="space-y-10">
                        {/* Intelligence Pulse */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 italic">Pulse Modulation</h2>
                                <button
                                    onClick={handleExportCSV}
                                    className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all"
                                >
                                    <Download className="w-3 h-3" /> Report
                                </button>
                            </div>

                            <div className="liquid-glass p-6 border border-white/[0.04] space-y-6">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1 space-y-2">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic">Phase Start</p>
                                        <input
                                            type="date"
                                            value={dateRange.start}
                                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-xs font-black uppercase text-white focus:outline-none focus:border-primary/50"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic">Phase End</p>
                                        <input
                                            type="date"
                                            value={dateRange.end}
                                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-xs font-black uppercase text-white focus:outline-none focus:border-primary/50"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Topline Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <Skeleton key={i} className="h-32" />
                                ))
                            ) : (
                                statCards.map((stat, i) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="liquid-glass p-7 space-y-3 relative overflow-hidden group border border-white/[0.04]"
                                    >
                                        <stat.icon className="text-white/[0.03] w-24 h-24 absolute -right-4 -bottom-4 group-hover:scale-110 group-hover:text-primary/10 transition-all duration-700" />
                                        <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black italic">{stat.label}</p>
                                        <h3 className="text-4xl font-black text-white italic tracking-tighter shadow-glow-primary">
                                            {stat.suffix}{stat.value.toLocaleString()}
                                        </h3>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Global Vibe Intelligence */}
                        <section className="space-y-6">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 italic">Global Vibe Intelligence</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Revenue Refraction */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="liquid-glass p-8 border border-white/[0.04] space-y-8"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white italic">Revenue Refraction</h3>
                                        </div>
                                        <Globe className="text-slate-600 w-4 h-4" />
                                    </div>
                                    <div className="h-48 flex items-end gap-3 px-2">
                                        {(statsData?.dailyRevenue || []).map((day, i) => (
                                            <div key={day._id} className="flex-1 flex flex-col items-center gap-3 group">
                                                <div className="w-full relative flex items-end justify-center h-full">
                                                    <motion.div
                                                        initial={{ height: 0 }}
                                                        animate={{ height: `${(day.revenue / maxDaily) * 100}%` }}
                                                        className="w-full bg-primary/10 hover:bg-primary transition-all rounded-xl relative border border-primary/20 hover:shadow-[0_0_20px_rgba(242,127,13,0.3)]"
                                                    />
                                                </div>
                                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">
                                                    {new Date(day._id).toLocaleDateString('en-US', { weekday: 'short' })}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Market Resonance */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="liquid-glass p-8 border border-white/[0.04] space-y-8"
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white italic">Market Resonance</h3>
                                        <TrendingUp className="text-secondary w-4 h-4" />
                                    </div>
                                    <div className="space-y-6">
                                        {(statsData?.popularItems || []).map((item, i) => (
                                            <div key={item._id} className="space-y-3">
                                                <div className="flex justify-between items-end">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1 h-3 bg-primary rounded-full" />
                                                        <span className="text-[10px] font-black text-white uppercase italic tracking-tight">{item._id}</span>
                                                    </div>
                                                    <span className="text-[9px] font-black text-primary uppercase tracking-widest">{item.count} Extractions</span>
                                                </div>
                                                <div className="h-2 w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/[0.05]">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(item.count / (statsData?.popularItems[0].count || 1)) * 100}%` }}
                                                        className="h-full bg-gradient-to-r from-primary/30 via-primary to-primary shadow-[0_0_15px_rgba(242,127,13,0.4)]"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        </section>

                        {/* Recent Activity Stream */}
                        <section className="space-y-6">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 italic">Extraction Stream</h2>
                            <div className="space-y-4">
                                {loading ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <Skeleton key={i} className="h-20 w-full" />
                                    ))
                                ) : (
                                    orders.slice(0, 8).map((order, i) => (
                                        <motion.div
                                            key={order.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="liquid-glass p-5 flex items-center justify-between border border-white/[0.04] hover:bg-white/[0.06] transition-all cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center font-black text-[10px] text-primary border border-white/[0.05] shadow-lg group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
                                                    #{order.id.slice(-4).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-xs text-white italic uppercase tracking-tight flex items-center gap-2">
                                                        {order.user?.name || 'Anonymous Aura'}
                                                        {order.deliveryTimeSlot && (
                                                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1 border border-primary/20">
                                                                <Clock className="w-2 h-2" />
                                                                {order.deliveryTimeSlot.split(' ')[0]}
                                                            </span>
                                                        )}
                                                    </h4>
                                                    <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mt-1">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right space-y-1.5">
                                                <p className="font-black text-sm text-white italic">₦{order.totalPrice.toLocaleString()}</p>
                                                <div className={`text-[8px] font-black uppercase px-2 py-1 rounded-lg inline-flex items-center gap-1.5 ${order.isPaid ? 'bg-secondary/10 text-secondary border border-secondary/20' : 'bg-red-400/10 text-red-400 border border-red-400/20'}`}>
                                                    <div className={`w-1 h-1 rounded-full ${order.isPaid ? 'bg-secondary' : 'bg-red-400'}`} />
                                                    {order.isPaid ? 'Settled' : 'Unpaid'}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'orders' && <OrderManagement />}
                {activeTab === 'inventory' && <ProductManagement />}
                {activeTab === 'notifications' && <NotificationManagement />}
                {activeTab === 'locations' && <LocationManagement />}
                {activeTab === 'carousel' && <CarouselManagement />}
                {activeTab === 'plans' && <PlanManagement />}
                {activeTab === 'settings' && <SettingsManagement />}
                {activeTab === 'promos' && <PromoManagement />}
                {activeTab === 'users' && <UserManagement />}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
