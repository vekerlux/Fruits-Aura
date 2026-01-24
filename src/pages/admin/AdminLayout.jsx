import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    LogOut,
    Home,
    Bell,
    Image,
    Menu,
    X,
    Check,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import './AdminLayout.css';
import { useState, useEffect } from 'react';

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await logout();
            showToast('Logged out successfully', 'success');
            navigate('/login');
        } catch (error) {
            showToast('Logout failed', 'error');
        }
    };

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <div className={`admin-layout ${isCollapsed ? 'collapsed' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            {/* Mobile Header */}
            <header className="admin-mobile-header">
                <button className="mobile-toggle" onClick={toggleMobileMenu}>
                    <Menu size={24} />
                </button>
                <div className="mobile-logo">
                    <img src="/logo.png" alt="Fruits Aura" />
                    <span>Admin</span>
                </div>
            </header>

            {/* Sidebar Overlay */}
            {isMobileMenuOpen && <div className="sidebar-overlay" onClick={toggleMobileMenu}></div>}

            <aside className={`admin-sidebar ${isMobileMenuOpen ? 'show' : ''}`}>
                <div className="admin-header">
                    <div className="admin-logo-section">
                        <img src="/images/fruits-aura-logo.png" alt="Fruits Aura" className="brand-logo" />
                        {!isCollapsed && (
                            <div className="brand-text">
                                <h2>Fruits Aura</h2>
                                <p className="admin-tagline">Admin Panel</p>
                            </div>
                        )}
                    </div>
                    <button className="collapse-toggle desktop-only" onClick={toggleSidebar}>
                        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                    <button className="mobile-close mobile-only" onClick={toggleMobileMenu}>
                        <X size={24} />
                    </button>
                </div>

                <nav className="admin-nav">
                    <NavLink title="Dashboard" to="/admin" end className={({ isActive }) => isActive ? 'active' : ''}>
                        <LayoutDashboard size={20} />
                        {!isCollapsed && <span>Dashboard</span>}
                    </NavLink>
                    <NavLink title="Products" to="/admin/products" className={({ isActive }) => isActive ? 'active' : ''}>
                        <Package size={20} />
                        {!isCollapsed && <span>Products</span>}
                    </NavLink>
                    <NavLink title="Orders" to="/admin/orders" className={({ isActive }) => isActive ? 'active' : ''}>
                        <ShoppingCart size={20} />
                        {!isCollapsed && <span>Orders</span>}
                    </NavLink>
                    <NavLink title="Users" to="/admin/users" className={({ isActive }) => isActive ? 'active' : ''}>
                        <Users size={20} />
                        {!isCollapsed && <span>Users</span>}
                    </NavLink>
                    <NavLink title="Notifications" to="/admin/notifications" className={({ isActive }) => isActive ? 'active' : ''}>
                        <Bell size={20} />
                        {!isCollapsed && <span>Notifications</span>}
                    </NavLink>
                    <NavLink title="Carousel" to="/admin/carousel" className={({ isActive }) => isActive ? 'active' : ''}>
                        <Image size={20} />
                        {!isCollapsed && <span>Carousel</span>}
                    </NavLink>
                    <NavLink title="Voting Results" to="/admin/votes" className={({ isActive }) => isActive ? 'active' : ''}>
                        <Check size={20} />
                        {!isCollapsed && <span>Votes</span>}
                    </NavLink>
                </nav>

                <div className="admin-footer">
                    {!isCollapsed && (
                        <div className="admin-user-info">
                            <p className="user-name">{user?.name}</p>
                            <p className="user-email">{user?.email}</p>
                        </div>
                    )}
                    <button title="Back to Site" onClick={() => navigate('/')} className="back-to-site">
                        <Home size={18} />
                        {!isCollapsed && <span>Back to Site</span>}
                    </button>
                    <button title="Logout" onClick={handleLogout} className="logout-btn">
                        <LogOut size={18} />
                        {!isCollapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <div className="main-content-wrapper">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
