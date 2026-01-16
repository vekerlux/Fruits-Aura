import React, { useState, useRef } from 'react';
import { User, MapPin, CreditCard, Bell, HelpCircle, LogOut, ChevronRight, Clock, Moon, Sun, Shield, Camera, X, Check, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import PageTransition from '../components/PageTransition';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { updateProfile } from '../api/authApi';
import Button from '../components/Button';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();
    const { user, isAuthenticated, isAdmin, logout, updateUser } = useAuth();
    const { showToast } = useToast();

    // Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: user?.name || '',
        email: user?.email || '', // Email usually read-only
        avatar: user?.avatar || null
    });

    const handleLogout = async () => {
        try {
            await logout();
            showToast('Logged out successfully', 'success');
            navigate('/login');
        } catch (error) {
            showToast('Logout failed', 'error');
        }
    };

    const handleSaveProfile = async () => {
        try {
            const response = await updateProfile({ name: editForm.name, avatar: editForm.avatar });
            // Update local context with the data returned from backend
            if (response.success && response.data?.user) {
                updateUser(response.data.user);
                setIsEditing(false);
                showToast('Profile updated successfully!', 'success');
            } else {
                throw new Error('Update failed');
            }
        } catch (error) {
            console.error(error);
            showToast(error.response?.data?.message || 'Failed to update profile', 'error');
        }
    };

    const fileInputRef = useRef(null);

    const handleAvatarClick = () => {
        if (!isEditing) return;
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5000000) { // 5MB limit
                showToast('Image is too large (max 5MB)', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setEditForm(prev => ({ ...prev, avatar: reader.result }));
                showToast('Profile picture updated!', 'success');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleWhatsApp = () => {
        // Using the user provided number 09139110078 formatted for intl format (234...)
        window.open('https://wa.me/2349139110078', '_blank');
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
                    <div className="profile-avatar" onClick={handleAvatarClick} style={{ cursor: isEditing ? 'pointer' : 'default', position: 'relative' }}>
                        {(isEditing ? editForm.avatar : user?.avatar) ? (
                            <img src={isEditing ? editForm.avatar : user.avatar} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                            <User size={40} />
                        )}
                        {isEditing && (
                            <div style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--primary)', borderRadius: '50%', padding: '4px', color: 'white' }}>
                                <Camera size={14} />
                            </div>
                        )}
                    </div>

                    <div className="profile-info">
                        {!isEditing ? (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h2>{user?.name || 'User'}</h2>
                                    <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
                                </div>
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
                            </>
                        ) : (
                            <div className="edit-form">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <div className="profile-input-group">
                                    <input
                                        type="text"
                                        className="profile-input"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        placeholder="Full Name"
                                    />
                                </div>
                                <div className="action-buttons-row">
                                    <Button size="sm" onClick={handleSaveProfile}><Check size={16} /> Save</Button>
                                    <Button size="sm" variant="secondary" onClick={() => setIsEditing(false)}><X size={16} /> Cancel</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* WhatsApp Direct */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                >
                    <Card className="whatsapp-card" onClick={handleWhatsApp}>
                        <div className="whatsapp-content">
                            <Phone size={28} />
                            <div className="whatsapp-text">
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <h3>Order via WhatsApp</h3>
                                    <span className="save-contact-badge">SAVE ME</span>
                                </div>
                                <p>0913 911 0078 • Click to chat directly</p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Subscription Dashboard */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="subscription-card premium-aura">
                        <div className="sub-header">
                            <div className="sub-title-group">
                                <h3>Subscription</h3>
                                <div className="aura-sparkle">✨</div>
                            </div>
                            <span className="status-pill active">
                                {user?.subscription?.status || 'Active'}
                            </span>
                        </div>
                        <div className="plan-details-hero">
                            <p className="plan-label">Current Plan</p>
                            <h4 className="plan-name">Aura (Welcome Bonus)</h4>
                            <p className="plan-info">Valid until transition to Fresher plan.</p>
                            <div className="plan-benefits">
                                <span>• 20 bottles/day limit</span>
                                <span>• 3 Aurasets/day limit</span>
                                <span>• Priority delivery</span>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Referral Program Section */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 }}
                >
                    <Card className="referral-card">
                        <div className="referral-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div className="gift-icon">🎁</div>
                                <h3>Refer & Earn</h3>
                            </div>
                            <span className="referral-count">{user?.referrals?.length || 0} Joins</span>
                        </div>
                        <p className="referral-text">Share your code and get <strong>Free Aurasets</strong> when friends join!</p>

                        <div className="referral-progress-container">
                            <div className="referral-progress-info">
                                <span>Progress to Reward</span>
                                <span>{user?.referrals?.length || 0}/5 Friends</span>
                            </div>
                            <div className="referral-progress-bar">
                                <motion.div
                                    className="referral-progress-fill"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(((user?.referrals?.length || 0) / 5) * 100, 100)}%` }}
                                />
                            </div>
                            <p className="referral-milestone">
                                {user?.referrals?.length >= 5
                                    ? "🎉 Reward unlocked! Contact support."
                                    : `Refer ${5 - (user?.referrals?.length || 0)} more to get a Free Auraset!`}
                            </p>
                        </div>

                        <div className="referral-code-box">
                            <span className="code-label">YOUR CODE:</span>
                            <span className="code-value">{user?.referralCode || 'GENERATING...'}</span>
                            <button
                                className="copy-btn"
                                onClick={() => {
                                    navigator.clipboard.writeText(user?.referralCode || '');
                                    showToast('Code copied to clipboard!', 'success');
                                }}
                            >
                                Copy
                            </button>
                        </div>

                        {user?.referrals?.length > 0 && (
                            <div className="referrals-list">
                                <h4>Recent Joins</h4>
                                <div className="referrals-chips">
                                    {user.referrals.slice(0, 3).map((ref, idx) => (
                                        <div key={idx} className="ref-chip">
                                            {ref.name?.split(' ')[0] || 'Friend'}
                                        </div>
                                    ))}
                                    {user.referrals.length > 3 && <div className="ref-chip extra">+{user.referrals.length - 3}</div>}
                                </div>
                            </div>
                        )}
                    </Card>
                </motion.div>

                {/* Address Management */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="address-management-section"
                >
                    <Card className="address-card">
                        <div className="card-header-row">
                            <h3>Delivery Addresses</h3>
                            <Button variant="secondary" className="btn-tiny">Add New</Button>
                        </div>
                        <div className="address-list">
                            <div className="address-item active">
                                <div className="address-icon">
                                    <MapPin size={18} />
                                </div>
                                <div className="address-text">
                                    <p className="title">Default Address (Home)</p>
                                    <p className="detail">Abakaliki, Ebonyi State, Nigeria</p>
                                </div>
                                <div className="active-dot"></div>
                            </div>
                        </div>
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
