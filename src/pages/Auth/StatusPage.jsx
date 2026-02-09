import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Ban, ArrowRight, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import styles from '@/Features/Website/landing/Landing.module.css';

const StatusPage = () => {
    const { logout, user } = useAuth(); // Assuming user object has approval_status
    const navigate = useNavigate();

    // Default to PENDING_APPROVAL view if status isn't clear
    const status = user?.approval_status || 'PENDING_APPROVAL';

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleRetry = () => {
        navigate('/profile-setup');
    };

    return (
        <div className={styles.container}>
            <div className={`${styles.shape} ${styles.shape1}`} />
            <div className={`${styles.shape} ${styles.shape2}`} />

            <div className={styles.authCard} style={{ maxWidth: '450px', textAlign: 'center' }}>
                {status === 'PENDING_APPROVAL' && (
                    <>
                        <div style={{ margin: '0 auto 1.5rem', width: '64px', height: '64px', background: 'rgba(14, 165, 233, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Clock size={32} color="#0ea5e9" />
                        </div>
                        <h2 className={styles.cardTitle}>Approval Pending</h2>
                        <p className={styles.cardSubtitle} style={{ marginBottom: '2rem' }}>
                            Your profile has been submitted and is currently under review by the administrator. You will be able to access the dashboard once approved.
                        </p>
                        <button onClick={() => window.location.reload()} className={styles.submitBtn} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                            <RefreshCw size={16} style={{ marginRight: '0.5rem' }} /> Check Status
                        </button>
                    </>
                )}

                {status === 'REJECTED' && (
                    <>
                        <div style={{ margin: '0 auto 1.5rem', width: '64px', height: '64px', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Ban size={32} color="#ef4444" />
                        </div>
                        <h2 className={styles.cardTitle}>Application Rejected</h2>
                        <p className={styles.cardSubtitle} style={{ marginBottom: '2rem' }}>
                            Unfortunately, your application for access was not approved. You can review your details and re-apply.
                        </p>
                        <button onClick={handleRetry} className={styles.submitBtn}>
                            Review & Re-apply <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
                        </button>
                    </>
                )}

                <button
                    onClick={handleLogout}
                    className={styles.backBtn}
                    style={{ marginTop: '1.5rem' }}
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default StatusPage;
