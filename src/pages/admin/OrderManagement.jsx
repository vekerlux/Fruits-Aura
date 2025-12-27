import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatusAdmin } from '../../api/adminApi';
import { useToast } from '../../context/ToastContext';
import { Eye } from 'lucide-react';

export default function OrderManagement() {
    const { showToast } = useToast();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const response = await getAllOrders();
            setOrders(response.orders);
        } catch (error) {
            showToast('Failed to load orders', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatusAdmin(orderId, newStatus);
            showToast('Order status updated', 'success');
            loadOrders();
        } catch (error) {
            showToast('Failed to update order status', 'error');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="admin-page-header">
                <h1>Loading orders...</h1>
            </div>
        );
    }

    return (
        <div className="order-management">
            <div className="admin-page-header">
                <h1>Orders</h1>
                <p>Manage customer orders and order status</p>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                                    No orders found
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order._id}>
                                    <td style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                                        #{order._id.slice(-8)}
                                    </td>
                                    <td>
                                        <div>
                                            <p style={{ fontWeight: '600' }}>{order.user?.name || 'Guest'}</p>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                                {order.user?.email}
                                            </p>
                                        </div>
                                    </td>
                                    <td>{order.items?.length || 0} items</td>
                                    <td>${order.totalAmount?.toFixed(2)}</td>
                                    <td>
                                        <select
                                            className={`status-badge ${order.status}`}
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            style={{
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: '0.5rem'
                                            }}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="preparing">Preparing</option>
                                            <option value="ready">Ready for Pickup</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td>{formatDate(order.createdAt)}</td>
                                    <td>
                                        <button className="action-btn view">
                                            <Eye size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
