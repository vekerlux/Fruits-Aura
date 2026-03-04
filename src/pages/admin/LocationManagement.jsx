import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, MapPin, Phone, ExternalLink, X, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../../context/ToastContext';
import client from '../../api/client';
import Button from '../../components/Button';
import './LocationManagement.css';

const LocationManagement = () => {
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const { showToast } = useToast();

    const [form, setForm] = useState({
        name: '',
        description: '',
        address: '',
        phone: '',
        image: '',
        mapEmbedUrl: '',
        mapLink: '',
        shopNumber: '',
        order: 0
    });

    const fetchLocations = async () => {
        try {
            const res = await client.get('/locations/all');
            setLocations(res.data.locations || []);
        } catch (error) {
            showToast('Failed to fetch locations', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    const handleFileChange = (e, isEdit = false) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (isEdit) {
                    setIsEditing(prev => ({ ...prev, image: reader.result }));
                } else {
                    setForm(prev => ({ ...prev, image: reader.result }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAdd = async () => {
        try {
            await client.post('/locations', form);
            showToast('Location added successfully', 'success');
            setShowAddForm(false);
            setForm({ name: '', description: '', address: '', phone: '', image: '', mapEmbedUrl: '', mapLink: '', shopNumber: '', order: locations.length });
            fetchLocations();
        } catch (error) {
            showToast('Failed to add location', 'error');
        }
    };

    const handleUpdate = async (id) => {
        try {
            await client.patch(`/locations/${id}`, isEditing);
            showToast('Location updated', 'success');
            setIsEditing(null);
            fetchLocations();
        } catch (error) {
            showToast('Update failed', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this location?')) return;
        try {
            await client.delete(`/locations/${id}`);
            showToast('Location deleted', 'success');
            fetchLocations();
        } catch (error) {
            showToast('Delete failed', 'error');
        }
    };

    return (
        <div className="location-mgmt-container">
            <div className="admin-page-header">
                <div>
                    <h1>Location Management</h1>
                    <p>Manage your physical store branches and pickup points</p>
                </div>
                <Button onClick={() => setShowAddForm(true)}>
                    <Plus size={18} /> Add New Location
                </Button>
            </div>

            <div className="locations-grid-premium">
                {isLoading ? (
                    <div className="loading-state-icon">
                        <div className="aura-spinner"></div>
                        <p>Loading Locations...</p>
                    </div>
                ) : locations.length > 0 ? (
                    locations.map((loc) => (
                        <motion.div
                            key={loc._id}
                            className="location-card-premium"
                            whileHover={{ y: -8 }}
                        >
                            <div className="location-card-media">
                                <img src={loc.image || 'https://via.placeholder.com/400x200'} alt={loc.name} />
                                <div className="location-badge">#{loc.shopNumber || 'Store'}</div>
                            </div>
                            <div className="location-card-info">
                                <h3>{loc.name}</h3>
                                <div className="loc-detail-row">
                                    <MapPin size={14} />
                                    <span>{loc.address}</span>
                                </div>
                                <div className="loc-detail-row">
                                    <Phone size={14} />
                                    <span>{loc.phone}</span>
                                </div>
                                <p className="loc-desc">{loc.description}</p>
                            </div>
                            <div className="location-card-actions">
                                <button className="loc-action-btn edit" onClick={() => setIsEditing(loc)}>
                                    <Edit2 size={16} />
                                </button>
                                <button className="loc-action-btn delete" onClick={() => handleDelete(loc._id)}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="empty-state-box">
                        <MapPin size={48} opacity={0.3} />
                        <p>No locations added yet. Add your first store branch!</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Modals would go here, reusing the same styling as CarouselManagement */}
            {(showAddForm || isEditing) && (
                <div className="form-overlay">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="form-card"
                    >
                        <div className="form-header">
                            <h3>{showAddForm ? 'Add New Location' : 'Edit Location'}</h3>
                            <button className="close-btn" onClick={() => { setShowAddForm(false); setIsEditing(null); }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="form-body">
                            <div className="form-inputs">
                                <div className="input-group">
                                    <label>Location Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Glamour Dinners"
                                        value={showAddForm ? form.name : isEditing.name}
                                        onChange={e => showAddForm ? setForm({ ...form, name: e.target.value }) : setIsEditing({ ...isEditing, name: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Brief Description</label>
                                    <textarea
                                        placeholder="Store highlights..."
                                        value={showAddForm ? form.description : isEditing.description}
                                        onChange={e => showAddForm ? setForm({ ...form, description: e.target.value }) : setIsEditing({ ...isEditing, description: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Physical Address</label>
                                    <input
                                        type="text"
                                        placeholder="Full address here..."
                                        value={showAddForm ? form.address : isEditing.address}
                                        onChange={e => showAddForm ? setForm({ ...form, address: e.target.value }) : setIsEditing({ ...isEditing, address: e.target.value })}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div className="input-group">
                                        <label>Phone Number</label>
                                        <input
                                            type="text"
                                            placeholder="+234..."
                                            value={showAddForm ? form.phone : isEditing.phone}
                                            onChange={e => showAddForm ? setForm({ ...form, phone: e.target.value }) : setIsEditing({ ...isEditing, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Shop/Order #</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Shop 45"
                                            value={showAddForm ? form.shopNumber : isEditing.shopNumber}
                                            onChange={e => showAddForm ? setForm({ ...form, shopNumber: e.target.value }) : setIsEditing({ ...isEditing, shopNumber: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label>Google Maps Embed URL</label>
                                    <input
                                        type="text"
                                        placeholder="https://www.google.com/maps/embed?..."
                                        value={showAddForm ? form.mapEmbedUrl : isEditing.mapEmbedUrl}
                                        onChange={e => showAddForm ? setForm({ ...form, mapEmbedUrl: e.target.value }) : setIsEditing({ ...isEditing, mapEmbedUrl: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Brand Photo</label>
                                    <div className="image-upload-box">
                                        <input
                                            type="file"
                                            id="loc-upload"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, !!isEditing)}
                                            hidden
                                        />
                                        <label htmlFor="loc-upload" className="upload-label">
                                            <ImageIcon size={24} />
                                            <span>{(showAddForm ? form.image : isEditing.image) ? "Change Photo" : "Upload Store Photo"}</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="preview-section">
                                <h4>Live Mobile Card Preview</h4>
                                <div className="location-card-premium" style={{ width: '100%', margin: '0' }}>
                                    <div className="location-card-media">
                                        <img src={(showAddForm ? form.image : isEditing.image) || 'https://via.placeholder.com/400x200'} alt="Preview" />
                                        <div className="location-badge">#{(showAddForm ? form.shopNumber : isEditing.shopNumber) || 'STORE'}</div>
                                    </div>
                                    <div className="location-card-info">
                                        <h3>{(showAddForm ? form.name : isEditing.name) || 'STORE NAME'}</h3>
                                        <div className="loc-detail-row">
                                            <MapPin size={14} />
                                            <span>{(showAddForm ? form.address : isEditing.address) || 'Store Address...'}</span>
                                        </div>
                                        <div className="loc-detail-row">
                                            <Phone size={14} />
                                            <span>{(showAddForm ? form.phone : isEditing.phone) || 'Phone Number...'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-footer">
                            <Button variant="secondary" onClick={() => { setShowAddForm(false); setIsEditing(null); }}>Cancel</Button>
                            <Button onClick={showAddForm ? handleAdd : () => handleUpdate(isEditing._id)}>
                                {showAddForm ? 'Publish Location' : 'Save Changes'}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default LocationManagement;
