import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import styles from './UserLayout.module.css';
import {
    LayoutGrid,
    User,
    Users,
    GraduationCap,
    BookOpen,
    CalendarCheck,
    FileText,
    Clock,
    CreditCard,
    Bell,
    ClipboardList,
    BarChart3,
    Settings,
    LogOut,
    School,
    Layers,
    Calendar,
    Grid,
    Library
} from 'lucide-react';

const UserLayout = ({ children, title = "Student Management System" }) => {
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

    const isApproved = user?.approval_status === 'APPROVED';
    const isSystemAdmin = user?.is_system_admin;

    const allNavItems = [
        { to: ROUTES.USER_DASHBOARD, icon: LayoutGrid, label: 'Overview', end: true },
        { to: ROUTES.USER_PROFILE, icon: User, label: 'My Profile' },
        { to: ROUTES.USER_STUDENTS, icon: GraduationCap, label: 'Students' },
        { to: ROUTES.USER_TEACHERS, icon: Users, label: 'Teachers' },
        { to: ROUTES.USER_FACULTIES, icon: Grid, label: 'Faculties' },
        { to: ROUTES.USER_COURSES, icon: Library, label: 'Courses' },
        { to: ROUTES.USER_CLASSES, icon: School, label: 'Classes' },
        { to: ROUTES.USER_BATCHES, icon: Calendar, label: 'Batches' },
        { to: ROUTES.USER_SECTIONS, icon: Layers, label: 'Sections' },
        { to: ROUTES.USER_SUBJECTS, icon: BookOpen, label: 'Subjects' },
        { to: ROUTES.USER_ATTENDANCE, icon: CalendarCheck, label: 'Attendance' },
        { to: ROUTES.USER_EXAMS, icon: FileText, label: 'Exams & Results' },
        { to: ROUTES.USER_TIMETABLE, icon: Clock, label: 'Timetable' },
        { to: ROUTES.USER_FEES, icon: CreditCard, label: 'Fees & Payments' },
        { to: ROUTES.USER_NOTICES, icon: Bell, label: 'Notices' },
        { to: ROUTES.USER_ASSIGNMENTS, icon: ClipboardList, label: 'Assignments' },
        { to: ROUTES.USER_ENROLLMENTS, icon: Users, label: 'Enrollments' },
        { to: ROUTES.USER_TEACHER_ASSIGNMENTS, icon: GraduationCap, label: 'Teacher Appts' },
        { to: ROUTES.USER_REPORTS, icon: BarChart3, label: 'Reports' },
        { to: ROUTES.USER_SETTINGS, icon: Settings, label: 'Settings' },
    ];

    // Filter items: Only show everything if Approved or System Admin
    const navItems = allNavItems.filter(item => {
        if (isApproved || isSystemAdmin) return true;
        // If not approved, only show Overview and Profile
        return [ROUTES.USER_DASHBOARD, ROUTES.USER_PROFILE].includes(item.to);
    });

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.header}>
                    <School size={24} className={styles.logoIcon} />
                    <span className={styles.logoText}>ProSleek SMS</span>
                </div>

                <nav className={styles.nav}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) => isActive ? styles.activeLink : styles.link}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className={styles.footer}>
                    <div className={styles.userInfo}>
                        <div className={styles.userEmail}>{user?.email}</div>
                        <div className={styles.userRole}>{user?.role || 'User'}</div>
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
                        <span>App</span> / <span>{title}</span>
                    </div>
                </div>
                <div className={styles.content}>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default UserLayout;
