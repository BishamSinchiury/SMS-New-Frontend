import api from '../api';

const OrgApi = {
    /**
     * Create a new organization profile.
     * Endpoint: POST /api/v1/orgs/
     * @param {FormData} data - Multipart form data for org creation
     */
    createProfile: (data) => {
        // Axios handles Content-Type: multipart/form-data automatically 
        // when data is an instance of FormData
        return api.post('/api/v1/orgs/', data);
    },

    /**
     * Check if an organization domain exists.
     * Endpoint: POST /api/v1/orgs/check/
     * @param {string} domain - Domain name to check
     */
    checkOrg: (domain) => {
        return api.post('/api/v1/orgs/check/', { domain_name: domain });
    }
};

export default OrgApi;
