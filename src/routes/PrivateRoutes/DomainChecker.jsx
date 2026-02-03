import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrgApi from "@/services/api/org";
import { useToast } from "@/Components/Toast/ToastContext";
import { useAuth } from "@/context/AuthContext";
import styles from "./DomainChecker.module.css";

export default function DomainChecker({ children }) {
    const navigate = useNavigate();
    const { error: toastError } = useToast();
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('loading'); // loading, verified, needs_setup, invalid

    const { user, loading: authLoading } = useAuth();

    // Only proceed with logic if auth loading is done (or if we don't block on it)
    // Actually, checkOrg is async, so we might want to wait for both.
    // For now, let's just use user from context.

    useEffect(() => {
        const checkOrg = async () => {
            // ... (checkOrg logic remains same) ...
            const domain = window.location.hostname;
            // Check session storage first
            const cached = sessionStorage.getItem("orgStatus");
            if (cached) {
                try {
                    const data = JSON.parse(cached);
                    if (data.domain === domain) {
                        handleOrgStatus(data);
                        return;
                    } else {
                        sessionStorage.removeItem("orgStatus");
                    }
                } catch (e) {
                    sessionStorage.removeItem("orgStatus");
                }
            }

            try {
                // Use the new standard API service
                const response = await OrgApi.checkOrg(domain);
                const data = response.data;

                sessionStorage.setItem("orgStatus", JSON.stringify({ ...data, domain }));
                handleOrgStatus(data);

            } catch (err) {
                console.error("Error checking organization:", err);
                setStatus('invalid');

                if (err.response && err.response.status === 404) {
                    toastError("Organization not found. Please check the domain.");
                } else {
                    toastError("Failed to verify organization. Please try again.");
                }
                setLoading(false);
            }
        };

        const handleOrgStatus = (data) => {
            const currentPath = window.location.pathname;

            if (data.organization_exists) {
                if (data.has_profile) {
                    // 4. Handle Authenticated User Routing (Approval Workflow)
                    if (user && data.organization_exists) {
                        const status = user.approval_status;

                        // Define allowed paths for each status to prevent redirect loops
                        const isProfileSetupPath = currentPath === '/profile-setup';
                        const isStatusPath = currentPath === '/status';

                        if (status === 'PENDING_PROFILE' && !isProfileSetupPath) {
                            navigate('/profile-setup', { replace: true });
                            setLoading(false);
                            return;
                        }

                        // If pending profile but ON profile setup page, we stop here (status remains loading or whatever)
                        // Actually we need to set status='verified' to render children? 
                        // DomainChecker renders children. So if we want to show ProfileSetup page (which is a child route),
                        // we need to setStatus('verified') or just return to render children.

                        if ((status === 'PENDING_APPROVAL' || status === 'REJECTED') && !isStatusPath) {
                            navigate('/status', { replace: true });
                            setLoading(false);
                            return;
                        }

                        if (status === 'APPROVED') {
                            // Prevent access to setup/status pages if approved
                            if (isProfileSetupPath || isStatusPath || currentPath === '/login') {
                                navigate('/dashboard', { replace: true });
                                setLoading(false);
                                return;
                            }
                        }
                    }

                    setStatus('verified');
                    // If verified and trying to access setup pages, redirect to home
                    if (currentPath === '/org-setup') {
                        navigate("/", { replace: true });
                    }
                } else {
                    setStatus('needs_setup');
                    // If no profile, they must be in login or setup
                    if (currentPath !== '/login' && currentPath !== '/org-setup') {
                        navigate("/login", { replace: true });
                    }
                }
            } else {
                setStatus('invalid');
            }
            setLoading(false);
        };

        if (!authLoading) {
            checkOrg();
        }
    }, [user, authLoading, navigate]);

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={`glass-panel ${styles.loaderContent}`}>
                    <div className={styles.spinner}></div>
                    <p className={`text-gradient ${styles.loadingText}`}>Verifying Domain...</p>
                </div>
            </div>
        );
    }

    if (status === 'invalid') {
        return (
            <div className={styles.container}>
                <div className={`glass-panel ${styles.errorCard}`}>
                    <div className={styles.errorIcon}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                    </div>
                    <h2 className={styles.errorTitle}>Domain Not Recognized</h2>
                    <p className={styles.errorMessage}>
                        This domain is not associated with any active organization.
                        Please check the URL or contact support.
                    </p>
                </div>
            </div>
        );
    }

    // Render children for both 'verified' and 'needs_setup' states
    // This allows the Router to handle the /org-setup route
    return children;
}
