import React from 'react';
import { useAuth } from '@/context/AuthContext';
// Reuse Dashboard styles for now
import styles from '@/Features/Core/Dashboard/Dashboard.module.css';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Admin Dashboard</h1>
                <button onClick={logout} className={styles.logoutBtn}>Sign Out</button>
            </header>
            <main className={styles.grid}>
                <div className={styles.card}>
                    <h2>Administration</h2>
                    <p>Manage users, settings, and organization details.</p>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
