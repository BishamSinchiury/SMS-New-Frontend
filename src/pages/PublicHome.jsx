import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthApi from '@/services/api/auth';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/Components/Toast/ToastContext';
import { LogOut, Mail, Lock, Key } from 'lucide-react';
import styles from './PublicHome.module.css';

// Simple Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>{title}</h2>
                    <button onClick={onClose} className={styles.closeButton}>&times;</button>
                </div>
                <div className={styles.modalBody}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default function PublicHome() {
    const [orgData, setOrgData] = useState(null); // Keep as null or sets defaults if needed
    // const [loading, setLoading] = useState(true); // Removed blocking loading

    // Modal state
    const [authMode, setAuthMode] = useState(null); // 'login' or 'signup'
    const [authStep, setAuthStep] = useState(1); // 1, 2, 3

    // Form data
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        otp: ''
    });

    const [authLoading, setAuthLoading] = useState(false);

    const navigate = useNavigate();
    const { success, error } = useToast();
    const { checkAuthStatus } = useAuth(); // usage

    // Removed OrgApi useEffect logic


    const openAuthModal = async (mode) => {
        // Check if user is already logged in
        if (mode === 'login') { // Only check on login attempt, or both?
            // Actually request says: "If the user clicks login, check the auth context"
            const user = await checkAuthStatus();
            if (user) {
                navigate('/dashboard');
                return;
            }
        }

        setAuthMode(mode);
        setAuthStep(1);
        setFormData({ email: '', password: '', otp: '' });
    };

    const closeAuthModal = () => {
        setAuthMode(null);
        setAuthStep(1);
        setFormData({ email: '', password: '', otp: '' });
    };

    // Sign-Up Flow
    const handleSignupStep1 = async (e) => {
        e.preventDefault();
        if (!formData.email) {
            error('Please enter your email');
            return;
        }
        setAuthStep(2);
    };

    const handleSignupStep2 = async (e) => {
        e.preventDefault();
        if (!formData.password || formData.password.length < 8) {
            error('Password must be at least 8 characters');
            return;
        }

        setAuthLoading(true);
        try {
            await AuthApi.signup(formData.email, formData.password);
            success('OTP sent to your email!');
            setAuthStep(3);
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Sign-up failed';
            error(errorMsg);
            if (errorMsg.includes('already exists')) {
                // Suggest login
                setTimeout(() => {
                    setAuthMode('login');
                    setAuthStep(1);
                }, 2000);
            }
        } finally {
            setAuthLoading(false);
        }
    };

    const handleSignupStep3 = async (e) => {
        e.preventDefault();
        if (!formData.otp) {
            error('Please enter the OTP');
            return;
        }

        setAuthLoading(true);
        try {
            const response = await AuthApi.verifySignup(formData.email, formData.otp);
            success('Account created successfully!');
            closeAuthModal();

            // Redirect to profile setup
            navigate('/profile-setup');
            window.location.reload();
        } catch (err) {
            error(err.response?.data?.error || 'Invalid OTP');
        } finally {
            setAuthLoading(false);
        }
    };

    // Login Flow
    const handleLoginStep1 = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            error('Please enter both email and password');
            return;
        }

        setAuthLoading(true);
        try {
            await AuthApi.login(formData.email, formData.password);

            // Check if we are logged in now (No OTP required case)
            const user = await checkAuthStatus();
            if (user) {
                success('Login successful!');
                closeAuthModal();
                navigate('/dashboard');
            } else {
                success('OTP sent to your email!');
                setAuthStep(2);
            }
        } catch (err) {
            error(err.response?.data?.error || 'Invalid email or password');
        } finally {
            setAuthLoading(false);
        }
    };

    const handleLoginStep2 = async (e) => {
        e.preventDefault();
        if (!formData.otp) {
            error('Please enter the OTP');
            return;
        }

        setAuthLoading(true);
        try {
            const response = await AuthApi.verifyLogin(formData.email, formData.otp);
            success('Login successful!');
            closeAuthModal();

            // Get user data and redirect based on approval status
            const userData = response.data.user || response.data;
            const approvalStatus = userData.approval_status;

            if (approvalStatus === 'PENDING_PROFILE') {
                navigate('/profile-setup');
            } else if (approvalStatus === 'PENDING_APPROVAL' || approvalStatus === 'REJECTED') {
                navigate('/status');
            } else if (approvalStatus === 'APPROVED') {
                navigate('/dashboard');
            } else {
                navigate('/dashboard');
            }

            window.location.reload();
        } catch (err) {
            error(err.response?.data?.error || 'Invalid OTP');
        } finally {
            setAuthLoading(false);
        }
    };

    // Removed loading check


    return (
        <div className={styles.container}>
            <nav className={styles.nav}>
                <div className={styles.logo}>
                    <h1>{orgData?.organization_name || 'School Management System'}</h1>
                </div>
                <div className={styles.authButtons}>
                    <button onClick={() => openAuthModal('login')} className={styles.loginBtn}>
                        Login
                    </button>
                    <button onClick={() => openAuthModal('signup')} className={styles.signupBtn}>
                        Sign Up
                    </button>
                </div>
            </nav>

            <main className={styles.main}>
                <h2>Welcome to {orgData?.organization_name || 'Our School'}</h2>
                <p>Manage your school efficiently with our comprehensive management system.</p>
            </main>

            {/* Sign-Up Modal */}
            {authMode === 'signup' && (
                <Modal
                    isOpen={true}
                    onClose={closeAuthModal}
                    title={`Sign Up - Step ${authStep} of 3`}
                >
                    {authStep === 1 && (
                        <form onSubmit={handleSignupStep1} className={styles.authForm}>
                            <div className={styles.formGroup}>
                                <label>
                                    <Mail size={18} />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            <div className={styles.formActions}>
                                <button type="submit" className={styles.primaryBtn}>
                                    Next
                                </button>
                                <button type="button" onClick={closeAuthModal} className={styles.secondaryBtn}>
                                    <LogOut size={16} />
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    {authStep === 2 && (
                        <form onSubmit={handleSignupStep2} className={styles.authForm}>
                            <div className={styles.formGroup}>
                                <label>
                                    <Lock size={18} />
                                    Create Password
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="At least 8 characters"
                                    minLength={8}
                                    required
                                />
                                <small>Password must be at least 8 characters long</small>
                            </div>
                            <div className={styles.formActions}>
                                <button type="submit" className={styles.primaryBtn} disabled={authLoading}>
                                    {authLoading ? 'Sending OTP...' : 'Next'}
                                </button>
                                <button type="button" onClick={() => setAuthStep(1)} className={styles.secondaryBtn}>
                                    Back
                                </button>
                                <button type="button" onClick={closeAuthModal} className={styles.secondaryBtn}>
                                    <LogOut size={16} />
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    {authStep === 3 && (
                        <form onSubmit={handleSignupStep3} className={styles.authForm}>
                            <div className={styles.formGroup}>
                                <label>
                                    <Key size={18} />
                                    Enter OTP
                                </label>
                                <input
                                    type="text"
                                    value={formData.otp}
                                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                                    placeholder="6-digit code"
                                    maxLength={6}
                                    required
                                />
                                <small>Check your email for the verification code</small>
                            </div>
                            <div className={styles.formActions}>
                                <button type="submit" className={styles.primaryBtn} disabled={authLoading}>
                                    {authLoading ? 'Verifying...' : 'Verify & Create Account'}
                                </button>
                                <button type="button" onClick={closeAuthModal} className={styles.secondaryBtn}>
                                    <LogOut size={16} />
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </Modal>
            )}

            {/* Login Modal */}
            {authMode === 'login' && (
                <Modal
                    isOpen={true}
                    onClose={closeAuthModal}
                    title={`Login - Step ${authStep} of 2`}
                >
                    {authStep === 1 && (
                        <form onSubmit={handleLoginStep1} className={styles.authForm}>
                            <div className={styles.formGroup}>
                                <label>
                                    <Mail size={18} />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>
                                    <Lock size={18} />
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                            <div className={styles.formActions}>
                                <button type="submit" className={styles.primaryBtn} disabled={authLoading}>
                                    {authLoading ? 'Sending OTP...' : 'Login'}
                                </button>
                                <button type="button" onClick={closeAuthModal} className={styles.secondaryBtn}>
                                    <LogOut size={16} />
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    {authStep === 2 && (
                        <form onSubmit={handleLoginStep2} className={styles.authForm}>
                            <div className={styles.formGroup}>
                                <label>
                                    <Key size={18} />
                                    Enter OTP
                                </label>
                                <input
                                    type="text"
                                    value={formData.otp}
                                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                                    placeholder="6-digit code"
                                    maxLength={6}
                                    required
                                />
                                <small>Check your email for the verification code</small>
                            </div>
                            <div className={styles.formActions}>
                                <button type="submit" className={styles.primaryBtn} disabled={authLoading}>
                                    {authLoading ? 'Verifying...' : 'Verify & Login'}
                                </button>
                                <button type="button" onClick={() => setAuthStep(1)} className={styles.secondaryBtn}>
                                    Back
                                </button>
                                <button type="button" onClick={closeAuthModal} className={styles.secondaryBtn}>
                                    <LogOut size={16} />
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </Modal>
            )}
        </div>
    );
}
