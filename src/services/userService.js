import { apiMethods } from './apiClient';

/**
 * User Service
 * Handles user-specific data and profile management.
 */
const userService = {
    /**
     * Update user profile (identity details)
     * @param {Object} profileData - first_name, last_name, etc.
     */
    setupProfile: async (profileData) => {
        // If profileData is FormData (for photo upload), we send it directly
        const isFormData = profileData instanceof FormData;
        const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};

        // We use the people/profile/setup endpoint for the atomic workflow
        return apiMethods.post('/people/profile/setup/', profileData, config);
    },

    /**
     * Get user profile details
     */
    getProfile: async () => {
        return apiMethods.get('/users/profile/');
    },

    // System Admin (restricted)
    sysAdminList: async (params) => {
        return apiMethods.get('/sys-admin/users/', { params });
    },
    sysAdminDetail: async (id) => {
        return apiMethods.get(`/sys-admin/users/${id}/`);
    },
    sysAdminCreate: async (userData) => {
        return apiMethods.post('/sys-admin/users/', userData);
    },
    sysAdminUpdate: async (id, userData) => {
        return apiMethods.patch(`/sys-admin/users/${id}/`, userData);
    },
    sysAdminDelete: async (id) => {
        return apiMethods.delete(`/sys-admin/users/${id}/`);
    },
    sysAdminUpdateApproval: async (id, data) => {
        return apiMethods.patch(`/sys-admin/users/${id}/approval/`, data);
    }
};

export default userService;
