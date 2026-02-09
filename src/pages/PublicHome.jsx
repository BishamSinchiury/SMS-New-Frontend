import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthApi from '@/services/api/auth';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/Components/Toast/ToastContext';
import { LogOut, Mail, Lock, Key } from 'lucide-react';
import styles from './PublicHome.module.css';

// Modal Component Removed

export default function PublicHome() {
    const [orgData, setOrgData] = useState(null); // Keep as null or sets defaults if needed

    const navigate = useNavigate();
    const { success, error } = useToast();
    const { checkAuthStatus } = useAuth(); // usage

    // Removed OrgApi useEffect logic


    const handleAuthNavigation = (mode) => {
        if (mode === 'login') {
            navigate('/login');
        } else {
            navigate('/login', { state: { mode: 'signup' } });
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
                    <button onClick={() => handleAuthNavigation('login')} className={styles.loginBtn}>
                        Login
                    </button>
                    <button onClick={() => handleAuthNavigation('signup')} className={styles.signupBtn}>
                        Sign Up
                    </button>
                </div>
            </nav>

            <main className={styles.main}>
                <h2>Welcome to {orgData?.organization_name || 'Our School'}</h2>
                <p>Manage your school efficiently with our comprehensive management system.</p>
            </main>


        </div>
    );
}
