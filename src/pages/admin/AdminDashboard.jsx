import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '@/services/authService';
import { ROUTES } from '@/constants/routes';
import AdminLayout from '@/components/layout/AdminLayout';
import styles from './AdminDashboard.module.css';
import { useAuth } from '@/hooks/useAuth';

const AdminDashboard = () => {
    const { user, loading } = useAuth();

    if (loading) return (
        <AdminLayout title="System Status">
            <div className={styles.loading}>Loading system overview...</div>
        </AdminLayout>
    );

    return (
        <AdminLayout title="Overview">
            <div className={styles.dashboardContainer}>
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <h3>Portal Status</h3>
                        <div className={styles.statusBadge}>Online / Active</div>
                    </div>
                    <div className={styles.statCard}>
                        <h3>Organization</h3>
                        <p>{user?.organization_details?.org_name || 'ProSleek System'}</p>
                    </div>
                    <div className={styles.statCard}>
                        <h3>Management Role</h3>
                        <p>{user?.is_staff ? 'Platform Root' : 'Organization Admin'}</p>
                    </div>
                </div>

                <div className={styles.welcomeCard}>
                    <div className={styles.welcomeInfo}>
                        <div className={styles.dotGroup}>
                            <div className={styles.dot}></div>
                            <div className={styles.dot}></div>
                            <div className={styles.dot}></div>
                        </div>
                        <h2>System Overview</h2>
                    </div>
                    <div className={styles.activityList}>
                        <p className={styles.activityItem}><span>Log:</span> Portal access granted to {user?.email}</p>
                        <p className={styles.activityItem}><span>Security:</span> Encrypted session established</p>
                        <p className={styles.activityItem}><span>Data:</span> Organization personnel database synced</p>
                        <p className={styles.activityItem}><span>Config:</span> Workspace profile settings initialized</p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
