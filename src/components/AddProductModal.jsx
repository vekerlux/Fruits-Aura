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
                    <label>Full Description</label>
                    <textarea
                        name="longDescription"
                        value={formData.longDescription}
                        onChange={handleChange}
                        required
                        rows={3}
                        placeholder="Detailed description of the product..."
                    />
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
                                style={{ height: '40px', width: '60px', padding: 0, border: 'none' }}
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
                    <label>Image URL (Optional)</label>
                    <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="https://..."
                    />
                </div>
            </form>
        </Modal>
    );
};

export default AddProductModal;
