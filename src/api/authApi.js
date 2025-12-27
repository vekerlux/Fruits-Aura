import client from './client';

/**
 * Authentication API
 */

// Register a new user
export const register = async (userData) => {
    const response = await client.post('/auth/register', userData);
    return response.data;
};

// Login user
export const login = async (credentials) => {
    const response = await client.post('/auth/login', credentials);
    return response.data;
};

// Logout user
export const logout = async () => {
    const response = await client.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    return response.data;
};

// Refresh access token
export const refreshToken = async (refreshToken) => {
    const response = await client.post('/auth/refresh', { refreshToken });
    return response.data;
};

// Get current logged-in user
export const getCurrentUser = async () => {
    const response = await client.get('/auth/me');
    return response.data;
};

// Update user profile
export const updateProfile = async (profileData) => {
    const response = await client.put('/auth/profile', profileData);
    return response.data;
};
