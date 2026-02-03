import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    withCredentials: true, // IMPORTANT: Sends cookies with every request
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});
// Helper to get cookie by name
const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

// Request Interceptor to add CSRF Token
api.interceptors.request.use(
    (config) => {
        const csrfToken = getCookie('csrftoken');
        if (csrfToken) {
            config.headers['X-CSRFToken'] = csrfToken;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response) {
            // 401: Unauthorized - Likely cookie expired or invalid
            if (error.response.status === 401 && !originalRequest._retry) {
                // Here we might trigger a refresh token flow if we were using tokens,
                // but with cookies, we generally redirect to login.
                // However, we want the AuthContext to handle the state update/redirect.
                // We'll let the error propagate and catch it in the Context.
                console.warn("Unauthorized access - redirecting to login likely needed.");
            }

            // 403: Forbidden - Logged in but no permission
            if (error.response.status === 403) {
                console.error("Access Forbidden");
            }
        }
        return Promise.reject(error);
    }
);

export default api;
