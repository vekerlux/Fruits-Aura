import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import { useToast } from '../context/ToastContext';
import { createProduct } from '../api/adminApi';

const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        longDescription: '',
        price: '',
        category: 'Fresh Mix',
        color: '#4CAF50',
        stock: 100,
        bundlePrice: '',
        image: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const productPayload = {
                ...formData,
                price: parseFloat(formData.price),
                inventory: {
                    stock: parseInt(formData.stock),
                    lowStockThreshold: 10
                },
                isComingSoon: formData.category === 'Coming Soon',
                bundlePrice: formData.bundlePrice ? parseFloat(formData.bundlePrice) : undefined
            };

            const response = await createProduct(productPayload);

            if (response.success) {
                showToast('Product created successfully!', 'success');
                onProductAdded();
                onClose();
                // Reset form
                setFormData({
                    name: '',
                    description: '',
                    longDescription: '',
                    price: '',
                    category: 'Fresh Mix',
                    color: '#4CAF50',
                    stock: 100,
                    bundlePrice: '',
                    image: ''
                });
            }
        } catch (error) {
            console.error('Create product error:', error);
            showToast(error.response?.data?.message || 'Failed to create product', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Add New Product"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Creating...' : 'Create Product'}
                    </Button>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="product-form">
                <div className="form-group">
                    <label>Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Watermelon Mix"
                    />
                </div>

                <div className="form-group">
                    <label>Short Description</label>
                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        placeholder="e.g. 100% Natural • No Added Sugar"
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <div className="rich-text-editor">
                        <div className="rte-toolbar">
                            <button type="button" onClick={() => document.execCommand('bold')} title="Bold"><b>B</b></button>
                            <button type="button" onClick={() => document.execCommand('italic')} title="Italic"><i>I</i></button>
                            <button type="button" onClick={() => document.execCommand('underline')} title="Underline"><u>U</u></button>
                            <select onChange={(e) => document.execCommand('fontName', false, e.target.value)} defaultValue="Inter">
                                <option value="Inter">Inter</option>
                                <option value="Arial">Arial</option>
                                <option value="Georgia">Georgia</option>
                                <option value="Courier New">Courier</option>
                            </select>
                        </div>
                        <div
                            className="rte-content"
                            contentEditable
                            onInput={(e) => setFormData(prev => ({ ...prev, longDescription: e.currentTarget.innerHTML }))}
                            dangerouslySetInnerHTML={{ __html: formData.longDescription }}
                            style={{ minHeight: '100px', border: '1px solid #ddd', padding: '10px', borderRadius: '8px', background: '#333', color: '#fff' }}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Price (₦)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            min="0"
                        />
                    </div>
                    <div className="form-group">
                        <label>Stock</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                            min="0"
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="Fresh Mix">Fresh Mix</option>
                            <option value="Coming Soon">Coming Soon</option>
                            <option value="Events">Events</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Theme Color</label>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input
                                type="color"
                                name="color"
                                value={formData.color}
                                onChange={handleChange}
                                style={{ height: '40px', width: '60px', padding: 0, border: 'none', cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: '0.8rem', color: '#666' }}>{formData.color}</span>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label>Auraset Bundle Price (Optional)</label>
                    <input
                        type="number"
                        name="bundlePrice"
                        value={formData.bundlePrice}
                        onChange={handleChange}
                        placeholder="Leave empty if no bundle"
                        min="0"
                    />
                    <p className="input-hint">Price for a pack of 5</p>
                </div>

                <div className="form-group">
                    <label>Product Image</label>
                    <div className="image-upload-container" style={{ border: '2px dashed #444', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                        {formData.image ? (
                            <div className="image-preview" style={{ position: 'relative', display: 'inline-block' }}>
                                <img src={formData.image} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                                    style={{ position: 'absolute', top: -10, right: -10, background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}
                                >
                                    &times;
                                </button>
                            </div>
                        ) : (
                            <label style={{ cursor: 'pointer', display: 'block', color: '#aaa' }}>
                                <div style={{ fontSize: '24px', marginBottom: '8px' }}>📁</div>
                                <span>Click to Upload from Gallery</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setFormData(prev => ({ ...prev, image: reader.result }));
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    hidden
                                />
                            </label>
                        )}
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default AddProductModal;
