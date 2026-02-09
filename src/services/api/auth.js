import api from '../api';

const AuthApi = {
    // Login Flow (Email + Password → OTP → Verify)
    login: (email, password) => api.post('/api/v1/auth/login/', { email, password }),
    verifyLogin: (email, otp) => api.post('/api/v1/auth/login/verify-otp/', { email, otp }),

    // Sign-Up Flow (Email + Password → OTP → Verify)
    signup: (email, password) => api.post('/api/v1/auth/signup/', { email, password }),
    verifySignup: (email, otp) => api.post('/api/v1/auth/signup/verify/', { email, otp }),

    // Common
    submitProfile: (data) => api.post('/api/v1/auth/profile-setup/', data),
    logout: () => api.post('/api/v1/auth/logout/'),
    getCurrentUser: () => api.get('/api/v1/auth/me/'),

    // Deprecated (kept for backward compatibility)
    generateOTP: (email) => api.post('/api/v1/auth/otp/generate/', { email }),
    verifyOTP: (email, otp) => api.post('/api/v1/auth/otp/verify/', { email, otp }),
};

export default AuthApi;
