import { useState, useEffect, useCallback } from 'react';
import { getAllProductsAdmin, deleteProduct, toggleProductStatus } from '../../api/adminApi';
import { useToast } from '../../context/ToastContext';
import { Edit, Trash2, Plus } from 'lucide-react';
import Button from '../../components/Button';
import { formatNairaWithoutDecimals } from '../../utils/currency';
import AddProductModal from '../../components/AddProductModal';
import './ProductManagement.css';

export default function ProductManagement() {
    const { showToast } = useToast();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const loadProducts = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getAllProductsAdmin();
            setProducts(response.products || []);
        } catch (err) {
            console.error('Error loading products:', err);
            showToast(err.userMessage || 'Failed to load products', 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    const handleToggleStatus = async (productId) => {
        try {
            await toggleProductStatus(productId);
            showToast('Product status updated', 'success');
            loadProducts();
        } catch (err) {
            console.error('Error updating status:', err);
            showToast('Failed to update product status', 'error');
        }
    };

    const handleDelete = async (productId) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await deleteProduct(productId);
            showToast('Product deleted successfully', 'success');
            loadProducts();
        } catch (err) {
            console.error('Error deleting product:', err);
            showToast('Failed to delete product', 'error');
        }
    };

    if (loading) {
        return (
            <div className="admin-page-header">
                <h1>Loading products...</h1>
            </div>
        );
    }

    return (
        <div className="product-management">
            <div className="admin-page-header">
                <div className="header-title-row">
                    <div>
                        <h1>Products</h1>
                        <p>Manage your product inventory</p>
                    </div>
                    <Button onClick={() => setIsAddModalOpen(true)}>
                        <Plus size={18} />
                        Add Product
                    </Button>
                </div>
            </div>

            <AddProductModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onProductAdded={loadProducts}
            />

            <div className="products-grid">
                {products.map((product) => (
                    <div key={product._id} className="product-card-premium">
                        <div className="product-card-image">
                            {product.image ? (
                                <img src={product.image} alt={product.name} />
                            ) : (
                                <div
                                    className="product-color-circle"
                                    style={{ background: product.color || '#ddd' }}
                                />
                            )}
                        </div>

                        <div className="product-card-content">
                            <h3 className="product-card-title">{product.name}</h3>
                            <p className="product-card-category">Category: {product.category}</p>

                            <div className="product-card-meta">
                                <span className="product-card-price">
                                    {formatNairaWithoutDecimals(product.price)}
                                </span>
                                <span className="product-card-stock">
                                    Stock: {product.inventory?.stock || 0}
                                </span>
                            </div>

                            <button
                                className={`product-status-badge ${product.isActive ? 'status-active' : 'status-inactive'}`}
                                onClick={() => handleToggleStatus(product._id)}
                            >
                                {product.isActive ? '🟢 Active' : '🔴 Inactive'}
                            </button>

                            <div className="product-card-actions">
                                <button className="product-action-btn edit-btn">
                                    <Edit size={16} />
                                    Edit
                                </button>
                                <button
                                    className="product-action-btn delete-btn"
                                    onClick={() => handleDelete(product._id)}
                                >
                                    <Trash2 size={16} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
