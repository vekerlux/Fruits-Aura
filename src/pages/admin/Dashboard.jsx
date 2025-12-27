import { useState, useEffect } from 'react';
import { getDashboardStats } from '../../api/adminApi';
import { useToast } from '../../context/ToastContext';
import {
    DollarSign,
    ShoppingBag,
    Users,
    Package
} from 'lucide-react';

export default function Dashboard() {
    const { showToast } = useToast();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardStats();
    }, []);

    const loadDashboardStats = async () => {
        try {
            const response = await getDashboardStats();
            setStats(response.stats);
        } catch (error) {
            showToast('Failed to load dashboard stats', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-page-header">
                <h1>Loading...</h1>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-page-header">
                <h1>Dashboard</h1>
                <p>Overview of your store performance</p>
            </div>

            <div className="admin-stats-grid">
                <div className="admin-stat-card">
                    <div className="stat-icon">
                        <DollarSign size={24} />
                    </div>
                    <p className="stat-label">Total Revenue</p>
                    <p className="stat-value">${stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
                </div>

                <div className="admin-stat-card">
                    <div className="stat-icon">
                        <ShoppingBag size={24} />
                    </div>
                    <p className="stat-label">Total Orders</p>
                    <p className="stat-value">{stats?.totalOrders || 0}</p>
                </div>

                <div className="admin-stat-card">
                    <div className="stat-icon">
                        <Users size={24} />
                    </div>
                    <p className="stat-label">Total Users</p>
                    <p className="stat-value">{stats?.totalUsers || 0}</p>
                </div>

                <div className="admin-stat-card">
                    <div className="stat-icon">
                        <Package size={24} />
                    </div>
                    <p className="stat-label">Total Products</p>
                    <p className="stat-value">{stats?.totalProducts || 0}</p>
                </div>
            </div>

            <div className="admin-table-container">
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <h3>Recent Orders</h3>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        Recent order analytics will appear here
                    </p>
                </div>
            </div>
        </div>
    );
}
