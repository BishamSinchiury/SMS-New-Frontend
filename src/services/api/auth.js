import api from '../api';

const AuthApi = {
    login: (email, password) => api.post('/api/v1/auth/login/', { email, password }),
    signup: (email, password) => api.post('/api/v1/auth/signup/', { email, password }),
    verifySignup: (email, otp) => api.post('/api/v1/auth/signup/verify/', { email, otp }),
    submitProfile: (data) => api.post('/api/v1/auth/profile-setup/', data),
    generateOTP: (email) => api.post('/api/v1/auth/otp/generate/', { email }),
    verifyOTP: (email, otp) => api.post('/api/v1/auth/otp/verify/', { email, otp }),
    logout: () => api.post('/api/v1/auth/logout/'),
    getCurrentUser: () => api.get('/api/v1/auth/me/'),
};

export default AuthApi;
