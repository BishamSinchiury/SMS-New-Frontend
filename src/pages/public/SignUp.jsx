import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/context/AuthContext';
import authService from '@/services/authService';
import styles from './Auth.module.css';

const STEPS = {
    SIGNUP: 'SIGNUP',
    VERIFY: 'VERIFY'
};

const SignUp = () => {
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();
    const [step, setStep] = useState(STEPS.SIGNUP);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [roles, setRoles] = useState([]);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        role: ''
    });

    const [otpData, setOtpData] = useState({
        otp: ''
    });

    // Fetch roles on mount
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await authService.getRoles();
                setRoles(response.data || response);
                if (response.length > 0) {
                    setFormData(prev => ({ ...prev, role: response[0].value }));
                }
            } catch (err) {
                console.error("Failed to fetch roles:", err);
            }
        };
        fetchRoles();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleOtpChange = (e) => {
        setOtpData({ otp: e.target.value });
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            await authService.register({
                email: formData.email,
                password: formData.password,
                role: formData.role
            });
            setStep(STEPS.VERIFY);
            setSuccess('Signup initiated! Please check your email for the OTP.');
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifySubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await authService.verifySignupOTP({
                email: formData.email,
                otp: otpData.otp
            });

            // Update auth context
            if (response.data?.user) {
                authLogin(response.data.user);
            } else if (response.user) {
                authLogin(response.user);
            }

            // On success, redirect to profile setup
            navigate(ROUTES.USER_PROFILE);
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'OTP verification failed.');
        } finally {
            setLoading(false);
        }
    };

    const renderSignupForm = () => (
        <form onSubmit={handleSignupSubmit}>
            <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="email">Email Address</label>
                <div className={styles.inputWrapper}>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className={styles.input}
                        placeholder="name@company.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="role">Select Role</label>
                <div className={styles.inputWrapper}>
                    <select
                        id="role"
                        name="role"
                        className={styles.input}
                        value={formData.role}
                        onChange={handleChange}
                        required
                    >
                        {roles.map(role => (
                            <option key={role.value} value={role.value}>
                                {role.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="password">Password</label>
                <div className={styles.inputWrapper}>
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        className={styles.input}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
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

            <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="confirmPassword">Confirm Password</label>
                <div className={styles.inputWrapper}>
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        className={styles.input}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    <button
                        type="button"
                        className={styles.togglePassword}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Processing...' : 'Create Account'}
            </button>

            <div className={styles.switchAuth}>
                Already have an account?
                <Link to={ROUTES.LOGIN} className={styles.switchAuthLink}>Login</Link>
            </div>
        </form>
    );

    const renderVerifyForm = () => (
        <form onSubmit={handleVerifySubmit}>
            <div className={styles.formHeader}>
                <h1 className={styles.formTitle}>Verify Email</h1>
                <p className={styles.formSubtitle}>Enter the 6-digit code sent to {formData.email}</p>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="otp">Security Code</label>
                <div className={styles.inputWrapper}>
                    <input
                        type="text"
                        id="otp"
                        className={styles.input}
                        placeholder="123456"
                        maxLength="6"
                        value={otpData.otp}
                        onChange={handleOtpChange}
                        required
                    />
                </div>
                <p className={styles.helpText}>Didn't receive a code? <button type="button" className={styles.switchAuthLink} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }} onClick={handleSignupSubmit}>Resend</button></p>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>

            <button type="button" className={styles.backBtn} onClick={() => setStep(STEPS.SIGNUP)}>
                Back to Signup
            </button>
        </form>
    );

    return (
        <div className={styles.authContainer}>
            {/* Left Graphical Section */}
            <div className={styles.leftSection}>
                <div className={styles.visualContent}>
                    <div className={styles.visualImage}>
                        <svg width="100%" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="400" height="300" rx="16" fill="white" fillOpacity="0.1" />
                            <path d="M100 220 L150 150 L200 180 L250 100 L300 130" stroke="white" strokeOpacity="0.5" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="100" cy="220" r="8" fill="white" fillOpacity="0.8" />
                            <circle cx="150" cy="150" r="8" fill="white" fillOpacity="0.8" />
                            <circle cx="200" cy="180" r="8" fill="white" fillOpacity="0.8" />
                            <circle cx="250" cy="100" r="8" fill="white" fillOpacity="0.8" />
                            <circle cx="300" cy="130" r="8" fill="white" fillOpacity="0.8" />
                            <rect x="50" y="50" width="100" height="20" rx="4" fill="white" fillOpacity="0.2" />
                            <rect x="50" y="80" width="60" height="20" rx="4" fill="white" fillOpacity="0.2" />
                        </svg>
                    </div>
                    <h2 className={styles.visualTitle}>
                        {step === STEPS.SIGNUP ? 'Join the Community' : 'Verify Your Identity'}
                    </h2>
                    <p className={styles.visualDescription}>
                        {step === STEPS.SIGNUP
                            ? 'Create your account to start managing your workflow with ProSleek. Fast, secure, and beautiful.'
                            : 'We\'ve sent a verification code to your email. Please enter it to continue.'}
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
                    {step === STEPS.SIGNUP && (
                        <div className={styles.formHeader}>
                            <h1 className={styles.formTitle}>Create Account</h1>
                            <p className={styles.formSubtitle}>Join thousands of users today</p>
                        </div>
                    )}

                    {error && <div className={styles.errorAlert}>{error}</div>}
                    {success && <div className={styles.successAlert}>{success}</div>}

                    {step === STEPS.SIGNUP ? renderSignupForm() : renderVerifyForm()}
                </div>
            </div>
        </div>
    );
};

export default SignUp;
