import { useState, useEffect } from 'react';
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
    ChevronRight
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

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [statsRes, rankingsRes] = await Promise.all([
                getDashboardStats(),
                getVotingRankings()
            ]);
            setStats(statsRes.stats);
            setRankings(rankingsRes.data || []);
        } catch (error) {
            showToast('Failed to load dashboard data', 'error');
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

            <div className="dashboard-grid-layout">
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

                {/* Important Actions / Alerts */}
                <div className="dashboard-panel alert-panel">
                    <div className="panel-header">
                        <h3><AlertCircle size={20} /> Actions Needed</h3>
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
