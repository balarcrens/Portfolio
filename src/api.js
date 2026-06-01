import axios from 'axios';
import { API_BASE_URL } from './config';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * Dynamically updates the common Authorization header.
 * @param {string|null} token - JWT administrative token or null to remove it.
 */
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

// Auto-inject existing local storage administrative tokens on client startup
const token = localStorage.getItem('admin_token');
if (token) {
    setAuthToken(token);
}

export default api;
