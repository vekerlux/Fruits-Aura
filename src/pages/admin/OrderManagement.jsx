import React, { useState, useEffect, useCallback } from 'react';
import { getAllOrders, updateOrderStatusAdmin, approveOrder, getPendingOrders } from '../../api/adminApi';
import { useToast } from '../../context/ToastContext';
import { CheckCircle, Truck, Eye, Package } from 'lucide-react';
import { formatNairaWithoutDecimals } from '../../utils/currency';
import Modal from '../../components/Modal'; // Assuming a Modal component exists or I'll create one
import Button from '../../components/Button';

export default function OrderManagement() {
    const { showToast } = useToast();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('all'); // 'all' or 'pending'
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
    const [overriddenFee, setOverriddenFee] = useState('');

    const loadOrders = useCallback(async () => {
        try {
            setLoading(true);
            const response = view === 'pending' ? await getPendingOrders() : await getAllOrders();
            setOrders(response.orders || response.data?.orders || []);
        } catch (err) {
            console.error('Error loading orders:', err);
            showToast('Failed to load orders', 'error');
        } finally {
            setLoading(false);
        }
    }, [view, showToast]);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatusAdmin(orderId, newStatus);
            showToast('Order status updated', 'success');
            loadOrders();
        } catch (err) {
            console.error('Error updating order status:', err);
            showToast('Failed to update order status', 'error');
        }
    };

    const handleOpenApproval = (order) => {
        setSelectedOrder(order);
        setOverriddenFee(order.deliveryFee || '');
        setIsApprovalModalOpen(true);
    };

    const handleConfirmApproval = async () => {
        try {
            const approvalData = {
                status: 'approved',
                deliveryFee: overriddenFee ? parseFloat(overriddenFee) : selectedOrder.deliveryFee
            };
            await approveOrder(selectedOrder._id, approvalData);
            showToast('Order approved successfully', 'success');
            setIsApprovalModalOpen(false);
            loadOrders();
        } catch (err) {
            console.error('Error approving order:', err);
            showToast('Failed to approve order', 'error');
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
                <div className="header-title-row">
                    <div>
                        <h1>Orders</h1>
                        <p>Manage customer orders and approval workflows</p>
                    </div>
                    <div className="admin-tabs">
                        <button
                            className={`tab-btn ${view === 'all' ? 'active' : ''}`}
                            onClick={() => setView('all')}
                        >
                            All Orders
                        </button>
                        <button
                            className={`tab-btn ${view === 'pending' ? 'active' : ''}`}
                            onClick={() => setView('pending')}
                        >
                            Pending Approval
                        </button>
                    </div>
                </div>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Delivery Fee</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                                    No {view === 'pending' ? 'pending' : ''} orders found
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
                                            <div className="customer-info-row">
                                                <p className="customer-name">{order.user?.name || order.userId?.name || 'Guest'}</p>
                                                {order.plan === 'aura' && (
                                                    <span className="priority-badge">PRIORITY</span>
                                                )}
                                            </div>
                                            <p className="customer-email">
                                                {order.user?.email || order.userId?.email}
                                            </p>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="items-summary">
                                            {order.items?.length || 0} items
                                            <span className="items-preview">
                                                ({order.items?.map(i => i.name).join(', ').slice(0, 30)}...)
                                            </span>
                                            {order.items?.some(i => i.isBundle) && (
                                                <div className="bundle-indicator-pill">
                                                    <Package size={12} /> BUNDLE
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td>{formatNairaWithoutDecimals(order.deliveryFee || 0)}</td>
                                    <td style={{ fontWeight: '700' }}>
                                        {formatNairaWithoutDecimals(order.totalAmount || order.total)}
                                    </td>
                                    <td>
                                        {order.status === 'pending-approval' || order.status === 'pending' ? (
                                            <span className="status-badge pending">Pending</span>
                                        ) : (
                                            <select
                                                className={`status-select-badge ${order.status}`}
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="approved">Approved</option>
                                                <option value="preparing">Preparing</option>
                                                <option value="in-transit">In Transit</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        )}
                                    </td>
                                    <td>{formatDate(order.createdAt)}</td>
                                    <td>
                                        <div className="action-row">
                                            {order.status === 'pending' || order.status === 'pending-approval' ? (
                                                <button
                                                    className="action-btn approve"
                                                    onClick={() => handleOpenApproval(order)}
                                                    title="Approve Order"
                                                >
                                                    <CheckCircle size={16} />
                                                </button>
                                            ) : null}
                                            <button className="action-btn view" title="View Details">
                                                <Eye size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Approval Modal */}
            <Modal
                isOpen={isApprovalModalOpen}
                onClose={() => setIsApprovalModalOpen(false)}
                title="Approve Order"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsApprovalModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleConfirmApproval}>Confirm & Approve</Button>
                    </>
                }
            >
                <div className="order-context">
                    <p><strong>Customer:</strong> {selectedOrder?.user?.name}</p>
                    <p><strong>Items:</strong> {selectedOrder?.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}</p>
                    <p><strong>Subtotal:</strong> {formatNairaWithoutDecimals(selectedOrder?.totalAmount - (selectedOrder?.deliveryFee || 0))}</p>
                </div>

                <div className="form-group">
                    <label>Delivery Fee (₦)</label>
                    <div className="input-with-icon">
                        <Truck size={18} className="input-icon" />
                        <input
                            type="number"
                            value={overriddenFee}
                            onChange={(e) => setOverriddenFee(e.target.value)}
                            placeholder="Enter delivery fee"
                        />
                    </div>
                    <p className="input-hint">Default for this order: {formatNairaWithoutDecimals(selectedOrder?.deliveryFee || 0)}</p>
                </div>

                <div className="total-preview">
                    <span>Final Total:</span>
                    <strong>{formatNairaWithoutDecimals((selectedOrder?.totalAmount - (selectedOrder?.deliveryFee || 0)) + (overriddenFee ? parseFloat(overriddenFee) : 0))}</strong>
                </div>
            </Modal>
        </div >
    );
}
