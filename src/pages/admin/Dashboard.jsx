import { useState, useEffect, useCallback } from 'react';
import { getDashboardStats } from '../../api/adminApi';
import { useToast } from '../../context/ToastContext';
import {
    DollarSign,
    ShoppingBag,
    Users,
    Package,
    ThumbsUp,
    TrendingUp,
    AlertCircle,
    ChevronRight,
    Clock
} from 'lucide-react';
import { formatNairaWithoutDecimals } from '../../utils/currency';
import { getVotingRankings } from '../../api/votingApi';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [stats, setStats] = useState(null);
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const [statsRes, rankingsRes] = await Promise.all([
                getDashboardStats(),
                getVotingRankings()
            ]);
            setStats(statsRes.stats);
            setRankings(rankingsRes.products || rankingsRes.data || []);
        } catch (err) {
            console.error('Error loading dashboard data:', err);
            showToast('Failed to load dashboard data', 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        loadData();
    }, [loadData]);

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
                <div className="admin-stat-card premium-card" onClick={() => navigate('/admin/orders')}>
                    <div className="stat-icon green">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <p className="stat-label">Total Revenue</p>
                        <p className="stat-value">{formatNairaWithoutDecimals(stats?.totalRevenue || 0)}</p>
                    </div>
                    <ChevronRight size={16} className="stat-chevron" />
                </div>

                <div className="admin-stat-card" onClick={() => navigate('/admin/orders')}>
                    <div className="stat-icon orange">
                        <ShoppingBag size={24} />
                    </div>
                    <div>
                        <p className="stat-label">Total Orders</p>
                        <p className="stat-value">{stats?.totalOrders || 0}</p>
                    </div>
                </div>

                <div className="admin-stat-card" onClick={() => navigate('/admin/users')}>
                    <div className="stat-icon blue">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="stat-label">Total Users</p>
                        <p className="stat-value">{stats?.totalUsers || 0}</p>
                    </div>
                </div>

                <div className="admin-stat-card" onClick={() => navigate('/admin/products')}>
                    <div className="stat-icon yellow">
                        <Package size={24} />
                    </div>
                    <div>
                        <p className="stat-label">Total Products</p>
                        <p className="stat-value">{stats?.totalProducts || 0}</p>
                    </div>
                </div>
            </div>

            {/* Top Selling Products */}
            <div className="dashboard-panel voting-panel">
                <div className="panel-header">
                    <h3><Package size={20} /> Top Selling Products</h3>
                    <span className="badge-info">Best Sellers</span>
                </div>
                <div className="voting-standings-list">
                    {stats?.topProducts?.length === 0 ? (
                        <p className="empty-msg">No sales data yet.</p>
                    ) : (
                        stats?.topProducts?.map((product, index) => (
                            <div key={product._id} className="standing-item">
                                <div className="standing-rank" style={{ background: index === 0 ? 'var(--primary)' : '#eee', color: index === 0 ? '#fff' : '#666' }}>
                                    {index + 1}
                                </div>
                                <div className="standing-info">
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <p className="standing-name">{product.name}</p>
                                        <span style={{ fontSize: '0.8rem', color: '#666' }}>{formatNairaWithoutDecimals(product.revenue)}</span>
                                    </div>
                                    <div className="progress-bar-bg">
                                        <div
                                            className="progress-bar-fill"
                                            style={{
                                                width: `${(product.totalSold / (stats?.topProducts[0]?.totalSold || 1)) * 100}%`,
                                                background: 'var(--secondary)'
                                            }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="standing-votes">
                                    <ShoppingBag size={14} />
                                    <span>{product.totalSold}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Voting Standings */}
            <div className="dashboard-panel voting-panel">
                <div className="panel-header">
                    <h3><TrendingUp size={20} /> Next Aura Mix Standings</h3>
                    <span className="badge-info">Latest Votes</span>
                </div>
                <div className="voting-standings-list">
                    {rankings.length === 0 ? (
                        <p className="empty-msg">No votes recorded yet.</p>
                    ) : (
                        rankings.map((product, index) => (
                            <div key={product._id} className="standing-item">
                                <div className="standing-rank">{index + 1}</div>
                                <div className="standing-info">
                                    <p className="standing-name">{product.name}</p>
                                    <div className="progress-bar-bg">
                                        <div
                                            className="progress-bar-fill"
                                            style={{ width: `${(product.voteCount / (rankings[0]?.voteCount || 1)) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="standing-votes">
                                    <ThumbsUp size={14} />
                                    <span>{product.voteCount}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Revenue Breakdown & Alerts */}
            <div className="dashboard-grid-layout">
                {/* Revenue Card */}
                <div className="dashboard-panel alert-panel">
                    <div className="panel-header">
                        <h3><DollarSign size={20} /> Revenue Health</h3>
                        <span className="badge-info">Financials</span>
                    </div>
                    <div className="action-alerts-list">
                        <div className="alert-item no-hover">
                            <div className="alert-icon green"><DollarSign size={18} /></div>
                            <div className="alert-text">
                                <p>Realized Revenue</p>
                                <span>{formatNairaWithoutDecimals(stats?.totalRevenue || 0)} (Confirmed)</span>
                            </div>
                        </div>
                        <div className="alert-item no-hover">
                            <div className="alert-icon orange"><Clock size={18} /></div>
                            <div className="alert-text">
                                <p>Potential Revenue</p>
                                <span>{formatNairaWithoutDecimals(stats?.potentialRevenue || 0)} (Pending/Transit)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Important Actions */}
                <div className="dashboard-panel alert-panel">
                    <div className="panel-header">
                        <h3><AlertCircle size={20} /> Operational Alerts</h3>
                    </div>
                    <div className="action-alerts-list">
                        <div className="alert-item" onClick={() => navigate('/admin/orders')}>
                            <div className="alert-icon orange"><ShoppingBag size={18} /></div>
                            <div className="alert-text">
                                <p>Review Pending Orders</p>
                                <span>Action required for {stats?.pendingOrders || 0} orders</span>
                            </div>
                        </div>
                        <div className="alert-item" onClick={() => navigate('/admin/users')}>
                            <div className="alert-icon blue"><Users size={18} /></div>
                            <div className="alert-text">
                                <p>Distributor Approvals</p>
                                <span>Check {stats?.pendingDistributors || 0} applications</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
