import { apiMethods } from './apiClient';

/**
 * Auth Service
 * 
 * Manages authentication related API calls.
 */

const authService = {
    /**
     * Login user (Regular/OrgAdmin)
     * @param {Object} credentials - email and password
     */
    login: async (credentials) => {
        return apiMethods.post('/auth/login/', credentials);
    },

    /**
     * Verify Login OTP
     * @param {Object} data - email and otp
     */
    verifyOTP: async (data) => {
        return apiMethods.post('/auth/login/verify-otp/', data);
    },

    /**
     * System Admin Login (Step 1)
     * @param {Object} credentials - email and password
     */
    systemAdminLogin: async (credentials) => {
        return apiMethods.post('/auth/system/login/', credentials);
    },

    /**
     * System Admin Verify OTP (Step 2)
     * @param {Object} data - email and otp
     */
    systemAdminVerifyOTP: async (data) => {
        return apiMethods.post('/auth/system/login/verify/', data);
    },

    /**
     * Register new user
     * @param {Object} userData
     */
    register: async (userData) => {
        return apiMethods.post('/auth/signup/', userData);
    },

    /**
     * Logout user
     */
    logout: async () => {
        return apiMethods.post('/auth/logout/');
    },

    /**
     * Get available roles for signup
     */
    getRoles: async () => {
        return apiMethods.get('/auth/roles/');
    },

    /**
     * Verify Signup OTP
     * @param {Object} data - email and otp
     */
    verifySignupOTP: async (data) => {
        return apiMethods.post('/auth/signup/verify/', data);
    },

    /**
     * Get current user profile
     */
    getMe: async () => {
        return apiMethods.get('/users/me/');
    },
};

export default authService;
