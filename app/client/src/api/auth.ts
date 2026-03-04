import api from './client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const loginUser = async (credentials: any) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const registerUser = async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const getProfile = async () => {
    const response = await api.get('/auth/profile');
    return response.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const placeOrder = async (orderData: any) => {
    const response = await api.post('/orders', orderData);
    return response.data;
};
