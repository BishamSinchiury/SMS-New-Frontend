import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants/routes';

/**
 * PrivateRoute Component
 * 
 * Wrapper for protected routes that require authentication.
 */
const PrivateRoute = ({
    children,
    redirectTo = ROUTES.LOGIN,
    allowedRoles = []
}) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-family-base)',
                color: 'var(--text-secondary)'
            }}>
                Checking authorization...
            </div>
        );
    }

    // Check if user is authenticated
    if (!user) {
        return <Navigate to={redirectTo} replace />;
    }

    // Role-based access control
    const userRole = user.role || 'USER';
    const approvalStatus = user.approval_status;
    const isSystemAdmin = user.is_system_admin;

    // 1. System Admin bypass
    if (isSystemAdmin) {
        return children;
    }

    // 2. Profile Verification Gating
    // If user needs to setup or fix their profile, redirect to profile setup
    if (approvalStatus === 'PENDING_PROFILE' || approvalStatus === 'REJECTED') {
        const currentPath = window.location.pathname;
        if (currentPath !== ROUTES.USER_PROFILE) {
            return <Navigate to={ROUTES.USER_PROFILE} replace />;
        }
    }

    // 3. Pending Approval Gating
    // If user is waiting for approval, they can only see their profile or the dashboard (which will be restricted)
    // We allow them to proceed, but UserLayout/sidebar will handle the visibility of modules.
    // However, if we want strict route gating for specific modules:
    const restrictedModules = [
        ROUTES.USER_FACULTIES, ROUTES.USER_COURSES, ROUTES.USER_CLASSES,
        ROUTES.USER_BATCHES, ROUTES.USER_SECTIONS, ROUTES.USER_SUBJECTS,
        ROUTES.USER_STUDENTS, ROUTES.USER_TEACHERS, ROUTES.USER_ENROLLMENTS,
        ROUTES.USER_TEACHER_ASSIGNMENTS, ROUTES.ADMIN
    ];

    if (approvalStatus === 'PENDING_APPROVAL' || approvalStatus === 'REJECTED' || approvalStatus === 'PENDING_PROFILE') {
        const currentPath = window.location.pathname;
        if (restrictedModules.some(route => currentPath.startsWith(route))) {
            return <Navigate to={ROUTES.USER_DASHBOARD} replace />;
        }
    }

    // Role-based check (only if APPROVED or for bypass)
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        console.warn(`Access Denied: User role '${userRole}' not in allowed roles: [${allowedRoles.join(', ')}]`);
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default PrivateRoute;
