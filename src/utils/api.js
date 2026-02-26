/**
 * API Utility Helpers
 * 
 * Provides utility functions for common API-related tasks like token management
 */

// Key for storage
const AUTH_TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token';

/**
 * Get auth token from storage
 * @returns {string|null} Auth token
 */
export const getAuthToken = () => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Set auth token in storage
 * @param {string} token - Auth token
 */
export const setAuthToken = (token) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
};

/**
 * Remove auth token from storage
 */
export const removeAuthToken = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
};

/**
 * Check if the user is authenticated based on token existence
 * @returns {boolean}
 */
export const isAuthenticated = () => {
    return !!getAuthToken();
};

/**
 * Format API validation errors for display
 * @param {Object} error - Error object from API
 * @returns {Object} Key-value pairs of field and error message
 */
export const formatApiErrors = (error) => {
    if (error.response?.data?.errors) {
        return error.response.data.errors;
    }
    return { general: error.message || 'An unexpected error occurred' };
};
