import axios from 'axios';

// Create axios instance with default config
const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true // For cookie-based auth if needed
});

// Request interceptor - Add auth token to requests
client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle token refresh and errors
client.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized errors
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh the token
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const response = await axios.post(
                        `${client.defaults.baseURL}/auth/refresh`,
                        { refreshToken }
                    );

                    const { token } = response.data;
                    localStorage.setItem('token', token);

                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return client(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed, clear tokens and redirect to login
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Handle other errors
        let friendlyMessage = 'An unexpected error occurred';

        if (!error.response) {
            // Network error (server down, cors, DNS) implementation
            friendlyMessage = 'Unable to connect to server. Please check your internet connection or try again later.';
        } else if (error.response.status === 429) {
            friendlyMessage = 'Too many requests. Please wait a moment before trying again.';
        } else if (error.response.status >= 500) {
            friendlyMessage = `Server Error (${error.response.status}). Please contact support if this persists.`;
        } else {
            // Client error (400, 404, etc)
            friendlyMessage = error.response.data?.message || error.message || 'Request failed';
        }

        console.error('API Error:', friendlyMessage, error);

        // Attach friendly message to error object for UI use
        error.userMessage = friendlyMessage;

        return Promise.reject(error);
    }
);

export default client;
