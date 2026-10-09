import axios from 'axios';

// Update this to match your backend's actual running URL (e.g., https://localhost:7231/api) for local Development and https://megamart-backend-uyt3.onrender.com/api for Production
const API_BASE_URL = 'https://localhost:7231/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
  },
});

// Automatically attach JWT token to requests if available in localStorage
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;


