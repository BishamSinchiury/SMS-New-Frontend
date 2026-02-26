import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants/routes';

/**
 * PublicRoute Component
 * 
 * Wrapper for public routes that are accessible without authentication.
 */
const PublicRoute = ({
    children,
    restricted = false,
    redirectTo = ROUTES.DASHBOARD
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
                Initializing ProSleek...
            </div>
        );
    }

    // If route is restricted (like login/signup) and user is already authenticated
    if (restricted && user) {
        // If it's a platform/org admin, redirect to admin dashboard instead of user dashboard
        const target = user.is_system_admin ? ROUTES.ADMIN : redirectTo;
        return <Navigate to={target} replace />;
    }

    return children;
};

export default PublicRoute;
