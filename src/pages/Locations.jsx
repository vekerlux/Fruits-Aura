import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { Map as MapIcon, List, Search, Navigation, Phone, Heart, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import Button from '../components/Button';
import PageTransition from '../components/PageTransition';
import './Locations.css';

// Custom Pin Icon
const createPinIcon = (color) => {
    const iconMarkup = renderToStaticMarkup(
        <div style={{ color: color }}>
            <MapPin size={32} fill={color} />
        </div>
    );
    return L.divIcon({
        html: iconMarkup,
        className: 'custom-pin',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });
};

const shopIcon = createPinIcon('#4CAF50');

const locationsData = [
    {
        id: 1,
        name: "Fruits Aura Downtown",
        distance: "0.8 mi",
        address: "123 Main St, City Center",
        status: "Open Now",
        hours: "9 AM - 8 PM",
        coords: [51.505, -0.09]
    },
    {
        id: 2,
        name: "Fruits Aura Mall",
        distance: "1.2 mi",
        address: "456 Shopping Ave, Westside",
        status: "Open Now",
        hours: "10 AM - 9 PM",
        coords: [51.515, -0.1]
    },
    {
        id: 3,
        name: "Fruits Aura Kiosk",
        distance: "2.5 mi",
        address: "789 Park Ln, Northside",
        status: "Opens at 9 AM",
        hours: "9 AM - 6 PM",
        coords: [51.49, -0.08]
    }
];

const Locations = () => {
    const [viewMode, setViewMode] = useState('list');
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <PageTransition>
            <div className="locations-container">
                {/* Header */}
                <div className="locations-header">
                    <h2>Locations Near You</h2>
                    <div className="search-bar">
                        <Search size={20} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by address or zip code"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* View Toggle */}
                    <div className="view-toggle">
                        <button
                            className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
                            onClick={() => setViewMode('map')}
                        >
                            <MapIcon size={18} /> Map
                        </button>
                        <button
                            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            <List size={18} /> List
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="locations-content">
                    {viewMode === 'map' ? (
                        <div className="locations-map">
                            <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} className="leaflet-map">
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                {locationsData.map(loc => (
                                    <Marker key={loc.id} position={loc.coords} icon={shopIcon}>
                                        <Popup>
                                            <div className="map-popup">
                                                <h4>{loc.name}</h4>
                                                <p>{loc.status}</p>
                                                <button className="popup-btn">Get Directions</button>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>
                    ) : (
                        <motion.div
                            className="locations-list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Filter Bar */}
                            <div className="filter-bar">
                                <span className="filter-chip active">All Locations</span>
                                <span className="filter-chip">Open Now</span>
                            </div>

                            {locationsData.map((loc, index) => (
                                <motion.div
                                    key={loc.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="location-card">
                                        <div className="location-info">
                                            <div className="location-header-row">
                                                <h3>{loc.name}</h3>
                                                <span className="distance-badge">{loc.distance}</span>
                                            </div>
                                            <p className="address">{loc.address}</p>
                                            <div className="status-row">
                                                <span className={`status-pill ${loc.status.includes('Open') ? 'open' : 'closed'}`}>
                                                    {loc.status}
                                                </span>
                                                <span className="hours">{loc.hours}</span>
                                            </div>
                                        </div>
                                        <div className="location-actions">
                                            <Button variant="primary" className="action-btn-sm">
                                                <Navigation size={16} /> Directions
                                            </Button>
                                            <motion.button
                                                className="icon-action-btn"
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => window.location.href = 'tel:+2348000000000'}
                                                aria-label="Call Location"
                                            >
                                                <Phone size={20} />
                                            </motion.button>
                                            <motion.button
                                                className="icon-action-btn"
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <Heart size={20} />
                                            </motion.button>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>
        </PageTransition>
    );
};

export default Locations;
