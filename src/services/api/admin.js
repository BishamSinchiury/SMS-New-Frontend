import api from '../api';

const AdminApi = {
    // Get all users with optional status filter
    getUsers: (status = null) => {
        const params = status ? { status } : {};
        return api.get('/api/v1/users/approvals/', { params });
    },

    // Approve a user
    approveUser: (userId) => {
        return api.post(`/api/v1/users/approvals/${userId}/approve/`);
    },

    // Reject a user
    rejectUser: (userId) => {
        return api.post(`/api/v1/users/approvals/${userId}/reject/`);
    },
};

export default AdminApi;
