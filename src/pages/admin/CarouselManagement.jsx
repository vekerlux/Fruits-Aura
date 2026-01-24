import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, X, MoveUp, MoveDown, Image } from 'lucide-react';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';
import client from '../../api/client';
import Button from '../../components/Button';
import './CarouselManagement.css';

const CarouselManagement = () => {
    const [slides, setSlides] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(null); // ID of slide being edited
    const [showAddForm, setShowAddForm] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const { showToast } = useToast();

    const [form, setForm] = useState({
        title: '',
        description: '',
        image: '',
        color: '#00A651',
        order: 0
    });

    const fetchSlides = async () => {
        try {
            const res = await client.get('/admin/carousel');
            setSlides(res.data.slides || []);
        } catch (error) {
            showToast('Failed to fetch slides', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSlides();
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
            await client.post('/admin/carousel', form);
            showToast('Slide added successfully', 'success');
            setShowAddForm(false);
            setForm({ title: '', description: '', image: '', color: '#00A651', order: slides.length });
            fetchSlides();
        } catch (error) {
            showToast('Failed to add slide', 'error');
        }
    };

    const handleUpdate = async (id) => {
        try {
            await client.patch(`/admin/carousel/${id}`, isEditing);
            showToast('Slide updated', 'success');
            setIsEditing(null);
            fetchSlides();
        } catch (error) {
            showToast('Update failed', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this slide?')) return;
        try {
            await client.delete(`/admin/carousel/${id}`);
            showToast('Slide deleted', 'success');
            fetchSlides();
        } catch (error) {
            showToast('Delete failed', 'error');
        }
    };

    return (
        <div className="carousel-mgmt">
            <div className="mgmt-header">
                <h2>Carousel Management</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button variant="secondary" onClick={() => setShowSettings(!showSettings)}>
                        Settings
                    </Button>
                    <Button onClick={() => setShowAddForm(true)}>
                        <Plus size={18} /> Add Slide
                    </Button>
                </div>
            </div>

            {showSettings && (
                <div className="settings-panel" style={{ background: '#1E1E1E', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #333' }}>
                    <h3>Carousel Settings</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '16px' }}>
                        <div className="form-group">
                            <label>Autoplay</label>
                            <select style={{ width: '100%', padding: '8px', background: '#121212', border: '1px solid #333', borderRadius: '6px', color: 'white' }}>
                                <option>Enabled</option>
                                <option>Disabled</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Speed (ms)</label>
                            <input type="number" defaultValue={5000} style={{ width: '100%', padding: '8px', background: '#121212', border: '1px solid #333', borderRadius: '6px', color: 'white' }} />
                        </div>
                    </div>
                </div>
            )}

            {showAddForm && (
                <div className="slide-form-overlay">
                    <div className="slide-form">
                        <h3>New Carousel Slide</h3>
                        <input
                            type="text"
                            placeholder="Heading Title"
                            value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                        />
                        <textarea
                            placeholder="Short Description"
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                        />
                        <div className="form-row">
                            <input
                                type="color"
                                value={form.color}
                                onChange={e => setForm({ ...form, color: e.target.value })}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        {form.image && <img src={form.image} className="preview-img" alt="Preview" />}
                        <div className="form-actions">
                            <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                            <Button onClick={handleAdd}>Save Slide</Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="slides-grid">
                {isLoading ? (
                    <p>Loading slides...</p>
                ) : slides.length > 0 ? (
                    slides.map((slide) => (
                        <div key={slide._id} className="slide-mgmt-card">
                            {isEditing?._id === slide._id ? (
                                <div className="edit-mode">
                                    <input value={isEditing.title} onChange={e => setIsEditing({ ...isEditing, title: e.target.value })} />
                                    <textarea value={isEditing.description} onChange={e => setIsEditing({ ...isEditing, description: e.target.value })} />
                                    <div className="edit-actions">
                                        <button onClick={() => handleUpdate(slide._id)}><Check size={18} /></button>
                                        <button onClick={() => setIsEditing(null)}><X size={18} /></button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="slide-preview" style={{ background: slide.color }}>
                                        <img src={slide.image} alt={slide.title} />
                                    </div>
                                    <div className="slide-details">
                                        <h4>{slide.title}</h4>
                                        <p>{slide.description}</p>
                                    </div>
                                    <div className="card-controls">
                                        <button onClick={() => setIsEditing(slide)}><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete(slide._id)} className="red"><Trash2 size={16} /></button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No slides found. Add your first one!</p>
                )}
            </div>
        </div>
    );
};

export default CarouselManagement;
