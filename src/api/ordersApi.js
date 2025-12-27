import client from './client';

/**
 * Orders API
 */

// Create a new order
export const createOrder = async (orderData) => {
    const response = await client.post('/orders', orderData);
    return response.data;
};

// Get user's orders
export const getUserOrders = async () => {
    const response = await client.get('/orders/my-orders');
    return response.data;
};

// Get order by ID
export const getOrderById = async (id) => {
    const response = await client.get(`/orders/${id}`);
    return response.data;
};

// Update order status (admin only)
export const updateOrderStatus = async (id, status) => {
    const response = await client.patch(`/orders/${id}/status`, { status });
    return response.data;
};

// Cancel order
export const cancelOrder = async (id) => {
    const response = await client.patch(`/orders/${id}/cancel`);
    return response.data;
};
