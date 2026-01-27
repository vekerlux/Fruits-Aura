import client from './client';

/**
 * Admin API
 */

// ===== Dashboard & Analytics =====

export const getDashboardStats = async () => {
    const response = await client.get('/admin/dashboard');
    return response.data;
};

// ===== Product Management =====

export const getAllProductsAdmin = async (params = {}) => {
    const response = await client.get('/admin/products', { params });
    return response.data;
};

export const createProduct = async (productData) => {
    const response = await client.post('/admin/products', productData);
    return response.data;
};

export const updateProduct = async (id, productData) => {
    const response = await client.put(`/admin/products/${id}`, productData);
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await client.delete(`/admin/products/${id}`);
    return response.data;
};

export const toggleProductStatus = async (id) => {
    const response = await client.patch(`/admin/products/${id}/toggle-status`);
    return response.data;
};

// ===== User Management =====

export const getAllUsers = async (params = {}) => {
    const response = await client.get('/admin/users', { params });
    return response.data;
};

export const getUserDetails = async (id) => {
    const response = await client.get(`/admin/users/${id}`);
    return response.data;
};

export const updateUserRole = async (id, role) => {
    const response = await client.patch(`/admin/users/${id}/role`, { role });
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await client.delete(`/admin/users/${id}`);
    return response.data;
};

export const updateUserSubscription = async (id, subscriptionData) => {
    const response = await client.patch(`/admin/users/${id}/subscription`, subscriptionData);
    return response.data;
};

export const updateUserAdmin = async (id, userData) => {
    const response = await client.patch(`/admin/users/${id}`, userData);
    return response.data;
};

export const claimReferralReward = async (id) => {
    const response = await client.patch(`/admin/users/${id}/claim-reward`);
    return response.data;
};

export const getPendingDistributors = async () => {
    const response = await client.get('/admin/distributors/pending');
    return response.data;
};

export const approveDistributor = async (id) => {
    const response = await client.put(`/admin/distributors/${id}/approve`);
    return response.data;
};

// ===== Order Management =====

export const getAllOrders = async (params = {}) => {
    const response = await client.get('/admin/orders', { params });
    return response.data;
};

export const updateOrderStatusAdmin = async (id, status) => {
    const response = await client.patch(`/orders/${id}/status`, { status });
    return response.data;
};

export const approveOrder = async (id, approvalData) => {
    const response = await client.put(`/${id}/approve`, approvalData);
    return response.data;
};

export const getPendingOrders = async () => {
    const response = await client.get('/admin/pending');
    return response.data;
};

export const getOrderDetailsAdmin = async (id) => {
    const response = await client.get(`/orders/${id}`);
    return response.data;
};

// ===== Reviews Management =====

export const getAllReviews = async (params = {}) => {
    const response = await client.get('/admin/reviews', { params });
    return response.data;
};

export const deleteReviewAdmin = async (id) => {
    const response = await client.delete(`/admin/reviews/${id}`);
    return response.data;
};

// ===== ComingSoonMix (Voting) Management =====

export const getAdminMixes = async () => {
    const response = await client.get('/admin/mixes');
    return response.data;
};

export const createMix = async (mixData) => {
    const response = await client.post('/admin/mixes', mixData);
    return response.data;
};

export const updateMix = async (id, mixData) => {
    const response = await client.patch(`/admin/mixes/${id}`, mixData);
    return response.data;
};

export const deleteMix = async (id) => {
    const response = await client.delete(`/admin/mixes/${id}`);
    return response.data;
};

export const resetVotingCycle = async () => {
    const response = await client.post('/admin/votes/reset');
    return response.data;
};
