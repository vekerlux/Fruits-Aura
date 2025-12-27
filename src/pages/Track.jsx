import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { MapPin, Truck, CheckCircle, Clock, Phone, MessageCircle, User } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import Button from '../components/Button';
import PageTransition from '../components/PageTransition';
import './Track.css';

// Fix for default Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const createIcon = (IconComponent, color) => {
    const iconMarkup = renderToStaticMarkup(
        <div style={{ color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', background: 'white', borderRadius: '50%', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
            <IconComponent size={20} fill={color} />
        </div>
    );

    return L.divIcon({
        html: iconMarkup,
        className: 'custom-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    });
};

const userIcon = createIcon(MapPin, '#4CAF50');
const driverIcon = createIcon(Truck, '#FF9800');

const Track = () => {
    const [driverPos, setDriverPos] = useState([51.505, -0.09]);
    const userPos = [51.51, -0.1]; // Fixed user position

    // Simulate driver movement
    useEffect(() => {
        const interval = setInterval(() => {
            setDriverPos(prev => [
                prev[0] + (userPos[0] - prev[0]) * 0.05,
                prev[1] + (userPos[1] - prev[1]) * 0.05
            ]);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <PageTransition>
            <div className="track-container">
                <div className="track-header">
                    <h2>Track Order</h2>
                    <span className="order-id">#FA12345</span>
                </div>

                <div className="map-wrapper">
                    <MapContainer center={[51.5075, -0.095]} zoom={13} scrollWheelZoom={false} className="leaflet-map">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={userPos} icon={userIcon}>
                            <Popup>You are here</Popup>
                        </Marker>
                        <Marker position={driverPos} icon={driverIcon}>
                            <Popup>Driver is here</Popup>
                        </Marker>
                        <Polyline positions={[driverPos, userPos]} color="#FF9800" dashArray="5, 10" />
                    </MapContainer>
                </div>

                <motion.div
                    className="status-panel"
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ type: "spring", stiffness: 100 }}
                >
                    <Card className="eta-card">
                        <div className="eta-info">
                            <span className="eta-label">Arriving in</span>
                            <span className="eta-time">12 mins</span>
                        </div>
                        <div className="eta-progress">
                            <motion.div
                                className="progress-bar"
                                initial={{ width: 0 }}
                                animate={{ width: '70%' }}
                                transition={{ duration: 1.5 }}
                            />
                        </div>
                        <p className="eta-expected">Expected by 3:45 PM</p>
                    </Card>

                    <div className="timeline">
                        <div className="timeline-item completed">
                            <div className="timeline-icon"><CheckCircle size={16} /></div>
                            <div className="timeline-content">
                                <h4>Order Confirmed</h4>
                                <span>3:15 PM</span>
                            </div>
                        </div>
                        <div className="timeline-item completed">
                            <div className="timeline-icon"><CheckCircle size={16} /></div>
                            <div className="timeline-content">
                                <h4>Preparing</h4>
                                <span>3:20 PM</span>
                            </div>
                        </div>
                        <div className="timeline-item active">
                            <div className="timeline-icon"><Truck size={16} /></div>
                            <div className="timeline-content">
                                <h4>Out for Delivery</h4>
                                <span>3:30 PM</span>
                            </div>
                        </div>
                        <div className="timeline-item pending">
                            <div className="timeline-icon"><MapPin size={16} /></div>
                            <div className="timeline-content">
                                <h4>Delivered</h4>
                                <span>Pending</span>
                            </div>
                        </div>
                    </div>

                    <div className="driver-info">
                        <div className="driver-profile">
                            <div className="driver-avatar">
                                <User size={24} />
                            </div>
                            <div className="driver-details">
                                <h4>Michael R.</h4>
                                <span>Your Driver • 4.9 ★</span>
                            </div>
                        </div>
                        <div className="driver-actions">
                            <button className="icon-action-btn green"><Phone size={20} /></button>
                            <button className="icon-action-btn orange"><MessageCircle size={20} /></button>
                        </div>
                    </div>

                    <div className="order-details-preview">
                        <Button variant="secondary" className="w-full">View Order Details</Button>
                    </div>
                </motion.div>
            </div>
        </PageTransition>
    );
};

export default Track;
