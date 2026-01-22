import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsonApi from "@/api/json";
import { useToast } from "@/Components/Toast/ToastContext";
import styles from "./DomainChecker.module.css";

export default function DomainChecker({ children }) {
    const navigate = useNavigate();
    const { error: toastError } = useToast();
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('loading'); // loading, verified, needs_setup, invalid

    useEffect(() => {
        const checkOrg = async () => {
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
                const response = await jsonApi.get(`/org/check-org/?domain_name=${domain}`);
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
            if (data.organization_exists) {
                if (data.has_profile) {
                    setStatus('verified');
                } else {
                    setStatus('needs_setup');
                    navigate("/org-setup", { replace: true });
                }
            } else {
                setStatus('invalid');
            }
            setLoading(false);
        };

        checkOrg();
    }, []);

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
