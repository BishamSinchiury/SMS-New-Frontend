import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import authService from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';
import styles from './Auth.module.css';

/**
 * System Admin Login Page
 * 
 * Secure login for System Administrators (is_superuser=True).
 * Implements a 2-step flow:
 * 1. Email/Password authentication
 * 2. OTP Verification
 */
const SystemAdminLogin = () => {
    const navigate = useNavigate();
    const { login: setGlobalUser } = useAuth();
    const [step, setStep] = useState(1); // 1: Login, 2: OTP
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        otp: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
        if (success) setSuccess('');
    };

    /**
     * Step 1: Submit email/password
     */
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await authService.systemAdminLogin({
                email: formData.email,
                password: formData.password
            });

            // If successful, backend sends OTP and we move to step 2
            setSuccess(response.message || 'Security OTP sent to your registered email.');
            setStep(2);
        } catch (err) {
            if (err.code === 'ERR_NETWORK') {
                setError('Network error, please try again later');
            } else {
                setError(err.message || 'Invalid credentials or unauthorized access');
            }
        } finally {
            setLoading(false);
        }
    };

    /**
     * Step 2: Submit OTP
     */
    const handleOTPSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await authService.systemAdminVerifyOTP({
                email: formData.email,
                otp: formData.otp
            });

            // On success, backend sets a secure cookie and we redirect
            setGlobalUser(response.user);
            setSuccess('System Admin login successful');

            // Short delay to show success message before redirect
            setTimeout(() => {
                const redirectPath = response.user.role === 'ADMIN' ? ROUTES.ADMIN : ROUTES.USER_DASHBOARD;
                navigate(redirectPath);
            }, 1000);
        } catch (err) {
            if (err.code === 'ERR_NETWORK') {
                setError('Network error, please try again later');
            } else {
                setError(err.message || 'Invalid or expired security code');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.authContainer}>
            {/* Left Graphical Section - Specialized for System Admin */}
            <div className={`${styles.leftSection} ${styles.systemAdminPrimary}`}>
                <div className={styles.visualContent}>
                    <div className={styles.visualImage}>
                        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            <circle cx="12" cy="16" r="1"></circle>
                        </svg>
                    </div>
                    <h2 className={styles.visualTitle}>Terminal Access</h2>
                    <p className={styles.visualDescription}>
                        System-level administrative controls. Access is strictly monitored and requires 2nd-factor authentication.
                    </p>
                </div>
            </div>

            {/* Right Form Section */}
            <div className={styles.rightSection}>
                <div className={styles.homeLinkWrapper}>
                    <Link to="/" className={styles.homeLink}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        Back to Home
                    </Link>
                </div>
                <div className={styles.formCard}>
                    <div className={styles.formHeader}>
                        <h1 className={styles.formTitle}>System Admin</h1>
                        <p className={styles.formSubtitle}>
                            {step === 1
                                ? 'Authorize via administrative credentials'
                                : `Verification code sent to ${formData.email}`}
                        </p>
                    </div>

                    {error && <div className={styles.errorAlert}>{error}</div>}
                    {success && <div className={styles.successAlert}>{success}</div>}

                    {step === 1 ? (
                        /* Step 1: Login Form */
                        <form onSubmit={handleLoginSubmit}>
                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="email">Admin Email</label>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className={styles.input}
                                        placeholder="admin@prosleek.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={loading}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="password">Security Password</label>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        className={styles.input}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={loading}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className={styles.togglePassword}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className={styles.submitBtn} disabled={loading}>
                                {loading ? 'Authorizing...' : 'Next Step'}
                            </button>
                        </form>
                    ) : (
                        /* Step 2: OTP Form */
                        <form onSubmit={handleOTPSubmit}>
                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="otp">Security OTP</label>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="text"
                                        id="otp"
                                        name="otp"
                                        className={styles.input}
                                        placeholder="Enter 6-digit code"
                                        value={formData.otp}
                                        onChange={handleChange}
                                        disabled={loading}
                                        maxLength={6}
                                        autoFocus
                                        required
                                    />
                                </div>
                                <p className={styles.helpText}>Enter the code sent to your email to verify terminal access.</p>
                            </div>

                            <button type="submit" className={styles.submitBtn} disabled={loading}>
                                {loading ? 'Verifying...' : 'Verify & Login'}
                            </button>

                            <button
                                type="button"
                                className={styles.backBtn}
                                onClick={() => setStep(1)}
                                disabled={loading}
                            >
                                Back to Login
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SystemAdminLogin;
