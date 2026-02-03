import React from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Dashboard</h1>
                <button onClick={logout} className={styles.logoutBtn}>Sign Out</button>
            </header>

            <main className={styles.grid}>
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Welcome Back!</h2>
                    <p>
                        Logged in as: <strong>{user?.email}</strong>
                    </p>
                    <p style={{ marginTop: '1rem', color: '#94a3b8' }}>
                        This is a secure area. Your organization is <strong>{user?.person?.organization?.name || 'Loading...'}</strong>.
                    </p>
                </div>

                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Quick Stats</h2>
                    <p>No data available yet.</p>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
