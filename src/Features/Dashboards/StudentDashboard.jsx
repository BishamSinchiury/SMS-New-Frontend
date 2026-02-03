import React from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from '@/Features/Core/Dashboard/Dashboard.module.css';

const StudentDashboard = () => {
    const { user, logout } = useAuth();
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Student Dashboard</h1>
                <button onClick={logout} className={styles.logoutBtn}>Sign Out</button>
            </header>
            <main className={styles.grid}>
                <div className={styles.card}>
                    <h2>My Studies</h2>
                    <p>View grades, attendance, and assignments.</p>
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
