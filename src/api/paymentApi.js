import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const paymentApi = axios.create({
    baseURL: `${API_URL}/payments`,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add interceptor to include token
paymentApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const initializePayment = async (paymentData) => {
    const response = await paymentApi.post('/initialize', paymentData);
    return response.data;
};
