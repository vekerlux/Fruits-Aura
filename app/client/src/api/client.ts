import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://fruits-aura.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to automatically add the JWT token to all requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('fruitsAuraToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token expiration globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Only trigger session clear on 401 (Not Authorized), never 403 (Forbidden)
        if (error.response?.status === 401) {
            // Check if the request that failed was the login request itself
            const isLoginRequest = error.config?.url?.includes('/auth/login');

            if (!isLoginRequest) {
                // Token expired or invalid
                localStorage.removeItem('fruitsAuraToken');
                localStorage.removeItem('fruitsAuraUser');

                // Only redirect if we are NOT already on the login page to avoid infinite loops
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
