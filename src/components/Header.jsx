import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const userName = user?.name?.split(' ')[0] || 'Aura Guest';

    return (
        <header className="glass-header">
            <div className="header-left">
                <img src="/images/fruits-aura-logo.png" alt="Logo" className="header-logo-glow" />
            </div>

            <div className="header-center">
                <h2 className="header-greeting">Welcome back, {userName}! ✨</h2>
            </div>

            <div className="header-right">
                <button className="notification-trigger" onClick={() => navigate('/notifications')}>
                    <Bell size={24} color="var(--primary-orange)" />
                    <span className="unread-badge">12</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
