import axios from 'axios';

/**
 * Base API Client
 * 
 * Configured axios instance with base URL from environment variables,
 * interceptors for authorization, and common error handling.
 */

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 30000, // 30 seconds
    withCredentials: true, // Required for cookie-based sessions
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
});

// Request Interceptor: Add Authorization token to every request
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Fix for File Uploads: If data is FormData, let the browser set the boundary
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle common errors and token expiration
apiClient.interceptors.response.use(
    (response) => {
        return response.data; // Return only the data from the response
    },
    (error) => {
        // Handle 401 Unauthorized (Token expired or invalid)
        if (error.response && error.response.status === 401) {
            // Avoid redirecting if already on login page
            if (!window.location.pathname.includes('/login')) {
                localStorage.removeItem('auth_token');
                window.location.href = '/login';
            }
        }

        // Pass the error message or original error
        const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            'Something went wrong';
        return Promise.reject({ ...error, message });
    }
);

/**
 * Common HTTP Methods
 */
export const apiMethods = {
    get: (url, config = {}) => apiClient.get(url, config),
    post: (url, data = {}, config = {}) => apiClient.post(url, data, config),
    put: (url, data = {}, config = {}) => apiClient.put(url, data, config),
    patch: (url, data = {}, config = {}) => apiClient.patch(url, data, config),
    delete: (url, config = {}) => apiClient.delete(url, config),
};

export default apiClient;
