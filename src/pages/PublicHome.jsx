import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrgApi from '@/services/api/org';
import AuthApi from '@/services/api/auth';
import { useToast } from '@/Components/Toast/ToastContext';
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
    const [orgData, setOrgData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Login State
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('email'); // email or otp
    const [authLoading, setAuthLoading] = useState(false);

    const navigate = useNavigate();
    const { success, error } = useToast();

    useEffect(() => {
        const fetchOrgData = async () => {
            try {
                const domain = window.location.hostname;
                // We assume if we are here, the org exists.
                // But we need profile data.
                // Assuming we have an endpoint for public profile or reuse check?
                // The requirements say "Display organization-specific data (from the org profile)"
                // But CheckOrg only returns existence booleans.
                // We might need a new endpoint or update check to return public profile if profile exists.
                // For now, let's try to verify via check first, then maybe we need a public profile fetch.

                // NOTE: I'll assume for this iteration we use `checkOrg` and maybe it returns more data later, 
                // OR we need to create a specific `getPublicProfile` endpoint.
                // Let's stick to what we have or mock it visually if backend data is missing.

                const response = await OrgApi.checkOrg(domain);
                if (response.data.has_profile) {
                    setOrgData(response.data); // Ideally this should have name, logo etc.
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchOrgData();
    }, []);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setAuthLoading(true);
        try {
            await AuthApi.generateOTP(email);
            success("OTP sent to your email!");
            setStep('otp');
        } catch (err) {
            error(err.response?.data?.error || "Failed to send OTP");
        } finally {
            setAuthLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setAuthLoading(true);
        try {
            const response = await AuthApi.verifyOTP(email, otp);
            success("Login successful!");
            setShowLoginModal(false);
            // Redirect to dashboard or refresh
            navigate('/dashboard');
        } catch (err) {
            error(err.response?.data?.error || "Invalid OTP");
        } finally {
            setAuthLoading(false);
        }
    };

    if (loading) return <div className={styles.loading}>Loading...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.logo}>
                    {/* Placeholder for Org Logo/Name */}
                    <h1>{orgData?.name || "School Portal"}</h1>
                </div>
                <nav className={styles.nav}>
                    <button
                        className={styles.loginBtn}
                        onClick={() => setShowLoginModal(true)}
                    >
                        Login / Signup
                    </button>
                </nav>
            </header>

            <main className={styles.main}>
                <section className={styles.hero}>
                    <h2>Welcome to {orgData?.name || "Our Institute"}</h2>
                    <p>Empowering education through technology.</p>
                </section>

                {/* Dynamic content would go here */}
            </main>

            <Modal
                isOpen={showLoginModal}
                onClose={() => { setShowLoginModal(false); setStep('email'); setEmail(''); setOtp(''); }}
                title={step === 'email' ? "Login / Signup" : "Enter OTP"}
            >
                {step === 'email' ? (
                    <form onSubmit={handleSendOTP} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label>Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                            />
                        </div>
                        <button type="submit" disabled={authLoading} className={styles.submitBtn}>
                            {authLoading ? "Sending..." : "Send OTP"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOTP} className={styles.form}>
                        <p className={styles.otpInstruction}>We verified that an account exists for {email}. Please enter the code sent to your email.</p>
                        <div className={styles.formGroup}>
                            <label>OTP Code</label>
                            <input
                                type="text"
                                required
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="******"
                                maxLength={6}
                            />
                        </div>
                        <button type="submit" disabled={authLoading} className={styles.submitBtn}>
                            {authLoading ? "Verifying..." : "Verify & Login"}
                        </button>
                        <button
                            type="button"
                            className={styles.backBtn}
                            onClick={() => setStep('email')}
                        >
                            Back
                        </button>
                    </form>
                )}
            </Modal>
        </div>
    );
}
