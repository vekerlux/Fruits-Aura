import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    LogOut,
    Home
} from 'lucide-react';
import './AdminLayout.css';

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            showToast('Logged out successfully', 'success');
            navigate('/login');
        } catch (error) {
            showToast('Logout failed', 'error');
        }
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-header">
                    <h2>🍹 Fruits Aura</h2>
                    <p className="admin-title">Admin Panel</p>
                </div>

                <nav className="admin-nav">
                    <NavLink to="/admin" end className={({ isActive }) => isActive ? 'active' : ''}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'active' : ''}>
                        <Package size={20} />
                        <span>Products</span>
                    </NavLink>
                    <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'active' : ''}>
                        <ShoppingCart size={20} />
                        <span>Orders</span>
                    </NavLink>
                    <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'active' : ''}>
                        <Users size={20} />
                        <span>Users</span>
                    </NavLink>
                </nav>

                <div className="admin-footer">
                    <div className="admin-user-info">
                        <p className="user-name">{user?.name}</p>
                        <p className="user-email">{user?.email}</p>
                    </div>
                    <button onClick={() => navigate('/')} className="back-to-site">
                        <Home size={18} />
                        <span>Back to Site</span>
                    </button>
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
}
