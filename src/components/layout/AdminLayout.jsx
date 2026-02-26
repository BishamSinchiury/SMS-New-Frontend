import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import styles from './AdminLayout.module.css';
import { LayoutGrid, Users, Building2, LogOut } from 'lucide-react';

const AdminLayout = ({ children, title = "Admin Portal" }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate(ROUTES.HOME);
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.header}>
                    <Building2 size={24} className={styles.logoIcon} />
                    <span className={styles.logoText}>ProSleek Admin</span>
                </div>

                <nav className={styles.nav}>
                    <NavLink to={ROUTES.ADMIN} end className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                        <LayoutGrid size={20} />
                        <span>Overview</span>
                    </NavLink>
                    <NavLink to={ROUTES.ADMIN_ORG_PROFILE} className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                        <Building2 size={20} />
                        <span>Organization</span>
                    </NavLink>
                    <NavLink to={ROUTES.ADMIN_USERS} className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                        <Users size={20} />
                        <span>User Management</span>
                    </NavLink>
                </nav>

                <div className={styles.footer}>
                    <div className={styles.userInfo}>
                        <div className={styles.userEmail}>{user?.email}</div>
                        <div className={styles.userRole}>System Admin</div>
                    </div>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            <main className={styles.main}>
                <div className={styles.topBar}>
                    <h2 className={styles.pageTitle}>{title}</h2>
                    <div className={styles.breadcrumb}>
                        <span>Admin</span> / <span>{title}</span>
                    </div>
                </div>
                <div className={styles.content}>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
