import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import styles from './MainLayout.module.css';

/**
 * MainLayout Component
 * 
 * Main layout wrapper for the application.
 * Can be used to wrap pages that need consistent header/footer.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Page content
 * @param {boolean} props.showHeader - Whether to show header (default: true)
 * @param {boolean} props.showFooter - Whether to show footer (default: true)
 * @param {boolean} props.hideAuthButtons - Whether to force hide login/signup (default: false)
 */
const MainLayout = ({
    children,
    showHeader = true,
    showFooter = true,
    hideAuthButtons = false
}) => {
    const { user } = useAuth();

    return (
        <div className={styles.layout}>
            {showHeader && (
                <header className={styles.header}>
                    <div className={styles.headerContent}>
                        <Link to={ROUTES.HOME} className={styles.logo}>EECOHM</Link>
                        <nav className={styles.nav}>
                            {!user && !hideAuthButtons && (
                                <>
                                    <Link to={ROUTES.LOGIN} className={styles.loginBtn}>Login</Link>
                                    <Link to={ROUTES.SIGNUP} className={styles.signupBtn}>Sign Up</Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>
            )}

            <main className={styles.main}>
                {children}
            </main>

            {showFooter && (
                <footer className={styles.footer}>
                    <div className={styles.footerContent}>
                        <div className={styles.footerLinks}>
                            <p>&copy; 2026 EECOHM. All rights reserved.</p>
                            <Link to={ROUTES.SYSTEM_ADMIN_LOGIN} className={styles.adminLink}>
                                Admin Login
                            </Link>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

export default MainLayout;
