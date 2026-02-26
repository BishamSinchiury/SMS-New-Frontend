import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import authService from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';
import styles from './Auth.module.css';

const Login = () => {
    const navigate = useNavigate();
    const { login: setGlobalUser } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (error) setError('');
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await authService.login({
                email: formData.email,
                password: formData.password
            });

            setSuccess('Login successful. Redirecting...');
            setGlobalUser(response.user);

            setTimeout(() => {
                const redirectPath = response.user.role === 'ADMIN' ? ROUTES.ADMIN : ROUTES.USER_DASHBOARD;
                navigate(redirectPath);
            }, 1000);
        } catch (err) {
            setError(err.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.authContainer}>
            {/* Left Graphical Section */}
            <div className={styles.leftSection}>
                <div className={styles.visualContent}>
                    <div className={styles.visualImage}>
                        <svg width="100%" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="400" height="300" rx="16" fill="white" fillOpacity="0.1" />
                            <rect x="40" y="40" width="320" height="40" rx="8" fill="white" fillOpacity="0.2" />
                            <rect x="40" y="100" width="150" height="120" rx="8" fill="white" fillOpacity="0.2" />
                            <rect x="210" y="100" width="150" height="50" rx="8" fill="white" fillOpacity="0.2" />
                            <rect x="210" y="170" width="150" height="50" rx="8" fill="white" fillOpacity="0.2" />
                            <circle cx="200" cy="150" r="40" stroke="white" strokeOpacity="0.3" strokeWidth="4" strokeDasharray="10 10" />
                        </svg>
                    </div>
                    <h2 className={styles.visualTitle}>Smart Management</h2>
                    <p className={styles.visualDescription}>
                        Track your progress, manage your scheduled tasks, and stay updated with real-time analytics.
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
                        <h1 className={styles.formTitle}>Welcome Back</h1>
                        <p className={styles.formSubtitle}>Please enter your details to login</p>
                    </div>

                    {error && <div className={styles.errorAlert}>{error}</div>}
                    {success && <div className={styles.successAlert}>{success}</div>}

                    <form onSubmit={handleLoginSubmit}>
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
                                    disabled={loading}
                                />
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
                                    disabled={loading}
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

                        <div className={styles.formActions}>
                            <label className={styles.rememberMe}>
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    className={styles.checkbox}
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                />
                                Remember me
                            </label>
                            <Link to="#" className={styles.forgotPassword}>Forgot password?</Link>
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={loading}>
                            {loading ? 'Logging in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className={styles.switchAuth}>
                        Don't have an account?
                        <Link to={ROUTES.SIGNUP} className={styles.switchAuthLink}>Sign Up</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
