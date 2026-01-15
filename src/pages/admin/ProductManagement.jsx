import { useState, useEffect, useCallback } from 'react';
import { getAllProductsAdmin, deleteProduct, toggleProductStatus } from '../../api/adminApi';
import { useToast } from '../../context/ToastContext';
import { Edit, Trash2, Plus } from 'lucide-react';
import Button from '../../components/Button';
import { formatNairaWithoutDecimals } from '../../utils/currency';
import AddProductModal from '../../components/AddProductModal';

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
            showToast('Failed to load products', 'error');
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
            <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Products</h1>
                    <p>Manage your product inventory</p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)}>
                    <Plus size={18} />
                    Add Product
                </Button>
            </div>

            <AddProductModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onProductAdded={loadProducts}
            />

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '12px',
                                                background: product.color || '#ddd'
                                            }}
                                        />
                                        <div>
                                            <p style={{ fontWeight: '600' }}>{product.name}</p>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                                {product.description}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td>{product.category}</td>
                                <td>{formatNairaWithoutDecimals(product.price)}</td>
                                <td>{product.inventory?.stock || 0}</td>
                                <td>
                                    <button
                                        className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}
                                        onClick={() => handleToggleStatus(product._id)}
                                        style={{ cursor: 'pointer', border: 'none' }}
                                    >
                                        {product.isActive ? 'Active' : 'Inactive'}
                                    </button>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="action-btn edit">
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            className="action-btn delete"
                                            onClick={() => handleDelete(product._id)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
