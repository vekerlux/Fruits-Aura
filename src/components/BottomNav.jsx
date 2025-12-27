import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, LayoutGrid, Heart, MapPin, User } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import './BottomNav.css';

const BottomNav = () => {
    const { getFavoritesCount } = useFavorites();
    const favCount = getFavoritesCount();

    return (
        <nav className="bottom-nav">
            <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} aria-label="Home">
                <Home size={24} />
                <span>Home</span>
            </NavLink>
            <NavLink to="/menu" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} aria-label="Menu">
                <LayoutGrid size={24} />
                <span>Menu</span>
            </NavLink>
            <NavLink to="/wishlist" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} aria-label="Wishlist">
                <div className="nav-icon-wrapper">
                    <Heart size={24} />
                    {favCount > 0 && <span className="nav-badge">{favCount}</span>}
                </div>
                <span>Wishlist</span>
            </NavLink>
            <NavLink to="/locations" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} aria-label="Locations">
                <MapPin size={24} />
                <span>Locations</span>
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} aria-label="Profile">
                <User size={24} />
                <span>Profile</span>
            </NavLink>
        </nav>
    );
};

export default BottomNav;
