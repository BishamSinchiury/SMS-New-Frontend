import { apiMethods } from './apiClient';

/**
 * Org Service
 * Handles organization profile and data management.
 */
const orgService = {
    /**
     * Get organization profile
     */
    getProfile: async () => {
        return apiMethods.get('/orgs/profile/');
    },

    /**
     * Update organization profile
     * @param {Object} profileData - description, address, phone_number, website, logo
     */
    updateProfile: async (profileData) => {
        return apiMethods.patch('/orgs/profile/', profileData);
    }
};

export default orgService;
