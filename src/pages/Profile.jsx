import React from 'react';
import { User, MapPin, CreditCard, Bell, HelpCircle, LogOut, ChevronRight, Clock, Moon, Sun, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import PageTransition from '../components/PageTransition';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const { showToast } = useToast();

    const handleLogout = async () => {
        try {
            await logout();
            showToast('Logged out successfully', 'success');
            navigate('/login');
        } catch (error) {
            showToast('Logout failed', 'error');
        }
    };

    const menuItems = [
        { icon: Clock, label: 'My Orders', path: '/history' },
        ...(isAdmin ? [{ icon: Shield, label: 'Admin Panel', path: '/admin' }] : []),
        { icon: MapPin, label: 'Saved Locations', path: '/locations' },
        { icon: CreditCard, label: 'Payment Methods', path: '#' },
        { icon: Bell, label: 'Notifications', path: '#' },
        { icon: HelpCircle, label: 'Help & Support', path: '#' },
    ];

    if (!isAuthenticated) {
        return (
            <PageTransition>
                <div className="profile-container">
                    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                        <h2>Please log in to view your profile</h2>
                        <motion.button
                            onClick={() => navigate('/login')}
                            style={{ marginTop: '1rem', padding: '0.75rem 2rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', cursor: 'pointer', fontWeight: '600' }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Go to Login
                        </motion.button>
                    </div>
                </div>
            </PageTransition>
        );
    }

    return (
        <PageTransition>
            <div className="profile-container">
                <motion.div
                    className="profile-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="profile-avatar">
                        <User size={40} />
                    </div>
                    <div className="profile-info">
                        <h2>{user?.name || 'User'}</h2>
                        <p>{user?.email}</p>
                        <div className="profile-badges">
                            {isAdmin && <span className="badge admin">Admin</span>}
                            <span className={`badge ${user?.role || 'consumer'}`}>
                                {user?.role === 'distributor' ? 'Distributor' : 'Consumer'}
                            </span>
                            <span className="badge plan">
                                {user?.subscription?.plan === 'aura' ? 'Aura Plan' : 'Free Plan'}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Subscription Dashboard */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="subscription-card">
                        <div className="sub-header">
                            <h3>Subscription Status</h3>
                            <span className={`status-pill ${user?.subscription?.status || 'active'}`}>
                                {user?.subscription?.status || 'Active'}
                            </span>
                        </div>
                        <div className="plan-details">
                            <p className="plan-name">Current Plan: <strong>{user?.subscription?.plan === 'aura' ? 'Aura (Welcome Bonus)' : 'Fresher (Free)'}</strong></p>
                            <p className="plan-desc">
                                {user?.subscription?.plan === 'aura'
                                    ? ' enjoying welcome benefits and discounts.'
                                    : 'Basic access to ordering.'}
                            </p>
                        </div>
                        {user?.role === 'consumer' && (
                            <button className="upgrade-btn">
                                Upgrade to Distributor
                            </button>
                        )}
                    </Card>
                </motion.div>

                <div className="profile-menu">
                    {menuItems.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card
                                className="menu-item"
                                onClick={() => item.path && navigate(item.path)}
                            >
                                <div className="menu-icon">
                                    <item.icon size={20} />
                                </div>
                                <span className="menu-label">{item.label}</span>
                                <ChevronRight size={16} className="chevron" />
                            </Card>
                        </motion.div>
                    ))}

                    {/* Dark Mode Toggle */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: menuItems.length * 0.05 }}
                    >
                        <Card className="menu-item" onClick={toggleTheme}>
                            <div className="menu-icon">
                                {isDark ? <Sun size={20} /> : <Moon size={20} />}
                            </div>
                            <span className="menu-label">Dark Mode</span>
                            <div className={`toggle-switch ${isDark ? 'active' : ''}`}>
                                <div className="toggle-knob"></div>
                            </div>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (menuItems.length + 1) * 0.05 }}
                    >
                        <Card className="menu-item logout" onClick={handleLogout}>
                            <div className="menu-icon red">
                                <LogOut size={20} />
                            </div>
                            <span className="menu-label red">Log Out</span>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </PageTransition>
    );
};

export default Profile;
